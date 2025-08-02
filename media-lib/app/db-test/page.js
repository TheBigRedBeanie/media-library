'use client';
import { useState } from "react";
import getUser from "../../lib/database/users"
import getUserLibrary from "@/lib/database/library";
import getUserBooks, {getUserBookByID} from "@/lib/database/books";
import getUserFilm, {getUserFilmByID} from "@/lib/database/film";
import getUserMusic, {getUserMusicByID} from "@/lib/database/music";
import { supabase } from "@/lib/supabaseClient";


//- get users 
//- get library by user ID 
//- get media by media ID;

export default function DatabaseTest() {
  const [libraryID, setLibraryID] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userID, setUserID] = useState('');
  const [librarydata, setLibraryData] = useState('');
  const username = 'thebigredbeanie';

  console.log('database test started');

  const testGetUser = async () => {
    setLoading(true);
    setError('');
    console.log('getting user');

    try {

      const result = await getUser(supabase, username);

      if (result.success) {
      setUserID(result.user)
      setLibraryID(result.library)
      console.log('get user result', result)
      } else {
        setError(result.error);
        console.error('error with function', error);
      }
    } catch (err) {
      console.error('unexpected error:', err);
      setError('unexpected error:' + err.message);
    } finally {
      setLoading(false);
    }
    
  };

  const testGetUserLibrary = async () => {
    setLoading(true);
    setError('');
    console.log('getting user library');

    try {
      const result = await getUserLibrary(supabase, libraryID);

      if (result.success) {
        setLibraryData(result.library)
        console.log('get library resul', library)
  

      } else {
        setError(result.error);
        console.error('error with get library', error);
      }
    } catch (err) {
      console.error('unexpected error:', err);
        setError('unepxected error' + err.message);
    } finally {
      setLoading(false);
    }

  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>testing username</h1>
      <p>get userID via username <strong>{username}</strong></p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
        onClick={testGetUser}
        style={{ padding: '10px', cursor: 'pointer' }}
        disabled={loading}
        ></button>
      </div>

      <button 
      className='btn'
      onClick={testGetUser}>test button</button>
      <button
      className='btn'
      onClick={testGetUserLibrary}>get user library</button>
    </div>
  )
}
