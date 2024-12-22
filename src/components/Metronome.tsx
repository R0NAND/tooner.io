import React, { useRef, useState } from "react";
import * as Tone from "tone";

// interface Props {
//   children: string;
//   isTuned: boolean;
//   playNoteCallback: (note: string) => void;
//   changeNoteCallback: (newNote: string) => void;
// }

type TimeSignatureDictionary = {
  [key: string]: string[];
};

const timeSignatureDictionary: TimeSignatureDictionary = {
  "4/4": ["high", "low", "low", "low"],
  "3/4": ["high", "low", "low"],
  "2/4": ["high", "low"],
  "5/4": ["high", "low", "low", "low", "low"],
  "7/4": ["high", "low", "low", "low", "low", "low"],
};

const Metronome = () => {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState(timeSignatureDictionary["4/4"]);
  const [beat, setBeat] = useState(-1);
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

  const onTimeSignatureSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSequence(timeSignatureDictionary[e.target.value]);
  };

  const beatRef = useRef(beat);
  const synth = useRef(new Tone.Synth().toDestination());
  const onPlayClick = () => {
    if (isPlaying) {
      Tone.getTransport().stop();
      setBeat(-1);
      beatRef.current = -1;
      setIsPlaying(false);
    } else {
      Tone.getTransport().bpm.value = bpm;
      setBeat(sequence.length - 1);
      beatRef.current = sequence.length - 1;
      const loop = new Tone.Loop((time) => {
        if (sequence[(beatRef.current + 1) % sequence.length] === "high") {
          synth.current.triggerAttackRelease("C5", "8n");
        } else {
          synth.current.triggerAttackRelease("C4", "8n");
        }
        beatRef.current = (beatRef.current + 1) % sequence.length;
        setBeat(beatRef.current);
      }, "4n").start(0);
      Tone.getTransport().start();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <h1>Metronome</h1>
      <div>
        {sequence.map((e, i) => {
          return (
            <svg
              key={i}
              height="50"
              width="50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                r="25"
                cx="25"
                cy="25"
                fill={i === beat ? "red" : "white"}
              />
            </svg>
          );
        })}
      </div>
      <div>
        <label>Time Signature</label>
        <select onChange={onTimeSignatureSelect}>
          {Object.keys(timeSignatureDictionary).map((key) => (
            <option value={key} key={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <label>BPM:</label>
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
