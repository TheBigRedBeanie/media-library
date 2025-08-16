"use client"
import Link from 'next/link'
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import { MEDIA_TYPES, getMediaConfig } from '../lib/api/mediaSearch'

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // the search state
  const [mediaType, setMediaType] = useState(MEDIA_TYPES.BOOK);

  const mediaConfig = getMediaConfig(mediaType);


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

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      alert('Please enter a search term');
      return;
    }

    const encodeQuery = encodeURIComponent(trimmedQuery);
    const encodeMediaType = encodeURIComponent(mediaType);
    router.push(`/search/results?q=${encodeQuery}&type=${encodeMediaType}`);

    console.log('type:', mediaType);

    setSearchQuery('');
  };



  // Optional: hide the Navbar on /login and /signup
  if (pathname === "/login" || pathname === "/signup") return null;


    return (
      <div className="navbar bg-base-100 shadow-md px-4">
        <div className="flex-1">
          <form onSubmit={handleSearch} className='w-full max-w-md'>
            <div className='join w-full'>
                <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={mediaConfig.placeholder}
                className='input input-bordered join-item flex-1'
                />
                <select className='select'
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}>
              <option value={`${MEDIA_TYPES.BOOK}`}>Book</option>
              <option value={`${MEDIA_TYPES.FILM}`}>Film</option>
              <option value={`${MEDIA_TYPES.MUSIC}`}>Music</option>
              <option value={`${MEDIA_TYPES.GAME}`}>Game</option>
                </select>
                <button
                type='submit'
                className='btn btn-primary join-itme'
                >
                  Search
                </button>
            </div>
          </form>
        </div> 
        <div className="flex-none gap-2">
          <Link href = "/create" className="btn btn-primary"> + Add Media</Link>
          <button onClick={handleLogout} className="btn btn-outline">LogOut</button>
        </div>
        </div>
    )
  }