'use client'
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import searchMedia, { getMediaConfig, MEDIA_TYPES } from '@/lib/api/mediaSearch';
import { addMediaToLibrary } from '@/lib/database/library';
import { useAuth } from '../../../lib//context/AuthContext';

export default function SearchResultsPage() {
    const { session } = useAuth();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [userId, setUserId] = useState('');

    const searchParams = useSearchParams();
    const router = useRouter();

    const query = searchParams.get('q') || '';
    const mediaType = searchParams.get('type') || MEDIA_TYPES.BOOK;

    const mediaConfig = getMediaConfig(mediaType);

    useEffect(() => {
        if (query) {
            performSearch(query, 1, mediaType)
        }
    }, [query, mediaType]);

    useEffect(() => {
        if (!session) {router.push("/")};
        setUserId(session.user.id);
      }, [session, router]);
    
      console.log('user id', userId);

    const performSearch = async (searchQuery, page = 1, type = MEDIA_TYPES.BOOK) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');

        try {
            const limit = 12;
            const offset = (page - 1) * limit;
            const config = getMediaConfig(type);

            const searchResult = await searchMedia(searchQuery, type, {
                limit,
                offset,
                fields: config.fields
            });

            if (searchResult.success) {
                const itemKey = config.itemKey;

                if (page === 1) {
                    setResults(searchResult.data);
                } else {
                    setResults(prev => ({
                        ...searchResult.data,
                        [itemKey]: [...(prev[itemKey] || []), ...(searchResult.data[itemKey] || [])]
                    }));
                }

            } else {
                setError(searchResult.error);
            }
        } catch (err) {
            console.error('Search error', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMedia = (item) => {
        console.log('selected item', item);
        console.log('media type', mediaType);

        
    }

    const getMediaItems = () => {
        if (!results) return [];
        return results[mediaConfig.itemKey] || [];
    };

    const renderMediaItem = (item, index) => {
        const key = `${item.key || item.id || index}`;

        switch (mediaType) {
            case 'Book':
                return renderBookItem(item, key);
            case 'Film':
                return renderFilmItem(item, key);
            case 'Music':
                return renderMusicItem(item, key);
            case 'Game':
                return renderGameItem(item, key);
            default:
                return renderBookItem(item, key);
        }
    };


    const renderBookItem = (book, key) => (
        <div key={key} className='card bg-base-100 shadow-xl'>
            <figure className='px-4 pt-4'>
                {book.coverUrl ? (
                    <img 
                    src={book.coverUrl}
                    alt={`Cover of ${book.title}`}
                    className='rounded-xl h-48 w-32 object-cover'
                    />
                ) : (
                    <div className='bg-grey-200 rounded-xl h-48 w-32 flex items-center justify-center'>
                        <span className='text-gray-500'>No Cover</span>
                    </div>
                )}
            </figure>
            <div className="card-body">
                <h2 className="card-title text-sm">{book.title}</h2>
                <p className="text-xs text-gray-600">
                    {book.authors?.join(', ') || 'Unknown Author'}
                </p>
                {book.firstPublishYear && (
                    <p className="text-xs text-gray-500">
                        Published: {book.firstPublishYear}
                    </p>
                )}
                <div className="card-actions justify-end">
                    <button
                        onClick={() => handleAddMedia(book)}
                        className="btn btn-primary btn-sm"
                    >
                        Add to Library
                    </button>
                </div>
            </div>
        </div>
    )

    // placeholders for other renders once the search functions are implemented
    const renderFilmItem = (film, key) => (
        <div key={key} className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-sm">{film.title || 'Unknown Film'}</h2>
                <p className="text-xs text-gray-600">Film (Not yet implemented)</p>
                <div className="card-actions justify-end">
                    <button
                        onClick={() => handleAddMedia(film)}
                        className="btn btn-primary btn-sm"
                    >
                        Add to Library
                    </button>
                </div>
            </div>
        </div>
    );

    const renderMusicItem = (music, key) => (
        <div key={key} className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-sm">{music.title || 'Unknown Track'}</h2>
                <p className="text-xs text-gray-600">Music (Not yet implemented)</p>
                <div className="card-actions justify-end">
                    <button
                        onClick={() => handleAddMedia(music)}
                        className="btn btn-primary btn-sm"
                    >
                        Add to Library
                    </button>
                </div>
            </div>
        </div>
    );

    const renderGameItem = (game, key) => (
        <div key={key} className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-sm">{game.title || 'Unknown Game'}</h2>
                <p className="text-xs text-gray-600">Game (Not yet implemented)</p>
                <div className="card-actions justify-end">
                    <button
                        onClick={() => handleAddMedia(game)}
                        className="btn btn-primary btn-sm"
                    >
                        Add to Library
                    </button>
                </div>
            </div>
        </div>
    );

    const loadMore = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        performSearch(query, nextPage, mediaType);
    };

    if (loading && !results) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!results || !getMediaItems() || getMediaItems().length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">No results found</h2>
                    <p>Try searching with different terms.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-6'>
                <h1 className='text-3xl font-bold'>Search Results for '{query}'</h1>
                <p className='text-gray-600'>Media type: {mediaConfig.displayName}</p>
                <p className='text-sm text-gray-500'>
                    Found {results.totalResults} results
                </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {getMediaItems().map((item, index) => renderMediaItem(item, index))}
            </div>

            {results.hasMore && (
                <div className='text-center mt-8'>
                    <button
                    onClick={loadMore}
                    disabled={loading}
                    className='btn btn-primary'>
                        {loading ? (
                            <>
                            <span className='loading loading-spinner loading-sm'></span>
                            Loading...</>
                        ): (
                            'Load More'
                        )}
                    </button>
                    </div>
            )}
        </div>
    );
}