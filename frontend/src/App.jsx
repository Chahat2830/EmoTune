
import { useState } from "react";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Mood from "./pages/Mood";
import Explore from "./pages/Explore";
import Favorites from "./pages/Favorites";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home setActivePage={setActivePage} />;

      case "mood":
        return <Mood />;

      case "explore":
        return <Explore />;

      case "favorites":
        return <Favorites />;

      case "dashboard":
        return <Dashboard />;

      default:
        return <Home setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {renderPage()}
    </div>
  );
}

export default App;
