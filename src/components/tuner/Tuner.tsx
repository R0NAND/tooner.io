import React, { useEffect, useRef, useState } from "react";
import TuningButton from "./TuningButton";
import * as Tone from "tone";
import TuningGauge from "./TuningGauge";
import MicOn from "./assets/mic-on.svg?react";
import MicOff from "./assets/mic-off.svg?react";
import GuitarHeadstock from "./assets/guitar-headstock.svg?react";
import UkuleleHeadstock from "./assets/ukulele-headstock.svg?react";
import BassHeadstock from "./assets/bass-headstock.svg?react";
import guitarTransforms from "./transforms/guitar.json";
import bassTransforms from "./transforms/bass.json";
import ukuleleTransforms from "./transforms/ukulele.json";
import eightStringTransforms from "./transforms/eight-string.json";
import "./Tuner.css";

export enum InstrumentEnum {
  guitar = "guitar",
  bass = "bass",
  ukulele = "ukulele",
  eigthString = "8-String",
}

class TuningResult {
  heardNote: string;
  consecutiveTimesHeard: number;
  sensitivity: number;
  isActive: boolean;

  constructor(s: number) {
    if (s >= 0.95) {
      throw new Error("Highest allowable sensitivity is 0.95");
    }
    this.heardNote = "";
    this.consecutiveTimesHeard = 0;
    this.sensitivity = s;
    this.isActive = true;
  }

