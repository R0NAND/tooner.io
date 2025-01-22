import "./App.css";
import Tuner from "./components/tuner/Tuner";
import Metronome from "./components/metronome/Metronome";
import TutorialPlayer from "./components/tutorial-player/TutorialPlayer";
import { useState } from "react";
import { Routes, Route } from "react-router";
import TunerPage from "./pages/TunerPage";
import Navbar from "./components/navbar/Navbar";
import AboutPage from "./pages/AboutPage";
import TabsPage from "./pages/TabsPage";
import ToolsPanel from "./components/tools-panel/ToolsPanel";
import TestComponent from "./components/TestComponent";

function App() {
  const [appState, setAppState] = useState("tuner");
  return (
    <div className="app-container">
      {/* <TestComponent></TestComponent> */}
      <Navbar></Navbar>
      <Routes>
        <Route path="/tuner" element={<TunerPage></TunerPage>}></Route>
        <Route
          path="/tutorials"
          element={<TutorialPlayer></TutorialPlayer>}
        ></Route>
        <Route path="/tabs" element={<TabsPage></TabsPage>}></Route>
        <Route path="/about" element={<AboutPage></AboutPage>}></Route>
      </Routes>
      <ToolsPanel></ToolsPanel>
    </div>
  );
}

export default App;
