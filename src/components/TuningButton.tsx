import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import peg from "./assets/peg.svg";

let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let frequencies = [
  261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.0, 415.3, 440.0,
  466.16, 493.88,
];

interface Props {
  children: string;
  isTuned: boolean;
  playNoteCallback: (note: string) => void;
  changeNoteCallback: (newNote: string) => void;
  lostFocusCallback: () => void;
}

const TuningButton = ({
  children,
  isTuned,
  playNoteCallback,
  changeNoteCallback,
  lostFocusCallback,
}: Props) => {
  const noteRegex = /^([A-G|a-g][#b]?)([0-8])$/;
  if (noteRegex.exec(children) === null) {
    throw new Error(
      'TuningButton child must be a string specifying a musical note followed by an integer between 0 and 8. e.g: "C#4", "E2", "F#8", etc.'
    );
  }

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
    //@ts-ignore
    e.target.parentElement.style.animation = "rotateImage 1s";
    //@ts-ignore
    e.target.parentElement.children[1].style.animation = "fadeOut 0.25s";
    //@ts-ignore
    e.target.parentElement.children[2].style.animation = "fadeOut 0.25s";
    //@ts-ignore
    e.target.parentElement.children[3].style.animation = "fadeOut 0.25s";
    setTimeout(() => {
      //@ts-ignore
      e.target.parentElement.children[1].style.opacity = "0";
      //@ts-ignore
      e.target.parentElement.children[2].style.opacity = "0";
      //@ts-ignore
      e.target.parentElement.children[3].style.opacity = "0";
      //@ts-ignore
      e.target.parentElement.children[1].style.animation = "";
      //@ts-ignore
      e.target.parentElement.children[2].style.animation = "";
      //@ts-ignore
      e.target.parentElement.children[3].style.animation = "";
    }, 250);
    setTimeout(() => {
      //@ts-ignore
      e.target.parentElement.style.animation = "";
      //@ts-ignore
      e.target.parentElement.children[1].style.animation = "fadeIn 0.25s";
      //@ts-ignore
      e.target.parentElement.children[2].style.animation = "fadeIn 0.25s";
      //@ts-ignore
      e.target.parentElement.children[3].style.animation = "fadeIn 0.25s";
      //@ts-ignore
      e.target.parentElement.children[1].style.opacity = "1";
      //@ts-ignore
      e.target.parentElement.children[2].style.opacity = "1";
      //@ts-ignore
      e.target.parentElement.children[3].style.opacity = "1";
      //@ts-ignore
    }, 1000);
  };
  return (
    <>
      <div
        className="tuning-button"
        onBlur={(e) => {
          lostFocusCallback();
        }}
      >
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
      </div>
    </>
  );
};

export default TuningButton;
