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

class TuningResult {
  heardNote: string;
  consecutiveTimesHeard: number;
  sensitivity: number;

  constructor(s: number) {
    if (s >= 0.95) {
      throw new Error("Highest allowable sensitivity is 0.95");
    }
    this.heardNote = "";
    this.consecutiveTimesHeard = 0;
    this.sensitivity = s;
  }

  trackFrequency(frequency: number) {
    let note = frequency === 0 ? "" : Tone.Frequency(frequency).toNote();
    let target = Tone.Frequency(note).toFrequency();
    let lower_bound = target / 1.02930223664; // 24th root of 2
    let upper_bound = target * 1.02930223664; // 24th root of 2
    let tolerance = 1 - this.sensitivity;

    let fraction = 1;
    if (frequency < target) {
      fraction = (target - frequency) / (target - lower_bound);
    } else {
      fraction = (frequency - target) / (upper_bound - target);
    }

    if (fraction <= tolerance && note === this.heardNote) {
      this.consecutiveTimesHeard += 1;
    } else {
      this.consecutiveTimesHeard = 0;
    }
    this.heardNote = note;

    if (this.consecutiveTimesHeard === 3) {
      this.consecutiveTimesHeard = 0;
      return note;
    } else {
      return "";
    }
  }
}

const tuningDictionary: TuningDictionary = {
  Standard: ["E2", "A2", "D3", "G3", "B3", "E4"],
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
  const [frequency, setFrequency] = useState(0);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const sampler = useRef(new Tone.Sampler());
  const mic = useRef(new Tone.UserMedia());
  const pitchTracker = useRef(new TuningResult(0.7));
  const confirmationPlayer = useRef(
    new Tone.Player("src/components/assets/confirmation.mp3").toDestination()
  );

  useEffect(() => {
    let dummyAnalyzer: any;
    Tone.getContext()
      .addAudioWorkletModule("src/components/PitchAnalysis.js")
      .then(() => {
        const analyzer = Tone.getContext().createAudioWorkletNode(
          "PitchAnalysis",
          {
            processorOptions: { sampleFrequency: 1 },
          }
        );
        analyzer.port.onmessage = (e) => {
          console.log("ayoo");
          //console.log(areFocused.indexOf(true));
          const freq = 329 + Math.random();
          setFrequency(freq);
          const note = pitchTracker.current.trackFrequency(freq);
          if (note !== "") {
            const focusedIndex = areFocused.indexOf(true);
            if (focusedIndex !== -1 && note === notes[focusedIndex]) {
              const foo = new Tone.Player(
                "src/components/assets/confirmation.mp3"
              ).toDestination();
              foo.autostart = true;
              const newAreTuned = areTuned.map((s, i) => {
                return i === focusedIndex ? true : s;
              });
              setAreTuned(newAreTuned);
            }
          }
        };
        mic.current.connect(analyzer);
        dummyAnalyzer = analyzer;
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
    return () => {
      mic.current.disconnect(dummyAnalyzer);
    };
  }, []);

  const playNoteCallback = (note: string) => {
    sampler.current.triggerAttackRelease(note, "1n");
  };

  const toggleMic = () => {
    if (isMicEnabled) {
      mic.current.close();
      setIsMicEnabled(false);
      setFrequency(0);
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
          <TuningGauge sensitivity={0.7}>{frequency}</TuningGauge>
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
          const now = Tone.now();
          tuningDictionary[e.target.value].map((note, i) => {
            sampler.current.triggerAttackRelease(note, "1n", now + i * 0.1);
          });
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
