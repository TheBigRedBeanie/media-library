"use client"
import { createContext, useContext, useEffect, 
    useState } from "react";
    import { supabase } from "../supabaseClient";
    import { Session } from "@supabase/supabase-js";
    const AuthContext = createContext ({ session: null });
    export function AuthProvider({ children }) {
      const [session, setSession] = useState(null);
      useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
          setSession(data.session);
        });
        const { data: listener } = 
    supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });
        return () => {
          listener.subscription.unsubscribe();
        };
      }, []);
      return (
        <AuthContext.Provider value={{ session }}>
          {children}
        </AuthContext.Provider>
      );}



export const useAuth = () => useContext(AuthContext);