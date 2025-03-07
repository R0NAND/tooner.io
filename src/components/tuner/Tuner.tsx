import { useEffect, useRef, useState } from "react";
import TuningButton from "./TuningButton";
import * as Tone from "tone";
import TuningGauge from "./TuningGauge";
import MicOn from "./assets/mic-on.svg?react";
import MicOff from "./assets/mic-off.svg?react";
import GuitarHeadstock from "./assets/guitar-headstock.svg?react";
import UkuleleHeadstock from "./assets/ukulele-headstock.svg?react";
import BassHeadstock from "./assets/bass-headstock.svg?react";
import EightStringHeadstock from "./assets/eight-string-headstock.svg?react";
import guitarTransforms from "./transforms/guitar.json";
import bassTransforms from "./transforms/bass.json";
import ukuleleTransforms from "./transforms/ukulele.json";
import eightStringTransforms from "./transforms/eight-string.json";
import guitarE2 from "./assets/acoustic-guitar-e2.wav";
import guitarA2 from "./assets/acoustic-guitar-a2.wav";
import guitarD3 from "./assets/acoustic-guitar-d3.wav";
import guitarG3 from "./assets/acoustic-guitar-g3.wav";
import guitarB3 from "./assets/acoustic-guitar-b3.wav";
import guitarE4 from "./assets/acoustic-guitar-e4.wav";
import bassE1 from "./assets/bass-e1.wav";
import bassA1 from "./assets/bass-a1.wav";
import bassD2 from "./assets/bass-d2.wav";
import bassG2 from "./assets/bass-g2.wav";
import ukuleleG3 from "./assets/ukulele-g3.wav";
import ukuleleC4 from "./assets/ukulele-c4.wav";
import ukuleleE4 from "./assets/ukulele-e4.wav";
import ukuleleA4 from "./assets/ukulele-a4.wav";
import eguitarA2 from "./assets/electric-guitar-a2.wav";
import eguitarE2 from "./assets/electric-guitar-e2.wav";
import eguitarD3 from "./assets/electric-guitar-d3.wav";
import eguitarG3 from "./assets/electric-guitar-g3.wav";
import eguitarB3 from "./assets/electric-guitar-b3.wav";
import eguitarE4 from "./assets/electric-guitar-e4.wav";
import confirmationSound from "./assets/confirmation.mp3";
import pitchAnalysisNode from "./PitchAnalysis?worker&url";
import "./Tuner.css";

export enum InstrumentEnum {
  guitar = "guitar",
  bass = "bass",
  ukulele = "ukulele",
  eightString = "8-String",
}

interface Props {
  instrument: InstrumentEnum;
  tuning: string[];
  pitchShift: number; //in cents
  onNoteChange: (index: number, newNote: string) => void;
}

