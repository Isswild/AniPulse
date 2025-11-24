import { useEffect, useState } from "react";

const CATEGORY_OPTIONS = ["General", "Recommendations", "Spoilers", "Off-topic"];
const STORAGE_KEY = "anipulse_threads_v1";

function loadThreads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // some starter threads
      return [
        {
          id: 1,
          title: "Best starter anime for a friend?",
          category: "Recommendations",
          content: "Trying to put my friend on anime. They like mystery shows—any recs?",
          author: "You",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          replies: [
            {
              id: 1,
              author: "You",
              text: "I’m thinking starting them with Death Note or Spy x Family.",
              createdAt: new Date().toISOString(),
            },
          ],
        },
        {
          id: 2,
          title: "Underrated shows you love",
          category: "General",
          content: "Drop some anime you think deserve more hype 👀",
          author: "You",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          replies: [],
        },
      ];
    }
    return JSON.parse(raw);
  } catch (_e) {
    return [];
  }
}

function saveThreads(threads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch (_e) {
    // ignore
  }
}

export default function ThreadList() {
  const [threads, setThreads] = useState(loadThreads);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [newThread, setNewThread] = useState({
    title: "",
    category: "General",
    content: "",
  });

  useEffect(() => {
    saveThreads(threads);
  }, [threads]);

  const filteredThreads =
    categoryFilter === "all"
      ? threads
      : threads.filter((t) => t.category === categoryFilter);

  const activeThread = threads.find((t) => t.id === activeThreadId) || null;

  const handleChangeNewThread = (field, value) => {
    setNewThread((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateThread = (e) => {
    e.preventDefault();
    const title = newThread.title.trim();
    const content = newThread.content.trim();
    if (!title || !content) return;

    const now = new Date().toISOString();
    const nextId = threads.length ? Math.max(...threads.map((t) => t.id)) + 1 : 1;

    const thread = {
      id: nextId,
      title,
      category: newThread.category,
      content,
      author: "You",
      createdAt: now,
      updatedAt: now,
      replies: [],
    };

    setThreads((prev) => [thread, ...prev]);
    setNewThread({ title: "", category: "General", content: "" });
    setActiveThreadId(thread.id);
  };

  const handleAddReply = (threadId, text) => {
    const body = text.trim();
    if (!body) return;

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        const now = new Date().toISOString();
        const nextReplyId = t.replies.length
          ? Math.max(...t.replies.map((r) => r.id)) + 1
          : 1;
        return {
          ...t,
          updatedAt: now,
          replies: [
            ...t.replies,
            {
              id: nextReplyId,
              author: "You",
              text: body,
              createdAt: now,
            },
          ],
        };
      })
    );
  };

  return (
    <div className="thread-page">
      <header className="thread-header">
        <div>
          <h1>Anime Discussions</h1>
          <p className="thread-subtitle">
            Start a conversation, ask for recommendations, or rant about your latest binge.
          </p>
        </div>
      </header>

      {/* New thread composer */}
      <section className="thread-composer">
        <h2>Start a new thread</h2>
        <form onSubmit={handleCreateThread} className="thread-form">
          <div className="thread-form-row">
            <div className="thread-form-field">
              <label htmlFor="thread-title">Title</label>
              <input
                id="thread-title"
                type="text"
                placeholder="e.g. 'Is Blue Lock worth watching?'"
                value={newThread.title}
                onChange={(e) => handleChangeNewThread("title", e.target.value)}
              />
            </div>
            <div className="thread-form-field">
              <label htmlFor="thread-category">Category</label>
              <select
                id="thread-category"
                value={newThread.category}
                onChange={(e) =>
                  handleChangeNewThread("category", e.target.value)
                }
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="thread-form-field">
            <label htmlFor="thread-content">What&apos;s on your mind?</label>
            <textarea
              id="thread-content"
              rows={3}
              placeholder="Share your thoughts, theories, or questions..."
              value={newThread.content}
              onChange={(e) => handleChangeNewThread("content", e.target.value)}
            />
          </div>

          <button type="submit" className="primary">
            Post thread
          </button>
        </form>
      </section>

      {/* Main layout: list + detail */}
      <section className="thread-main">
        <div className="thread-list-panel">
          <div className="thread-filters">
            <button
              className={`thread-filter-pill ${
                categoryFilter === "all" ? "active" : ""
              }`}
              type="button"
              onClick={() => setCategoryFilter("all")}
            >
              All
            </button>
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`thread-filter-pill ${
                  categoryFilter === cat ? "active" : ""
                }`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <ul className="thread-list">
            {filteredThreads.length === 0 && (
              <li className="thread-empty">No threads yet. Be the first!</li>
            )}

            {filteredThreads.map((thread) => (
              <li
                key={thread.id}
                className={`thread-item ${
                  activeThreadId === thread.id ? "thread-item-active" : ""
                }`}
                onClick={() => setActiveThreadId(thread.id)}
              >
                <div className="thread-title-row">
                  <h3>{thread.title}</h3>
                  <span className="thread-category-pill">
                    {thread.category}
                  </span>
                </div>
                <p className="thread-snippet">
                  {thread.content.length > 100
                    ? thread.content.slice(0, 100) + "..."
                    : thread.content}
                </p>
                <div className="meta">
                  <span>{thread.author}</span>
                  <span>·</span>
                  <span>
                    {thread.replies.length}{" "}
                    {thread.replies.length === 1 ? "reply" : "replies"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side: active thread detail */}
        <div className="thread-detail-panel">
          {activeThread ? (
            <ThreadDetail
              thread={activeThread}
              onAddReply={handleAddReply}
            />
          ) : (
            <div className="thread-detail-placeholder">
              <p>Select a thread on the left to read and reply.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ThreadDetail({ thread, onAddReply }) {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddReply(thread.id, replyText);
    setReplyText("");
  };

  return (
    <div className="thread-detail-card">
      <h2>{thread.title}</h2>
      <p className="thread-detail-category">{thread.category}</p>
      <p className="thread-detail-body">{thread.content}</p>

      <h3 className="thread-replies-heading">
        Replies ({thread.replies.length})
      </h3>

      <div className="reply-list">
        {thread.replies.length === 0 && (
          <p className="reply-empty">No replies yet. Start the conversation!</p>
        )}

        {thread.replies.map((r) => (
          <div key={r.id} className="reply-item">
            <div className="reply-meta">
              <span className="reply-author">{r.author}</span>
            </div>
            <p className="reply-text">{r.text}</p>
          </div>
        ))}
      </div>

      <form className="reply-form" onSubmit={handleSubmit}>
        <label htmlFor="reply-input">Add a reply</label>
        <textarea
          id="reply-input"
          rows={3}
          placeholder="Share your thoughts..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button type="submit" className="primary">
          Post reply
        </button>
      </form>
    </div>
  );
}
