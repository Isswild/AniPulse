import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function FavoriteList({ token, onSelect }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFavorites() {
      try {
        const res = await fetch(`${API_BASE}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch favorites");
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error(err);
        setError("Could not load favorites.");
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [token]);

  async function handleUnfavorite(id, e) {
    // so clicking the button doesn't also trigger onSelect(card)
    e.stopPropagation();

    try {
      const res = await fetch(`${API_BASE}/api/anime/${id}/favorite`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not remove favorite");
        return;
      }

      // update UI: remove from local state
      setFavorites((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Something went wrong removing favorite.");
    }
  }

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h2>❤️ My Favorite Anime</h2>
      {favorites.length === 0 && <p>You haven’t favorited any anime yet.</p>}
      <div className="card-grid">
        {favorites.map((item) => {
          let imgSrc = item.cover_image_url;
          if (imgSrc && imgSrc.startsWith("/uploads")) {
            imgSrc = `${API_BASE}${imgSrc}`;
          }

          return (
            <article
              key={item.id}
              className="card"
              onClick={() => onSelect && onSelect(item)}
            >
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={item.title}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/240x240?text=Anime")
                  }
                />
              )}
              <h3>{item.title}</h3>
              <p className="anime-meta">
                {item.season
                  ? `${item.season} ${item.year || ""}`
                  : item.year || ""}
              </p>

              {/* 🔻 new unfavorite button */}
              <button
                className="danger"
                onClick={(e) => handleUnfavorite(item.id, e)}
              >
                Remove from favorites
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
