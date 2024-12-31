import "./App.css";
import Tuner from "./components/tuner/Tuner";
import Metronome from "./components/metronome/Metronome";
import TutorialPlayer from "./components/tutorial-player/TutorialPlayer";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import TunerPage from "./pages/TunerPage";

function App() {
  const [appState, setAppState] = useState("tuner");

  return (
    <>
      <ul>
        <li>
          <Link to={"/tuner"}>Tuner</Link>
        </li>
        <li>
          <Link to={"/tutorials"}>Tutorials</Link>
        </li>
        <li>
          <a href="#metronome">Metronome</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<button>Welcome to Costco</button>}></Route>
        <Route path="/tuner" element={<TunerPage></TunerPage>}></Route>
        <Route
          path="/tutorials"
          element={<TutorialPlayer></TutorialPlayer>}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
