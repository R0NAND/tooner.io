import Metronome from "../metronome/Metronome";
import "./ToolsPanel.css";

const ToolsPanel = () => {
  return (
    <div className="tools-panel">
      {/* <PracticeTimer></PracticeTimer> */}
      <div></div>
      <Metronome></Metronome>
      <div></div>
    </div>
  );
};

export default ToolsPanel;
