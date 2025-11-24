import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import AnimeList from "./components/AnimeList.jsx";
import ThreadList from "./components/ThreadList.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import AddAnime from "./components/AddAnime.jsx";
import AnimeDetail from "./components/AnimeDetail.jsx";
import FavoriteList from "./components/FavoriteList.jsx";
import FanArtPage from "./components/FanArtPage.jsx";
import AnimeQuizPage from "./components/AnimeQuizPage.jsx";
import CredentialLoginForm from "./components/CredentialLoginForm.jsx";
import SignupForm from "./components/SignupForm.jsx";

const PAGES = {
  HOME: "home",
  ANIME: "anime",
  THREADS: "threads",
  FAVORITES: "favorites",
  FANART: "fanart",
  QUIZ: "quiz",
};

function App() {
  const [page, setPage] = useState(PAGES.HOME);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [auth, setAuth] = useState(null); // { user, token } or null
  const [authMode, setAuthMode] = useState(null); // "viewer" | "admin" | "signup" | null

  const handleLogout = () => {
    setAuth(null);
    setAuthMode(null);
    setPage(PAGES.HOME);
    setSelectedAnime(null);
  };

  // 1) No user & no mode picked yet → show role picker
  if (!auth && !authMode) {
    return (
      <LoginScreen
        onSelectMode={setAuthMode}
        onAuth={setAuth} // used only for "guest" button
      />
    );
  }

  // 2) Viewer / admin → show username/password login form
  if (!auth && (authMode === "viewer" || authMode === "admin")) {
    return (
      <CredentialLoginForm
        mode={authMode}
        onAuth={setAuth}
        onBack={() => setAuthMode(null)}
      />
    );
  }

  // 3) Signup flow
  if (!auth && authMode === "signup") {
    return (
      <SignupForm
        onAuth={setAuth}
        onBack={() => setAuthMode(null)}
      />
    );
  }

  // 4) Logged in → normal app
  if (!auth) {
    // fallback (shouldn’t really hit)
    return null;
  }

  const user = auth.user;
  const isAdmin = user && user.role === "admin";

  return (
    <div className="app-shell">
      <Navbar
        activePage={page}
        user={user}
        onNav={(p) => {
          setPage(p);
          setSelectedAnime(null);
        }}
      />

      <main className="content">
        {page === PAGES.HOME && (
          <Home
            onLogout={handleLogout}
            user={auth.user}
            onNav={(p) => {
              setPage(p);
              setSelectedAnime(null);
            }}
          />
        )}

        {page === PAGES.ANIME && (
          <>
            {selectedAnime ? (
              <AnimeDetail
                anime={selectedAnime}
                user={user}
                token={auth.token}
                onBack={() => setSelectedAnime(null)}
                onDeleted={() => setSelectedAnime(null)}
              />
            ) : (
              <>
                {isAdmin && <AddAnime token={auth.token} />}
                <AnimeList onSelect={setSelectedAnime} />
              </>
            )}
          </>
        )}

        {page === PAGES.THREADS && <ThreadList />}

        {page === PAGES.FAVORITES && (
          <FavoriteList user={user} token={auth.token} />
        )}

        {page === PAGES.FANART && (
          <FanArtPage token={auth.token} user={user} />
        )}

        {page === PAGES.QUIZ && <AnimeQuizPage />}
      </main>
    </div>
  );
}

export default App;
