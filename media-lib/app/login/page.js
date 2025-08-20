"use client";
import { useState,useEffect } from "react"
import {useRouter} from "next/navigation"
import {supabase} from "../../lib/supabaseClient"

export default function LoginPage() {
    const router = useRouter();
    const [email,setEmail] = useState ("")
    const [password,setPassword] = useState ("")
    const [submitting,setSubmitting] = useState(false)
    const [errorMessage,setErrorMessage] = useState("")
    const [infoMessage, setInfoMessage] = useState("");
    const [msg, setMessage] = useState("");


    // If already signed in, bounce to home
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
        if (data.session) router.replace("/");
        });
    }, [router]);


    const handleEmailLogin = async () => {
      if (submitting) return;
      setSubmitting(true);
      setErrorMessage("");
      setMessage("");

      
    const { data, error } = await supabase.auth.signInWithPassword(
      {email,password,
      });
      setSubmitting(false);
                      
    if (error) {
    setErrorMessage(error.message);
    return;
    }
    // success → go home
    router.replace("/");
    };
    const handleSignup = async () => {
      if (submitting) return;
      setSubmitting(true);
      setErrorMessage("");
      setMessage("");
    
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { 
        setSubmitting(false);  
        setErrorMessage(error.message); 
        return; 
      }
    
      // ensure FK row exists in public.users (safe if it already exists)
      if (data.user) {
        await supabase.from("users").upsert(
          { id: data.user.id, username: email.split("@")[0] },
          { onConflict: "id" }
        );
      }
    
      setSubmitting(false);
      setMessage("Signup successful! Check your email to confirm, then log in.");
    };
    
    return (
            <div className="flex items-center justify-center min-h-screen bg-base-200">
              <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="text-2xl font-bold text-center">Login</h2>
        
                  {errorMessage && (
                    <div className="alert alert-error my-2">
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {infoMessage && (
                    <div className="alert alert-success my-2">
                      <span>
                        
                        {infoMessage}

                      </span>
                    </div>
                  )}
                  {msg && 
                  <div className="alert my-2">
                    {msg}
                  </div>}
                  
                  <div className="space-y-3"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !submitting) handleEmailLogin();
                    }}
                    >
                    <input
                      type="email"
                      placeholder="Email"
                      className="input input-bordered w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
        
                    <input
                      type="password"
                      placeholder="Password"
                      className="input input-bordered w-full"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
        
                    <button 
                      type ="button"
                      onClick={handleEmailLogin}
                      className={`btn btn-primary w-full ${submitting ? "btn-disabled" : ""}`}
                      disabled={submitting}
                    >
                      {submitting ? "Signing in..." : "Sign in"}
                    </button>

                    <button 
                      type = "button"
                      onClick={handleSignup}
                      className={`btn btn-primary w-full ${submitting ? "btn-disabled" : ""}`}
                      disabled={submitting}
                    >
                      {submitting ? "Signing Up..." : "Sign Up"}
                    </button>
                </div>
              </div>
            </div>
          </div>
    );
        
  }

    
     