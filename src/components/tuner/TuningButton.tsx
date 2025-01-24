import React, { useEffect, useRef, useState } from "react";
import "./TuningButton.css";

let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let frequencies = [
  261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.0, 415.3, 440.0,
  466.16, 493.88,
];

interface Props {
  children: string;
  x: number;
  y: number;
  isTuned: boolean;
  playNoteCallback: (note: string) => void;
  changeNoteCallback: (newNote: string) => void;
}

const TuningButton = ({
  children,
  x,
  y,
  isTuned,
  playNoteCallback,
  changeNoteCallback,
}: Props) => {
  const noteRegex = /^([A-G|a-g][#b]?)([0-8])$/;
  if (noteRegex.exec(children) === null) {
    throw new Error(
      'TuningButton child must be a string specifying a musical note followed by an integer between 0 and 8. e.g: "C#4", "E2", "F#8", etc.'
    );
  }

  const gRef = useRef<SVGGElement>(null);

  const incrementNote = () => {
    let regexResult = noteRegex.exec(children);
    if (regexResult === null) {
      throw new Error("Invalid note passed in to decrementer");
    }
    let letter = regexResult[1];
    let octave = Number(regexResult[2]);

    if (letter === "B") {
      octave += 1;
    }

    if (octave >= 9) {
      return;
    }

    let letterIndex = notes.indexOf(letter);
    letterIndex += 1;
    if (letterIndex >= notes.length) {
      letterIndex = 0;
    }

    const newNote = notes[letterIndex] + octave.toString();
    playNoteCallback(newNote);
    changeNoteCallback(newNote);
  };

  const decrementNote = () => {
    let regexResult = noteRegex.exec(children);
    if (regexResult === null) {
      throw new Error("Invalid note passed in to decrementer");
    }
    let letter = regexResult[1];
    let octave = Number(regexResult[2]);

    if (letter === "C") {
      octave -= 1;
    }

    if (octave < 0) {
      return;
    }

    let letterIndex = notes.indexOf(letter);
    letterIndex -= 1;
    if (letterIndex < 0) {
      letterIndex = notes.length - 1;
    }

    const newNote = notes[letterIndex] + octave.toString();
    playNoteCallback(newNote);
    changeNoteCallback(newNote);
  };

  const rotatePeg = (e: React.MouseEvent) => {
    if (gRef.current !== null) {
      gRef.current.style.animation = "rotateImage 1s";
    }
  };
  return (
    <g
      className="tuning-peg-svg"
      ref={gRef}
      style={{
        transformOrigin: `${x + 5}px ${y + 7.5}px`,
      }}
    >
      <path
        className="tuning-peg-path"
        style={{ transform: `translate(${-17.198 + x} ${-40.746 + y})` }}
        d="m22.676 40.931c-1.2075-0.01828-2.4774 0.12683-3.1755 0.69892-2.8261 2.3159-2.8262 10.93 0 13.246 1.5957 1.3076 6.1772 0.38201 6.1772 0.38201l2.3564-7.0049-2.3564-7.0049s-1.4492-0.2934-3.0017-0.31691z"
      />
      <rect x={x} y={y} width="11.030" height="15.015"></rect>
      <text
        className="tuning-peg-adjuster"
        fontSize="3px"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        x={x + 5}
        y={y + 2}
        onClick={(e) => {
          incrementNote();
          rotatePeg(e);
        }}
      >
        +
      </text>
      <text
        className="tuning-peg-note"
        fontSize="3px"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        x={x + 5}
        y={y + 7.5}
      >
        {children}
      </text>
      <circle
        className="tuning-peg-button"
        cx={x + 5}
        cy={y + 7.5}
        r="3"
        onClick={() => {
          playNoteCallback(children);
        }}
        stroke={isTuned ? "green" : "red"}
        fill="transparent"
      ></circle>
      <text
        className="tuning-peg-adjuster"
        fontSize="3px"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        x={x + 5}
        y={y + 13}
        onClick={(e) => {
          decrementNote();
          rotatePeg(e);
        }}
      >
        -
      </text>
    </g>
  );
};
{
  /* <div className="tuning-button">
        <img className="peg-vector" src={peg} alt="" width="150"></img>
        <button
          className="top-peg-button"
          style={{ display: "block" }}
          onClick={(e) => {
            incrementNote();
            rotatePeg(e);
          }}
        >
          +
        </button>
        <button
          className="middle-peg-button"
          style={{
            display: "block",
            borderColor: isTuned ? "green" : "red",
            borderWidth: "5px",
          }}
          onClick={() => {
            playNoteCallback(children);
          }}
        >
          {children}
        </button>
        <button
          className="bottom-peg-button"
          style={{ display: "block" }}
          onClick={(e) => {
            decrementNote();
            rotatePeg(e);
          }}
        >
          -
        </button>
      </div> */
}

export default TuningButton;
