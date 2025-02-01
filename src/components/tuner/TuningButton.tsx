import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import GuitarPeg from "./assets/guitar-peg.svg?react";
import transforms from "./tuner-svg-transforms.json";
import "./TuningButton.css";

let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

interface Props {
  children: string;
  i: number;
  isFocused: boolean;
  isTuned: boolean;
  playNoteCallback: (note: string) => void;
  transposeNoteCallback: (transposeAmount: number) => void;
}

const TuningButton = ({
  children,
  i,
  isFocused,
  isTuned,
  playNoteCallback,
  transposeNoteCallback,
}: Props) => {
  const noteRegex = /^([A-G|a-g][#b]?)([0-8])$/;
  if (noteRegex.exec(children) === null) {
    throw new Error(
      'TuningButton child must be a string specifying a musical note followed by an integer between 0 and 8. e.g: "C#4", "E2", "F#8", etc.'
    );
  }

  const componentRef = useRef<SVGGElement>(null);
  const textRef = useRef<SVGGElement>(null);
  const rotatePeg = () => {
    componentRef.current?.classList.add("tuning-button-rotating");

    const handleRotateAnimationEnd = () => {
      componentRef.current?.classList.remove("tuning-button-rotating");
      componentRef.current?.removeEventListener(
        "animationend",
        handleRotateAnimationEnd
      );
    };

    componentRef.current?.addEventListener(
      "animationend",
      handleRotateAnimationEnd
    );
  };
  useEffect(() => {
    rotatePeg();
  }, [children]);

  return (
    <g
      className="tuning-peg-group"
      ref={componentRef}
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
      <g ref={textRef}>
        <text
          className="tuning-peg-adjuster"
          fontSize="4px"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          x={
            transforms.guitar.pegs[i].x +
            transforms.guitar.pegElements.centerLine
          }
          y={transforms.guitar.pegs[i].y + transforms.guitar.pegElements.upY}
          onClick={(e) => {
            transposeNoteCallback(1);
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
            transforms.guitar.pegs[i].x +
            transforms.guitar.pegElements.centerLine
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
            transforms.guitar.pegs[i].x +
            transforms.guitar.pegElements.centerLine
          }
          y={transforms.guitar.pegs[i].y + transforms.guitar.pegElements.downY}
          onClick={(e) => {
            transposeNoteCallback(-1);
          }}
        >
          -
        </text>
      </g>
    </g>
  );
};

export default TuningButton;
