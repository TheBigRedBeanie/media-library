"use client";
import MediaCard from '../../components/MediaCard'
import Link from 'next/link'
import { useState,useEffect,useMemo } from 'react'
import { getAccessToken } from "../../lib/getAccessToken";
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/navigation";

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
  
