import { supabase } from '../supabaseClient'

export default async function getUserMedia(libraryData) {

//in theory, libraryData will be an array of media_id from the library table captured in a previous function

// build a unique index on the media table 


    try {

        const mediaIds = libraryData.map(item => item.mediaID);
        console.log('searching media IDs', mediaIds);
        console.log('Input libraryData:', libraryData);
        console.log('libraryData type:', typeof libraryData);
        console.log('Is array?', Array.isArray(libraryData));

        const {data, error} = await supabase
        .from('media')
        .select('media_id, created_at, title, creator, media_type, release_date, desc, format')
        .in('media_id', mediaIds);

        console.log('media', data)

        if (error) {
            console.error('error fetching media', error);
            return {success: false, error: error.message };
        }

        const media = data.map(media => ({
        mediaID: media.media_id,
        createdAt: media.created_at,
        title: media.title,
        creator: media.creator,
        mediaType: media.media_type,
        releaseDate: media.release_date,
        desc: media.desc,
        format: media.format


        }))
        return {success: true, media}
    } catch (err) {
        console.error('unexpected error:', err)
        return { success: false, error: 'unexpected error occurred' };
    }
}
