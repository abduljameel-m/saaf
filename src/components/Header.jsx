import { HeartPulse, Menu, X } from "lucide-react";
import { useState } from "react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <a href="#home" className="brand">
        <div className="brand-icon">
          <HeartPulse size={22} />
        </div>
        <div>
          <h1>SAAF</h1>
          <p>Small steps to a calmer mind.</p>
        </div>
      </a>

      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={isOpen ? "nav nav-open" : "nav"}>
        <a href="#tracker" onClick={() => setIsOpen(false)}>
          Tracker
        </a>
        <a href="#dashboard" onClick={() => setIsOpen(false)}>
          Progress
        </a>
        <a href="#calm" onClick={() => setIsOpen(false)}>
          Calm Mode
        </a>
        <a href="#journal" onClick={() => setIsOpen(false)}>
          Journal
        </a>
      </nav>
    </header>
  );
}

export default Header;