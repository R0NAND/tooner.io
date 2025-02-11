import React, { useEffect, useRef, useState } from "react";
import Tuner from "../components/tuner/Tuner";
import { InstrumentEnum } from "../components/tuner/Tuner";
import "./TunerPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove, faSave } from "@fortawesome/free-solid-svg-icons";
import { Tuning } from "../types/tunings";
import { generateNewString } from "../utils/generateNewString";
import EditableText from "../components/EditableText";
import useLocalStorageArray from "../hooks/useLocalStorageArray";
import defaultTunings from "../defaults/tunings";

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

  const instrumentSelect = (instrument: InstrumentEnum) => {
    setTuning(tunings.filter((t) => t.instrument === instrument)[0]);
    setSelectedInstrument(instrument);
  };

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

  const changeNote = (index: number, newNote: string) => {
    const newNotes = tuning.notes.map((note, i) => {
      return i === index ? newNote : note;
    });
    setTuning({
      instrument: selectedInstrument,
      name: tuning.name,
      notes: newNotes,
    });
  };

  const [canSaveTuning, setCanSaveTuning] = useState(false);
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
    setCanSaveTuning(false);
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
        {tunings
          .filter((t) => t.instrument === selectedInstrument)
          .map((t) => {
            return (
              <div className="tuning-menu-item" key={t.notes.toString()}>
                <button
                  className="tuning-table-delete"
                  onClick={() => {
                    deleteTuning(t);
                  }}
                >
                  <FontAwesomeIcon
                    fontSize={"1.61em"}
                    icon={faRemove}
                  ></FontAwesomeIcon>
                </button>
                <div
                  style={{ textAlign: "left", width: "20ch", height: "2em" }}
                  onClick={() => {
                    setTuning(t);
                  }}
                >
                  <EditableText onEditCompleted={onNameEdited}>
                    {t.name}
                  </EditableText>
                  <div style={{ fontSize: "0.61em" }}>{t.notes.toString()}</div>
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
        instrument={tuning.instrument}
        tuning={tuning.notes}
        onNoteChange={changeNote}
      ></Tuner>
    </div>
  );
};

export default TunerPage;
