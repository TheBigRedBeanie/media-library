"use client"
import Link from 'next/link'
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  // Optional: hide the Navbar on /login and /signup
  if (pathname === "/login" || pathname === "/signup") return null;


    return (
      <div className="navbar bg-base-100 shadow-md px-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search media..."
            className="input input-bordered w-full max-w-md"
          />
        </div> 
        <div className="flex-none gap-2">
          <Link href = "/create" className="btn btn-primary"> + Add Media</Link>
          <button onClick={handleLogout} className="btn btn-outline">LogOut</button>
        </div>
        </div>
       
    )
  }