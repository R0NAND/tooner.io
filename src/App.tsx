import "./App.css";
import Tuner from "./components/Tuner";
import Metronome from "./components/Metronome";
import TutorialPlayer from "./components/TutorialPlayer/TutorialPlayer";
function App() {
  return (
    <>
      <Tuner></Tuner>
      <Metronome></Metronome>
      <TutorialPlayer></TutorialPlayer>
    </>
  );
}

export default App;
