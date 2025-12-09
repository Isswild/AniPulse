// src/components/SignupForm.jsx
import { useState } from "react";

export default function SignupForm({ onAuth, onBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now just fake auth like before
    onAuth({
      user: { name: username || "New AniPulse member", role: "viewer" },
      token: "signup-demo-token",
    });
  };

  return (
    <div className="login-screen">
      <div className="auth-card">
        <button type="button" className="auth-back-btn" onClick={onBack}>
          ← Back
        </button>

        <h1 className="auth-title">Create your AniPulse account</h1>
        <p className="auth-subtitle">
          Save your favorites, fan art, and quiz results across sessions.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label
              htmlFor="signup-username"
              className="auth-input-label"
            >
              Username
            </label>
            <input
              id="signup-username"
              className="auth-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="signup-email" className="auth-input-label">
              Email (optional)
            </label>
            <input
              id="signup-email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-input-group">
            <label
              htmlFor="signup-password"
              className="auth-input-label"
            >
              Password
            </label>
            <input
              id="signup-password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
