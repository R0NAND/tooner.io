import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import GuitarPeg from "./assets/guitar-peg.svg?react";
import UkulelePeg from "./assets/ukulele-peg.svg?react";
import BassPeg from "./assets/bass-peg.svg?react";
import guitarTransforms from "./transforms/guitar.json";
import ukuleleTransforms from "./transforms/ukulele.json";
import bassTransforms from "./transforms/bass.json";
import eightStringTransforms from "./transforms/eight-string.json";
import "./TuningButton.css";
import { InstrumentEnum } from "./Tuner";

interface Props {
  children: string;
  instrument: InstrumentEnum;
  i: number;
  isFocused: boolean;
  isTuned: boolean;
  playNoteCallback: (note: string) => void;
  onNoteChange: (index: number, newNote: string) => void;
}

const TuningButton = ({
  children,
  instrument,
  i,
  isFocused,
  isTuned,
  playNoteCallback,
  onNoteChange,
}: Props) => {
  const noteRegex = /^([A-G|a-g][#b]?)([0-8])$/;
  if (noteRegex.exec(children) === null) {
    throw new Error(
      'TuningButton child must be a string specifying a musical note followed by an integer between 0 and 8. e.g: "C#4", "E2", "F#8", etc.'
    );
  }

  const [transforms, setTransforms] =
    useState<typeof guitarTransforms>(guitarTransforms);
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
      case InstrumentEnum.eigthString:
        setTransforms(eightStringTransforms);
        break;
    }
  }, [instrument]);

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
  }, [children, instrument]);

  const renderPeg = () => {
    switch (instrument) {
      case InstrumentEnum.guitar:
        return (
          <GuitarPeg
            height={transforms.pegs[i].height}
            x={transforms.pegs[i].x}
            y={transforms.pegs[i].y}
            preserveAspectRatio="xMinYMin"
            className={`tuning-peg-svg${isFocused ? " focused-peg" : ""} ${
              isTuned ? " tuned-peg" : ""
            }`}
            onClick={() => {
              playNoteCallback(children);
            }}
          ></GuitarPeg>
        );
        break;
      case InstrumentEnum.ukulele:
        return (
          <UkulelePeg
            height={transforms.pegs[i].height}
            x={transforms.pegs[i].x}
            y={transforms.pegs[i].y}
            preserveAspectRatio="xMinYMin"
            className={`tuning-peg-svg${isFocused ? " focused-peg" : ""} ${
              isTuned ? " tuned-peg" : ""
            }`}
            onClick={() => {
              playNoteCallback(children);
            }}
          ></UkulelePeg>
        );
        break;
      case InstrumentEnum.bass:
        return (
          <BassPeg
            height={transforms.pegs[i].height}
            x={transforms.pegs[i].x}
            y={transforms.pegs[i].y}
            preserveAspectRatio="xMinYMin"
            className={`tuning-peg-svg${isFocused ? " focused-peg" : ""} ${
              isTuned ? " tuned-peg" : ""
            }`}
            onClick={() => {
              playNoteCallback(children);
            }}
          ></BassPeg>
        );
        break;
      case InstrumentEnum.eigthString:
        return (
          <GuitarPeg
            height={transforms.pegs[i].height}
            x={transforms.pegs[i].x}
            y={transforms.pegs[i].y}
            preserveAspectRatio="xMinYMin"
            className={`tuning-peg-svg${isFocused ? " focused-peg" : ""} ${
              isTuned ? " tuned-peg" : ""
            }`}
            onClick={() => {
              playNoteCallback(children);
            }}
          ></GuitarPeg>
        );
        break;
    }
  };

  return (
    <g
      className="tuning-peg-group"
      ref={componentRef}
      style={{
        transformOrigin: `${
          transforms.pegs[i].x + transforms.pegs[i].transformX
        }px ${transforms.pegs[i].y + transforms.pegs[i].transformY}px`,
      }}
    >
      <g
        transform={transforms.pegs[i].isMirrored ? "scale(-1 1)" : ""}
        style={{
          transformOrigin: `${
            transforms.pegs[i].x + transforms.pegs[i].transformX
          }px ${transforms.pegs[i].y + transforms.pegs[i].transformY}px`,
        }}
      >
        {renderPeg()}
      </g>
      <g ref={textRef}>
        <text
          className="tuning-peg-adjuster"
          fontSize="4px"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          x={transforms.pegs[i].x + transforms.pegElements.centerLine}
          y={transforms.pegs[i].y + transforms.pegElements.upY}
          onClick={(e) => {
            onNoteChange(i, Tone.Frequency(children).transpose(1).toNote());
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
          x={transforms.pegs[i].x + transforms.pegElements.centerLine}
          y={transforms.pegs[i].y + transforms.pegElements.playY}
        >
          {children}
        </text>
        <text
          className="tuning-peg-adjuster"
          fontSize="4px"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          x={transforms.pegs[i].x + transforms.pegElements.centerLine}
          y={transforms.pegs[i].y + transforms.pegElements.downY}
          onClick={(e) => {
            onNoteChange(i, Tone.Frequency(children).transpose(-1).toNote());
          }}
        >
          -
        </text>
      </g>
    </g>
  );
};

export default TuningButton;
