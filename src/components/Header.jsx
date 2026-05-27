import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

function Header({ activeView, setActiveView }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleNav(view) {
    setActiveView(view);
    setIsOpen(false);
  }

  return (
    <header className="header">
      <button className="brand brand-button" onClick={() => handleNav("home")}>
        <div className="brand-icon">
          <Leaf size={21} />
        </div>

        <div>
          <h1>SAAF</h1>
          <p>Pause softly. Breathe freely.</p>
        </div>
      </button>

      <button
        className="menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={isOpen ? "nav nav-open" : "nav"}>
        <button
          className={activeView === "tracker" ? "nav-active" : ""}
          onClick={() => handleNav("tracker")}
        >
          Tracker
        </button>

        <button
          className={activeView === "progress" ? "nav-active" : ""}
          onClick={() => handleNav("progress")}
        >
          Progress
        </button>

        <button
          className={activeView === "calm" ? "nav-active" : ""}
          onClick={() => handleNav("calm")}
        >
          Calm Mode
        </button>

        <button
          className={activeView === "journal" ? "nav-active" : ""}
          onClick={() => handleNav("journal")}
        >
          Journal
        </button>
      </nav>
    </header>
  );
}

export default Header;