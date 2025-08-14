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

    // If already signed in, bounce to home
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
        if (data.session) router.replace("/");
        });
    }, [router]);


    const handleEmailLogin = async (e) => {
      console.log("Inside handle email login")
        e.preventDefault();
        setSubmitting(true)
        setErrorMessage("")

            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
        
            setSubmitting(false);
        
            if (error) {
              setErrorMessage(error.message);
              return;
            }
            // success → go home
            router.replace("/");
          };

    return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          {errorMessage && (
            <div className="alert alert-error my-2">
            <span>{errorMsg}</span>
          </div>
          )}
          
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
            type="submit" 
            onClick={handleEmailLogin}
            className={`btn btn-primary w-full ${submitting ? "btn-disabled" :""}`}>
            disabled={submitting}
            {submitting ? "Signing in..." : "Sign in"}
            </button>

       

          <div className="text-center mt-4">
            <p className="text-sm">Don't have an account?</p>
            <a href="/signup" className="link link-primary">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  )

}