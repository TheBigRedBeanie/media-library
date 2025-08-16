//handling the config of various API search functions

import searchBooks from './bookSearch';
// import searchFilm from './filmSearch';
// import searchMusic from './musicSearch';
//import searchGame from './gameSearch';

export const MEDIA_TYPES = {
    BOOK: 'Book',
    FILM: 'Film',
    MUSIC: 'Music',
    GAME: 'Game'
};

export default async function searchMedia(query, mediaType, options = {}) {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
        return { success: false, error: 'Search query is required'};
    }

    try {
        switch (mediaType) {
            case MEDIA_TYPES.BOOK:
                return await searchBooks(trimmedQuery, options);

            // case for film search
            case MEDIA_TYPES.FILM:
                //return await searchFilm(trimmedQuery, options);
                return {
                    sucess: false,
                    error: 'film search not yet implmeneted'
                };
            
                case MEDIA_TYPES.MUSIC:
                    //return await searchMusic(trimmedQuery, options);
                    return {
                        success: false,
                        error: 'music search not yet implemented'
                    };
                
                case MEDIA_TYPES.GAME:
                    //return await searchGame(trimmedQuery, options);
                    return {
                        success: false,
                        error: 'game search not yet implemented'
                    };
            
                    default:
                        return {
                            success: false,
                            error: `unsupported media type: ${mediaType}`
                        };
        }
    } catch (error) {
        console.error('[MediaSearch] Error:', error);
        return {
            success: false,
            error: error.message || 'search failed'
        };
    }
}


export function getMediaConfig(mediaType) {
    const configs = {
        [MEDIA_TYPES.BOOK]: {
            placeholder: 'Search for books...',
            fields: ' key title author_name first_publish_year cover_i isbn publisher',
            itemKey: 'books',
            displayName: 'Books'
        },
        [MEDIA_TYPES.FILM]: {
            placeholder: 'Search for movies...',
            fields: 'title year director cast plot poster',
            itemKey: 'films',
            displayName: 'films'
        },
        [MEDIA_TYPES.MUSIC]: {
            placeholder: 'Search for music...',
            fields: 'title artist album year genre',
            itemKey: 'tracks',
            displayName: 'Music'
        },
        [MEDIA_TYPES.GAME]: {
            placeholder: 'Search for games...',
            fields: 'title platform developer publisher year',
            itemKey: 'games',
            displayName: 'Games'
        }
    };

    return configs[mediaType] || configs[MEDIA_TYPES.BOOK];
}