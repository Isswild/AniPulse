// AddAnime.jsx
import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function AddAnime({ token, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    cover_image_url: "",
    year: "",
    season: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    // Build multipart form data
    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("year", form.year);
    fd.append("season", form.season.trim());

    if (file) {
      // user picked a file
      fd.append("image", file);
    } else if (form.cover_image_url.trim()) {
      // fallback to URL if no file
      fd.append("cover_image_url", form.cover_image_url.trim());
    }

    try {
      const res = await fetch(`${API_BASE}/api/anime`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // don't set Content-Type here, browser will set multipart boundary
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add anime");

      setMessage("✅ Anime added successfully!");
      setForm({ title: "", cover_image_url: "", year: "", season: "" });
      setFile(null);
      if (onAdded) onAdded(data);
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  }

  return (
    <div className="add-anime-card">
      <h2>Add New Anime</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        

        {/* THIS is the file selector you weren't seeing */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0] || null)}
        />

        <input
          name="year"
          type="number"
          value={form.year}
          onChange={handleChange}
          placeholder="Year"
        />
        <input
          name="season"
          value={form.season}
          onChange={handleChange}
          placeholder="Season (Spring, Fall, etc.)"
        />

        <button type="submit">Create Anime</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
