"use client";

import { useState } from "react";

export default function DropText() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitPaste() {
    if (!content.trim()) {
      setError("Paste content cannot be empty");
      return;
    }

    setError("");
    setLink("");
    setLoading(true);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttlSeconds ? Number(ttlSeconds) : undefined,
          max_views: maxViews ? Number(maxViews) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create paste");
      }

      setLink(data.url);
      setContent("");
      setTtlSeconds("");
      setMaxViews("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F3EE] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-semibold text-green-700 mb-2">
          🌿 DropText
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Share text securely with optional expiry and view limits.
        </p>

        <textarea
          className="w-full rounded-lg border border-green-200 p-3 text-sm text-gray-800 
             placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 "
          placeholder="Paste your text here..."
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-3 mt-4">
          <input
            type="number"
            placeholder="TTL (seconds)"
            className="w-1/2 rounded-lg border border-green-200 p-2 text-sm text-gray-800 
             placeholder:text-gray-400focus:ring-2 focus:ring-green-200"
            value={ttlSeconds}
            onChange={(e) => setTtlSeconds(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max views"
            className="w-1/2 rounded-lg border border-green-200 p-2 text-sm  text-gray-800 
             placeholder:text-gray-400 focus:ring-2 focus:ring-green-200"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
          />
        </div>

        <button
          onClick={submitPaste}
          disabled={loading}
          className="mt-5 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2.5 rounded-lg transition"
        >
          {loading ? "Creating..." : "Create Drop"}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </p>
        )}

        {link && (
  <div className="mt-3 flex items-center justify-between gap-3 
                  bg-green-50 border border-green-200 
                  rounded-md p-3 text-sm text-green-800">

    <div className="truncate">
       URL:&nbsp;
      <a
        href={link}
        className="underline font-medium"
        target="_blank"
        rel="noopener noreferrer"
      >
        {link}
      </a>
    </div>

    <button
      onClick={() => navigator.clipboard.writeText(link)}
      title="Copy link"
      className="shrink-0 rounded-md border border-green-300 
                 bg-white px-2 py-1 text-green-700 
                 hover:bg-green-100 transition"
    >
      🔗
    </button>
  </div>
)}

      </div>
    </main>
  );
}
