"use client";
import MediaCard from '../../components/MediaCard'
import Link from 'next/link'
import { useState,useEffect,useMemo } from 'react'
import { getAccessToken } from "../../lib/getAccessToken";
import { useAuth } from "../../lib/context/AuthContext";
import { useRouter } from "next/navigation";
import { deleteMediaFromLibrary } from '@/lib/database/library';
import { supabase } from '@/lib/supabaseClient';

const FILTERS = ["All", "Books", "Movies", "Music", "Games"];
const mapFilterToDb = { Books: "Book", Movies: "Film", Music: "Music", Games: "Game'"}; // the DB columns are now capitalized, which is required for the comparison at the filter level


export default function LibraryPage() {
  const { session } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, mediaId: null, title: ''})
  
  // Require auth
  useEffect(() => {
    if (!session) {router.push("/")};
    setUserId(session.user.id);
  }, [session, router]);

  console.log('user id', userId);
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

// function for loading the delete modal to the user 
const showDeleteConfirmation = (mediaId, title) => {
  setDeleteConfirmation({ show: true, mediaId, title })
}

const confirmDelete = async () => {
  const { mediaId } = deleteConfirmation

  try {
    const result = await deleteMediaFromLibrary(userId, mediaId)

    if (result.success) {
      setItems(prev => prev.filter(item => item.media_id !== mediaId))
      console.log('sucessfully removed media:', mediaId)
    } else {
      console.error('delete failed:', result.error)
    }
  } catch (error) {
    console.error('error:', error)
  }

  setDeleteConfirmation({ show: false, mediaId: null, title: ''})
}

const cancelDelete = () => {
  setDeleteConfirmation({ show: false, mediaId: null, title: ''})
}


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
              image={`/logos/${item.media_type}.logo.png`}
              mediaId={item.media_id}
              showDelete={true}
              onDelete={showDeleteConfirmation}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead><tr><th>Title</th><th>Creator</th><th>Type</th><th>Added</th><th>Remove</th></tr></thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.media_id}>
                  <td>{item.title}</td>
                  <td>{item.creator}</td>
                  <td>{item.media_type}</td>
                  <td>{new Date(item.created_at || item.date_added).toLocaleDateString()}</td>
                  <td><button 
                  className='btn btn-sm border-warning'
                  onClick={() => showDeleteConfirmation(item.media_id, item.title)}
                  >X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{deleteConfirmation.show && (
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Removal</h3>
          <p className="py-4">
            Are you sure you want to remove "{deleteConfirmation.title}" from your library?
          </p>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={cancelDelete}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={confirmDelete}>
              Remove
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
  
