// frontend/src/components/Navbar/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom"; // 1. I-import ang Link
import { useBuild } from "../../contexts/BuildContext";
import "./Navbar.css"; // Import the CSS file

function Navbar() {
  const { resetBuild } = useBuild();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          BUILDLAB
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/build" className="navbar-link">
            Build
          </Link>
          <Link to="/compatibility" className="navbar-link">
            Compatibility
          </Link>
          <Link to="/learn" className="navbar-link">
            Learn
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
