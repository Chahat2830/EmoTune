
import {
  Heart,
  Home,
  Library,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";

import "./Navbar.css";

function Navbar({ activePage, setActivePage }) {
  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
    },
    {
      id: "mood",
      label: "My Mood",
      icon: Sparkles,
    },
    {
      id: "explore",
      label: "Explore",
      icon: Search,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
    },
    {
      id: "dashboard",
      label: "My Space",
      icon: Library,
    },
  ];

  return (
    <header className="navbar">
      <button
        type="button"
        className="brand"
        onClick={() => setActivePage("home")}
        aria-label="EmoTune home"
      >
        <div className="brand-icon">
          ♫
        </div>

        <div>
          <strong>EmoTune</strong>
          <span>music for your feelings</span>
        </div>
      </button>

      <nav className="nav-menu">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.id}
              className={`nav-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="profile-button"
        aria-label="Profile"
      >
        <UserRound size={18} />
      </button>
    </header>
  );
}

export default Navbar;
