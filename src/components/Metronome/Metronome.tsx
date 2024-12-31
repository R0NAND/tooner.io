import { faDrum, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
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
  "4/4": ["hi", "lo", "lo", "lo"],
  "3/4": ["hi", "lo", "lo"],
  "2/4": ["hi", "lo"],
  "5/4": ["hi", "lo", "lo", "lo", "lo"],
  "7/4": ["hi", "lo", "lo", "lo", "lo", "lo"],
};

const loop = new Tone.Loop();
const player = new Tone.Players({
  urls: {
    hi: "Metronome-hi.wav",
    lo: "Metronome-lo.wav",
  },
  baseUrl: "src/components/Metronome/assets/",
}).toDestination();

const Metronome = () => {
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState(timeSignatureDictionary["4/4"]);
  const [beat, setBeat] = useState(-1);
  const isTapInitiated = useRef(false);
  const prevTapTime = useRef(Date.now());

  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    if (isPlaying) {
      setBeat(sequence.length - 1);
      beatRef.current = sequence.length - 1;
    } else {
      setBeat(-1);
      beatRef.current = -1;
    }
    loop.callback = (time) => {
      player
        .player(sequence[(beatRef.current + 1) % sequence.length])
        .start(time, 0);
      beatRef.current = (beatRef.current + 1) % sequence.length;
      setBeat(beatRef.current);
    };
    loop.interval = "4n";
  }, [sequence]);

  const onTapClick = () => {
    if (isTapInitiated.current) {
      const clickTime = Date.now();
      setBpm(Math.round((60 / (clickTime - prevTapTime.current)) * 1000));
      prevTapTime.current = clickTime;
    } else {
      isTapInitiated.current = true;
    }
  };

  const onTimeSignatureSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSequence(timeSignatureDictionary[e.target.value]);
  };

  const beatRef = useRef(beat);
  const onPlayClick = () => {
    if (isPlaying) {
      Tone.getTransport().stop();
      setBeat(-1);
      beatRef.current = -1;
      setIsPlaying(false);
    } else {
      loop.start(0);
      Tone.getTransport().start();
      setIsPlaying(true);
    }
  };

  return (
    <>
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
                fill={i === beat ? "green" : "red"}
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
      <button onClick={onPlayClick}>
        {isPlaying ? (
          <FontAwesomeIcon icon={faStop} />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
      </button>
      <button onClick={onTapClick}>
        <FontAwesomeIcon icon={faDrum} />
      </button>
    </>
  );
};

export default Metronome;
