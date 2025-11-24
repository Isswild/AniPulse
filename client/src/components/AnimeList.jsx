// AnimeList.jsx
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function AnimeList({ onSelect }) {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnime() {
      try {
        const res = await fetch(`${API_BASE}/api/anime`);
        if (!res.ok) throw new Error("Failed to fetch anime");
        const data = await res.json();
        setAnime(data);
      } catch (err) {
        console.error(err);
        setError("Could not load anime list.");
      } finally {
        setLoading(false);
      }
    }
    fetchAnime();
  }, []);

  if (loading) return <p>Loading anime...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h2>Anime Database</h2>
      {anime.length === 0 && <p>No anime found yet.</p>}
      <div className="card-grid">
        {anime.map((item) => {
          let imgSrc = item.cover_image_url;
          if (imgSrc && imgSrc.startsWith("/uploads")) {
            imgSrc = `${API_BASE}${imgSrc}`;
          }

          return (
            <article
              key={item.id}
              className="card anime-card"
              onClick={() => onSelect && onSelect(item)}
            >
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={item.title}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/240x240?text=Anime";
                  }}
                />
              )}
              <h3>{item.title}</h3>
              <p className="anime-meta">
                {item.season
                  ? `${item.season} ${item.year || ""}`
                  : item.year || ""}
              </p>
              <p className="anime-hint">Click to view details →</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
