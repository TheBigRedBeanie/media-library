"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage("Check your email to confirm your account.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Sign up</h2>
          {msg && <div className="alert mt-2">{msg}</div>}
          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <input className="input input-bordered w-full" placeholder="Email"
              value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <input className="input input-bordered w-full" placeholder="Password" type="password"
              value={password} onChange={(e)=>setPassword(e.target.value)} required />
            <button className="btn btn-primary w-full" type="submit">Create account</button>
          </form>
          <p className="text-center text-sm opacity-70 mt-4">
            Already have an account? <a href="/login" className="link link-primary">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}