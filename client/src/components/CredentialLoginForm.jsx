// src/components/CredentialLoginForm.jsx
import { useState } from "react";

// You can set this in your Vite env: VITE_API_BASE_URL=http://localhost:8080
const API_BASE = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8080";

export default function CredentialLoginForm({ mode, onAuth, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const roleLabel = mode === "admin" ? "Admin" : "Viewer";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // backend supports username OR email — we're using username here
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // data = { token, user: { id, username, email, role } }

      // if they clicked "Admin" but this user isn't admin
      if (mode === "admin" && data.user.role !== "admin") {
        setError("This account is not an admin account.");
        return;
      }

      // ✅ hand off to App.jsx (it expects { user, token })
      onAuth(data);
    } catch (err) {
      console.error("AniPulse: login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="login-screen">
          <div className="login-card">
            <button className="back-btn" onClick={onBack}>
              ← Back
            </button>

            <h2 className="login-title">{roleLabel} login</h2>
            <p className="login-caption">
              Enter your username and password to continue.
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label>
                Username
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              {error && <p className="error-text">{error}</p>}

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading
                  ? "Logging in..."
                  : `Log in as ${roleLabel.toLowerCase()}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

