import { useState, useEffect } from "react";
import { Plus, Trash2, StickyNote } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

const STORAGE_KEY = "frons-notes";

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.length > 0 ? parsed : [{
            id: "1",
            title: "Welcome to frons.id",
            content: "This is your productivity workspace on Solana. Create notes, track tasks, and stay focused!",
            timestamp: Date.now(),
          }];
        } catch {
          return [{
            id: "1",
            title: "Welcome to frons.id",
            content: "This is your productivity workspace on Solana. Create notes, track tasks, and stay focused!",
            timestamp: Date.now(),
          }];
        }
      }
    }
    return [{
      id: "1",
      title: "Welcome to frons.id",
      content: "This is your productivity workspace on Solana. Create notes, track tasks, and stay focused!",
      timestamp: Date.now(),
    }];
  });
  const [selectedNote, setSelectedNote] = useState<string | null>(notes[0]?.id || null);
  const [currentTitle, setCurrentTitle] = useState(notes[0]?.title || "");
  const [currentContent, setCurrentContent] = useState(notes[0]?.content || "");

  // Save to localStorage whenever notes change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      timestamp: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote.id);
    setCurrentTitle(newNote.title);
    setCurrentContent(newNote.content);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (selectedNote === id) {
      setSelectedNote(null);
      setCurrentTitle("");
      setCurrentContent("");
    }
  };

  const updateNote = () => {
    if (selectedNote) {
      setNotes(
        notes.map((note) =>
          note.id === selectedNote
            ? { ...note, title: currentTitle, content: currentContent, timestamp: Date.now() }
            : note
        )
      );
    }
  };

  // Auto-save on content change (debounced)
  useEffect(() => {
    if (!selectedNote) return;
    
    const timer = setTimeout(() => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === selectedNote
            ? { ...note, title: currentTitle, content: currentContent, timestamp: Date.now() }
            : note
        )
      );
    }, 1000); // Auto-save after 1 second of inactivity
    
    return () => clearTimeout(timer);
  }, [currentTitle, currentContent, selectedNote]);

  const selectNote = (note: Note) => {
    updateNote(); // Save current note before switching
    setSelectedNote(note.id);
    setCurrentTitle(note.title);
    setCurrentContent(note.content);
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-yellow-50 to-amber-50">
      {/* Notes List */}
      <div className="w-64 border-r border-amber-200 bg-white/50 p-4 flex flex-col">
        <Button
          onClick={createNewNote}
          className="mb-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>

        <div className="flex-1 overflow-auto space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => selectNote(note)}
              className={`p-3 rounded-lg cursor-pointer transition-all group ${
                selectedNote === note.id
                  ? "bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-md"
                  : "bg-white hover:bg-yellow-100"
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className={`flex-1 truncate ${selectedNote === note.id ? "text-white" : "text-gray-800"}`}>
                  {note.title || "Untitled"}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                >
                  <Trash2 className={`w-4 h-4 ${selectedNote === note.id ? "text-white" : "text-red-500"}`} />
                </button>
              </div>
              <div className={`text-xs ${selectedNote === note.id ? "text-white/80" : "text-gray-500"}`}>
                {new Date(note.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-1 p-6 flex flex-col">
        {selectedNote ? (
          <>
            <Input
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              onBlur={updateNote}
              placeholder="Note title..."
              className="mb-4 bg-white border-amber-200 focus:border-amber-400 text-xl"
            />
            <Textarea
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              onBlur={updateNote}
              placeholder="Start writing..."
              className="flex-1 resize-none bg-white border-amber-200 focus:border-amber-400"
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <StickyNote className="w-16 h-16 mb-4" />
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}
