"use client"
import MediaCard from '../components/MediaCard'
import Link from 'next/link'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";


export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMessage] = useState("");
  const [submitting,setSubmitting] = useState(false)
  const recentMedia = [
    { id: 1, title: "Sample Movie",url: "https://placehold.co/300x200", type:"Movie" },
    { id: 2, title: "Sample Song", url: "https://placehold.co/300x200", type:"Song" },
    { id: 3, title: "Sample Video Game", url: "https://placehold.co/300x200", type:"Game"},
    { id: 4, title: "Sample Book", url: "https://placehold.co/300x200", type:"Book"},

  ]

  const handleSignup = async (e) => {
    e.preventDefault();
    setSubmitting(true)
    setMessage("");
    const { data,error } = await supabase.auth.signUp({ email, password });
    setSubmitting(false);
    if (error) setMessage(error.message);
    else setMessage("Check your email to confirm your account.");
    if (data.user) {
      await supabase.from("users").insert([
        { id: data.user.id, username: email.split("@")[0] }
      ]);
    }
  };

  const handleEmailLogin = async (e) => {
    console.log("Inside handle email login")
      e.preventDefault();
      setSubmitting(true)
      setMessage("")

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
      
          setSubmitting(false);
      
          if (error) {
            setMessage(error.message);
            return;
          }
          // success → go home
          alert("Logged In")
          router.replace("/library");
        };
  return (
    <div className="space-y-10">
      {/* Welcome message */}
      <section className="text-center mt-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to Media Library</h1>
        <p className="text-lg text-gray-600">
          Your place to organize, create, and explore your media collection.
        </p>
      </section>
      <section>
      <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center"> Hallo</h2>
          {msg && <div className="alert mt-2">{msg}</div>}
         
            <input className="input input-bordered w-full" placeholder="Email"
              value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <input className="input input-bordered w-full" placeholder="Password" type="password"
              value={password} onChange={(e)=>setPassword(e.target.value)} required />
      
          <div>
            <button className={`btn btn-primary w-full ${submitting ? "btn-disabled" :""}`} disabled={submitting}
             onClick={handleEmailLogin}>
              {submitting ? "Signing in..." : "Sign in"}
            </button>
            <button className={`btn btn-primary w-full ${submitting ? "btn-disabled" :""}`}
            disabled={submitting} onClick={handleSignup}>
            {submitting ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
            
         
        </div>
      </div>
    </div>
      </section>

    {/*recenlty Added Section */}
    <section>
      <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold"> Recently Added</h2> 
      <Link href="/create" className="btn btn-primary"> +Add New</Link>
    </div>

    {/*Media Cards grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recentMedia.map((m) => (
        <MediaCard key={m.id} title={m.title} image={m.url} type={m.type} />
      ))}
    </div>
    </section>
    </div>
  )
}