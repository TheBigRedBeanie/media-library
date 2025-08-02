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

        const libraryData = data.map(libraryData => ({
            libraryID: libraryData.id,
            mediaID: libraryData.media_id,
            mediaType: libraryData.media_type,
            DateAdded: libraryData.date_added
        }));
    return {success: true, libraryData}
    } catch (err) {
        console.error('unexpected error:', error)
        return { success: false, error: 'unepected error occurred' };
    }
}


export async function getMediaByID() {


}

