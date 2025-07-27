export default function Navbar() {
    return (
      <div className="navbar bg-base-100 shadow-md px-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search media..."
            className="input input-bordered w-full max-w-md"
          />
        </div>
        <div className="flex-none gap-2">
          <button className="btn btn-primary">+ Add Media</button>
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src="/default-avatar.png" alt="User avatar" />
            </div>
          </div>
        </div>
      </div>
    )
  }