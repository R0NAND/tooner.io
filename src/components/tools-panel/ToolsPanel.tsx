import React from "react";
import Metronome from "../metronome/Metronome";
import "./ToolsPanel.css";
import PracticeTimer from "../practice-timer/PracticeTimer";

const ToolsPanel = () => {
  return (
    <>
      <div className="tools-panel">
        <Metronome></Metronome>
        <PracticeTimer></PracticeTimer>
      </div>
    </>
  );
};

export default ToolsPanel;
