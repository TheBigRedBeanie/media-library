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


export async function addMediaToLibrary( supabase, userId, mediaData) {
    const { title, creator, mediaType, releaseDate, description, format} = mediaData;

    try{ 

        const validMediaTypes = ['book', 'film', 'music'];
        if (!validMediaTyptes.includes(mediaType)) {
            return {success: false, error: `invalid media type: ${mediaType}` };
        }

        let mediaRecord;
        let tableName;

        if (mediaType === 'book') {
            tableName = 'books';
            const { data, error } = await supabase
            .from('books')
            .insert({
                title: title,
                creator: creator,
                media_type: mediaType,
                release_date: releaseDate,
                desc: description,
                format: format
            })
            .select()
            .single();

            if (error) {
                console.error('error creating book', error);
                return { success: false, error: error.message };
            }

            mediaRecord = data;
        } else if (mediaType === 'film') {
            tableName = 'film';
            const { data, error } = await supabase 
            .from('film')
            .insert({
                title: title,
                creator: creator,
                media_type: mediaType,
                release_date: releaseDate,
                desc: description,
                format: format
            })
            .select()
            .single();

            if (error) {
                console.error('error creating film', error);
                return {success: false, error: error.message };
            }

            mediaRecord = data;
        } else if (mediaType === 'music') {
            tableName = 'music';
            const { data, error } = await supabase
            .from('film')
            .insert({
                title: title,
                creator: creator,
                media_type: mediaType,
                release_date: releaseDate,
                desc: description,
                format: format
            })
            .select()
            .single();

            if (error) {
                console.error('error creating music', error);
                return {success: false, error: error.message };
            }

            mediaRecord = data;
        }

        console.log(`${mediaType} created: `, mediaRecord);

        const { data: libraryEntry, error: libraryError } = await supabase
        .from('library')
        .insert({
            user_id: userId,
            media_type: mediaType,
            media_id: mediaRecord.id,
        })
        .select()
        .single();

        if (libraryError) {
            console.error('error adding to library', libraryError);
        }


        const result = {
            libraryId: libraryEntry.id,
            dateAdded: libraryEntry.date_added || libraryEntry.created_at,
            mediaType: libraryEntry.media_type,
            mediaId: libraryEntry.media_id,
            ...mediaRecord
        };

        return {
            success: true,
            message: `${mediaType} "${title}" added to library succssfully`,
            data: result
        };

    } catch (err) {
        console.error('unexpected error', err);
        return {success: false, error: 'an unexpected error occurred' };
    }
}
