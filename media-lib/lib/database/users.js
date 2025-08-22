import { supabase } from '../supabaseClient'

// users and authentication functions may go here

export default async function getUser(username) {
    try {
        const {data, error} = await supabase
            .from('users')
            .select('id, username, full_name, created_at')
            .eq('username', username);

        console.log('username + userID:', data[0].username, '+', data[0].id )

        if (error) {
        console.error('error fetching user:', error);
            return {success: false, error: error.message };
        }

        const user = data.map(user => ({
        userID: user.id,
        username: user.username,
        fullName: user.full_name,
        createdAd: user.created_at

}));

    return {success: true, user };
    } catch (err) {
        console.error('unexpected error:', err);
        return { success: false, error: 'unexpected error occurred' };
    }
}