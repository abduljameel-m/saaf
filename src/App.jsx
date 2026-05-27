import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  Leaf,
  Sparkles,
} from "lucide-react";
import "./App.css";

import Header from "./components/Header";
import DailyCheckIn from "./components/DailyCheckIn";
import Dashboard from "./components/Dashboard";
import CalmMode from "./components/CalmMode";
import Journal from "./components/Journal";
import Footer from "./components/Footer";

import {
  archiveExpiredEntries,
  fetchDailyEntries,
  saveDailyEntry,
} from "./services/saafStorage";

function App() {
  const [showMainApp, setShowMainApp] = useState(false);
  const [activeView, setActiveView] = useState("home");

  const [entries, setEntries] = useState([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("saaf_notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  useEffect(() => {
    async function loadEntriesFromSupabase() {
      try {
        setIsLoadingEntries(true);

        await archiveExpiredEntries();

        const savedEntries = await fetchDailyEntries();
        setEntries(savedEntries);
      } catch (error) {
        console.error("Unable to load SAAF entries:", error);
      } finally {
        setIsLoadingEntries(false);
      }
    }

    loadEntriesFromSupabase();
  }, []);

  useEffect(() => {
    localStorage.setItem("saaf_notes", JSON.stringify(notes));
  }, [notes]);

  async function handleAddEntry(newEntry) {
    try {
      const savedEntry = await saveDailyEntry(newEntry);

      setEntries((currentEntries) => [savedEntry, ...currentEntries]);
      setActiveView("progress");
    } catch (error) {
      console.error("Unable to save reflection:", error);
      alert("Reflection could not be saved. Please check Supabase connection.");
    }
  }

  function handleAddNote(newNote) {
    setNotes((currentNotes) => [newNote, ...currentNotes]);
  }

  function handleDeleteNote(noteId) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId)
    );
  }

  const featureCards = [
    {
      id: "tracker",
      icon: CalendarCheck,
      title: "Daily Reflection",
      text: "Note today’s feeling, trigger, pause, and small progress.",
      button: "Open reflection",
    },
    {
      id: "progress",
      icon: BarChart3,
      title: "Gentle Progress",
      text: "View calm progress, saved reflections, pauses, and patterns.",
      button: "View progress",
    },
    {
      id: "calm",
      icon: Leaf,
      title: "Calm Mode",
      text: "Start a soft breathing pause before reacting to the urge.",
      button: "Begin calm mode",
    },
    {
      id: "journal",
      icon: BookOpen,
      title: "Gentle Journal",
      text: "Write private thoughts, feelings, and tomorrow’s gentle step.",
      button: "Write note",
    },
  ];

  if (!showMainApp) {
    return (
      <div className="landing-page">
        <main className="landing-shell">
          <section className="landing-left">
            <div className="brand-mark">
              <div className="brand-mark-inner">
                <Leaf size={42} />
              </div>

              <div className="breathing-ring ring-one"></div>
              <div className="breathing-ring ring-two"></div>
            </div>

            <p className="eyebrow">Supportive companion</p>

            <h1>SAAF</h1>

            <p className="tagline">
              Pause softly. Breathe freely. Begin again.
            </p>

            <button
              className="get-started-btn"
              onClick={() => setShowMainApp(true)}
            >
              Get Started
              <ArrowRight size={20} />
            </button>
          </section>
        </main>

        <p className="landing-rights">
          © 2026 AbdulJameel M. SAAF. All rights reserved.
        </p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header activeView={activeView} setActiveView={setActiveView} />

      <main className="inner-main">
        {activeView === "home" && (
          <section className="inner-home">
            <div className="inner-home-title">
              <span>
                <Sparkles size={18} /> Choose one gentle step
              </span>

              <h2>What would you like to do now?</h2>

              <p>
                SAAF keeps things simple. Pick one card and focus only on that
                step.
              </p>
            </div>

            <div className="feature-card-grid">
              {featureCards.map((card) => {
                const Icon = card.icon;

                return (
                  <button
                    className="feature-card"
                    key={card.id}
                    onClick={() => setActiveView(card.id)}
                  >
                    <div className="feature-icon">
                      <Icon size={26} />
                    </div>

                    <div>
                      <h3>{card.title}</h3>
                      <p>{card.text}</p>
                    </div>

                    <span>{card.button}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {activeView === "tracker" && (
          <DailyCheckIn onAddEntry={handleAddEntry} />
        )}

        {activeView === "progress" &&
          (isLoadingEntries ? (
            <section className="section">
              <div className="section-title">
                <span>Loading</span>
                <h2>Loading your reflections...</h2>
                <p>Please wait while SAAF gets your saved progress.</p>
              </div>
            </section>
          ) : (
            <Dashboard entries={entries} />
          ))}

        {activeView === "calm" && <CalmMode />}

        {activeView === "journal" && (
          <Journal
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;