import Link from 'next/link'

export default function Sidebar() {
  return (
    <div className="w-64 bg-base-300 p-4">
      <h1 className="text-xl font-bold mb-6">📚 Media Library</h1>
      <ul className="menu">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/library">My Library</Link></li>
        <li><Link href="/create">Create New</Link></li>
        
      </ul>
    </div>
  )
}
