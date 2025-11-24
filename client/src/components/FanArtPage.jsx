import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function FanArtPage({ token, user }) {
  const [tab, setTab] = useState("mine"); // "mine" | "community"
  const [myArt, setMyArt] = useState([]);
  const [communityArt, setCommunityArt] = useState([]);
  const [animeOptions, setAnimeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [animeId, setAnimeId] = useState(""); // string so it works nicely with <select>
  const [file, setFile] = useState(null);

  // load my art, community art, and anime list
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      try {
        // my art
        const myRes = await fetch(`${API_BASE}/api/fanart/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!myRes.ok) throw new Error("Failed to load your fan art");
        const myData = await myRes.json();
        setMyArt(myData);

        // community art
        const allRes = await fetch(`${API_BASE}/api/fanart`);
        if (!allRes.ok) throw new Error("Failed to load gallery");
        const allData = await allRes.json();
        setCommunityArt(allData);

        // anime list for dropdown
        const animeRes = await fetch(`${API_BASE}/api/anime`);
        if (!animeRes.ok) throw new Error("Failed to load anime list");
        const animeData = await animeRes.json();
        setAnimeOptions(animeData);
      } catch (err) {
        console.error(err);
        setError("Could not load fan art.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token]);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      alert("Please choose an image.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("image", file);
      if (title) formData.append("title", title);
      if (description) formData.append("description", description);
      if (animeId) formData.append("anime_id", animeId);

      const res = await fetch(`${API_BASE}/api/fanart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not upload fan art");
        setUploading(false);
        return;
      }

      const created = await res.json();

      // find anime title from options
      const animeTitle =
        animeOptions.find((a) => a.id === created.anime_id)?.title || null;

      // update lists
      const withMeta = { ...created, anime_title: animeTitle };
      setMyArt((prev) => [withMeta, ...prev]);
      setCommunityArt((prev) => [
        { ...withMeta, username: user.username },
        ...prev,
      ]);

      // reset form
      setTitle("");
      setDescription("");
      setAnimeId("");
      setFile(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong uploading your art.");
    } finally {
      setUploading(false);
    }
  }

  // 🔥 new: delete fan art (only yours)
  async function handleDelete(artId) {
    const ok = confirm("Delete this fan art?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/fanart/${artId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not delete fan art");
        return;
      }

      // Remove from both lists
      setMyArt((prev) => prev.filter((a) => a.id !== artId));
      setCommunityArt((prev) => prev.filter((a) => a.id !== artId));
    } catch (err) {
      console.error(err);
      alert("Something went wrong deleting your art.");
    }
  }

  const visibleArt = tab === "mine" ? myArt : communityArt;

  return (
    <section className="fanart-page">
      <header className="fanart-header">
        <h2>🎨 Fan Art Gallery</h2>
        <p className="muted">
          Upload your anime fan art and explore creations from the AniPulse
          community.
        </p>
      </header>

      {/* Upload form */}
      <form className="card fanart-upload" onSubmit={handleUpload}>
        <h3>Upload Fan Art</h3>

        <div className="fanart-form-row">
          <label>
            Title (optional)
            <input
              type="text"
              placeholder="My Tokyo Ghoul sketch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label>
            Linked Anime (optional)
            <select
              value={animeId}
              onChange={(e) => setAnimeId(e.target.value)}
            >
              <option value="">-- Select anime --</option>
              {animeOptions.map((anime) => (
                <option key={anime.id} value={anime.id}>
                  {anime.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="fanart-field-full">
          Description (optional)
          <textarea
            placeholder="Short description of your art..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="fanart-form-row">
          <label className="fanart-file-field">
            Image file
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
          </label>

          <div className="fanart-submit-wrap">
            <button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Post Fan Art"}
            </button>
          </div>
        </div>
      </form>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={tab === "mine" ? "tab-active" : ""}
          onClick={() => setTab("mine")}
        >
          My Fan Art
        </button>
        <button
          className={tab === "community" ? "tab-active" : ""}
          onClick={() => setTab("community")}
        >
          Community Gallery
        </button>
      </div>

      {loading && <p>Loading fan art…</p>}
      {error && <p>{error}</p>}

      {/* Gallery */}
      <div className="card-grid fanart-grid">
        {visibleArt.length === 0 && !loading && (
          <p>
            {tab === "mine"
              ? "You haven’t uploaded any fan art yet."
              : "No fan art yet — be the first to post!"}
          </p>
        )}

        {visibleArt.map((art) => {
          let imgSrc = art.image_url;
          if (imgSrc && imgSrc.startsWith("/uploads")) {
            imgSrc = `${API_BASE}${imgSrc}`;
          }

          return (
            <article key={art.id} className="card fanart-card">
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={art.title || "Fan art"}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/240x240?text=Fan+Art";
                  }}
                />
              )}

              <h4>{art.title || "Untitled fan art"}</h4>

              {art.anime_title && (
                <p className="muted">From: {art.anime_title}</p>
              )}

              {art.description && (
                <p className="fanart-description">{art.description}</p>
              )}

              {art.username && tab === "community" && (
                <p className="muted">by {art.username}</p>
              )}

              <p className="muted">
                {new Date(art.created_at).toLocaleDateString()}
              </p>

              {/* show delete only on "My Fan Art" */}
              {tab === "mine" && (
                <button
                  type="button"
                  className="fanart-delete-btn"
                  onClick={() => handleDelete(art.id)}
                >
                  Delete
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
