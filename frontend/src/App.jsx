import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BuildProvider } from "./contexts/BuildContext";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Build from "./components/Build/Build";
import Compatibility from "./components/Compatibility/Compatibility";
import Learn from "./components/Learn/Learn";
import Brands from "./components/Brands/Brands";

function App() {
  return (
    <BuildProvider>
      <Router>
        <div className="min-h-screen bg-buildlab-dark">
          <Navbar />
          <Routes>
            {/* Main Landing Page */}
            <Route path="/" element={<Home />} />

            {/* Build Page */}
            <Route path="/build" element={<Build />} />

            {/* Compatibility Page */}
            <Route path="/compatibility" element={<Compatibility />} />

            {/* Learn Page */}
            <Route path="/learn" element={<Learn />} />

            {/* Brands Page */}
            <Route path="/brands" element={<Brands />} />

          </Routes>
        </div>
      </Router>
    </BuildProvider>
  );
}

export default App;