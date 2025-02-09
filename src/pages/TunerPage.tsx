import React, { useEffect, useRef, useState } from "react";
import Tuner from "../components/tuner/Tuner";
import { InstrumentEnum } from "../components/tuner/Tuner";
import "./TunerPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faRemove,
  faSave,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Tuning, Tunings } from "../types/tunings";
import { generateNewString } from "../utils/generateNewString";
import { measureTextWidth } from "../utils/measureTextWidth";
import EditableText from "../components/EditableText";

const TunerPage = () => {
  const [tuning, setTuning] = useState<string[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState(
    InstrumentEnum.guitar
  );
  const [instrumentTunings, setInstrumentTunings] = useState<Tuning[]>([]);

  const instrumentSelect = (instrument: InstrumentEnum) => {
    try {
      const tuningsString = localStorage.getItem("tunings");
      if (tuningsString !== null) {
        const localTunings: Tunings = JSON.parse(tuningsString);
        setInstrumentTunings(
          localTunings.instruments.filter((t) => t.name === instrument)[0]
            .tunings
        );
        setTuning(
          localTunings.instruments.filter((t) => t.name === instrument)[0]
            .tunings[0].notes
        );
        setSelectedInstrument(instrument);
      } else {
        throw new Error(
          "Could not retrieve saved tuning data from local storage!"
        );
      }
    } catch {
      throw new Error();
    }
  };

  useEffect(() => {
    instrumentSelect(InstrumentEnum.guitar);
  }, []);

  //Checks if current tuning is already in list... if not, allow it to be saved
  useEffect(() => {
    if (
      instrumentTunings
        .map((t) => {
          return t.notes.toString();
        })
        .includes(tuning.toString())
    ) {
      setCanSaveTuning(false);
    } else {
      setCanSaveTuning(true);
    }
  }, [tuning, instrumentTunings]);

  const changeNote = (index: number, newNote: string) => {
    const newTuning = tuning.map((note, i) => {
      return i === index ? newNote : note;
    });
    setTuning(newTuning);
  };

  const [canSaveTuning, setCanSaveTuning] = useState(false);
  const saveTuning = () => {
    const newName = generateNewString(
      instrumentTunings.map((t) => {
        return t.name;
      }),
      "New Tuning "
    );
    const newSelectedTunings = [
      ...instrumentTunings,
      { name: newName, notes: tuning },
    ];
    setCanSaveTuning(false);
    setInstrumentTunings(newSelectedTunings);
  };
  const deleteTuning = (selectedTuning: Tuning) => {
    const newSelectedTuning = instrumentTunings.filter(
      (n) => n !== selectedTuning
    );
    setInstrumentTunings(newSelectedTuning);
  };

  const onNameEdited = (newName: string, oldName: string) => {
    const otherTuningNames = instrumentTunings
      .filter((t) => t.name !== oldName)
      .map((t) => {
        return t.name;
      });
    if (otherTuningNames.includes(newName) || newName === "") {
      return false;
    }
    const newSelectedTunings = instrumentTunings.map((t) => {
      if (t.name === oldName) {
        return {
          name: newName,
          notes: t.notes,
        };
      } else {
        return t;
      }
    });
    setInstrumentTunings(newSelectedTunings);
    return true;
  };

  return (
    <div className="tuner-page">
      <div className="tuning-menu">
        <div className="instrument-select-panel">
          <button
            className={
              selectedInstrument === InstrumentEnum.guitar
                ? "instrument-selected-tab"
                : "instrument-select-button"
            }
            onClick={() => {
              instrumentSelect(InstrumentEnum.guitar);
            }}
          >
            Guitar
          </button>
          <button
            className={
              selectedInstrument === InstrumentEnum.bass
                ? "instrument-selected-tab"
                : "instrument-select-button"
            }
            onClick={() => {
              instrumentSelect(InstrumentEnum.bass);
            }}
          >
            Bass
          </button>
          <button
            className={
              selectedInstrument === InstrumentEnum.ukulele
                ? "instrument-selected-tab"
                : "instrument-select-button"
            }
            onClick={() => {
              instrumentSelect(InstrumentEnum.ukulele);
            }}
          >
            Ukulele
          </button>
          <button
            className={
              selectedInstrument === InstrumentEnum.eigthString
                ? "instrument-selected-tab"
                : "instrument-select-button"
            }
            onClick={() => {
              instrumentSelect(InstrumentEnum.eigthString);
            }}
          >
            8-String
          </button>
        </div>
        {instrumentTunings.map((tuning) => {
          return (
            <div className="tuning-menu-item" key={tuning.notes.toString()}>
              <button
                className="tuning-table-delete"
                onClick={() => {
                  deleteTuning(tuning);
                }}
              >
                <FontAwesomeIcon
                  fontSize={"1.61em"}
                  icon={faRemove}
                ></FontAwesomeIcon>
              </button>
              <div
                style={{ textAlign: "left", height: "2em" }}
                onClick={() => {
                  setTuning(tuning.notes);
                }}
              >
                <EditableText onEditCompleted={onNameEdited}>
                  {tuning.name}
                </EditableText>
                <div style={{ fontSize: "0.61em" }}>
                  {tuning.notes.toString()}
                </div>
              </div>
            </div>
          );
        })}
        <button
          className="tuning-save-button"
          disabled={!canSaveTuning}
          onClick={saveTuning}
        >
          <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
        </button>
      </div>
      <Tuner
        instrument={selectedInstrument}
        tuning={tuning}
        onNoteChange={changeNote}
      ></Tuner>
    </div>
  );
};

export default TunerPage;
