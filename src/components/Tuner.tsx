import React, { useEffect, useRef, useState } from "react";
import head from "./assets/guitar-head.svg";
import TuningButton from "./TuningButton";
import * as Tone from "tone";
import TuningGauge from "./TuningGauge";
import micOn from "./assets/mic-on.svg";
import micOff from "./assets/mic-off.svg";

type TuningDictionary = {
  [key: string]: string[];
};

const tuningDictionary: TuningDictionary = {
  Standard: ["E2", "A2", "D3", "E2", "G3", "B3"],
  "Drop D": ["D2", "A2", "D3", "G3", "B3", "E4"],
  DADGAD: ["D2", "A2", "D3", "G3", "A3", "D4"],
  "Half step down": ["D#2", "G#2", "C#3", "F#3", "A#3", "D#4"],
  "Full step down": ["D2", "G2", "C3", "F3", "A3", "D4"],
};

const peg_positions = [
  { top: "60%", left: "0%", transform: "Scale(50%)" },
  { top: "35%", left: "0%", transform: "Scale(50%)" },
  { top: "10%", left: "0%", transform: "Scale(50%)" },
  { top: "10%", left: "80%", transform: "Scale(50%) ScaleX(-1)" },
  { top: "35%", left: "80%", transform: "Scale(50%) ScaleX(-1)" },
  { top: "60%", left: "80%", transform: "Scale(50%) ScaleX(-1)" },
];

const Tuner = () => {
  const [notes, setNotes] = useState(tuningDictionary["Standard"]);
  const [areFocused, setAreFocused] = useState(
    tuningDictionary["Standard"].map(() => {
      return false;
    })
  );
  const [areTuned, setAreTuned] = useState(
    tuningDictionary["Standard"].map(() => {
      return false;
    })
  );
  const [tuning, setTuning] = useState("Standard");
  const [pitch, setPitch] = useState(0);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const sampler = useRef(new Tone.Sampler());
  const mic = useRef(new Tone.UserMedia());

  useEffect(() => {
    Tone.getContext()
      .addAudioWorkletModule("src/components/PitchAnalysis.js")
      .then(() => {
        const analyzer = Tone.getContext().createAudioWorkletNode(
          "PitchAnalysis",
          { processorOptions: { sampleFrequency: 5 } }
        );
        analyzer.port.onmessage = (e) => {
          setPitch(Math.round(e.data.frequency));
        };
        mic.current.connect(analyzer);
      });
    sampler.current = new Tone.Sampler({
      urls: {
        E2: "acoustic-guitar-e2.wav",
        A2: "acoustic-guitar-a2.wav",
        D3: "acoustic-guitar-d3.wav",
        G3: "acoustic-guitar-g3.wav",
        B3: "acoustic-guitar-b3.wav",
        E4: "acoustic-guitar-e4.wav",
      },
      baseUrl: "src/components/assets/",
    }).toDestination();
  }, []);

  const playNoteCallback = (note: string) => {
    sampler.current.triggerAttackRelease(note, "1n");
  };

  const tunedCallbackHandler = (note: string) => {
    console.log(note);
    const focusedIndex = areFocused.indexOf(true);
    if (focusedIndex !== -1 && note === notes[focusedIndex]) {
      const newAreTuned = areTuned.map((s, i) => {
        return i === focusedIndex ? true : s;
      });
      setAreTuned(newAreTuned);
    }
  };

  const setFocusedPeg = () => {
    console.log("foocused");
  };

  const unsetFocusedPeg = () => {
    console.log("unfocused");
  };

  const toggleMic = () => {
    if (isMicEnabled) {
      mic.current.close();
      setIsMicEnabled(false);
      setPitch(0);
    } else {
      mic.current.open();
      setIsMicEnabled(true);
    }
  };
  return (
    <>
      <div style={{ position: "relative" }}>
        <img className="guitar-head" src={head} alt="" width="800"></img>
        <button
          onClick={() => toggleMic()}
          style={{
            position: "absolute",
            borderRadius: "50%",
            top: "30%",
            left: "45%",
            background: isMicEnabled ? "red" : "green",
          }}
        >
          {isMicEnabled ? (
            <img className="mic-icon" src={micOff} alt="" width="150"></img>
          ) : (
            <img className="mic-icon" src={micOn} alt="" width="150"></img>
          )}
        </button>
        <div style={{ position: "absolute", top: "50%", left: "45%" }}>
          <TuningGauge
            tunedNoteCallback={tunedCallbackHandler}
            sensitivity={0.7}
          >
            {pitch}
          </TuningGauge>
        </div>
        {notes.map((n, index) => (
          <div
            key={tuning + index}
            style={{
              position: "absolute",
              top: peg_positions[index].top,
              left: peg_positions[index].left,
              transform: peg_positions[index].transform,
              backgroundColor: areFocused[index] ? "green" : "red",
            }}
          >
            <TuningButton
              playNoteCallback={(note: string) => {
                playNoteCallback(note);
                const newFocusList = areFocused.map((state, i) => {
                  return i === index ? true : false;
                });
                setAreFocused(newFocusList);
              }}
              changeNoteCallback={(newNote: string) => {
                const newTuning = notes.map((newNotes, i) => {
                  if (i === index) {
                    return newNote;
                  } else {
                    return newNotes;
                  }
                });
                const newAreTuned = areTuned.map((s, i) => {
                  return i === index ? false : s;
                });
                setNotes(newTuning);
                setTuning("Custom");
                const newFocusList = areFocused.map((state, i) => {
                  return i === index ? true : false;
                });
                setAreFocused(newFocusList);
                setAreTuned(newAreTuned);
              }}
              lostFocusCallback={() => {
                setFocusedIndex(-1);
              }}
              isTuned={areTuned[index]}
            >
              {n}
            </TuningButton>
          </div>
        ))}
      </div>
      <select
        name="Tuning"
        id="tuning"
        onChange={(e) => {
          setNotes(tuningDictionary[e.target.value]);
          setTuning(e.target.value);
        }}
      >
        {Object.keys(tuningDictionary).map((key) => (
          <option value={key} key={key}>
            {key}
          </option>
        ))}
      </select>
    </>
  );
};

export default Tuner;
