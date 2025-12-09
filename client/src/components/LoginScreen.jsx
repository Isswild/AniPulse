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
            {/* Logo + text */}
            <div className="login-logo-wrap">
              <div className="login-logo-orb" />
              <div>
                <h1 className="login-title">AniPulse</h1>
                <p className="login-tagline">anime that adapts to your vibe</p>
              </div>
            </div>

            <p className="login-caption">
              Step into a immersive anime city. Track your favorites, share fan
              art, join discussions, and find out which character you&apos;re
              most like.
            </p>

            {/* Big white option cards */}
            <div className="login-actions">
              <button
                type="button"
                className="login-option-btn"
                onClick={() => onSelectMode("viewer")}
              >
                <span className="login-option-main">Sign In</span>
                <span className="login-option-sub">
                  Log in with your account and pick up where you left off.
                </span>
              </button>

              <button
                type="button"
                className="login-option-btn"
                onClick={() => onSelectMode("admin")}
              >
                <span className="login-option-main">Admin Sign In</span>
                <span className="login-option-sub">
                  Manage the anime database, reviews, and site content.
                </span>
              </button>

              <button
                type="button"
                className="login-option-btn"
                onClick={() => onSelectMode("signup")}
              >
                <span className="login-option-main">Register</span>
                <span className="login-option-sub">
                  Make a free AniPulse account to save favorites and quiz results.
                </span>
              </button>

              <button
                type="button"
                className="login-option-btn"
                onClick={() =>
                  onAuth?.({
                    user: { name: "Guest", role: "guest" },
                    token: "guest-mode",
                  })
                }
              >
                <span className="login-option-main">Continue as guest</span>
                <span className="login-option-sub">
                  Explore AniPulse without saving anything.
                  demos.
                </span>
              </button>
            </div>

            <p className="login-footnote">
              AniPulse Created by James Wilds III
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
