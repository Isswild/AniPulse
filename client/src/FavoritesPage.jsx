// src/pages/FavoritesPage.jsx
import { useFavorites } from "../FavoritesContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  if (!favorites || favorites.length === 0) {
    return (
      <section>
        <h2>Your Favorites</h2>
        <p>You haven’t favorited any anime yet. Go tap ⭐ on an anime first.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Your Favorites ({favorites.length})</h2>
      <div className="card-grid">
        {favorites.map((item) => {
          let imgSrc = item.cover_image_url;
          if (imgSrc && imgSrc.startsWith("/uploads")) {
            imgSrc = `${API_BASE}${imgSrc}`;
          }

          return (
            <article key={item.id} className="card anime-card">
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

              <button
                onClick={() => removeFavorite(item.id)}
                className="danger"
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
