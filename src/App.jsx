import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import DailyCheckIn from "./components/DailyCheckIn";
import Dashboard from "./components/Dashboard";
import CalmMode from "./components/CalmMode";
import Journal from "./components/Journal";
import Footer from "./components/Footer";

import { sampleEntries } from "./data/sampleEntries";

function App() {
  const [showMainApp, setShowMainApp] = useState(false);

  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem("saaf_entries");
    return savedEntries ? JSON.parse(savedEntries) : sampleEntries;
  });

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("saaf_notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  useEffect(() => {
    localStorage.setItem("saaf_entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("saaf_notes", JSON.stringify(notes));
  }, [notes]);

  function handleAddEntry(newEntry) {
    setEntries((currentEntries) => [newEntry, ...currentEntries]);
  }

  function handleAddNote(newNote) {
    setNotes((currentNotes) => [newNote, ...currentNotes]);
  }

  function handleDeleteNote(noteId) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId)
    );
  }

  if (!showMainApp) {
    return (
      <div className="landing-page">
        <div className="landing-glow landing-glow-one"></div>
        <div className="landing-glow landing-glow-two"></div>

        <div className="landing-card">
          <div className="landing-logo">
            <span>S</span>
          </div>

          <h1>SAAF</h1>

          <p>Small steps to a calmer mind.</p>

          <button className="get-started-btn" onClick={() => setShowMainApp(true)}>
            Get Started
          </button>
        </div>

        <p className="landing-rights">
          © 2026 AbdulJameel M. SAAF. All rights reserved.
        </p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />

      <main>
        <DailyCheckIn onAddEntry={handleAddEntry} />
        <Dashboard entries={entries} />
        <CalmMode />
        <Journal
          notes={notes}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;