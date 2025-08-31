import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  // 🔹 Używamy env, żeby łatwo podmieniać backend
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ⬇️ Hook TYLKO w komponencie
  useEffect(() => {
    axios.get(`${API_URL}/api/notes`)
      .then(res => setNotes(res.data))
      .catch(err => console.error("Error fetching notes:", err));
  }, [API_URL]);

  // 🔹 Funkcja do dodawania notatki
  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const res = await axios.post(`${API_URL}/api/notes`, { text: newNote });
      setNotes([...notes, res.data]);
      setNewNote("");
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Beer Pixel Notes 🍺</h1>

        <div className="flex mb-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="border p-2 rounded flex-grow"
            placeholder="Write a note..."
          />
          <button
            onClick={addNote}
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>

        <ul>
          {notes.map((note, idx) => (
            <li key={idx} className="border-b py-2">{note.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
