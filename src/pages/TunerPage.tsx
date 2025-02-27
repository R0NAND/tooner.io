import { useState } from "react";
import Tuner from "../components/tuner/Tuner";
import { InstrumentEnum } from "../components/tuner/Tuner";
import "./TunerPage.css";
import { Tuning } from "../types/tunings";
import { generateNewString } from "../utils/generateNewString";
import useLocalStorageArray from "../hooks/useLocalStorageArray";
import defaultTunings from "../defaults/tunings";
import { measureTextWidth } from "../utils/measureTextWidth";
import TuningMenu from "../components/tuning-menu/TuningMenu";

const TunerPage = () => {
  const [tunings, setTunings] = useLocalStorageArray<Tuning>(
    "tunings",
    defaultTunings
  );
  const [selectedInstrument, setSelectedInstrument] = useState(
    InstrumentEnum.guitar
  );
  const [tuning, setTuning] = useState(
    tunings.filter((t) => t.instrument === selectedInstrument)[0]
  );
  const [pitchShift, setPitchShift] = useState(0); //in cents

  const [isMobileView, setIsMobileView] = useState(false);
  const sidebarWidth = 30; //characters
  const tunerResizeHandler = (width: number) => {
    if (window.visualViewport) {
      const font = window
        //@ts-ignore
        .getComputedStyle(document.getElementById("tuning-menu"), null)
        .getPropertyValue("font");
      const sidebarWidthApproximation = measureTextWidth(
        "0".repeat(sidebarWidth),
        font
      );
      if (
        window.visualViewport.width - 2 * sidebarWidthApproximation - width <
        0
      ) {
        if (!isMobileView) {
          //resize event also gets triggered by mobile keyboard
          //putting contents within this prevents keyboard from minimizing menu
          setIsMobileView(true);
        }
      } else {
        setIsMobileView(false);
      }
    }
  };

  const instrumentSelect = (instrument: InstrumentEnum) => {
    setTuning(tunings.filter((t) => t.instrument === instrument)[0]);
    setSelectedInstrument(instrument);
  };

  const changeNote = (index: number, newNote: string) => {
    const newNotes = tuning.notes.map((note, i) => {
      return i === index ? newNote : note;
    });
    const matchedTuning = tunings.filter(
      (t) => t.notes.toString() === newNotes.toString()
    );
    let newTuningName = "Custom";
    if (matchedTuning.length === 1) {
      newTuningName = matchedTuning[0].name;
    }
    setTuning({
      instrument: selectedInstrument,
      name: newTuningName,
      notes: newNotes,
    });
  };

  const saveTuning = () => {
    const newName = generateNewString(
      tunings
        .filter((t) => t.instrument === selectedInstrument)
        .map((t) => {
          return t.name;
        }),
      "New Tuning "
    );
    const newSelectedTunings = [
      ...tunings,
      { instrument: selectedInstrument, name: newName, notes: tuning.notes },
    ];
    setTunings(newSelectedTunings);
  };
  const deleteTuning = (selectedTuning: Tuning) => {
    const newSelectedTuning = tunings.filter((n) => n !== selectedTuning);
    setTunings(newSelectedTuning);
  };

  const onNameEdited = (newName: string, oldName: string) => {
    const otherTuningNames = tunings
      .filter((t) => t.instrument === selectedInstrument && t.name !== oldName)
      .map((t) => {
        return t.name;
      });
    if (otherTuningNames.includes(newName) || newName === "") {
      return false;
    }
    const newTunings = tunings.map((t) => {
      if (t.instrument === selectedInstrument && t.name === oldName) {
        return {
          instrument: t.instrument,
          name: newName,
          notes: t.notes,
        };
      } else {
        return t;
      }
    });
    setTunings(newTunings);
    return true;
  };

  return (
    <div className="tuning-ui">
      <div className="instrument-select-box">
        <button
          className={`instrument-select-button ${
            selectedInstrument === InstrumentEnum.guitar ? "is-selected" : ""
          }`}
          onClick={() => {
            instrumentSelect(InstrumentEnum.guitar);
          }}
        >
          Guitar
        </button>
        <button
          className={`instrument-select-button ${
            selectedInstrument === InstrumentEnum.bass ? "is-selected" : ""
          }`}
          onClick={() => {
            instrumentSelect(InstrumentEnum.bass);
          }}
        >
          Bass
        </button>
        <button
          className={`instrument-select-button ${
            selectedInstrument === InstrumentEnum.ukulele ? "is-selected" : ""
          }`}
          onClick={() => {
            instrumentSelect(InstrumentEnum.ukulele);
          }}
        >
          Ukulele
        </button>
        <button className="instrument-select-button">8-string</button>
      </div>
      <div className="tuner-container">
        <Tuner
          instrument={tuning.instrument}
          tuning={tuning.notes}
          onNoteChange={changeNote}
          pitchShift={pitchShift}
          onResize={tunerResizeHandler}
        ></Tuner>
      </div>
      <TuningMenu
        tuning={tuning}
        tunings={tunings}
        selectedInstrument={selectedInstrument}
        pitchShift={pitchShift}
        isMobileMenu={false}
        onInstrumentSelect={instrumentSelect}
        onClicked={setTuning}
        onDeleted={deleteTuning}
        onNameEdited={onNameEdited}
        onSave={saveTuning}
        onPitchShift={setPitchShift}
      ></TuningMenu>
    </div>
  );
};

export default TunerPage;
