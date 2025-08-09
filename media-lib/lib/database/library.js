// functions to get user's whole library, and do CRUD operations will go here


export default async function getUserLibrary(supabase, libraryID) {
    try {
        const {data, error} = await supabase
        .from('library')
        .select('library_id, media_id, media_type, date_added')
        .eq('library_id',libraryID)

        console.log('libraryID', data)

        if (error) {
            console.error('error fetching library', error);
            return {success: false, error: error.message };
        }

        const library = data.map(library => ({
            libraryID: library.library_id,
            mediaID: library.media_id,
            mediaType: library.media_type,
            DateAdded: library.date_added
        }));
    return {success: true, library}
    } catch (err) {
        console.error('unexpected error:', error)
        return { success: false, error: 'unepected error occurred' };
    }
}


export async function getMediaByID() {


}

