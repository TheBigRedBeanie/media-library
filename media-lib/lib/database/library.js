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
        console.error('unexpected error:', err)
        return { success: false, error: 'unepected error occurred' };
    }
}


export async function checkForDuplicates(supabase, mediaType, title, format, creator) {
    try {
        console.log('🔍 Searching for duplicates:', { title: title.trim(), creator: creator.trim(), format: format.trim() });
        const { data, error } = await supabase
        .from('media') 
        .select('media_id, title, format, creator')
        .ilike('title', title.trim())
        .ilike('format', format.trim())
        .ilike('creator', creator.trim())
        .ilike('media_type', mediaType.trim());

        if (error) {
            console.error('error checking for dupes', error);
            return { success: false, error: error.message };
        }
    
        console.log('📊 Found similar items:', data);

        const exactMatch = data.find(item => 
        item.title.toLowerCase().trim() === title.toLowerCase().trim() && 
        item.creator.toLowerCase().trim() === creator.toLowerCase().trim() &&
        item.format.toLowerCase().trim() === format.toLowerCase().trim() &&
        item.mediaType?.toLowerCase().trim() === mediaType.toLowerCase().trim()
    );

    return {
        success: true,
        isDuplicate: !!exactMatch,
        existingItem: exactMatch || null,
        similarItems: data
    };
} catch (err) {
    console.error('unexpected error checking dupes', err);
    return { success: false, error: 'unexpected error occurred' };
}
}

export async function addMediaToLibrary( supabase, userId, mediaData) {
    const { title, creator, mediaType, releaseDate, description, format} = mediaData;

    try{ 

        const validMediaTypes = ['book', 'film', 'music'];
        if (!validMediaTypes.includes(mediaType)) {
            return {success: false, error: `invalid media type: ${mediaType}` };
        }

        console.log('checking for dupes');
        const duplicateCheck = await checkForDuplicates(supabase, mediaType, title, format, creator);

        console.log('🔍 Duplicate check result:', duplicateCheck);

        if (!duplicateCheck.success) {
            console.error('❌ Duplicate check failed:', duplicateCheck.error);
            return {success: false, error: `error checking dupes: ${duplicateCheck.error}`}
        }

        if (duplicateCheck.isDuplicate) {
            console.log('🚫 Duplicate detected, blocking insertion');
            return {
                success: false,
                error: `duplicate found "${title} by ${creator} in ${format} format already exists`,
                isDuplicate: true,
                existingItem: duplicateCheck.existingItem
            };
        }

        console.log('✅ No duplicates found, proceeding with insertion');

        let mediaRecord;
        let tableName = 'media';

        if (validMediaTypes.includes(mediaType)) {
            const { data, error } = await supabase 
            .from(tableName)
            .insert({
                title: title.trim(),
                creator: creator.trim(),
                media_type: mediaType,
                release_date: releaseDate,
                desc: description ? description.trim() : null,
                format: format.trim()
            })
            .select()
            .single();

            if (error) {
                console.error(`error creating ${mediaType}`, error);
                return { success: false, error: error.message };
            }

            mediaRecord = data;
        }

        console.log(`${mediaType} created: `, mediaRecord);

        const { data: libraryEntry, error: libraryError } = await supabase
        .from('library')
        .insert({
            library_id: userId,
            media_type: mediaType,
            media_id: mediaRecord.media_id,
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