  trackFrequency(frequency: number) {
    if (this.isActive) {
      let note = frequency === 0 ? "" : Tone.Frequency(frequency).toNote();
      let target = Tone.Frequency(note).toFrequency();
      let lower_bound = target / 1.02930223664; // 24th root of 2
      let upper_bound = target * 1.02930223664; // 24th root of 2
      let tolerance = 1 - this.sensitivity;

      let fraction = 1;
      if (frequency < target) {
        fraction = (target - frequency) / (target - lower_bound);
      } else {
        fraction = (frequency - target) / (upper_bound - target);
      }

      if (fraction <= tolerance && note === this.heardNote) {
        this.consecutiveTimesHeard += 1;
      } else {
        this.consecutiveTimesHeard = 0;
      }
      this.heardNote = note;

      if (this.consecutiveTimesHeard === 3) {
        this.isActive = false;
        setTimeout(() => {
          this.isActive = true;
        }, 3000);
        this.consecutiveTimesHeard = 0;
        return note;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
}

interface Props {
  instrument: InstrumentEnum;
  tuning: string[];
  onNoteChange: (index: number, newNote: string) => void;
}

const Tuner = ({ instrument, tuning, onNoteChange }: Props) => {
  const guitarSampler = useRef(
    new Tone.Sampler({
      urls: {
        E2: "acoustic-guitar-e2.wav",
        A2: "acoustic-guitar-a2.wav",
        D3: "acoustic-guitar-d3.wav",
        G3: "acoustic-guitar-g3.wav",
        B3: "acoustic-guitar-b3.wav",
        E4: "acoustic-guitar-e4.wav",
      },
      baseUrl: "src/components/tuner/assets/",
    }).toDestination()
  );
  const confirmationPlayer = useRef(
    new Tone.Player(
      "src/components/tuner/assets/confirmation.mp3"
    ).toDestination()
  );

  const [tuningState, setTuningState] = useState(
    tuning.map((n) => {
      return { note: n, isFocused: false, isTuned: false };
    })
  );

  const noteChangeRef = useRef(""); // flags that tuning was changed via peg adjustment... no need to playback all notes
  useEffect(() => {
    const now = Tone.now();
    const newTuningState = tuning.map((n, i) => {
      return { note: n, isFocused: false, isTuned: false };
    });
    setTuningState(newTuningState);
    tuningStateRef.current = newTuningState;
    focusedIndex.current = -1;
    if (guitarSampler.current.loaded) {
      if (noteChangeRef.current === "") {
        newTuningState.forEach((element, i) => {
          guitarSampler.current.triggerAttackRelease(
            element.note,
            "1n",
            now + i * 0.1
          );
        });
      } else {
        guitarSampler.current.triggerAttackRelease(noteChangeRef.current, "1n");
        noteChangeRef.current = "";
      }
    }
  }, [tuning, instrument]);

  const [transforms, setTransforms] =
    useState<typeof guitarTransforms>(guitarTransforms);
  useEffect(() => {
    switch (instrument) {
      case InstrumentEnum.guitar:
        setTransforms(guitarTransforms);
        break;
      case InstrumentEnum.bass:
        setTransforms(bassTransforms);
        break;
      case InstrumentEnum.ukulele:
        setTransforms(ukuleleTransforms);
        break;
      // case InstrumentEnum.eigthString:
      //   setTransform(eightStringTransforms);
      //   break;
    }
  }, [instrument]);

  const [frequency, setFrequency] = useState(0);
  const [isMicEnabled, setIsMicEnabled] = useState(false);

  const mic = useRef(new Tone.UserMedia());
  const pitchTracker = useRef(new TuningResult(0.7));

  //TODO: kinda sucks to have to do this due to scope closure on state reference... there should be a better way
  const focusedIndex = useRef(-1);
  const tuningStateRef = useRef(tuningState);
  const processPitch = (e: MessageEvent) => {
    const freq = e.data.frequency !== null ? e.data.frequency : 0;
    setFrequency(freq);
    const note = pitchTracker.current.trackFrequency(freq);
    if (note !== "") {
      if (tuning.filter((n) => n === note)) {
        const confSound = new Tone.Player(
          "src/components/tuner/assets/confirmation.mp3"
        ).toDestination();
        confSound.autostart = true;
        const noteIndex = tuningStateRef.current.findIndex(
          (n) => n.note === note && n.isTuned === false
        );
        if (noteIndex !== -1) {
          const newTuningState = tuningStateRef.current.map((n, i) => {
            return i === noteIndex
              ? { note: n.note, isTuned: true, isFocused: n.isFocused }
              : n;
          });
          tuningStateRef.current = newTuningState;
          setTuningState(newTuningState);
        }
      }
    }
  };

  useEffect(() => {
    Tone.getContext()
      .addAudioWorkletModule("src/components/tuner/PitchAnalysis.js")
      .then(() => {
        const analyzer = Tone.getContext().createAudioWorkletNode(
          "PitchAnalysis",
          {
            processorOptions: { sampleFrequency: 3, confidence: 0.9 },
          }
        );
        analyzer.port.onmessage = processPitch;
        Tone.disconnect(mic.current); //TODO: Find better way than this to fix issue where audioworklet resolves promise later asynchronously
        mic.current.connect(analyzer);
      });
  }, []);

  const playNoteCallback = (noteIndex: number, note: string) => {
    const newTuningState = tuningState.map((n, i) => {
      return i === noteIndex
        ? { note: n.note, isFocused: true, isTuned: n.isTuned }
        : { note: n.note, isFocused: false, isTuned: n.isTuned };
    });
    setTuningState(newTuningState);
    focusedIndex.current = noteIndex;
    tuningStateRef.current = newTuningState;
    guitarSampler.current.triggerAttackRelease(note, "1n");
  };

  const toggleMic = () => {
    if (isMicEnabled) {
      mic.current.close();
      setIsMicEnabled(false);
      setFrequency(0);
    } else {
      Tone.start();
      mic.current.open();
      setIsMicEnabled(true);
    }
  };

  const renderHeadstock = () => {
    switch (instrument) {
      case InstrumentEnum.guitar:
        return <GuitarHeadstock className="bass-head"></GuitarHeadstock>;
        break;
      case InstrumentEnum.bass:
        return <BassHeadstock className="bass-head"></BassHeadstock>;
        break;
      case InstrumentEnum.ukulele:
        return <UkuleleHeadstock className="bass-head"></UkuleleHeadstock>;
        break;
      case InstrumentEnum.eigthString:
        return <GuitarHeadstock className="bass-head"></GuitarHeadstock>;
        break;
    }
  };

  return (
    <div className="tuner">
      <svg
        version="1.1"
        width="100%"
        height="auto"
        className="headstock"
        viewBox="0 0 80 100"
      >
        <g>
          {renderHeadstock()}
          <circle
            className="mic-button"
            cx={transforms.mic.x}
            cy={transforms.mic.y}
            r={transforms.mic.r}
            onClick={() => {
              toggleMic();
            }}
          ></circle>
          {isMicEnabled ? (
            <MicOff
              x={transforms.mic.x - transforms.mic.r * 0.75}
              y={transforms.mic.y - transforms.mic.r * 0.75}
              height={transforms.mic.r * 2 * 0.75}
              preserveAspectRatio="xMinYMin"
              className="mic-button-icon"
            ></MicOff>
          ) : (
            <MicOn
              x={transforms.mic.x - transforms.mic.r * 0.75}
              y={transforms.mic.y - transforms.mic.r * 0.75}
              height={transforms.mic.r * 2 * 0.75}
              preserveAspectRatio="xMinYMin"
              className="mic-button-icon"
            ></MicOn>
          )}
        </g>
        {tuningState.map((note, index) => (
          <TuningButton
            key={index}
            i={index}
            instrument={instrument}
            isFocused={note.isFocused}
            isTuned={note.isTuned}
            playNoteCallback={(note: string) => {
              playNoteCallback(index, note);
            }}
            onNoteChange={(index, note) => {
              onNoteChange(index, note);
              noteChangeRef.current = note;
            }}
          >
            {note.note}
          </TuningButton>
        ))}
        <TuningGauge x={40} y={60} width={20} cents={5}>
          {frequency}
        </TuningGauge>
      </svg>
    </div>
  );
};

export default Tuner;
