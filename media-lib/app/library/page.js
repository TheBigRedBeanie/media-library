export default function HomePage() {
    return (
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to Media Library</h1>
        <p className="text-lg">Organize, create, and explore your media with ease.</p>
        <div className="mt-6">
          <a href="/library" className="btn btn-primary">📂 Go to My Library</a>
        </div>
      </div>
    )
  }