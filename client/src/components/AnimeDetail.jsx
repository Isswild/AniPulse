// client/src/components/AnimeDetail.jsx
import { useState } from "react";
import { useFavorites } from "../FavoritesContext"; // adjust path if needed

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function AnimeDetail({ anime, user, token, onBack, onDeleted }) {
  if (!anime) return null;

  const isAdmin = user?.role === "admin";
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const alreadyFavorite = isFavorite(anime.id);

  let imgSrc = anime.cover_image_url;
  if (imgSrc && imgSrc.startsWith("/uploads")) {
    imgSrc = `${API_BASE}${imgSrc}`;
  }

  // ==== ADMIN EDIT STATE ====
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editFields, setEditFields] = useState({
    streaming_url: anime.streaming_url || "",
    drop_date: anime.drop_date || "", // YYYY-MM-DD
    extra_notes: anime.extra_notes || "",
  });

  function handleFieldChange(e) {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSaveExtra() {
    if (!token) {
      alert("You must be logged in as admin.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/anime/${anime.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFields),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not update anime info");
        setSaving(false);
        return;
      }

      const updated = await res.json();

      // update local anime object so UI reflects changes
      anime.streaming_url = updated.streaming_url;
      anime.drop_date = updated.drop_date;
      anime.extra_notes = updated.extra_notes;

      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving extra info.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!token) return;
    const ok = confirm(`Delete ${anime.title}?`);
    if (!ok) return;

    const res = await fetch(`${API_BASE}/api/anime/${anime.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      onDeleted && onDeleted(anime.id);
      onBack();
    } else {
      alert("Could not delete.");
    }
  }

  async function handleFavorite() {
    if (!token) {
      alert("Login to favorite.");
      return;
    }

    try {
      if (!alreadyFavorite) {
        const res = await fetch(`${API_BASE}/api/anime/${anime.id}/favorite`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.error || "Could not favorite");
          return;
        }

        addFavorite(anime);
        alert("Added to favorites!");
      } else {
        const res = await fetch(`${API_BASE}/api/anime/${anime.id}/favorite`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.error || "Could not remove favorite");
          return;
        }

        removeFavorite(anime.id);
        alert("Removed from favorites!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="anime-detail">
      <button className="logout-btn" onClick={onBack}>
        ← Back to list
      </button>

      <div className="anime-detail-body">
        {imgSrc && <img src={imgSrc} alt={anime.title} className="detail-img" />}
        <div>
          <h2>{anime.title}</h2>
          <p>
            {anime.season
              ? `${anime.season} ${anime.year || ""}`
              : anime.year || ""}
          </p>

          {/* ==== EXTRA INFO DISPLAY (everyone sees this) ==== */}
          {anime.streaming_url && (
            <p>
              Watch here:{" "}
              <a href={anime.streaming_url} target="_blank" rel="noreferrer">
                {anime.streaming_url}
              </a>
            </p>
          )}
          {anime.drop_date && (
            <p>
              <strong>Upcoming / Latest Drop Date:</strong>{" "}
              {new Date(anime.drop_date).toLocaleDateString()}
            </p>
          )}

          {anime.extra_notes && (
            <p className="muted">Notes: {anime.extra_notes}</p>
          )}
          {!anime.streaming_url && !anime.drop_date && !anime.extra_notes && (
            <p className="muted">More info coming soon…</p>
          )}

          {/* ==== ACTIONS ==== */}
          {isAdmin ? (
            <div className="detail-actions">
              <button className="danger" onClick={handleDelete}>
                Delete Anime
              </button>

              {!isEditing && (
                <button onClick={() => setIsEditing(true)}>
                  Edit extra info
                </button>
              )}
            </div>
          ) : (
            <button onClick={handleFavorite}>
              {alreadyFavorite ? "★ Remove from Favorites" : "⭐ Add to Favorites"}
            </button>
          )}

          {/* ==== ADMIN EDIT FORM ==== */}
          {isAdmin && isEditing && (
            <div className="edit-panel">
              <h3>Edit extra info</h3>

              <label>
                Streaming link
                <input
                  type="url"
                  name="streaming_url"
                  value={editFields.streaming_url}
                  onChange={handleFieldChange}
                  placeholder="https://crunchyroll.com/..."
                />
              </label>

              <label>
                Upcoming / Latest Drop Date
                <input
                  type="date"
                  name="drop_date"
                  value={editFields.drop_date ? editFields.drop_date.substring(0, 10) : ""}
                  onChange={handleFieldChange}
                />
              </label>


              <label>
                Extra notes
                <textarea
                  name="extra_notes"
                  value={editFields.extra_notes}
                  onChange={handleFieldChange}
                  rows={3}
                  placeholder="Season 2 drops Fall 2025, dubbed on Hulu..."
                />
              </label>

              <div className="edit-actions">
                <button onClick={() => setIsEditing(false)} disabled={saving}>
                  Cancel
                </button>
                <button onClick={handleSaveExtra} disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
