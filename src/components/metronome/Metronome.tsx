import {
  faCaretDown,
  faCaretUp,
  faDrum,
  faPlay,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QuarterNote from "./assets/quater-note.svg?react";
import Slider from "../slider/Slider";
import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import metronomeHi from "./assets/metronome-hi.wav";
import metronomeLo from "./assets/metronome-lo.wav";
import "./Metronome.css";

const Metronome = () => {
  const minBpm = 30;
  const maxBpm = 300;
  const defaultBeats = 4;
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beats, setBeats] = useState(Array.from(Array(defaultBeats).keys()));
  const [beat, setBeat] = useState(-1);
  const [beatValues, setBeatValues] = useState<boolean[]>(
    Array(defaultBeats).fill(false)
  );
  const sequencer = useRef<Tone.Sequence | null>(null);
  const player = useRef<Tone.Players | null>(null);

  const prevTapTime = useRef(Date.now());
  const tapTimeQueue = useRef<number[]>([]);

  const playButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    player.current = new Tone.Players({
      urls: {
        hi: metronomeHi,
        lo: metronomeLo,
      },
    }).toDestination();
    return () => {
      player.current?.dispose(); // Free up resources
      player.current = null;
    };
  }, []);

  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  useEffect(() => {
    if (isPlaying) {
      sequencer.current?.dispose();
      sequencer.current = new Tone.Sequence(
        (time, beat) => {
          player.current?.player(beat === 0 ? "hi" : "lo").start(time);
          setBeatValues(
            beats.map((b) => {
              return beat === b;
            })
          );
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
      setBeat(-1);
      setBeatValues(
        beats.map((b) => {
          return beat === b;
        })
      );
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
    <div id="metronome" className="metronome">
      <button
        ref={playButton}
        className={`metronome-base-button ${isPlaying ? "red" : "green"}`}
        title={isPlaying ? "Stop metronome" : "Start metronome"}
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
      >
        <FontAwesomeIcon icon={isPlaying ? faStop : faPlay} />
      </button>
      <div className="metronome-bar-flex">
        <div className="metronome-time-sig-flex">
          <button
            className="metronome-base-button"
            disabled={beats.length >= 10}
            onClick={() => {
              setBeats(Array.from(Array(beats.length + 1).keys()));
              setBeatValues(Array(beats.length + 1).fill(false));
            }}
          >
            <FontAwesomeIcon
              style={{ transform: "translateY(0.3em)" }}
              icon={faCaretUp}
            ></FontAwesomeIcon>
          </button>
          <span>{beatValues.length}</span>
          <span>4</span>
          <button
            className="metronome-base-button"
            disabled={beats.length <= 1}
            onClick={() => {
              setBeats(Array.from(Array(beats.length - 1).keys()));
              setBeatValues(Array(beats.length - 1).fill(false));
            }}
          >
            <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
          </button>
        </div>
        <div
          className={`metronome-note-flex ${
            beatValues.length > 5 ? "metronome-note-overflow" : ""
          }`}
        >
          {beatValues.map((n, i) => {
            return (
              <QuarterNote
                key={i}
                className={n ? "metronome-note-active" : "metronome-note"}
              ></QuarterNote>
            );
          })}
        </div>
      </div>
      <button
        className="metronome-tap-button"
        title="Tap tempo"
        onClick={onTapClick}
      >
        <FontAwesomeIcon icon={faDrum} />
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Slider
          width="100%"
          min={minBpm}
          max={maxBpm}
          value={bpm}
          label="bpm"
          onChange={(bpm: number) => {
            setBpm(Math.round(bpm));
          }}
        ></Slider>
      </div>
    </div>
  );
};

export default Metronome;
