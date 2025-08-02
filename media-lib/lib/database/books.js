// function to get all books from user's library
export async function getUserBooks(supabase, userID) {
    try {
        const { data, error} = await supabase
        .from('library')
        .select(`
            id,
            books (
            id,
            title,
            author,
            pub_date,
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

export async function getMediaByLibraryId(supabase, userId, libraryId) {

try {

    const { data: libraryData, error: libraryError } = await supabase
    .from('library')
    .select('id, date_added', 'media_type', 'media_id')
    .eq('user_id', userId)
    .eq('id', libraryId)
    .single();

if (libraryError) {
    console.error('error fetching library entry', libraryError);
    return { success: false, error: libraryError.message };

}

if (!libraryData) {
    return {success: false, error: 'library entry not found' };
}


console.log('library entry found', libraryData);


let mediaDetails;

if (libraryData.media_type === 'book') {
    const { data: bookData, error: bookError} = await supabase
    .from('books')
    .select('*')
    .eq('id', libraryData.media_id)
    .single();


    if (bookError) {
        console.error('error fetching book details', bookError);
        return {success: false, error: bookError.message}; 
    }


    mediaDetails = bookData;
}

else {
    return {success: false, error: `media type '${libraryData.media_type} not supported yet'`};
}


const result = {
    libraryId: libraryData.id,
    dateAdded: libraryData.date_added,
    mediaType: libraryData.media_type,
    mediaId: libraryData.media_id,

    ...mediaDetails
        };



    console.log('Combined result:', result);
    return { success: true, mediaItem: result };

  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
    }

