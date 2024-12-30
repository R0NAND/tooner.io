import "./App.css";
import Tuner from "./components/Tuner";
import Metronome from "./components/Metronome/Metronome";
import TutorialPlayer from "./components/TutorialPlayer/TutorialPlayer";
import { useState } from "react";
function App() {
  const [appState, setAppState] = useState("tuner");

  return (
    <>
      {appState === "tuner" ? (
        <Tuner></Tuner>
      ) : (
        <TutorialPlayer></TutorialPlayer>
      )}
      <div style={{ position: "fixed", top: "80%", left: "50%" }}>
        <Metronome></Metronome>
      </div>
      <button
        style={{ position: "fixed", top: "80%", left: "10%" }}
        onClick={() => {
          setAppState("tuner");
        }}
      >
        Tuner
      </button>
      <button
        style={{ position: "fixed", top: "80%", left: "90%" }}
        onClick={() => {
          setAppState("tutorials");
        }}
      >
        Tutorials
      </button>
    </>
  );
}

export default App;
