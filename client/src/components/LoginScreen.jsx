// src/components/LoginScreen.jsx
import { useMemo } from "react";

const LOGIN_BACKGROUNDS = [
  "/login-bg-1.jpg",
  "/login-bg-2.jpg",
  "/login-bg-3.jpg",
  "/login-bg-4.jpg",
  "/login-bg-5.jpg",
];

export default function LoginScreen({ onSelectMode, onAuth }) {
  const backgroundUrl = useMemo(() => {
    const idx = Math.floor(Math.random() * LOGIN_BACKGROUNDS.length);
    return LOGIN_BACKGROUNDS[idx];
  }, []);

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    >
      <div className="login-overlay">
        <div className="login-screen">
          <div className="login-card">
            <div className="login-logo-wrap">
              <div className="login-logo-orb" />
              <div>
                <h1 className="login-title">AniPulse</h1>
                <p className="login-tagline">anime that adapts to your vibe</p>
              </div>
            </div>

            <p className="login-caption">
              Step into a neon-soaked anime city. Track your favorites, share
              fan art, join discussions, and find out which character you’re
              most like.
            </p>

            {/* 👉 Now just chooses a mode */}
            <div className="login-options">
              <button onClick={() => onSelectMode("viewer")}>
                Continue as viewer
              </button>
              <button onClick={() => onSelectMode("admin")}>
                Continue as admin
              </button>
              <button onClick={() => onSelectMode("signup")}>
                Create account
              </button>
              <button
                onClick={() =>
                  onAuth({
                    user: { name: "Guest", role: "guest" },
                    token: null,
                  })
                }
              >
                Continue as guest
              </button>
            </div>

            <p className="login-hint">
              Background rotates between different anime city & character shots
              each time you visit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
