/* AniPulse Navbar - James Wilds III */
function Navbar({ onNav, activePage }) {
  return (
    <header className="navbar">
      <div className="brand">
        <span className="logo">AniPulse</span>
        <span className="byline">by James Wilds III</span>
      </div>

      <nav className="nav-links">
        <button
          className={activePage === "home" ? "active" : ""}
          onClick={() => onNav("home")}
        >
          Home
        </button>

        <button
          className={activePage === "anime" ? "active" : ""}
          onClick={() => onNav("anime")}
        >
          Anime DB
        </button>

        <button
          className={activePage === "threads" ? "active" : ""}
          onClick={() => onNav("threads")}
        >
          Discussion
        </button>

        <button
          className={activePage === "quiz" ? "active" : ""}
          onClick={() => onNav("quiz")}
        >
          Quiz
        </button>
        <button
          className={activePage === "favorites" ? "active" : ""}
          onClick={() => onNav("favorites")}
        >
          ❤️ Favorites
        </button>

        {/* ⭐ NEW FAN ART TAB */}
        <button
          className={activePage === "fanart" ? "active" : ""}
          onClick={() => onNav("fanart")}
        >
          🎨 Fan Art
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
