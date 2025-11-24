// src/components/Home.jsx
export default function Home({ user, onLogout, onNav }) {
  const displayName =
    user?.name || user?.username || user?.email || "AniPulse member";

  return (
    <div className="home-page">
      {/* Top hero */}
      <section className="home-hero">
        <div className="home-hero-main">
          <p className="home-greeting">Welcome back, {displayName} 👋</p>
          <h1 className="home-title">
            Your anime world,
            <span className="home-title-accent"> tuned to your vibe.</span>
          </h1>
          <p className="home-subtitle">
            Track what you love, share your art, join discussions, and take
            quizzes that figure out which character you&apos;re most like.
          </p>

          <div className="home-chip-row">
            <span className="home-chip">✨ New: Quiz Hub</span>
            <span className="home-chip">🎨 Fan Art Gallery</span>
            <span className="home-chip">⭐ Favorites list</span>
          </div>

          {/* Optional: main CTA button to jump to quiz */}
          <div style={{ marginTop: "1rem" }}>
            <button
              className="quiz-primary-btn"
              onClick={() => onNav && onNav("quiz")}
            >
              Jump into a quiz 🎯
            </button>
          </div>
        </div>

        <div className="home-hero-side">
          <div className="home-stat-card">
            <p className="home-stat-label">Current mood</p>
            <p className="home-stat-value">Shonen energy 💥</p>
            <p className="home-stat-caption">
              Hit the Quiz tab to see which character you match or explore new
              anime.
            </p>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="home-section">
        <h2 className="home-section-title">Jump back in</h2>
        <p className="home-section-subtitle">
          Use the cards below to hop straight into different parts of AniPulse.
        </p>

        <div className="home-actions-grid">
          {/* Browse Anime */}
          <button
            type="button"
            className="home-card"
            onClick={() => onNav && onNav("anime")}
          >
            <div className="home-card-icon">📺</div>
            <h3>Browse Anime</h3>
            <p>
              Explore your anime collection, see details, and manage titles as
              admin.
            </p>
            <span className="home-pill">Go to Anime</span>
          </button>

          {/* Favorites */}
          <button
            type="button"
            className="home-card"
            onClick={() => onNav && onNav("favorites")}
          >
            <div className="home-card-icon">⭐</div>
            <h3>Your Favorites</h3>
            <p>
              Revisit shows you&apos;ve marked as favorites and keep your
              personal watchlist close.
            </p>
            <span className="home-pill">View Favorites</span>
          </button>

          {/* Fan Art */}
          <button
            type="button"
            className="home-card"
            onClick={() => onNav && onNav("fanart")}
          >
            <div className="home-card-icon">🎨</div>
            <h3>Fan Art Gallery</h3>
            <p>
              Upload your own fan art or browse community pieces in a curated
              gallery layout.
            </p>
            <span className="home-pill">Open Fan Art</span>
          </button>

          {/* Quiz */}
          <button
            type="button"
            className="home-card"
            onClick={() => onNav && onNav("quiz")}
          >
            <div className="home-card-icon">🎯</div>
            <h3>Anime Quiz Hub</h3>
            <p>
              Test your anime knowledge with trivia or find out which character
              you&apos;re most like.
            </p>
            <span className="home-pill">Start a quiz</span>
          </button>
        </div>
      </section>
    </div>
  );
}
