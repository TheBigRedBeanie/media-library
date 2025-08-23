'use client';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import MediaCard from '@/components/MediaCard';
import { useAuth } from '../../lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import getUserLibrary, {
    deleteMediaFromLibrary,
} from '../../lib/database/library';

const TYPES = ['All', 'Books', 'Movies', 'Music', 'Games']; // changed to TYPES instead of FILTERS to complete merge
const mapFilterToDb = {
    Books: 'Book',
    Movies: 'Film',
    Music: 'Music',
    Games: 'Game'
}; // the DB columns are now capitalized, which is required for the comparison at the filter level



export default function LibraryPage() {
    const { session } = useAuth();
    const router = useRouter();

    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('All');
    const [view, setView] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        show: false,
        mediaId: null,
        title: '',
    });

    useEffect(() => {
        if (session === null) {
            // not logged in → send to /
            router.replace('/');
        }
        setUserId(session.user.id);
        console.log('user id', userId);
    }, [session, router]);

    // Require auth
    /*useEffect(() => {
    if (!session) {router.push("/")};
    setUserId(session.user.id);
  }, [session, router]);

  console.log('user id', userId);
  */

    // Load items for this user
    useEffect(() => {
        getUserMedia();
    }, []);

    const getUserMedia = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser(); //Using Jons already created functions to see what media the user added
        if (!user) {
            setLoading(false);
            return;
        }
        console.log(user?.id);
        const usersLibrary = await getUserLibrary(user.id);
        console.log('what books', usersLibrary);
        if (!usersLibrary || !usersLibrary.success) {
            setErrorMessage('No Media Found');
            setLoading(false);
            return;
        }

        setItems(usersLibrary.library);
        setLoading(false);
    };

    // ...render your filter buttons + grid/list using `filtered`

    // function for loading the delete modal to the user
    const showDeleteConfirmation = (mediaId, title) => {
        setDeleteConfirmation({ show: true, mediaId, title });
    };

    const confirmDelete = async () => {
        const { mediaId } = deleteConfirmation;

        try {
            const result = await deleteMediaFromLibrary(userId, mediaId);

            if (result.success) {
                setItems((prev) =>
                    prev.filter((item) => item.mediaId !== mediaId)
                );
                console.log('sucessfully removed media:', mediaId);
            } else {
                console.error('delete failed:', result.error);
            }
        } catch (error) {
            console.error('error:', error);
        }

        setDeleteConfirmation({ show: false, mediaId: null, title: '' });
    };

    const cancelDelete = () => {
        setDeleteConfirmation({ show: false, mediaId: null, title: '' });
    };


    // filter logic 
    const filteredItems = useMemo(() => {
      if (filter === 'All') return items;
      const dbType = mapFilterToDb[filter];
      return items.filter(item => item.mediaType === dbType);
  }, [items, filter]);


    return (
        <div className="space-y-10">
            {/* Controls row */}
            <section className="flex flex-wrap justify-between items-center gap-4">
                {/* Filters */}
                <div className="join">
                    {TYPES.map((t) => (
                        <button
                            key={t}
                            className={`btn join-item ${
                                filter === t ? 'btn-primary' : 'btn-outline'
                            }`}
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
                            className={`btn btn-sm join-item ${
                                view === 'grid' ? 'btn-primary' : 'btn-outline'
                            }`}
                            onClick={() => setView('grid')}
                        >
                            Grid
                        </button>
                        <button
                            className={`btn btn-sm join-item ${
                                view === 'list' ? 'btn-primary' : 'btn-outline'
                            }`}
                            onClick={() => setView('list')}
                        >
                            List
                        </button>
                    </div>
                    <Link href="/create" className="btn btn-primary">
                        + Add New
                    </Link>
                </div>
            </section>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredItems.map((item, i) => (
                              <MediaCard
                                  key={i}
                                  title={item.title}
                                  type={item.mediaType}
                                  image={`/logos/${item.mediaType}.logo.png`}
                                  mediaId={item.mediaId}
                                  showDelete={true}
                                  onDelete={showDeleteConfirmation}
                              />
                          ))}
                </div>
            ) : errorMessage ? (
                <div>{errorMessage}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Creator</th>
                                <th>Type</th>
                                <th>Added</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item, i) => (
                                      <tr
                                          key={
                                              item.library_id ||
                                              `${item.mediaId}-${i}`
                                          }
                                      >
                                          <td>{item.title}</td>
                                          <td>{item.mediaType}</td>
                                          <td>
                                              {new Date(
                                                  item.date_added ||
                                                      item.created_at
                                              ).toLocaleDateString()}
                                          </td>
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
                            Are you sure you want to remove "
                            {deleteConfirmation.title}" from your library?
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={confirmDelete}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
