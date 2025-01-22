import React, { useEffect, useRef, useState } from "react";
import head from "./assets/guitar-head.svg";
import TuningButton from "./TuningButton";
import * as Tone from "tone";
import TuningGauge from "./TuningGauge";
import micOn from "./assets/mic-on.svg";
import micOff from "./assets/mic-off.svg";
import "./Tuner.css";

type TuningDictionary = {
  [key: string]: string[];
};

class TuningResult {
  heardNote: string;
  consecutiveTimesHeard: number;
  sensitivity: number;
  isActive: boolean;

  constructor(s: number) {
    if (s >= 0.95) {
      throw new Error("Highest allowable sensitivity is 0.95");
    }
    this.heardNote = "";
    this.consecutiveTimesHeard = 0;
    this.sensitivity = s;
    this.isActive = true;
  }

  trackFrequency(frequency: number) {
    if (this.isActive) {
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
        this.isActive = false;
        setTimeout(() => {
          this.isActive = true;
        }, 3000);
        this.consecutiveTimesHeard = 0;
        return note;
      } else {
        return "";
      }
    }
  }
}

const tuningDictionary: TuningDictionary = {
  Standard: ["E2", "A2", "D3", "G3", "B3", "E4"],
  "Drop D": ["D2", "A2", "D3", "G3", "B3", "E4"],
  DADGAD: ["D2", "A2", "D3", "G3", "A3", "D4"],
  "Half step down": ["D#2", "G#2", "C#3", "F#3", "A#3", "D#4"],
  "Full step down": ["D2", "G2", "C3", "F3", "A3", "D4"],
  "Drop D half step down": ["C#2", "G#2", "C#3", "F#3", "A#3", "D#4"],
  "Drop D full step down": ["C2", "G2", "C3", "F3", "A3", "D4"],
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
  const [tuningState, setTuningState] = useState(
    tuningDictionary["Standard"].map((n) => {
      return { note: n, isFocused: false, isTuned: false };
    })
  );

  const [tuning, setTuning] = useState("Standard");
  const [frequency, setFrequency] = useState(0);
  const [isMicEnabled, setIsMicEnabled] = useState(false);

  const sampler = useRef(new Tone.Sampler());
  const mic = useRef(new Tone.UserMedia());
  const pitchTracker = useRef(new TuningResult(0.7));
  const confirmationPlayer = useRef(
    new Tone.Player(
      "src/components/tuner/assets/confirmation.mp3"
    ).toDestination()
  );

  useEffect(() => {
    sampler.current = new Tone.Sampler({
      urls: {
        E2: "acoustic-guitar-e2.wav",
        A2: "acoustic-guitar-a2.wav",
        D3: "acoustic-guitar-d3.wav",
        G3: "acoustic-guitar-g3.wav",
        B3: "acoustic-guitar-b3.wav",
        E4: "acoustic-guitar-e4.wav",
      },
      baseUrl: "src/components/tuner/assets/",
    }).toDestination();
  }, [sampler]);

  //TODO: kinda sucks to have to do this due to scope closure on state reference... there should be a better way
  const focusedIndex = useRef(-1);
  const tuningStateRef = useRef(tuningState);
  const processPitch = (e: MessageEvent) => {
    const freq = e.data.frequency !== null ? e.data.frequency : 0;
    setFrequency(freq);
    const note = pitchTracker.current.trackFrequency(freq);
    if (note !== "") {
      if (
        focusedIndex.current !== -1 &&
        note === tuningStateRef.current[focusedIndex.current].note
      ) {
        const confSound = new Tone.Player(
          "src/components/tuner/assets/confirmation.mp3"
        ).toDestination();
        confSound.autostart = true;
        const newTuningState = tuningStateRef.current.map((n, i) => {
          return i === focusedIndex.current
            ? { note: n.note, isTuned: true, isFocused: n.isFocused }
            : n;
        });
        setTuningState(newTuningState);
      }
    }
  };

  useEffect(() => {
    Tone.getContext()
      .addAudioWorkletModule("src/components/tuner/PitchAnalysis.js")
      .then(() => {
        const analyzer = Tone.getContext().createAudioWorkletNode(
          "PitchAnalysis",
          {
            processorOptions: { sampleFrequency: 3, confidence: 0.9 },
          }
        );
        analyzer.port.onmessage = processPitch;
        Tone.disconnect(mic.current); //TODO: Find better way than this to fix issue where audioworklet resolves promise later asynchronously
        mic.current.connect(analyzer);
      });
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
      Tone.start();
      mic.current.open();
      setIsMicEnabled(true);
    }
  };
  return (
    <div
      className="tuner"
      style={{ position: "relative", margin: "auto", width: "800px" }}
    >
      <img className="guitar-head" src={head} alt="" width="100%"></img>
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
      {tuningState.map((note, index) => (
        <div
          key={tuning + index} //TODO: review this
          style={{
            position: "absolute",
            top: peg_positions[index].top,
            left: peg_positions[index].left,
            transform: peg_positions[index].transform,
            // backgroundColor: note.isFocused ? "green" : "red",
          }}
        >
          <TuningButton
            playNoteCallback={(note: string) => {
              playNoteCallback(note);
              const newTuningState = tuningState.map((n, i) => {
                return i === index
                  ? { note: n.note, isFocused: true, isTuned: n.isTuned }
                  : { note: n.note, isFocused: false, isTuned: n.isTuned };
              });
              setTuningState(newTuningState);
              focusedIndex.current = index;
              tuningStateRef.current = newTuningState;
            }}
            changeNoteCallback={(newNote: string) => {
              const newTuningState = tuningState.map((n, i) => {
                if (i === index) {
                  return {
                    note: newNote,
                    isFocused: true,
                    isTuned: false,
                  };
                } else {
                  return {
                    note: n.note,
                    isFocused: false,
                    isTuned: n.isTuned,
                  };
                }
              });
              setTuningState(newTuningState);
              setTuning("Custom");
              focusedIndex.current = index;
              tuningStateRef.current = newTuningState;
            }}
            isTuned={note.isTuned}
          >
            {note.note}
          </TuningButton>
        </div>
      ))}
    </div>
  );
};

{
  /* <select
        name="Tuning"
        id="tuning"
        onChange={(e) => {
          const now = Tone.now();
          const newTuningState = tuningState.map((n, i) => {
            sampler.current.triggerAttackRelease(
              tuningDictionary[e.target.value][i],
              "1n",
              now + i * 0.1
            );
            return {
              note: tuningDictionary[e.target.value][i],
              isFocused: false,
              isTuned: false,
            };
          });
          setTuning(e.target.value);
          setTuningState(newTuningState);
          tuningStateRef.current = newTuningState;
          focusedIndex.current = -1;
        }}
      >
        {Object.keys(tuningDictionary).map((key) => (
          <option value={key} key={key}>
            {key}
          </option>
        ))}
      </select> */
}

export default Tuner;
