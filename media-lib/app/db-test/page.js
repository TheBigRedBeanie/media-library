'use client';
import { useState, useEffect } from "react";
import getUser from "../../lib/database/users"
import getUserLibrary, {addMediaToLibrary, deleteMediaFromLibrary} from "@/lib/database/library";
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
  const [formData, setFormData] = useState({
    title: '',
    creator: '',
    mediaType: '',
    releaseDate: '',
    description: '',
    format: ''
  });
  const [libLoaded, setLibLoaded] = useState(false);
  const [mediaIdNum, setMediaIdNum] = useState('');

  const username = 'thebigredbeanie';

  console.log('database test started');

  const testGetUser = async () => {
    setLoading(true);
    setError('');
    console.log('getting user');

    try {

      const result = await getUser(username);

      if (result.success) {
      const userId = result.user[0].userID;
      setUserIdNum(userId)
      setLibraryID(userId)
      console.log('get user result', userId)
      console.log('libraryid', userId)
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
      const result = await getUserLibrary(libraryID);

      if (result.success && result.library) {
        setLibraryData(result.library)
        setLibLoaded(true)
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
      const result = await getUserMedia(libraryData);

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

  useEffect(() => {
    if (userIdNum) {
      testGetUserLibrary();
    }
  }, [userIdNum]);

  useEffect(() => {
    if (libraryData && libraryData.length > 0) {
      testGetUserMedia();
    }
  }, [libraryData]);


const testAddMediaToLibrary = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  console.log('starting media add');

  console.log('form data:', formData);
  console.log('user id', userIdNum);

  if (!formData.title || !formData.creator || !formData.mediaType || !formData.format) {
    setError('title, creator, media type, and format are required');
    setLoading(false);
    return;
  }

    try {
      const result = await addMediaToLibrary(userIdNum, formData);
      console.log('add media result', result);
      
      if (result.success) {
        console.log('media added successfully');

        setFormData({
          title: '',
          creator: '',
          mediaType: '',
          releaseDate: '',
          description: '',
          format: ''
        });

        testGetUserLibrary();
      }
      
      else {
        setError(result.error);
        console.error('database error', result.error);
      }
    } catch (err) {
      console.error('unexpected error:', err);
      setError('unexpected error' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const testDeleteMediaFromLibrary = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('deleting media:', mediaIdNum)

    try {
      const result = await deleteMediaFromLibrary(userIdNum, mediaIdNum)
      console.log('page message: deleting media id:', mediaIdNum)
      if (result.success) {
        console.log('media deleted!', mediaIdNum)
        setMediaIdNum('');

        testGetUserLibrary();

      } else {
            setError(result.error);
            console.error('database error', result.error);
    } 
  } catch (err) {
    console.error('unexpected error' + err.message);
  } finally {
    setLoading(false);
  }
}

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("users").insert([
        { id: data.user.id, username: email.split("@")[0] }
      ]);
    }

    alert("Check your email for a confirmation link!");
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert("Signed in!");
  };
  

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

      <form className='form' id='mediaForm' onSubmit={testAddMediaToLibrary}>
        <label htmlFor="title">title</label>
        <input 
        className='input'
        type='text'
        id='title'
        name='title'
        value={formData.title}
        onChange={handleInputChange}
        ></input>
        <label htmlFor='creator'>creator</label>
        <input
        className='input'
        type='text'
        id='creator'
        name='creator'
        value={formData.creator}
        onChange={handleInputChange}
        ></input>
        <label htmlFor='mediaType'>media type</label>
        <select 
        className='input'
        id='mediaType'
        name='mediaType'
        value={formData.mediaType}
        onChange={handleInputChange}
        >
          <option value=''>select media type</option>
          <option value='book'>Book</option>
          <option value='film'>Film</option>
          <option value='music'>Music</option>
        </select>
        <label htmlFor='releaseDate'>release date</label>
        <input
        className='input'
        type='date'
        id='releaseDate'
        name='releaseDate'
        value={formData.releaseDate}
        onChange={handleInputChange}
        ></input>
        <label htmlFor='description'>description</label>
        <input
        className='input'
        type='text'
        id='description'
        name='description'
        value={formData.description}
        onChange={handleInputChange}
        ></input>
                <label htmlFor='format'>format</label>
        <input
        className='input'
        type='text'
        id='format'
        name='format'
        value={formData.format}
        onChange={handleInputChange}
        ></input>
        <button
        type='submit'
        className='btn'
        disabled={loading}>{loading ? 'adding...' : 'Submit'}</button>
      </form>
      <br></br>
      <br></br>

      <h2>testing delete</h2>
      <div>
        <form
        className='form'
        id='deleteForm'
        onSubmit={testDeleteMediaFromLibrary}>
        <input 
        className='input'
        id='mediaId'
        name='mediaId'
        value={mediaIdNum}
        placeholder='enter media id to delete'
        onChange={(e) => setMediaIdNum(e.target.value)}></input>
        <button
        className='btn'
        type='submit'
        disabled={loading}>{loading ? 'deleting...' : 'delete'}</button>
        </form>
      
      
      </div>
      <br></br><br></br>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={signUp}>Sign Up</button>
      <button onClick={signIn}>Sign In</button>
    </div>

    
  )
}



export function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("users").insert([
        { id: data.user.id, username: email.split("@")[0] }
      ]);
    }

    alert("Check your email for a confirmation link!");
  };

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert("Signed in!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Supabase Auth</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={signUp}>Sign Up</button>
      <button onClick={signIn}>Sign In</button>
    </div>
  );
}
