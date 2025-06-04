import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Generate from "./components/Generate";
import Ranking from "./components/Ranking";
import Competition from "./components/Competition";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/competition" element={<Competition />} />
          </Routes>
        </main>
        <footer className="bg-gray-200 text-center py-4">
          © {new Date().getFullYear()} FrogArt AI
        </footer>
      </div>
    </Router>
  );
}

export default App;
