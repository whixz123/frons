"use client";

import { useState } from "react";
import Widget from "./Widget";

type BookmarkWidgetProps = {
  onClose: () => void;
};

type Bookmark = {
  id: string;
  name: string;
  url: string;
};

export default function BookmarkWidget({ onClose }: BookmarkWidgetProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: "1", name: "Give Feedback for WFC OS", url: "https://workfromcoffee.featurebase.app/" },
    { id: "2", name: "GitHub", url: "https://github.com" },
    { id: "3", name: "Solana Docs", url: "https://docs.solana.com" },
  ]);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addBookmark = () => {
    if (newName && newUrl) {
      setBookmarks([...bookmarks, {
        id: Date.now().toString(),
        name: newName,
        url: newUrl
      }]);
      setNewName("");
      setNewUrl("");
      setIsAdding(false);
    }
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const openBookmark = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Widget 
      title="Bookmark" 
      onClose={onClose}
      defaultPosition={{ x: 350, y: 200 }}
      width="450px"
    >
      <div className="p-6 space-y-4">
        {/* Add Bookmark Button */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-700 transition font-bold flex items-center justify-center gap-2"
          >
            <span>+</span>
            <span>Add Bookmark</span>
          </button>
        ) : (
          <div className="space-y-3 p-4 bg-amber-50 rounded-lg">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter bookmark name"
                className="w-full px-3 py-2 bg-white border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-amber-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-1">URL</label>
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="Enter URL (e.g., https://example.com)"
                className="w-full px-3 py-2 bg-white border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-amber-900"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={addBookmark}
                className="flex-1 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-700 transition font-bold"
              >
                Add Bookmark
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewName("");
                  setNewUrl("");
                }}
                className="px-4 py-2 bg-amber-200 text-amber-900 rounded-lg hover:bg-amber-300 transition font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bookmarks List */}
        <div className="space-y-2">
          {bookmarks.length === 0 ? (
            <div className="text-center py-8 text-amber-600">
              <p className="text-4xl mb-2">🔖</p>
              <p>No bookmarks yet</p>
              <p className="text-sm">Add your favorite links!</p>
            </div>
          ) : (
            bookmarks.map(bookmark => (
              <div
                key={bookmark.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-amber-200 hover:border-amber-400 transition group"
              >
                <button
                  onClick={() => openBookmark(bookmark.url)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-800">🔗</span>
                    <div className="flex-1">
                      <div className="font-semibold text-amber-900 group-hover:text-amber-700">
                        {bookmark.name}
                      </div>
                      <div className="text-xs text-amber-600 truncate">
                        {bookmark.url}
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition opacity-0 group-hover:opacity-100"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        {bookmarks.length > 0 && (
          <div className="pt-4 border-t border-amber-200 text-center text-sm text-amber-700">
            {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''} saved
          </div>
        )}
      </div>
    </Widget>
  );
}

