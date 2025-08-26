// file holds all functions for authentication

import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // If user just signed in and has user_metadata (from registration), add them to members table
      if (
        event === "SIGNED_IN" &&
        session?.user &&
        session.user.user_metadata?.first_name
      ) {
        // console.log("🔔 New user signed in, adding to members table...");
        await addUserToMembersTable(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, firstName, lastName) => {
    // Send magic link with user metadata
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email, // Include email in metadata
        },
      },
    });

    return { data, error };
  };

  // Function to add user to members table after successful authentication
  const addUserToMembersTable = async (user) => {
    try {
      // Check if user already exists in members table
      const { data: existingMember, error: checkError } = await supabase
        .from("members")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // console.error("❌ Error checking existing member:", checkError);
        return { error: checkError };
      }

      // If user already exists, don't insert again
      if (existingMember) {
        // console.log("✅ User already exists in members table");
        return { data: existingMember, error: null };
      }

      // Extract user data from metadata or user object
      const memberData = {
        email: user.email,
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
        points: 0,
        events_attended: 0,
        user_id: user.id,
        role: "member",
      };

      const { data: insertData, error: memberError } = await supabase
        .from("members")
        .insert([memberData])
        .select()
        .single();

      if (memberError) {
        // console.error("❌ Error adding user to members table:", memberError);
        return { error: memberError };
      } else {
        // console.log("✅ User successfully added to members table!");
        return { data: insertData, error: null };
      }
    } catch (memberError) {
      // console.error("❌ Exception adding user to members table:", memberError);
      return { error: memberError };
    }
  };

  const signIn = async (email) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return { data, error };
  };

  // Direct login function for existing members (bypasses magic link)
  const directLogin = async (email) => {
    // console.log("🔄 Starting directLogin for email:", email);

    try {
      // Go directly to member lookup
      // console.log("🔍 Looking up member in database...");

      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();

      // console.log("📊 Member lookup result:", { member, memberError });

      if (memberError && memberError.code !== "PGRST116") {
        // console.log("❌ Member query error:", memberError);
        // Fallback to direct login if there's an error
        // console.log("🔄 Falling back to direct login...");
      } else if (!member) {
        // console.log("❌ Member not found - redirecting to registration");
        return {
          data: null,
          error: { message: "Email not found in members database" },
        };
      } else {
        // console.log("🎉 Member found in database:", member);

        // Determine the correct user ID to use
        let userId = member.user_id;

        // If user_id is null or empty, we need to create one or use the member's id
        if (!userId) {
          // console.log("⚠️ Member has no user_id, using member id as fallback");
          userId = member.id;

          // Update the member record to have a proper user_id for consistency
          try {
            await supabase
              .from("members")
              .update({ user_id: member.id })
              .eq("id", member.id);
            // console.log("✅ Updated member record with user_id");
          } catch (updateError) {
            // console.log("⚠️ Could not update member user_id:", updateError);
          }
        }

        // Create user from real database data with actual user_id
        const realUser = {
          id: userId,
          email: member.email,
          user_metadata: {
            first_name: member.first_name,
            last_name: member.last_name,
          },
          created_at: member.created_at,
          role: member.role,
        };

        // console.log("👤 Created real user from database:", realUser);
        setUser(realUser);
        return { data: { user: realUser }, error: null };
      }

      // If we reach here, the member wasn't found in database
      // console.log("❌ Member not found in database, cannot create session");
      return {
        data: null,
        error: {
          message:
            "Email not found in members database. Please register first.",
        },
      };
    } catch (error) {
      // console.log("💥 DirectLogin exception:", error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    // console.log("🚪 Signing out user...");
    try {
      // Try to sign out from Supabase (in case there's a real session)
      await supabase.auth.signOut();
    } catch (error) {
      // console.log(
      //   "⚠️ Supabase signOut error (expected for mock sessions):",
      //   error
      // );
    }

    // Clear our custom user state
    // console.log("🧹 Clearing user state...");
    setUser(null);

    // console.log("✅ Logout successful!");
    return { error: null };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    directLogin,
    addUserToMembersTable,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
