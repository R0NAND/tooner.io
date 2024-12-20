import React, { useRef, useState } from "react";
import * as Tone from "tone";

// interface Props {
//   children: string;
//   isTuned: boolean;
//   playNoteCallback: (note: string) => void;
//   changeNoteCallback: (newNote: string) => void;
// }

const Metronome = () => {
  const [bpm, setBpm] = useState(100);
  const isTapInitiated = useRef(false);
  const prevTapTime = useRef(Date.now());

  const onTapClick = () => {
    if (isTapInitiated.current) {
      const clickTime = Date.now();
      prevTapTime.current = clickTime;
      setBpm(Math.round((60 / (clickTime - prevTapTime.current)) * 1000));
    } else {
      isTapInitiated.current = true;
    }
  };

  return (
    <>
      <h1>Metronome</h1>
      <h3>BPM:</h3>
      <input
        value={bpm}
        name="myInput"
        onChange={(e) => {
          setBpm(Number(e.target.value));
        }}
      />
      <input
        type="range"
        min="1"
        max="100"
        value={bpm}
        id="myRange"
        onChange={(e) => {
          setBpm(Number(e.target.value));
        }}
      ></input>
      <button>play</button>
      <button onClick={onTapClick}>tap</button>
    </>
  );
};

export default Metronome;
