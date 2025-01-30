import React, { useEffect, useRef, useState } from "react";
import "./TuningButton.css";
import GuitarPeg from "./assets/guitar-peg.svg?react";
import transforms from "./tuner-svg-transforms.json";

let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let frequencies = [
  261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.0, 415.3, 440.0,
  466.16, 493.88,
];

interface Props {
  children: string;
  i: number;
  isFocused: boolean;
  isTuned: boolean;
  playNoteCallback: (note: string) => void;
  changeNoteCallback: (newNote: string) => void;
}

const TuningButton = ({
  children,
  i,
  isFocused,
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
      className="tuning-peg-group"
      ref={gRef}
      style={{
        transformOrigin: `${
          transforms.guitar.pegs[i].x + transforms.guitar.pegs[i].transformX
        }px ${
          transforms.guitar.pegs[i].y + transforms.guitar.pegs[i].transformY
        }px`,
      }}
    >
      <g
        transform={transforms.guitar.pegs[i].transform}
        style={{
          transformOrigin: `${
            transforms.guitar.pegs[i].x + transforms.guitar.pegs[i].transformX
          }px ${
            transforms.guitar.pegs[i].y + transforms.guitar.pegs[i].transformY
          }px`,
        }}
      >
        <GuitarPeg
          height={transforms.guitar.pegs[i].height}
          x={transforms.guitar.pegs[i].x}
          y={transforms.guitar.pegs[i].y}
          preserveAspectRatio="xMinYMin"
          className={`tuning-peg-svg${isFocused ? " focused-peg" : ""} ${
            isTuned ? " tuned-peg" : ""
          }`}
          onClick={() => {
            playNoteCallback(children);
          }}
        ></GuitarPeg>
      </g>
      <text
        className="tuning-peg-adjuster"
        fontSize="4px"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        x={
          transforms.guitar.pegs[i].x + transforms.guitar.pegElements.centerLine
        }
        y={transforms.guitar.pegs[i].y + transforms.guitar.pegElements.upY}
        onClick={(e) => {
          incrementNote();
          rotatePeg(e);
        }}
      >
        +
      </text>
      <text
        className="tuning-peg-note"
        fontSize="2px"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        x={
          transforms.guitar.pegs[i].x + transforms.guitar.pegElements.centerLine
        }
        y={transforms.guitar.pegs[i].y + transforms.guitar.pegElements.playY}
      >
        {children}
      </text>
      <text
        className="tuning-peg-adjuster"
        fontSize="4px"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        x={
          transforms.guitar.pegs[i].x + transforms.guitar.pegElements.centerLine
        }
        y={transforms.guitar.pegs[i].y + transforms.guitar.pegElements.downY}
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

export default TuningButton;
