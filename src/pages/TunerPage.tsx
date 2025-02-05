import React, { useEffect, useState } from "react";
import Tuner from "../components/tuner/Tuner";
import { InstrumentEnum } from "../components/tuner/Tuner";
import "./TunerPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faDeleteLeft,
  faSave,
  faTrash,
  faTrashAlt,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { Tuning, Tunings } from "../types/tunings";

const TunerPage = () => {
  const [tuning, setTuning] = useState<string[]>([]);
  const [tunings, setTunings] = useState<Tunings>();
  const [selectedInstrument, setSelectedInstrument] = useState(
    InstrumentEnum.guitar
  );
  const [selectedTunings, setSelectedTunings] = useState<Tuning[]>([]);
  useEffect(() => {
    try {
      const tuningsString = localStorage.getItem("tunings");
      if (tuningsString !== null) {
        const localTunings: Tunings = JSON.parse(tuningsString);
        setTunings(localTunings);
        setSelectedTunings(
          localTunings.instruments.filter((t) => t.name === "guitar")[0].tunings
        );
        setTuning(
          localTunings.instruments.filter((t) => t.name === "guitar")[0]
            .tunings[0].notes
        );
      } else {
        throw new Error(
          "Could not retrieve saved tuning data from local storage!"
        );
      }
    } catch {
      throw new Error();
    }
  }, []);
  const changeNote = (index: number, newNote: string) => {
    const newTuning = tuning.map((note, i) => {
      return i === index ? newNote : note;
    });
    setTuning(newTuning);
    if (
      selectedTunings
        .map((t) => {
          return t.notes;
        })
        .includes(newTuning)
    ) {
      setCanSaveTuning(false);
    } else {
      setCanSaveTuning(true);
    }
  };

  const [canSaveTuning, setCanSaveTuning] = useState(false);
  const saveTuning = () => {
    const newSelectedTunings = [
      ...selectedTunings,
      { name: "New Tuning", notes: tuning },
    ];
    setSelectedTunings(newSelectedTunings);
  };
  const deleteTuning = (selectedTuning: Tuning) => {
    const newSelectedTuning = selectedTunings.filter(
      (n) => n !== selectedTuning
    );
    setSelectedTunings(newSelectedTuning);
  };

  const instrumentSelect = (instrument: InstrumentEnum) => {
    setSelectedInstrument(instrument);
    let instrumentString = "";
    switch (instrument) {
      case InstrumentEnum.guitar:
        instrumentString = "guitar";
        break;
      case InstrumentEnum.ukulele:
        instrumentString = "ukulele";
        break;
      case InstrumentEnum.bass:
        instrumentString = "bass";
        break;
      case InstrumentEnum.eigthString:
        instrumentString = "8-string";
        break;
    }
    if (tunings !== undefined) {
      setSelectedTunings(
        tunings.instruments.filter((t) => t.name === instrumentString)[0]
          .tunings
      );
      setTuning(
        tunings.instruments.filter((t) => t.name === instrumentString)[0]
          .tunings[0].notes
      );
    }
  };

  return (
    <div className="tuner-page">
      <div className="tuning-menu">
        <div>
          <button
            className="instrument-select-button"
            onClick={() => {
              instrumentSelect(InstrumentEnum.guitar);
            }}
          >
            Guitar
          </button>
          <button
            className="instrument-select-button"
            onClick={() => {
              instrumentSelect(InstrumentEnum.bass);
            }}
          >
            Bass
          </button>
          <button
            className="instrument-select-button"
            onClick={() => {
              instrumentSelect(InstrumentEnum.ukulele);
            }}
          >
            Ukulele
          </button>
          <button
            className="instrument-select-button"
            onClick={() => {
              instrumentSelect(InstrumentEnum.eigthString);
            }}
          >
            8-String
          </button>
        </div>
        {selectedTunings.map((tuning, i) => {
          return (
            <div className="tuning-menu-item" key={tuning.name}>
              <button
                className="tuning-table-button"
                onClick={() => {
                  deleteTuning(tuning);
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
              </button>
              <div style={{ textAlign: "left", width: "20em", height: "2em" }}>
                <div>{tuning.name}</div>
                <div style={{ fontSize: "0.61em" }}>
                  {tuning.notes.toString()}
                </div>
              </div>
              <button
                className="tuning-table-button"
                onClick={() => {
                  setTuning(tuning.notes);
                }}
              >
                <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
              </button>
            </div>
          );
        })}
        <button
          className="tuning-table-button"
          disabled={!canSaveTuning}
          onClick={saveTuning}
          style={{ background: "grey", width: "100%" }}
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
