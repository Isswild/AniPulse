// src/components/CredentialLoginForm.jsx
import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function CredentialLoginForm({ mode, onBack, onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = mode === "admin";

  const title = isAdmin ? "Admin login" : "Viewer login";
  const subtitle = isAdmin
    ? "Enter your admin credentials to manage AniPulse content."
    : "Enter your viewer credentials to continue where you left off.";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // backend sends { message: "..."} or { error: "..." }
        setError(data.message || data.error || "Login failed.");
        return;
      }

      // data should be { user, token }
      onAuth?.({
        user: {
          id: data.user.id,
          name: data.user.username,
          role: data.user.role,
          email: data.user.email,
        },
        token: data.token,
      });
    } catch (err) {
      console.error("Login error:", err);
      setError("Could not reach the server. Check if API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="login-screen">
          <div className="auth-card">
            <button
              type="button"
              className="auth-back-btn"
              onClick={onBack}
            >
              ← Back
            </button>

            <h1 className="auth-title">{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>

            <form onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  className="auth-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  className="auth-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.85rem",
                    color: "#fca5a5",
                  }}
                >
                  {error}
                </p>
              )}

              <button type="submit" className="auth-button" disabled={loading}>
                {loading
                  ? "Logging in..."
                  : isAdmin
                  ? "Log in as admin"
                  : "Log in as viewer"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
