import React, { useEffect, useRef, useState } from "react";
import head from "./assets/guitar-head.svg";
import TuningButton from "./TuningButton";
import * as Tone from "tone";

const tuningDictionary = {
  Standard: {
    notes: [
      { note: "E2" },
      { note: "A2" },
      { note: "D3" },
      { note: "G3" },
      { note: "B3" },
      { note: "E4" },
    ],
  },
  "Drop D": {
    notes: [
      { note: "D2" },
      { note: "A2" },
      { note: "D3" },
      { note: "G3" },
      { note: "B3" },
      { note: "E4" },
    ],
  },
  DADGAD: {
    notes: [
      { note: "D2" },
      { note: "A2" },
      { note: "D3" },
      { note: "G3" },
      { note: "A3" },
      { note: "D4" },
    ],
  },
  "Half step down": {
    notes: [
      { note: "D#2" },
      { note: "G#2" },
      { note: "C#3" },
      { note: "F#3" },
      { note: "A#3" },
      { note: "D#4" },
    ],
  },
  "Full step down": {
    notes: [
      { note: "D2" },
      { note: "G2" },
      { note: "C3" },
      { note: "F3" },
      { note: "A3" },
      { note: "D4" },
    ],
  },
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
  const [tuning, setNotes] = useState("Standard");
  const [pitch, setPitch] = useState(0);

  const sampler = useRef(new Tone.Sampler());

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        //@ts-ignore
        window.localStream = stream; // A
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        context.audioWorklet
          .addModule("src/components/PitchAnalysis.js")
          .then(() => {
            let pitchAnalyzer = new AudioWorkletNode(context, "PitchAnalysis");
            source.connect(pitchAnalyzer);
            pitchAnalyzer.port.onmessage = (e) => {
              setPitch(Math.round(e.data.frequency));
            };
          });
        Tone.setContext(context);
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
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`);
      });
  }, []);
  return (
    <>
      <div style={{ position: "relative" }}>
        <img className="guitar-head" src={head} alt="" width="800"></img>
        <h1
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            margin: "auto",
          }}
        >
          {pitch < 1000 && pitch > 30 ? Tone.Frequency(pitch).toNote() : ""}
        </h1>
        {
          //@ts-ignore
          tuningDictionary[tuning].notes.map((n, index) => (
            <div
              key={tuning + index}
              style={{
                position: "absolute",
                top: peg_positions[index].top,
                left: peg_positions[index].left,
                transform: peg_positions[index].transform,
              }}
            >
              <TuningButton
                onClick={(e) => {
                  //@ts-ignore
                  sampler.current.triggerAttackRelease(
                    //@ts-ignore
                    e.target.innerHTML,
                    "1n"
                  );
                }}
              >
                {n.note}
              </TuningButton>
            </div>
          ))
        }
      </div>
      <select
        name="Tuning"
        id="tuning"
        onChange={(e) => {
          //@ts-ignore
          setNotes(e.target.value);
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
