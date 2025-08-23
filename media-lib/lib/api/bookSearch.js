// utilized Kagi's Code Assistant to assist with developing the following API integration with openLibrary's Search API : https://openlibrary.org/dev/docs/api/search

export default async function searchBooks(query, opts = {}) {
    try {
        const {
            limit = 10,
            fields = 'key title author_name first_publish_year cover_i',
            page = 1,
            offset
        } = opts;

        const cleanQuery = query.trim();
        if (!cleanQuery) return {success: false, error: 'search query is required' };

        const baseUrl = 'https://openlibrary.org/search.json';

        const fieldsParam = fields.split(',').join(' ');

        const params = new URLSearchParams({
            q: cleanQuery,
            limit: limit.toString(),
            fields
        });

        if (offset !== undefined) {
            params.set('offset', offset.toString());
        } else {
            params.set('page', page.toString());
        }

        const url = `${baseUrl}?${params.toString()}`;
        console.log('[OpenLibrary] GET', url);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const totalResults = json.numFound ?? 0;

        const books = (json.docs ?? []).map(doc => ({
            key: doc.key,
            title: doc.title || 'Unknown Title',
            authors: doc.author_name || ['unknown author'],
            firstPublishYear: doc.first_publish_year || null,
            isbn: Array.isArray(doc.isbn) ? doc.isbn[0] : null,
            openLibraryId: doc.key?.replace('/works/', '') || null,
            coverUrl: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : null
        }));
        const currentOffset = offset ?? (page - 1) * limit;

        return {
            success: true,
            data: {
                books,
                totalResults,
                currentPage: Math.floor(currentOffset / limit) + 1,
                hasMore: currentOffset + limit < totalResults,
                query: cleanQuery
            }
        };
    } catch (err) {
        console.error('[OpenLibrary] Search Failed:', err);
        return { success: false, error: err.message || 'failed to search books.' };
    }
}


export const searchBooksByTitle = (title, opts) => searchBooks(`title:"${title}"`, opts);
export const searchBooksByAuthor = (author, opts) => searchBooks(`author:"${author}"`, opts);
export const searchBooksByISBN = (isbn, opts) => searchBooks(`isbn:"${isbn}"`);