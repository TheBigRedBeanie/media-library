"use client";
import MediaCard from '../../components/MediaCard'
import Link from 'next/link'
import { useState } from 'react'

export default function LibraryPage() {
  // Dummy data for now (this will be connected to Supabase later)
  const mediaItems = [
    { id: 1, title: 'Inception', type: 'Movies', url: 'https://placehold.co/300x200' },
    { id: 2, title: '1984', type: 'Books', url: 'https://placehold.co/300x200' },
    { id: 3, title: 'Assasins Creed', type: 'Games', url: 'https://placehold.co/300x200' },
    { id: 4, title: 'Ok Coders Hack the AI', type: 'Movies', url: 'https://placehold.co/300x200' },
    { id: 5, title: 'Song', type: 'Songs', url: 'https://placehold.co/300x200' },
  ]


// State for filter and view
const [filter, setFilter] = useState('All')
const [view, setView] = useState('grid') // grid or list view

// Filter logic
const filteredItems = filter === 'All'
  ? mediaItems
  : mediaItems.filter(item => item.type === filter)

  return (
    <div className="space-y-10">
      {/* Header & Filters */}
      <section className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2">
          <button
            className={`btn ${filter === 'All' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('All')}
          >
            All
          </button>
          <button
            className={`btn ${filter === 'Books' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('Books')}
          >
            Books
          </button>
          <button
            className={`btn ${filter === 'Songs' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('Songs')}
          >
            Songs
          </button>
          <button
            className={`btn ${filter === 'Movies' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('Movies')}
          >
            Movies
          </button>
          <button
            className={`btn ${filter === 'Games' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter('Games')}
          >
            Games
          </button>

        </div>

        {/* View toggle + Add New */}
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setView('grid')}
          >
            Grid
          </button>
          <button
            className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setView('list')}
          >
            List
          </button>

          <Link href="/create" className="btn btn-primary">+ Add New</Link>
        </div>
      </section>

      {/* Media grid or list */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MediaCard
              key={item.id}
              title={item.title}
              type={item.type}
              image={item.url}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}