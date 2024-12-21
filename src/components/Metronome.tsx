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
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState(["high", "low", "low", "low"]);
  const isTapInitiated = useRef(false);
  const prevTapTime = useRef(Date.now());
  const interval = useRef(setInterval(() => {}, 1000));

  const onTapClick = () => {
    if (isTapInitiated.current) {
      const clickTime = Date.now();
      prevTapTime.current = clickTime;
      setBpm(Math.round((60 / (clickTime - prevTapTime.current)) * 1000));
    } else {
      isTapInitiated.current = true;
    }
  };

  const synth = useRef(new Tone.Synth().toDestination());
  const onPlayClick = () => {
    if (isPlaying) {
      //clearInterval(interval.current);
      setIsPlaying(false);
    } else {
      // interval.current = setInterval(() => {
      //   synth.current.triggerAttackRelease("C4", "8n");
      // }, 60000 / bpm);
      synth.current.triggerAttackRelease("C4", "8n");
      setIsPlaying(true);
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
        min="30"
        max="300"
        value={bpm}
        id="myRange"
        onChange={(e) => {
          setBpm(Number(e.target.value));
        }}
      ></input>
      <button onClick={onPlayClick}>{isPlaying ? "stop" : "play"}</button>
      <button onClick={onTapClick}>tap</button>
    </>
  );
};

export default Metronome;
