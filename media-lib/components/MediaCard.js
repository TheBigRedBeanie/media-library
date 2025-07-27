import Link from 'next/link'

export default function MediaCard({ title, image }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <figure><img src={image} alt={title} /></figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>Description...</p>
        <div className="card-actions justify-end">
          <Link href={`/media/${title}`} className="btn btn-sm btn-secondary">View</Link>
        </div>
      </div>
    </div>
  )
}