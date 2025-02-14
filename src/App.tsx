import "./App.css";
import TutorialPlayer from "./components/tutorial-player/TutorialPlayer";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import TunerPage from "./pages/TunerPage";
import Navbar from "./components/navbar/Navbar";
import AboutPage from "./pages/AboutPage";
import TabsPage from "./pages/TabsPage";
import ToolsPanel from "./components/tools-panel/ToolsPanel";
import TutorialsPage from "./pages/TutorialsPage";

function App() {
  return (
    <div className="app-container">
      {/* <TestComponent></TestComponent> */}
      <Navbar></Navbar>
      <div className="app-content">
        <Routes>
          <Route path="/tuner" element={<TunerPage></TunerPage>}></Route>
          <Route
            path="/tutorials"
            element={<TutorialsPage></TutorialsPage>}
          ></Route>
          <Route path="/tabs" element={<TabsPage></TabsPage>}></Route>
          <Route path="/about" element={<AboutPage></AboutPage>}></Route>
        </Routes>
      </div>
      {/* <ToolsPanel></ToolsPanel> */}
    </div>
  );
}

export default App;
