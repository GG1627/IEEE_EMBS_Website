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
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, firstName, lastName) => {
    // First, create the user account with magic link
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      return { data, error };
    }

    // If successful, add user to members table
    try {
      const memberData = {
        email: email,
        first_name: firstName,
        last_name: lastName,
      };

      const { data: insertData, error: memberError } = await supabase
        .from("members")
        .insert([memberData]);

      if (memberError) {
        console.error("❌ Error adding user to members table:", memberError);
      } else {
        console.log("✅ User successfully added to members table!");
      }
    } catch (memberError) {
      console.error("❌ Exception adding user to members table:", memberError);
    }

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

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
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
