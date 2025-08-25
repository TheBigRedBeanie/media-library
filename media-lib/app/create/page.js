"use client";

import { useState,useEffect } from 'react'
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/context/AuthContext"; 


export default function CreatePage() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session === null) {
      // not logged in → send to /
      router.replace("/");
    }
  }, [session, router]);

  // form state
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [mediaType, setMediaType] = useState("Book"); // Book | Movie | Song | Game | Series
  const [releaseDate, setReleaseDate] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Optional: redirect to home if not logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/");
    });
  }, [router]);

  const handleSubmit = async () => {
    
    setSubmitting(true);
    setErrorMessage("");

    // 1) who is the user?
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      setSubmitting(false);
      setErrorMessage("Please log in first.");
      return;
    }

 // 2) insert into media
 const { data: mediaRow, error: mediaErr } = await supabase
 .from("media")
 .insert([{
   title: title.trim(),
   creator: creator.trim(),
   media_type: mediaType,              // match your enum/values
   release_date: releaseDate || null,  // YYYY-MM-DD or null
   description: description || null,          // you said column is 'desc' we use description
   format: format.trim() || null
 }])
 .select("media_id")
 .single();

if (mediaErr) {
 setSubmitting(false);
 setErrorMessage(mediaErr.message);
 return;
}

// 3) link it to user in library
const { error: libErr } = await supabase
 .from("library")
 .insert([{
   library_id: user.id,                   // FK to auth.users.id
   media_id: mediaRow.media_id,           // FK to media.media_id
   media_type: mediaType,                 // you have this column on library too
   date_added: new Date().toISOString()
 }]);

if (libErr) {
 setSubmitting(false);
 setErrorMessage(libErr.message);
 return;
}

setSubmitting(false);
router.replace("/library");
};

return (
    <div className="max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">Create New</h1>

    {errorMessage && (
      <div className="alert alert-error mb-4"><span>{errorMessage}</span></div>
    )}

    
      <input
        className="input input-bordered w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        className="input input-bordered w-full"
        placeholder="Creator (Author/Director/Artist)"
        value={creator}
        onChange={(e) => setCreator(e.target.value)}
        required
      />

      <div className="flex gap-3">
        <select
          className="select select-bordered"
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
        >
          <option>Book</option>
          <option>Movie</option>
          <option>Song</option>
          <option>Game</option>
          <option>Series</option>
        </select>

        <input
          type="date"
          className="input input-bordered"
          value={releaseDate}
          onChange={(e) => setReleaseDate(e.target.value)}
        />
      </div>

      <input
        className="input input-bordered w-full"
        placeholder="Format (e.g., Hardcover, BluRay, MP3)"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
      />

      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      <button onClick={handleSubmit} className={`btn btn-primary ${submitting ? "btn-disabled" : ""}`} disabled={submitting}>
        {submitting ? "Saving..." : "Save"}
      </button>
  
    </div>
    );
}
        
  