import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // If scrolling down and we scrolled past 50px, hide the navbar
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } 
      // If scrolling up, show the navbar
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Also show navbar if mouse moves near the top of the screen
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY < 50) {
        setIsVisible(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <nav className={`navbar ${isVisible ? "" : "navbar-hidden"}`}>
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