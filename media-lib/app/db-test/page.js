'use client';
import { useState } from "react";
import getUser from "../../lib/database/users"
import getUserLibrary, {addMediaToLibrary} from "@/lib/database/library";
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


  const testAddMediaToLibrary = async () => {
    setLoading(true);
    setError('');
    console.log('starting media add');

    setMediaData({title, creator, releaseDate, description, format});

    try {
      const result = await addMediaToLibrary(supabase, userIdNum, mediaData) 
    } catch (err) {
      console.error('unexpected error:', err);
      setError('unexpected error' + err.message);
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
      <form className='form' id='mediaForm'>
        <label for="title">title</label>
        <input 
        className='input'
        type='text'
        id='title'
        name='title'
        ></input>
        <label for='creator'>creator</label>
        <input
        className='input'
        type='text'
        id='creator'
        name='creator'
        ></input>
        <label for='mediaType'>media type</label>
        <input 
        className='input'
        type='text'
        id='mediaType'
        name='mediaType'
        ></input>
        <label for='releaseDate'>release date</label>
        <input
        className='input'
        type='date'
        id='releaseDate'
        name='releaseDate'
        ></input>
        <label for='description'>description</label>
        <input
        className='input'
        type='text'
        id='description'
        name='description'
        ></input>
                <label for='format'>format</label>
        <input
        className='input'
        type='text'
        id='format'
        name='format'
        ></input>
        <button
        className='btn'
        onClick={testAddMediaToLibrary}>submit</button>
      </form>
    </div>
  )
}
