import "./App.css";
import Tuner from "./components/tuner/Tuner";
import Metronome from "./components/metronome/Metronome";
import TutorialPlayer from "./components/tutorial-player/TutorialPlayer";
import { useState } from "react";
import { Routes, Route } from "react-router";
import TunerPage from "./pages/TunerPage";
import Navbar from "./components/Navbar";
import AboutPage from "./pages/AboutPage";

function App() {
  const [appState, setAppState] = useState("tuner");

  return (
    <>
      <Navbar></Navbar>
      <Routes>
        <Route path="/tuner" element={<TunerPage></TunerPage>}></Route>
        <Route
          path="/tutorials"
          element={<TutorialPlayer></TutorialPlayer>}
        ></Route>
        <Route path="/about" element={<AboutPage></AboutPage>}></Route>
      </Routes>
    </>
  );
}

export default App;
