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

const peg_positions = [
  { y: 64.496, x: 7.003, isMirrored: false },
  { y: 39.945, x: 7.003, isMirrored: false },
  { y: 15.394, x: 7.003, isMirrored: false },
  { y: 15.394, x: 61.967, isMirrored: true },
  { y: 39.945, x: 61.967, isMirrored: true },
  { y: 64.496, x: 61.967, isMirrored: true },
];

interface Props {
  tuning: string[];
}

const Tuner = ({ tuning }: Props) => {
  const [tuningState, setTuningState] = useState(
    tuning.map((n) => {
      return { note: n, isFocused: false, isTuned: false };
    })
  );
  useEffect(() => {
    const now = Tone.now();
    setTuningState(
      tuning.map((n, i) => {
        sampler.current.triggerAttackRelease(n, "1n", now + i * 0.1);
        return { note: n, isFocused: false, isTuned: false };
      })
    );
    //tuningStateRef.current = newTuningState;
    focusedIndex.current = -1;
  }, [tuning]);

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
    <div className="tuner">
      <svg
        width="100%"
        height="auto"
        className="headstock"
        viewBox="0 0 80 100"
      >
        <g>
          <path d="m 32.397846,1.189153 c -4.738905,4.8812164 -9.591365,7.7704085 -14.557967,8.6669579 4.529708,28.2641671 4.047955,50.1251031 2.86005,71.0834331 7.044778,8.657123 5.020004,11.925133 7.278644,17.890054 H 40 52.021428 C 54.280069,92.864681 52.255295,89.596669 59.300072,80.939544 58.112167,59.981214 57.630413,38.120278 62.160121,9.8561109 57.193518,8.9595615 52.341062,6.0703673 47.602155,1.189153 c -5.272067,1.2942631 -9.927973,1.2954338 -15.204309,0 z" />
        </g>
        {tuningState.map((note, index) => (
          <TuningButton
            key={index}
            x={peg_positions[index].x}
            y={peg_positions[index].y}
            isMirrored={peg_positions[index].isMirrored}
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
              focusedIndex.current = index;
              tuningStateRef.current = newTuningState;
            }}
            isTuned={note.isTuned}
          >
            {note.note}
          </TuningButton>
        ))}
      </svg>
    </div>
    // <div
    //   className="tuner"
    //   style={{
    //     position: "relative",
    //     margin: "auto",
    //     height: "800px",
    //     width: "800px",
    //   }}
    // >
    //   <img className="guitar-head" src={head} alt="" width="100%"></img>
    //   <button
    //     onClick={() => toggleMic()}
    //     style={{
    //       position: "absolute",
    //       borderRadius: "50%",
    //       top: "30%",
    //       left: "45%",
    //       background: isMicEnabled ? "red" : "green",
    //     }}
    //   >
    //     {isMicEnabled ? (
    //       <img className="mic-icon" src={micOff} alt="" width="150"></img>
    //     ) : (
    //       <img className="mic-icon" src={micOn} alt="" width="150"></img>
    //     )}
    //   </button>
    //   <div style={{ position: "absolute", top: "50%", left: "45%" }}>
    //     <TuningGauge sensitivity={0.7}>{frequency}</TuningGauge>
    //   </div>
    //   {tuningState.map((note, index) => (
    //     <div
    //       key={tuning + index} //TODO: review this
    //       style={{
    //         position: "absolute",
    //         top: peg_positions[index].top,
    //         left: peg_positions[index].left,
    //         transform: peg_positions[index].transform,
    //         // backgroundColor: note.isFocused ? "green" : "red",
    //       }}
    //     >
    //       <TuningButton
    //         playNoteCallback={(note: string) => {
    //           playNoteCallback(note);
    //           const newTuningState = tuningState.map((n, i) => {
    //             return i === index
    //               ? { note: n.note, isFocused: true, isTuned: n.isTuned }
    //               : { note: n.note, isFocused: false, isTuned: n.isTuned };
    //           });
    //           setTuningState(newTuningState);
    //           focusedIndex.current = index;
    //           tuningStateRef.current = newTuningState;
    //         }}
    //         changeNoteCallback={(newNote: string) => {
    //           const newTuningState = tuningState.map((n, i) => {
    //             if (i === index) {
    //               return {
    //                 note: newNote,
    //                 isFocused: true,
    //                 isTuned: false,
    //               };
    //             } else {
    //               return {
    //                 note: n.note,
    //                 isFocused: false,
    //                 isTuned: n.isTuned,
    //               };
    //             }
    //           });
    //           setTuningState(newTuningState);
    //           setTuning("Custom");
    //           focusedIndex.current = index;
    //           tuningStateRef.current = newTuningState;
    //         }}
    //         isTuned={note.isTuned}
    //       >
    //         {note.note}
    //       </TuningButton>
    //     </div>
    //   ))}
    // </div>
  );
};

export default Tuner;
