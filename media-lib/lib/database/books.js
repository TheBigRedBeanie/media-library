// function to get all books from user's library
export async function getUserBooks(supabase, userID) {
    try {
        const { data, error } = await supabase
        .from('library')
        .select(`
            id,
            books (
            id,
            title,
            author,
            pub_date
            isbn)
        `)
        .eq('user_id', userID)
        .eq('media_type', 'book')
        .order('date_added', { ascending: false});

        console.log('gn2 fetching data')

        if (error) {
            console.error('Error fetching user books:', error);
            return { success: false, error: error.message };
        }

        const books = data.map(item => ({
            libraryId: item.id,
            dateAdded: item.date_added,
            ...item.books
        }));

        return { success:  true, books };
    } catch (err) {
        console.error('Unexpected error:', err);
        return { success: false, error: 'an unexpected error occurred' };
    }
}

//function to get a single book from the logged in user's library based on book ID
export async function getUserBookByID(supabase, userId, libraryId) {
    try {
        const {data, error} = await supabase
        .from('library')
        .select(`
            id,
            date_added,
            books (
            id,
            title
            author,
            pub_date,
            isbn)
            `)
            .eq('user_id', userId)
            .eq('id', libraryId)
            .eq('media_type', 'book')
            .single();

            if (error) {
                console.error('Error fetching book:', error);
                return { success: false, error: error.message };
            }

            if (!data) {
                return {success: false, error: 'Book not found in library'};
            }

            const book = {
                libraryId: data.id,
                dateAdded: data.date_added,
                ...data.books
            };

            return { success: true, book};
    } catch (err) {
        console.error('Unexpected error:', err);
        return { success: false, error: 'An unexpected error occurred'};
    }
}