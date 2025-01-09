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
  const [hit, setHit] = useState("");
  const sequencer = useRef<Tone.Sequence | null>(null);

  const prevTapTime = useRef(Date.now());
  const tapTimeQueue = useRef<number[]>([]);

  const playButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    if (isPlaying) {
      sequencer.current?.dispose();
      sequencer.current = new Tone.Sequence(
        (time, beat) => {
          player.player(beat === 0 ? "hi" : "lo").start(time);
          beat === 0
            ? setHit("metronome-big-hit")
            : setHit("metronome-smol-hit");
          playButton.current?.classList.add(
            beat === 0 ? "metronome-big-hit" : "metronome-smol-hit"
          );
          setTimeout(() => {
            playButton.current?.classList.remove(
              beat === 0 ? "metronome-big-hit" : "metronome-smol-hit"
            );
          }, 150);
        },
        beats,
        "4n"
      ).start(0);
      Tone.getTransport().start();
    } else {
      Tone.getTransport().stop();
      setHit("");
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
      <div>
        <div
          style={{
            height: 55,
            width: 55,
            margin: "auto",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            ref={playButton}
            style={{ margin: "auto" }}
            className={
              "metronome-play-button " +
              (!isPlaying ? "metronome-play-button-dormant " : "")
            }
            onClick={() => {
              setIsPlaying(!isPlaying);
            }}
          >
            <FontAwesomeIcon fontSize={20} icon={isPlaying ? faStop : faPlay} />
          </button>
        </div>
        <div>
          <label>{bpm}bpm</label>
        </div>
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
        <div>
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
        </div>
        <div>
          <button className="metronome-tap-button" onClick={onTapClick}>
            <FontAwesomeIcon icon={faDrum} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Metronome;
