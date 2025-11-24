// src/components/SignupForm.jsx
import { useState } from "react";

// Use Vite env if set: VITE_API_BASE_URL=http://localhost:8080
const API_BASE = import.meta.env?.VITE_API_BASE_URL || "http://localhost:8080";

export default function SignupForm({ onAuth, onBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // backend expects: { username, email, password, role? }
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // server sends { error: "..." }
        setError(data.error || "Could not create account");
        return;
      }

      // data = { token, user: { id, username, email, role } }
      onAuth(data);
    } catch (err) {
      console.error("AniPulse: signup error:", err);
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

            <h2 className="login-title">Create your AniPulse account</h2>

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
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
