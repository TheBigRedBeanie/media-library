"use client";
import Link from "next/link";
import { useState,useEffect,useMemo } from 'react'
import { supabase } from "../../lib/supabaseClient";
import MediaCard from '@/components/MediaCard';
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/navigation";
import getUserLibrary from "../../lib/database/library";




const TYPES = ["All", "Book", "Movie", "Song", "Game", "Series"];


export default function LibraryPage() {

  const { session } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [errorMessage,setErrorMessage] = useState("")


  useEffect(() => {
    if (session === null) {
      // not logged in → send to /
      router.replace("/");
    }
  }, [session, router]);


  // Load items for this user
  useEffect(() => {
    getUserMedia();
   

  }, []);
 
  const getUserMedia = async () => {
    const { data: { user } } = await supabase.auth.getUser(); //Using Jons already created functions to see what media the user added 
      if (!user) { setLoading(false); return; }
      console.log(user?.id);
     const usersLibrary= await getUserLibrary(user.id)
      console.log("what books",usersLibrary)
      if(!usersLibrary || !usersLibrary.success){
        setErrorMessage("No Media Found");
        setLoading(false)
        return 
      }
        
      setItems(usersLibrary.library)
      setLoading(false)

  }


  // ...render your filter buttons + grid/list using `filtered`
  return (
    <div className="space-y-10">
        {/* Controls row */}
      <section className="flex flex-wrap justify-between items-center gap-4">
        {/* Filters */}
        <div className="join">
          {TYPES.map(t => (
            <button
              key={t}
              className={`btn join-item ${filter === t ? "btn-primary" : "btn-outline"}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* View toggle + Add New */}
        <div className="flex items-center gap-3">
          <div className="join">
            <button
              className={`btn btn-sm join-item ${view === "grid" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setView("grid")}
            >
              Grid
            </button>
            <button
              className={`btn btn-sm join-item ${view === "list" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setView("list")}
            >
              List
            </button>
          </div>
          <Link href="/create" className="btn btn-primary">+ Add New</Link>
        </div>
      </section>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {filter === "All"?
            items.map((item,i) => (
              <MediaCard
              key={i}
              title={item.title}
              type={item.media_type}
              image={"https://placehold.co/300x200"}
            />
            ))
            :
          items.filter(i => i.mediaType === filter).map((item,i) => (
            <MediaCard
              key={i}
              title={item.title}
              type={item.media_type}
              image={"https://placehold.co/300x200"}
            />
          ))}
        </div>
      ) : errorMessage ?
      (
        <div>
         {errorMessage}
        </div>
      ): (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr><th>Title</th><th>Type</th><th>Added</th></tr>
            </thead>
            <tbody>
            {filter === "All"?
            items.map((item,i) => (
              <tr key={item.library_id || `${item.media_id}-${i}`}>
                <td>{item.title}</td>
                <td>{item.media_type}</td>
                <td>{new Date(item.date_added || item.created_at).toLocaleDateString()}</td>
              </tr>
            ))
            :
             items.filter(i => i.mediaType === filter).map((item,i) => (
                <tr key={item.media_id}>
                  <td>{item.title}</td>
                  <td>{item.media_type}</td>
                  <td>{new Date(item.date_added || item.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
      