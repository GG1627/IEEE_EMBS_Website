// Simplified authentication context

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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(
        "🔍 Initial session check:",
        session?.user ? "User found" : "No user"
      );
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "🔄 Auth state change:",
        event,
        session?.user ? "User present" : "No user"
      );

      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
        // Clear any session storage
        sessionStorage.removeItem("welcome_shown");
        sessionStorage.removeItem("member_table_checked");
      } else if (session?.user) {
        setUser(session.user);

        // Add new users to members table (only on SIGNED_IN with metadata and if not already checked)
        if (
          event === "SIGNED_IN" &&
          session.user.user_metadata?.first_name &&
          !sessionStorage.getItem("member_table_checked")
        ) {
          console.log("👤 New user detected, adding to members table...");
          await addUserToMembersTable(session.user);
          // Mark that we've checked this session
          sessionStorage.setItem("member_table_checked", "true");
        }

        // Show welcome message for new login
        if (event === "SIGNED_IN" && !sessionStorage.getItem("welcome_shown")) {
          console.log("👋 Welcome message for new login");
          sessionStorage.setItem("welcome_shown", "true");
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
          email: email,
        },
      },
    });

    return { data, error };
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

  // Simple function to add user to members table
  const addUserToMembersTable = async (user) => {
    try {
      console.log("🔍 Checking if user exists in members table:", user.email);

      // First check if user already exists (with timeout)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Member check timeout")), 5000)
      );

      const queryPromise = supabase
        .from("members")
        .select("id")
        .eq("email", user.email)
        .single();

      const { data: existingUser, error: checkError } = await Promise.race([
        queryPromise,
        timeoutPromise,
      ]).catch((error) => {
        if (error.message === "Member check timeout") {
          console.log("⏰ Member check timed out - RLS is blocking access");
          return { data: null, error: { code: "TIMEOUT" } };
        }
        throw error;
      });

      if (existingUser) {
        console.log("✅ User already exists in members table, skipping insert");
        return;
      }

      if (
        checkError &&
        checkError.code !== "PGRST116" &&
        checkError.code !== "TIMEOUT"
      ) {
        console.error("❌ Error checking for existing user:", checkError);
        return;
      }

      if (checkError && checkError.code === "TIMEOUT") {
        console.log(
          "⏰ Database check timed out due to RLS - skipping member table operations"
        );
        return;
      }

      console.log("📝 Adding new user to members table:", user.email);

      const memberData = {
        email: user.email,
        first_name: user.user_metadata?.first_name || "",
        last_name: user.user_metadata?.last_name || "",
        points: 0,
        events_attended: 0,
        user_id: user.id,
        role: "member",
      };

      const { data, error } = await supabase
        .from("members")
        .insert([memberData])
        .select()
        .single();

      if (error) {
        console.error("❌ Error adding user to members table:", error);
      } else {
        console.log("✅ User successfully added to members table:", data);
      }
    } catch (error) {
      console.error("❌ Exception adding user to members table:", error);
    }
  };

  const signOut = async () => {
    console.log("🚪 Signing out user...");
    try {
      await supabase.auth.signOut();
      setUser(null);
      // Clear session storage
      sessionStorage.removeItem("welcome_shown");
      sessionStorage.removeItem("member_table_checked");
      console.log("✅ Logout successful!");
      return { error: null };
    } catch (error) {
      console.error("❌ Logout error:", error);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
