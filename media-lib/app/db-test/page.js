'use client';
import { useState } from "react";
import getUser from "../../lib/database/users"
import getUserLibrary from "@/lib/database/library";
import getUserMedia, {getUserMediaByID} from "@/lib/database/media";
import { supabase } from "@/lib/supabaseClient";


//- get users 
//- get library by user ID 
//- get media by media ID;

export default function DatabaseTest() {
  const [libraryID, setLibraryID] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userIdNum, setUserIdNum] = useState('');
  const [libraryData, setLibraryData] = useState('');
  const [mediaData, setMediaData] = useState('');
  const username = 'thebigredbeanie';

  console.log('database test started');

  const testGetUser = async () => {
    setLoading(true);
    setError('');
    console.log('getting user');

    try {

      const result = await getUser(supabase, username);

      if (result.success) {
      setUserIdNum(result.user[0].userID)
      setLibraryID(userIdNum)
      console.log('get user result', userIdNum)
      console.log('libraryid', libraryID)
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
        console.log('get library result', libraryData)
  

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


  const testGetUserMedia = async () => {
    setLoading(true);
    setError('');
    console.log('getting user media');

    try { 
      const result = await getUserMedia(supabase, libraryData);

      if (result.success) {
        setMediaData(result.media)
        console.log('get media result', mediaData)

      } else {
        setError(result.error);
        console.error('error with the get media', error);
      }

    } catch (err) {
      console.error('unexpected error:', err);
      setError('unexpected error' + err.message);
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
            <button
      className='btn'
      onClick={testGetUserMedia}>get user media</button>
    </div>
  )
}
