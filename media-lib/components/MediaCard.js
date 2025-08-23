import Link from 'next/link'

export default function MediaCard({ mediaId, title, image, type, onDelete, showDelete = false }) {
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition">
      <figure>
        <img src={image} alt={title} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {type && <span className="badge badge-secondary">{type}</span>}
        <div className="card-actions justify-end">
        {showDelete && (
            <button 
              className="btn btn-sm border-base-300"
              aria-label={`Remove ${title}`}
              onClick={() => onDelete(mediaId, title)}
            >
              Remove
            </button>
          )}
          <Link href={`/library}`} className="btn btn-sm btn-outline">View</Link>
            </div>
      </div>
    </div>
  )
}