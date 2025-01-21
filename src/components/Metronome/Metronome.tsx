import {
  faAdd,
  faDrum,
  faFastBackward,
  faFastForward,
  faPlay,
  faStop,
  faSubtract,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QuarterNote from "./QuarterNote";
import Slider from "./Slider";
import { useEffect, useRef, useState } from "react";
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
  const defaultBeats = 4;
  const [bpm, setBpm] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beats, setBeats] = useState(Array.from(Array(defaultBeats).keys()));
  const [beat, setBeat] = useState(-1);
  const [beatValues, setBeatValues] = useState<boolean[]>(
    Array(defaultBeats).fill(false)
  );
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
        className={"metronome-base-button"}
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
      >
        <FontAwesomeIcon icon={isPlaying ? faStop : faPlay} />
      </button>
      <div className="metronome-note-flex">
        <button
          className="metronome-base-button"
          disabled={beats.length <= 1}
          onClick={() => {
            setBeats(Array.from(Array(beats.length - 1).keys()));
            setBeatValues(Array(beats.length - 1).fill(false));
          }}
        >
          <FontAwesomeIcon icon={faSubtract}></FontAwesomeIcon>
        </button>
        {beatValues.map((n, i) => {
          return (
            <QuarterNote
              key={i}
              styleClass={n ? "metronome-note-active" : "metronome-note"}
            ></QuarterNote>
          );
        })}
        <button
          className="metronome-base-button"
          disabled={beats.length >= 10}
          onClick={() => {
            setBeats(Array.from(Array(beats.length + 1).keys()));
            setBeatValues(Array(beats.length + 1).fill(false));
          }}
        >
          <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
        </button>
      </div>
      <button className="metronome-base-button" onClick={onTapClick}>
        <FontAwesomeIcon icon={faDrum} />
      </button>
      <div style={{ display: "flex" }}>
        <button
          className="metronome-base-button"
          onClick={() => {
            setBpm(Math.max(minBpm, bpm - 1));
          }}
        >
          <FontAwesomeIcon icon={faFastBackward}></FontAwesomeIcon>
        </button>
        <Slider
          width={"15em"}
          min={minBpm}
          max={maxBpm}
          value={bpm}
          onChange={(bpm: number) => {
            setBpm(Math.round(bpm));
          }}
        ></Slider>
        <button
          className="metronome-base-button"
          onClick={() => {
            setBpm(Math.min(maxBpm, bpm + 1));
          }}
        >
          <FontAwesomeIcon icon={faFastForward}></FontAwesomeIcon>
        </button>
      </div>
    </div>
  );
};

export default Metronome;
