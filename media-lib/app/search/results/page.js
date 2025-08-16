'use client'
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import searchBooks from '@/lib/api/bookSearch';
import { addMediaToLibrary } from '@/lib/database/library';

export default function SearchResultsPage() {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const searchParams = useSearchParams();
    const router = useRouter();

    const query = searchParams.get('q') || '';

    useEffect(() => {
        if (query) {
            performSearch(query, 1)
        }
    }, [query]);

    const performSearch = async (searchQuery, page = 1) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');

        try {
            const limit = 12;
            const offset = (page - 1) * limit;

            const searchResult = await searchBooks(searchQuery, {
                limit,
                offset,
                fields: 'key title author_name first_publish_year cover_i isbn publisher'
            });

            if (searchResult.success) {

                if (page === 1) {
                    setResults(searchResult.data);
                } else {
                    setResults(prev => ({
                        ...searchResult.data,
                        books: [...prev.books, ...searchResult.data.books]
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

    const handleAddMedia = (book) => {
        console.log('selected book', book)
    }
}