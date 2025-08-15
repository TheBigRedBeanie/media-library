"use client";
import MediaCard from '../../components/MediaCard'
import Link from 'next/link'
import { useState,useEffect,useMemo } from 'react'
import { getAccessToken } from "../../lib/getAccessToken";
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/navigation";
import getUserLibrary from '@/lib/database/library';

export default function LibraryPage() {
const [libraryData, setLibraryData] = useState('');
// pulling from supabase to fill in the Book card to start
const currentUserID = 'd9becd19-b343-4711-97a5-3779765508cc' // this is jm's UUID from the Users table in supabase
const loadUserBooks = async () => {
  const result = await getUserLibrary(supabase, userId);
  if (!success) {
    console.error('failed to read books:', result.error);
    return {success: false, error: result.error}
  }

  console.log('raw library data', result.library);
  return (result.library);
}

console.log('loadUserBooks result', loadUserBooks.result);
//setLibraryData(loadUserBooks.result.library)

  // Dummy data for now (this will be connected to Supabase later)
  const mediaItems = [
    { id: 1, title: 'Inception', type: 'Movies', url: 'https://placehold.co/300x200' },
    { id: 2, title: '1984', type: 'Books', url: 'https://placehold.co/300x200' },
    { id: 3, title: 'Assasins Creed', type: 'Games', url: 'https://placehold.co/300x200' },
    { id: 4, title: 'Ok Coders Hack the AI', type: 'Movies', url: 'https://placehold.co/300x200' },
    { id: 5, title: 'Song', type: 'Songs', url: 'https://placehold.co/300x200' },
  ]


// State for filter and view
const [filter, setFilter] = useState('All')
const [view, setView] = useState('grid') // grid or list view
const { session } = useAuth();
const [userId, setUserId] = useState('');

const FILTERS = ["All", "Books", "Movies", "Songs", "Games"];
const mapFilterToDb = { Books: "Book", Movies: "Movie", Songs: "Song", Games: "Game" };


export default function LibraryPage() {
  const { session } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);
  
  // Require auth
  useEffect(() => {
    if (!session) {
      router.push("/");
    } else if (session.user?.id) {
      setUserId(session.user.id); // added userId config to the useEffect
    }
  }, [session, router]);

  console.log('userId:', userId);
// Filter logic
const filteredItems = filter === 'All'
  ? mediaItems
  : mediaItems.filter(item => item.type === filter)
    if (!session) router.push("/");
  }, [session, router]);

  // Load items for this user
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getAccessToken();
      if (!token) { setLoading(false); return; }

      const res = await fetch("/api/library", { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (!cancelled && res.ok) setItems(json.items || []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return items;
    const dbType = mapFilterToDb[filter] || filter;
    return items.filter(i => i.media_type === dbType);
  }, [items, filter]);

  return (
    <div className="space-y-10">
      <section className="flex flex-wrap justify-between items-center gap-4">
        <div className="join">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`btn join-item ${filter === f ? "btn-primary" : "btn-outline"}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="join">
            <button className={`btn btn-sm join-item ${view === "grid" ? "btn-primary" : "btn-outline"}`} onClick={() => setView("grid")}>Grid</button>
            <button className={`btn btn-sm join-item ${view === "list" ? "btn-primary" : "btn-outline"}`} onClick={() => setView("list")}>List</button>
          </div>
          <Link href="/create" className="btn btn-primary">+ Add New</Link>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center opacity-70">
          No items{filter !== "All" ? ` in "${filter}"` : ""}. Try adding something!
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(item => (
            <MediaCard
              key={item.media_id}
              title={item.title}
              type={item.media_type}
              image={"https://placehold.co/300x200"}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead><tr><th>Title</th><th>Type</th><th>Added</th></tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.media_id}>
                  <td>{item.title}</td>
                  <td>{item.media_type}</td>
                  <td>{new Date(item.created_at || item.date_added).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
  
