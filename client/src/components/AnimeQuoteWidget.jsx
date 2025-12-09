// src/components/AnimeQuoteWidget.jsx
import { useEffect, useState } from "react";

export default function AnimeQuoteWidget() {
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchQuote() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("https://animechan.xyz/api/random");
      if (!res.ok) {
        throw new Error("Failed to fetch quote");
      }
      const data = await res.json();
      setQuoteData(data);
    } catch (err) {
      setError("Could not load quote. Try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="anime-quote-card">
      <h3 className="anime-quote-title">Daily Anime Quote</h3>

      {loading && <p>Loading...</p>}

      {error && <p className="anime-quote-error">{error}</p>}

      {quoteData && !loading && !error && (
        <>
          <p className="anime-quote-text">“{quoteData.quote}”</p>
          <p className="anime-quote-meta">
            — {quoteData.character} ({quoteData.anime})
          </p>
        </>
      )}

      <button className="anime-quote-btn" onClick={fetchQuote} disabled={loading}>
        {loading ? "Getting..." : "New quote"}
      </button>
    </div>
  );
}
