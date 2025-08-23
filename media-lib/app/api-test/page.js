// utilized Kagi's Code Assistant to assist with developing the following API integration with openLibrary's Search API : https://openlibrary.org/dev/docs/api/search

'use client';
import { useState } from 'react';
import searchBooks, {
    searchBooksByTitle,
    searchBooksByAuthor,
    searchBooksByISBN
} from '@/lib/api/bookSearch'

export default function ApiTestPage() {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('general');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) {
            setError('Please enter a search query');
            setResults(null);
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);

        try {
            let res;
            switch (searchType) {
                case 'title':
                    res = await searchBooksByTitle(trimmed);
                    break;
                case 'author':
                    res = await searchBooksByAuthor(trimmed);
                    break;
                case 'isbn':
                    res = await searchBooksByISBN(trimmed);
                    break;
                default:
                    res = await searchBooks(trimmed);
            }

            if (res.success) setResults(res.data);
            else setError(res.error);
        } catch (err) {
            setError('an unexpected error occurred'. err.message)
        } finally {
            setLoading(false);
        }
    };

    const handleBookSelect = (book) => {
        alert(`Selected: ${book.title} by ${book.authors.join(', ')}`);
    };

    return (
        <div className='p-6 max-w-5xl mx-auto'>
            <h1 className='text-3xl font-bold mb-6'>Book Search API Test</h1>

            <form onSubmit={handleSearch} className='mb-6'>
                <div className='flex gap-3 mb-4'>
                    <input
                    type='text'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder='search for books..'
                    className='input input-bordered w-full max-w-md'
                    />
                    <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className='select select-bordered'
                    >
                        <option value='general'>General Search</option>
                        <option value='title'>By Title</option>
                        <option value='author'>By Author</option>
                        <option value='isbn'>By ISBN</option>
                    </select>
                    <button type='submit' disabled={loading} className='btn btn-primary'>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {error && (
                <div className='alert alert-error mb-6'>
                    <span>{error}</span>
                    </div>
            )}

            {results && (
                <div>
                    <h2 className='text-2xl font-semibold mb-4'>
                        Search results ({results.totalResults} total for '{results.query}')
                    </h2>

                    {results.books.length === 0 ? (
                        <div className='alert alert-info'>
                            <span>No books found. Try a different term.</span>
                            </div>
                    ): (
                        <div className='gird grid-cols-1 md:grid-cols-2 lg:gid-cols-3 gap-6'>
                            {results.books.map((book, idx) => (
                                <div key={book.key ?? idx} 
                                className='card card-compact bg-base-100 shadow-xl'>
                                    <figure className='px-4 pt-4'>
                                        {book.coverUrl ? (
                                            <img
                                            src={book.coverUrl}
                                            alt={`cover of ${book.title}`}
                                            className='object-cover w-24 h-36 rounded'
                                            />
                                        ) : (
                                            <div className='w-24 h-36 bg-neutral text-neautral-content flex items-cner justify-center rounded'>
                                                <span className='text-xs'>No Cover</span>
                                            </div>
                                        )}
                                    </figure>
                                    <div className='card-body'>
                                        <h3 className='card-title text-base'>{book.title}</h3>
                                        <p className='text-sm'>
                                            <strong>Author(s):</strong> {book.authors.join(' ')}
                                        </p>
                                        {book.firstPublishYear && (
                                            <p className='text-xs'>
                                                <strong>First Published:</strong> {book.firstPublishYear}
                                            </p>
                                        )}
                                        {book.isbn && (
                                            <p className='text-xs'>
                                                <strong>ISBN:</strong> {book.isbn}
                                            </p>
                                        )}
                                        <div className='card-actions justify-end'>
                                            <button
                                            onClick={() => handleBookSelect(book)}
                                            className='btn btn-success btn-sm'
                                            >
                                                Select
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                <div className='mt-6 text-center text-sm text-neutral'>
                    Showing {results.books.length} of {results.totalResults}
                    {results.hasMore && ' (more available)'}
                </div>
            </div>
        )}
        </div>
    );
}