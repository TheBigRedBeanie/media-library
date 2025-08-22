"use client"
import MediaCard from '../components/MediaCard'
import Link from 'next/link'
import { useState,useEffect} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";


export default function HomePage() {
  const router = useRouter();

  // auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMessage] = useState(""); //status/success/error text
  const [isError, setIsError] = useState(false);
  const [submitting,setSubmitting] = useState(false)

  // already signed in? go to library
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/library");
    });
  }, [router]);


  const recentMedia = [
    { id: 1, title: "Sample Movie",url: "https://placehold.co/300x200", type:"Movie" },
    { id: 2, title: "Sample Song", url: "https://placehold.co/300x200", type:"Song" },
    { id: 3, title: "Sample Video Game", url: "https://placehold.co/300x200", type:"Game"},
    { id: 4, title: "Sample Book", url: "https://placehold.co/300x200", type:"Book"},

  ]

  const handleEmailLogin = async () => {
      if (submitting) return;

      setSubmitting(true);
      setIsError(false);
      setMessage("");

       const {error } = await supabase.auth.signInWithPassword({email,password,});

          setSubmitting(false);
          if (error) {
            setIsError(true);
            setMessage(error.message);
            return;
          }

          // success → go home
          alert("Logged In")
          router.replace("/library");
        };

        const handleSignup = async () => {
          if (submitting) return;
          setSubmitting(true);
          setIsError(false);
          setMessage("");
      
          const { data,error } = await supabase.auth.signUp({ email, password });
          setSubmitting(false); 
      
          if (error){
            setSubmitting(false);
            setIsError(true);
            setMessage(error.message);
            return;
          }
          setMessage("Check your email to confirm your account.");
          // Ensure a matching row exists in public.users for FK (safe if it already exists
          if (data.user) {
            await supabase
              .from("users")
              .insert([{ id: data.user.id, username: email.split("@")[0] }]);
          }
        
          setSubmitting(false);
          setIsError(false);
          setMessage("Signup successful! Check your email to confirm, then log in.");
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

      {/*Auth Card */}
      <section>
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body space-y-3">
            <h2 className="text-2xl font-bold text-center"> Sign In / Sign Up </h2>
          {msg && (<div className={`alert ${isError ? "alert-error" : "alert-success"}`}>
                    <span>{msg}</span>
                  </div>
          )}
         <div className="space-y-3" onSubmit={handleEmailLogin}>
                <input
                  className="input input-bordered w-full"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <input
                  className="input input-bordered w-full"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />

                <button
                  type="submit"
                  className={`btn btn-primary w-full ${submitting ? "btn-disabled" : ""}`}
                  disabled={submitting}
                  onClick={handleEmailLogin}
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </button>
              </div>

              <button
                className={`btn btn-outline w-full ${submitting ? "btn-disabled" : ""}`}
                disabled={submitting}
                onClick={handleSignup}
              >
                {submitting ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Recently Added</h2>
          <Link href="/create" className="btn btn-primary">+ Add New</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentMedia.map((m) => (
            <MediaCard key={m.id} title={m.title} image={m.url} type={m.type} />
          ))}
        </div>
      </section>
    </div>
  );

}          