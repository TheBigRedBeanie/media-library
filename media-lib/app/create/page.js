export default function CreatePage() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">➕ Create New Media</h1>
        <form className="space-y-4 max-w-lg">
          <input type="text" placeholder="Title" className="input input-bordered w-full" />
          <textarea placeholder="Description" className="textarea textarea-bordered w-full" />
          <input type="text" placeholder="Media URL" className="input input-bordered w-full" />
          <button type="submit" className="btn btn-primary w-full">Save</button>
        </form>
      </div>
    )
  }