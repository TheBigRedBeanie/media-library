import MediaCard from '../components/MediaCard'

export default function HomePage() {
  const media = [
    { id: 1, title: "Sample Movie",url: "https://placehold.co/300x200" },
    { id: 2, title: "Sample Song", url: "https://placehold.co/300x200" },
    { id: 3, title: "Sample Video Game", url: "https://placehold.co/300x200"},
    { id: 4, title: "Sample Book", url: "https://placehold.co/300x200"},

  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {media.map((m) => (
        <MediaCard key={m.id} title={m.title} image={m.url} />
      ))}
    </div>
  )
}