'use client';
import MediaCard from '../../components/MediaCard'
import Link from 'next/link'
import { useState } from 'react'
import { getUserBooks } from '../../lib/database/books'
import { supabase } from '@/lib/supabaseClient';

export default function DatabaseTest() {
    const userID = 'd9becd19-b343-4711-97a5-3779765508cc';
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    console.log('dbtest started');

    const testGetBooks = async () => {
      setLoading(true);
      setError('');
      console.log('testing getUserBooks with userID:', userID);

      try {
        const result = await getUserBooks(supabase, userID);

        if (result.success) {
          console.log('books loaded', result.books);
          setBooks(result.books);
        } else {
          console.error('error:', result.error);
          setError(result.error);
        }
      } catch (err) {
        console.error('unexpected error:', err);
        setError('unexpected error:' + err.messsage);
      } finally {
        setLoading(false);
      }
    };


    const testConnection = async () => {
      try {
        console.log('testing supabase');
        const { data, error } = await supabase.from('Users').select('count');

        if (error) {
          console.error('connection failed:', error);
          setError('connection failed', + error.message);

        } else {
          console.log('connection successful:', data);
          alert('connection successful');
          setError('');
        }
      } catch (err) {
        console.error('conenction test failed', err);
        setError('connection test failed' + err.message);
      }
    };

    return (

   <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Database Test Page</h1>
      <p>Testing with User ID: <strong>{userID}</strong></p>
      
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
          style={{ padding: '10px', cursor: 'pointer' }}
        >
          {loading ? 'Loading...' : 'Get User Books'}
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
        <h2>Results:</h2>
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

      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
        <p><strong>Check the browser console for detailed logs</strong></p>
      </div>
    </div>
  ); 
    }
