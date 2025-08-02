'use client';

import { useState } from 'react';
import { getUserBooks, getMediaByLibraryId } from '../../lib/database/books';
import { supabase } from '@/lib/supabaseClient';

export default function DatabaseTest() {
  const [singleItem, setSingleItem] = useState(null);
  const [testLibraryId, setTestLibraryId] = useState('1'); // You'll need to update this with a real library ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [books, setBooks] = useState('');
  const userID = 'd9becd19-b343-4711-97a5-3779765508cc';

  console.log('dbtest started');

  const testGetBooks = async () => {
    setLoading(true);
    setError('');
    console.log('Testing getUserBooks with userID:', userID);
    
    try {
      console.log('Testing with userID:', userID);
      console.log('userID type:', typeof userID);
      
      // Let's test with different table names and check RLS
      console.log('Testing different approaches...');
      
      // Test 1: Try getting ALL data without filters
      const { data: testAll, error: testAllError } = await supabase
        .from('library')
        .select('*');
      
      console.log('Test 1 - All library data (no filters):', testAll);
      console.log('Test 1 - Error:', testAllError);
      
      // Test 2: Check if it's a table name issue
      const { data: testTables, error: testTablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      console.log('Test 2 - Available tables:', testTables);
      console.log('Test 2 - Error:', testTablesError);
      
      // Let's see what user IDs actually exist in the library table
      const { data: allLibraryData, error: allLibraryError } = await supabase
        .from('library')
        .select('user_id, media_type, media_id');
      
      console.log('All library data:', allLibraryData);
      console.log('All library error:', allLibraryError);
      
      // Check if our UUID matches exactly
      if (allLibraryData && allLibraryData.length > 0) {
        const matchingRecord = allLibraryData.find(record => record.user_id === userID);
        console.log('Matching record found:', matchingRecord);
        
        // Check each character
        const dbUserId = allLibraryData[0].user_id;
        console.log('DB user_id:', dbUserId);
        console.log('Our userID:', userID);
        console.log('Are they equal?', dbUserId === userID);
        console.log('DB user_id length:', dbUserId?.length);
        console.log('Our userID length:', userID.length);
      }
      
      // Let's try the specific query
      const { data: rawData, error: rawError } = await supabase
        .from('library')
        .select('*')
        .eq('user_id', userID);
      
      console.log('Raw library data for user:', rawData);
      console.log('Raw library error:', rawError);
      
      const result = await getUserBooks(supabase, userID);
      console.log('Full getUserBooks result:', result);
      
      if (result.success) {
        console.log('Books loaded:', result.books);
        console.log('Books array length:', result.books.length);
        setBooks(result.books);
      } else {
        console.error('Error:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Unexpected error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      const { data, error } = await supabase.from('users').select('count');
      
      if (error) {
        console.error('Connection failed:', error);
        setError('Connection failed: ' + error.message);
      } else {
        console.log('Connection successful:', data);
        alert('Connection successful!');
        setError('');
      }
    } catch (err) {
      console.error('Connection test failed:', err);
      setError('Connection test failed: ' + err.message);
    }
  };


  const testGetMediaById = async () => {
    try {
      console.log('testing getMedia by id');
      const {data, error} = await supabase
      .from('library')
      .select('id', 'media_id')
      .eq('user_id', userID)

      let libraryID = data.id;
      let mediaID = data.media_id;

      if (error) {
        console.error('media test failed', error);
        setError('media test failed' + error.message);
      } else {
        console.log('mediaID succes', mediaID);
        alert('media test passed, mediaID:', mediaID);
        setError('');
      }

      const result = await getMediaByLibraryId(supabase, mediaID, libraryID)
        console.log('getMediaByLibraryID test result: ', result);

    } catch (err) {
      console.error('mediabyid failed', err);
      setError('meida by id failed' + err.message);
    }




  }
return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Database Test Page</h1>
      <p>Testing with User ID: <strong>{userID}</strong></p>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Library ID to test: 
          <input 
            type="text" 
            value={testLibraryId} 
            onChange={(e) => setTestLibraryId(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testConnection} 
          style={{ marginRight: '10px', padding: '10px', cursor: 'pointer' }}
        >
          Test Connection
        </button>
        <button 
          onClick={testGetBooks} 
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px', cursor: 'pointer' }}
        >
          {loading ? 'Loading...' : 'Get User Books'}
        </button>
        <button 
          onClick={testGetMediaById} 
          disabled={loading}
          style={{ padding: '10px', cursor: 'pointer' }}
        >
          {loading ? 'Loading...' : 'Get Media by Library ID'}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '20px', 
          padding: '10px', 
          border: '1px solid red',
          backgroundColor: '#ffebee'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div>
        <h2>All Books Results:</h2>
        {books.length > 0 ? (
          <div>
            <p><strong>Found {books.length} books:</strong></p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {books.map((book) => (
                <li key={book.libraryId} style={{ 
                  marginBottom: '15px', 
                  padding: '15px', 
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <strong>{book.title}</strong>
                  {book.author && <> by {book.author}</>}
                  <br />
                  <small style={{ color: '#666' }}>
                    Library ID: {book.libraryId} | 
                    Added: {book.dateAdded}
                    {book.isbn && <> | ISBN: {book.isbn}</>}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No books loaded yet. Click "Get User Books" to test.</p>
        )}
      </div>

      <div>
        <h2>Single Item Result:</h2>
        {singleItem ? (
          <div style={{ 
            padding: '15px', 
            border: '2px solid #4CAF50',
            borderRadius: '5px',
            backgroundColor: '#f0f8f0'
          }}>
            <strong>{singleItem.title}</strong>
            {singleItem.author && <> by {singleItem.author}</>}
            <br />
            <small style={{ color: '#666' }}>
              Library ID: {singleItem.libraryId} | 
              Media Type: {singleItem.mediaType} |
              Added: {singleItem.dateAdded}
              {singleItem.isbn && <> | ISBN: {singleItem.isbn}</>}
            </small>
          </div>
        ) : (
          <p>No single item loaded yet. Enter a Library ID and click "Get Media by ID".</p>
        )}
      </div>

      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
        <p><strong>Check the browser console for detailed logs</strong></p>
      </div>
    </div>
  );
}