const Tuner = ({ instrument, tuning, pitchShift, onNoteChange }: Props) => {
  if (Math.abs(pitchShift) > 50) {
    throw new Error(
      "Invalid pitch shift detected. Value must be between -50 and 50 cents"
    );
  }

  const sampler = useRef(new Tone.Sampler());
  useEffect(() => {
    switch (instrument) {
      case InstrumentEnum.guitar:
        sampler.current = new Tone.Sampler({
          urls: {
            E2: guitarE2,
            A2: guitarA2,
            D3: guitarD3,
            G3: guitarG3,
            B3: guitarB3,
            E4: guitarE4,
          },
        }).toDestination();
        break;
      case InstrumentEnum.bass:
        sampler.current = new Tone.Sampler({
          urls: {
            E1: bassE1,
            A1: bassA1,
            D2: bassD2,
            G2: bassG2,
          },
        }).toDestination();
        break;
      case InstrumentEnum.ukulele:
        sampler.current = new Tone.Sampler({
          urls: {
            G3: ukuleleG3,
            C4: ukuleleC4,
            E4: ukuleleE4,
            A4: ukuleleA4,
          },
        }).toDestination();
        break;
      case InstrumentEnum.eightString:
        sampler.current = new Tone.Sampler({
          urls: {
            E2: eguitarE2,
            A2: eguitarA2,
            D3: eguitarD3,
            G3: eguitarG3,
            B3: eguitarB3,
            E4: eguitarE4,
          },
        }).toDestination();
        break;
    }
  }, [instrument]);

  const [tuningState, setTuningState] = useState(
    tuning.map((n) => {
      return { note: n, isFocused: false, isTuned: false };
    })
  );

  const noteChangeRef = useRef(""); // flags that tuning was changed via peg adjustment... no need to playback all notes
  useEffect(() => {
    const now = Tone.now();
    const newTuningState = tuning.map((n) => {
      return { note: n, isFocused: false, isTuned: false };
    });
    setTuningState(newTuningState);
    if (sampler.current.loaded) {
      if (noteChangeRef.current === "") {
        newTuningState.forEach((element, i) => {
          sampler.current.triggerAttackRelease(
            Tone.Frequency(element.note).toFrequency() *
              Math.pow(1.0005777895, pitchShift),
            "1n",
            now + i * 0.1
          );
        });
      } else {
        sampler.current.triggerAttackRelease(
          Tone.Frequency(noteChangeRef.current).toFrequency() *
            Math.pow(1.0005777895, pitchShift),
          "1n"
        );
        noteChangeRef.current = "";
      }
    }
  }, [tuning, instrument, pitchShift]);

  const [transforms, setTransforms] = useState(() => {
    switch (instrument) {
      case InstrumentEnum.guitar:
        return guitarTransforms;
      case InstrumentEnum.ukulele:
        return ukuleleTransforms;
      case InstrumentEnum.bass:
        return bassTransforms;
      case InstrumentEnum.eightString:
        return eightStringTransforms;
    }
  });

  useEffect(() => {
    switch (instrument) {
      case InstrumentEnum.guitar:
        setTransforms(guitarTransforms);
        break;
      case InstrumentEnum.ukulele:
        setTransforms(ukuleleTransforms);
        break;
      case InstrumentEnum.bass:
        setTransforms(bassTransforms);
        break;
      case InstrumentEnum.eightString:
        setTransforms(eightStringTransforms);
        break;
    }
  }, [instrument]);

  const [frequency, setFrequency] = useState(0);
  const [isMicEnabled, setIsMicEnabled] = useState(false);

  const mic = useRef(new Tone.UserMedia());
  const processPitch = (e: MessageEvent) => {
    const freq = e.data.frequency !== null ? e.data.frequency : 0;
    setFrequency(freq);
  };

  const onTunedNoteHandler = (note: string) => {
    if (
      tuningState
        .map((n) => {
          return n.note;
        })
        .includes(note)
    ) {
      const confSound = new Tone.Player(confirmationSound).toDestination();
      confSound.autostart = true;
      const noteIndex = tuningState.findIndex(
        (n) => n.note === note && n.isTuned === false
      );
      if (noteIndex !== -1) {
        const newTuningState = tuningState.map((n, i) => {
          return i === noteIndex
            ? { note: n.note, isTuned: true, isFocused: n.isFocused }
            : n;
        });
        setTuningState(newTuningState);
      }
    }
  };

  const pitchAnalyzerRef = useRef<AudioWorkletNode | null>(null);
  useEffect(() => {
    const setupPitchAnalyzer = async () => {
      try {
        await Tone.getContext().addAudioWorkletModule(pitchAnalysisNode);
        pitchAnalyzerRef.current = Tone.getContext().createAudioWorkletNode(
          "PitchAnalysis",
          {
            processorOptions: { sampleFrequency: 4, confidence: 0.9 },
          }
        );
        pitchAnalyzerRef.current.port.onmessage = processPitch;
        mic.current.connect(pitchAnalyzerRef.current);
      } catch (error) {
        console.error(
          "Failed to connect PitchAnalysis Worklet node to microphone",
          error
        );
      }
    };

    if (isMicEnabled) {
      if (pitchAnalyzerRef.current === null) {
        setupPitchAnalyzer();
      } else {
        mic.current.connect(pitchAnalyzerRef.current);
      }
    } else {
      if (pitchAnalyzerRef.current) {
        mic.current.disconnect(pitchAnalyzerRef.current);
      }
    }
  }, [isMicEnabled]);

  const playNoteCallback = (noteIndex: number, note: string) => {
    const newTuningState = tuningState.map((n, i) => {
      return i === noteIndex
        ? { note: n.note, isFocused: true, isTuned: n.isTuned }
        : { note: n.note, isFocused: false, isTuned: n.isTuned };
    });
    setTuningState(newTuningState);
    sampler.current.triggerAttackRelease(
      Tone.Frequency(note).toFrequency() * Math.pow(1.0005777895, pitchShift),
      "1n"
    );
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
        return <GuitarHeadstock></GuitarHeadstock>;
      case InstrumentEnum.bass:
        return <BassHeadstock></BassHeadstock>;
      case InstrumentEnum.ukulele:
        return <UkuleleHeadstock></UkuleleHeadstock>;
      case InstrumentEnum.eightString:
        return <EightStringHeadstock></EightStringHeadstock>;
    }
  };

  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <svg ref={svgRef} version="1.1" className="headstock" viewBox="0 0 80 100">
      <g>
        {renderHeadstock()}
        <circle
          className={`mic-button ${isMicEnabled ? "on" : "off"}`}
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
      <TuningGauge
        frequency={frequency}
        x={40}
        y={60}
        width={20}
        holdDuration={1}
        cents={5}
        pitchShift={pitchShift}
        onTuned={onTunedNoteHandler}
      ></TuningGauge>
    </svg>
  );
};

export default Tuner;
