<<<<<<< HEAD
import React from "react";
import { Link } from "react-router-dom";
=======
// frontend/src/components/Navbar/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom"; // 1. I-import ang Link
>>>>>>> b104f730eee2bbb74a30bf51f910858926679ecb
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
<<<<<<< HEAD
          <button onClick={resetBuild} className="navbar-reset">
            Reset Build
          </button>
=======
>>>>>>> b104f730eee2bbb74a30bf51f910858926679ecb
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
