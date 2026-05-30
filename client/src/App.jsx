import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import ExerciseList from "./pages/ExerciseList";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="logo">SPORŤÁK</div>

          <div className="nav-links">
            <Link to="/">Workout overview</Link>
            <Link to="/exerciseList">Exercise overview</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exerciseList" element={<ExerciseList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
