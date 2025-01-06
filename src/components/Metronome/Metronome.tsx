import {
  faDrum,
  faMinus,
  faPlay,
  faPlus,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import "./Metronome.css";

const player = new Tone.Players({
  urls: {
    hi: "Metronome-hi.wav",
    lo: "Metronome-lo.wav",
  },
  baseUrl: "src/components/Metronome/assets/",
}).toDestination();

const Metronome = () => {
  const minBpm = 30;
  const maxBpm = 300;
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beats, setBeats] = useState(Array.from(Array(4).keys()));
  const [beat, setBeat] = useState(-1);
  const sequencer = useRef<Tone.Sequence | null>(null);

  const prevTapTime = useRef(Date.now());
  const tapTimeQueue = useRef<number[]>([]);

  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    if (isPlaying) {
      sequencer.current?.dispose();
      sequencer.current = new Tone.Sequence(
        (time, beat) => {
          player.player(beat === 0 ? "hi" : "lo").start(time);
          setBeat(beat);
        },
        beats,
        "4n"
      ).start(0);
      Tone.getTransport().start();
    } else {
      Tone.getTransport().stop();
      setBeat(-1);
      setIsPlaying(false);
    }
  }, [isPlaying, beats]);

  const onTapClick = () => {
    const clickTime = Date.now();
    if (clickTime - prevTapTime.current > 2000) {
      prevTapTime.current = clickTime;
      tapTimeQueue.current = [];
      return;
    }
    if (tapTimeQueue.current.length >= 4) {
      tapTimeQueue.current.shift();
    }
    tapTimeQueue.current.push(clickTime - prevTapTime.current);
    const averageTime =
      tapTimeQueue.current.reduce((a, b) => a + b, 0) /
      tapTimeQueue.current.length;
    const tappedBpm = Math.round(60000 / averageTime);
    setBpm(Math.min(maxBpm, Math.max(minBpm, tappedBpm)));
    prevTapTime.current = clickTime;
  };

  return (
    <>
      <h3>Metronome</h3>
      <div>
        {beats.map((e, i) => {
          return (
            <button
              key={i}
              style={{
                height: i === beat ? 50 : 40,
                width: i === beat ? 50 : 40,
                backgroundColor: i === beat ? "red" : "green",
              }}
            />
          );
        })}
      </div>
      <div>
        <label>Beats Per Measure</label>
        <select
          defaultValue={4}
          onChange={(e) => {
            setBeats(Array.from(Array(Number(e.target.value)).keys()));
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((key) => (
            <option value={key} key={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
      <h3>{bpm}bpm</h3>
      {/* <input
          value={bpm}
          type="number"
          maxLength={3}
          size={3}
          onChange={(e) => {
            setBpm(Number(e.target.value));
          }}
          onBlur={(e) => {
            const inputBpm = Math.min(
              maxBpm,
              Math.max(minBpm, Number(e.target.value))
            );
            setBpm(Number(inputBpm));
          }}
        /> */}
      <button
        onClick={() => {
          setBpm(Math.max(minBpm, bpm - 1));
        }}
      >
        <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
      </button>
      <input
        type="range"
        value={bpm}
        min={minBpm}
        max={maxBpm}
        id="myRange"
        onChange={(e) => {
          setBpm(Number(e.target.value));
        }}
      ></input>
      <button
        onClick={() => {
          setBpm(Math.min(maxBpm, bpm + 1));
        }}
      >
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </button>
      <div>
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying ? (
            <FontAwesomeIcon icon={faStop} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )}
        </button>
        <button onClick={onTapClick}>
          <FontAwesomeIcon icon={faDrum} />
        </button>
      </div>
    </>
  );
};

export default Metronome;
