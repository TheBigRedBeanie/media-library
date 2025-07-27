import MediaCard from '../components/MediaCard'
import Link from 'next/link'

export default function HomePage() {
  const recentMedia = [
    { id: 1, title: "Sample Movie",url: "https://placehold.co/300x200", type:"Movie" },
    { id: 2, title: "Sample Song", url: "https://placehold.co/300x200", type:"Song" },
    { id: 3, title: "Sample Video Game", url: "https://placehold.co/300x200", type:"Game"},
    { id: 4, title: "Sample Book", url: "https://placehold.co/300x200", type:"Book"},

  ]

  return (
    <div className="space-y-10">
      {/* Welcome message */}
      <section className="text-center mt-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to Media Library</h1>
        <p className="text-lg text-gray-600">
          Your place to organize, create, and explore your media collection.
        </p>
      </section>

    {/*recenlty Added Section */}
    <section>
      <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold"> Recently Added</h2> 
      <Link href="/create" className="btn btn-primary"> +Add New</Link>
    </div>

    {/*Media Cards grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recentMedia.map((m) => (
        <MediaCard key={m.id} title={m.title} image={m.url} type={m.type} />
      ))}
    </div>
    </section>
    </div>
  )
}