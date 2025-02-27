import {
  faClose,
  faList,
  faRemove,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import "./TuningMenu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InstrumentEnum } from "../tuner/Tuner";
import { useEffect, useState } from "react";
import { Tuning } from "../../types/tunings";
import EditableText from "../editable-text/EditableText";
import Slider from "../slider/Slider";

interface Props {
  tuning: Tuning;
  tunings: Tuning[];
  selectedInstrument: InstrumentEnum;
  pitchShift: number;
  desktopWidth: string;
  isMobileMenu: boolean;
  onInstrumentSelect: (i: InstrumentEnum) => void;
  onClicked: (t: Tuning) => void;
  onDeleted: (t: Tuning) => void;
  onNameEdited: (newString: string, oldString: string) => boolean;
  onSave: () => void;
  onPitchShift: (cents: number) => void;
}

const TuningMenu = ({
  tuning,
  tunings,
  selectedInstrument,
  pitchShift,
  desktopWidth,
  isMobileMenu,
  onInstrumentSelect,
  onClicked,
  onDeleted,
  onNameEdited,
  onSave,
  onPitchShift,
}: Props) => {
  const [isMinimized, setIsMinimized] = useState(false);
  useEffect(() => {
    if (isMobileMenu) {
      setIsMinimized(true);
    } else {
      setIsMinimized(false);
    }
  }, [isMobileMenu]);

  const [canSaveTuning, setCanSaveTuning] = useState(false);
  //Checks if current tuning is already in list... if not, allow it to be saved
  useEffect(() => {
    if (
      tunings
        .filter((t) => t.instrument === selectedInstrument)
        .map((t) => {
          return t.notes.toString();
        })
        .includes(tuning.notes.toString())
    ) {
      setCanSaveTuning(false);
    } else {
      setCanSaveTuning(true);
    }
  }, [tuning, tunings]);
  return (
    <>
      <div
        id="tuning-menu"
        className="tuning-menu main-panel"
        style={{
          height: "auto",
          padding: "0.5em",
          width: isMobileMenu ? "100%" : desktopWidth,
          transform: isMobileMenu && isMinimized ? "translateX(-100%)" : "",
          transition: isMobileMenu //Very hard to read, but also effective animation solution
            ? "transform 0.3s ease-in-out, width 0s 0.3s"
            : isMinimized
            ? "transform 0.3s ease-in-out"
            : "transform 0.3s ease-in-out, width 0.3s ease-in-out",
        }}
      >
        <h3 style={{ textAlign: "left" }}>Tunings</h3>
        <div style={{ margin: "0.5em" }} className="tunings-list">
          {tunings
            .filter((t) => t.instrument === selectedInstrument)
            .map((t) => {
              return (
                <div
                  className="tuning-menu-item"
                  key={t.notes.toString()}
                  onClick={() => {
                    onClicked(t);
                  }}
                >
                  <div
                    style={{ textAlign: "left", width: "20ch", height: "2em" }}
                  >
                    <EditableText onEditCompleted={onNameEdited}>
                      {t.name}
                    </EditableText>
                    <div style={{ fontSize: "0.61em" }}>
                      {t.notes.toString()}
                    </div>
                  </div>
                  <button
                    className="tuning-table-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleted(t);
                    }}
                  >
                    <FontAwesomeIcon
                      fontSize={"1.61em"}
                      icon={faRemove}
                    ></FontAwesomeIcon>
                  </button>
                </div>
              );
            })}
        </div>
        <button
          className="tuning-save-button"
          disabled={!canSaveTuning}
          onClick={onSave}
        >
          <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
        </button>
        <div
          style={{ display: "flex", alignItems: "end", padding: "0.5em" }}
          className="tuning-slider"
        >
          <label>Shift Pitch: </label>
          <Slider
            min={-50}
            max={50}
            value={pitchShift}
            width={"20ch"}
            updateOnDrag={false}
            label={"cents"}
            inputPosition="top"
            onChange={(n) => onPitchShift(n)}
          ></Slider>
        </div>
      </div>
      {/* <div
        className="tuner-menu-tab"
        onClick={() => setIsMinimized(false)}
        style={{
          display: isMinimized ? "inline" : "none",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <div>{selectedInstrument}</div>
          <div style={{ fontSize: "0.61em" }}>{tuning.name}</div>
        </div>
        <FontAwesomeIcon icon={faList}></FontAwesomeIcon>
      </div> */}
    </>
  );
};

export default TuningMenu;
