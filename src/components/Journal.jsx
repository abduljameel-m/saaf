import { BookOpen, Trash2 } from "lucide-react";
import { useState } from "react";

function Journal({ notes, onAddNote, onDeleteNote }) {
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim()) return;

    const newNote = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      text,
    };

    onAddNote(newNote);
    setText("");
  }

  return (
    <section className="section" id="journal">
      <div className="section-title">
        <span>
          <BookOpen size={18} /> Gentle Journal
        </span>

        <h2>A private space for your thoughts</h2>

        <p>
          Write what you noticed, what felt difficult, and one gentle thing you
          want to try next.
        </p>
      </div>

      <form className="journal-form" onSubmit={handleSubmit}>
        <textarea
          rows="5"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Today I noticed..."
        ></textarea>

        <button className="primary-btn" type="submit">
          Save Note
        </button>
      </form>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="empty-text">No notes yet. Start with one gentle thought.</p>
        ) : (
          notes.map((note) => (
            <div className="note-card" key={note.id}>
              <div>
                <span>{note.date}</span>
                <p>{note.text}</p>
              </div>

              <button
                onClick={() => onDeleteNote(note.id)}
                aria-label="Delete note"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Journal;