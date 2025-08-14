'use client';
import { useState } from 'react';
import SearchBooks, {searchBooksByTitle, searchBooksByAuthor, searchBooksByISBN } from '@/lib/api/bookSearch';

export default function ApiTestPage() {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('general'); // general, title, author, isbn
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!query.trim()) {
            setError('Please enter a search query');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);

        try {
            let searchResult;
            
            switch (searchType) {
                case 'title':
                    searchResult = await searchBooksByTitle(query);
                    break;
                case 'author':
                    searchResult = await searchBooksByAuthor(query);
                    break;
                case 'isbn':
                    searchResult = await searchBooksByISBN(query);
                    break;
                default:
                    searchResult = await SearchBooks(query);
            }

            if (searchResult.success) {
                setResults(searchResult.data);
                console.log('Search results:', searchResult.data);
            } else {
                setError(searchResult.error);
            }
        } catch (err) {
            console.error('Search error:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleBookSelect = (book) => {
        console.log('Selected book:', book);
        // Here you could add the book to your library, show details, etc.
        alert(`Selected: ${book.title} by ${book.authors.join(', ')}`);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>📚 Book Search API Test</h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for books..."
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        style={{
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="general">General Search</option>
                        <option value="title">By Title</option>
                        <option value="author">By Author</option>
                        <option value="isbn">By ISBN</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: loading ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {/* Error Display */}
            {error && (
                <div style={{
                    color: 'red',
                    backgroundColor: '#ffe6e6',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    Error: {error}
                </div>
            )}

            {/* Results Display */}
            {results && (
                <div>
                    <h2>
                        📖 Search Results ({results.totalResults} total results for "{results.query}")
                    </h2>
                    
                    {results.books.length === 0 ? (
                        <p>No books found. Try a different search term.</p>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '20px'
                        }}>
                            {results.books.map((book, index) => (
                                <div
                                    key={book.key || index}
                                    style={{
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        backgroundColor: '#f9f9f9'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        {/* Book Cover */}
                                        {book.coverUrl ? (
                                            <img
                                                src={book.coverUrl}
                                                alt={`Cover of ${book.title}`}
                                                style={{
                                                    width: '60px',
                                                    height: '90px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '60px',
                                                height: '90px',
                                                backgroundColor: '#ddd',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                color: '#666'
                                            }}>
                                                No Cover
                                            </div>
                                        )}

                                        {/* Book Details */}
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>
                                                {book.title}
                                            </h3>
                                            <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                                <strong>Author(s):</strong> {book.authors.join(', ')}
                                            </p>
                                            {book.firstPublishYear && (
                                                <p style={{ margin: '0 0 5px 0', color: '#666' }}>
                                                    <strong>First Published:</strong> {book.firstPublishYear}
                                                </p>
                                            )}
                                            {book.isbn && (
                                                <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
                                                    <strong>ISBN:</strong> {book.isbn}
                                                </p>
                                            )}
                                            
                                            <button
                                                onClick={() => handleBookSelect(book)}
                                                style={{
                                                    marginTop: '10px',
                                                    padding: '5px 15px',
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                Select This Book
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Info */}
                    <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
                        Showing {results.books.length} of {results.totalResults} results
                        {results.hasMore && ' (more results available)'}
                    </div>
                </div>
            )}
        </div>
    );
}