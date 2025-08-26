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
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Validate that this user exists in our members table
        try {
          const { data: member, error } = await supabase
            .from("members")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (error || !member) {
            // Invalid session - user not in members table, clear it
            console.log("Invalid session detected, clearing...");
            await supabase.auth.signOut();
            setUser(null);
          } else {
            // Valid session
            setUser(session.user);
          }
        } catch (error) {
          console.log("Error validating session, clearing...");
          await supabase.auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
      } else if (session?.user) {
        // Validate session on auth change too
        try {
          const { data: member, error } = await supabase
            .from("members")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (error || !member) {
            console.log("Invalid session on auth change, clearing...");
            await supabase.auth.signOut();
            setUser(null);
          } else {
            setUser(session.user);

            // If user just signed in and has user_metadata (from registration), add them to members table
            if (
              event === "SIGNED_IN" &&
              session.user.user_metadata?.first_name
            ) {
              // console.log("🔔 New user signed in, adding to members table...");
              await addUserToMembersTable(session.user);
            }
          }
        } catch (error) {
          console.log("Error validating session on auth change, clearing...");
          await supabase.auth.signOut();
          setUser(null);
        }
      }
      setLoading(false);
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
    addUserToMembersTable,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
