import { faDrum, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import "./Metronome.css";

// interface Props {
//   children: string;
//   isTuned: boolean;
//   playNoteCallback: (note: string) => void;
//   changeNoteCallback: (newNote: string) => void;
// }

type TimeSignatureDictionary = {
  [key: string]: number[];
};

const timeSignatureDictionary: TimeSignatureDictionary = {
  "4/4": Array.from([0, 1, 2, 3]),
  "3/4": Array.from([0, 1, 2]),
  "2/4": Array.from([0, 1]),
  "5/4": Array.from([0, 1, 2, 3, 4]),
  "6/4": Array.from([0, 1, 2, 3, 4, 5]),
  "7/4": Array.from([0, 1, 2, 3, 4, 6, 6]),
};

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
  const sequencer = useRef<Tone.Sequence | null>(null);
  const isTapInitiated = useRef(false);
  const prevTapTime = useRef(Date.now());

  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  // useEffect(() => {
  //   sequencer.current = new Tone.Sequence((time, beat) => {
  //     player.player(beat === 0 ? "hi" : "lo").start(time);
  //     setBeat(beat);
  //   }, sequence).start(0);
  // }, sequence);

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

  const onPlayClick = () => {
    if (isPlaying) {
      Tone.getTransport().stop();
      sequencer.current?.dispose();
      setBeat(-1);
      setIsPlaying(false);
    } else {
      sequencer.current = new Tone.Sequence((time, beat) => {
        player.player(beat === 0 ? "hi" : "lo").start(time);
        setBeat(beat);
      }, sequence).start(0);
      Tone.getTransport().start();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div>
        {sequence.map((e, i) => {
          return (
            <button
              key={i}
              style={{
                height: i === beat ? 50 : 40,
                width: i === beat ? 50 : 40,
                backgroundColor: i === beat ? "#555555" : "#111111",
              }}
            >
              {/* {beat} */}
            </button>
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
