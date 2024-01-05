import React, { useEffect, useRef } from "react";

import "./styles/App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.js";
import Home from "./components/Home.js";

function App() {
  const canvasRef = useRef();

  useEffect(() => {
    const root = document.getElementById("root");
    const updateBackground = () => {
      const c = canvasRef.current;
      const ctx = c.getContext("2d");

      const scrollDistance =
        root.scrollTop || document.documentElement.scrollTop;
      const maxDistance = root.scrollHeight - root.clientHeight;
      const percentScrolled = Math.min(
        Math.log2(1 + (7.4 * scrollDistance) / maxDistance),
        1
      );

      const percentNotScrolled = 1 - percentScrolled;
      const secondHeight = Math.max(percentNotScrolled, 0.1);

      const grd = ctx.createLinearGradient(0, 0, 0, c.height);
      grd.addColorStop(1 * secondHeight, "#374788ff");
      grd.addColorStop(1, "#ea6d1dff");

      // Fill with gradient
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, c.width, c.height);
    };

    // Call updateBackground once the document is loaded
    updateBackground();
    // Call updateBackground on scroll
    root.addEventListener("scroll", updateBackground);

    // Cleanup function
    return () => {
      root.removeEventListener("scroll", updateBackground);
    };
  }, []); // Empty dependency array means this effect runs once after initial render

  return (
    <Router>
      <canvas ref={canvasRef} id="background" width="100" height="100"></canvas>
      <div id="container">
        <Header />
        <div id="MainContent">
          <Routes>
            <Route element={<Home />} path="" />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
