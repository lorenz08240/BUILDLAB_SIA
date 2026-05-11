import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { BuildProvider } from "./contexts/BuildContext";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Build from "./components/Build/Build";
import Compatibility from "./components/Compatibility/Compatibility";
import Learn from "./components/Learn/Learn";
<<<<<<< HEAD
import Brands from "./components/Brands/Brands";
=======
import PCBuilder3D from "./components/3D/PCBuilder3D";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
>>>>>>> b104f730eee2bbb74a30bf51f910858926679ecb

function App() {
  return (
    <BuildProvider>
      <Router>
        <ScrollToTop />
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

<<<<<<< HEAD
            {/* Brands Page */}
            <Route path="/brands" element={<Brands />} />

=======
            {/* 3D Builder Page */}
            <Route path="/3d" element={<PCBuilder3D />} />
>>>>>>> b104f730eee2bbb74a30bf51f910858926679ecb
          </Routes>
        </div>
      </Router>
    </BuildProvider>
  );
}

export default App;
