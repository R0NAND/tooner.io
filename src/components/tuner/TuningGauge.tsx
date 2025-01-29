import React, { useRef, useState } from "react";
import * as Tone from "tone";

interface Props {
  children: number;
  x: number;
  y: number;
  width: number;
  sensitivity: number;
}

const TuningGauge = ({ children, x, y, width, sensitivity = 0.7 }: Props) => {
  if (sensitivity >= 0.95) {
    throw new Error("Highest allowable sensitivity is 0.95");
  }
  const note = children === 0 ? "" : Tone.Frequency(children).toNote();
  const targetMidiNote = Tone.Frequency(note).toMidi();
  const continuousMidiNote =
    children !== 0
      ? Math.log(children / 8.1758) / Math.log(1.05946309436)
      : null;
  const noteError =
    continuousMidiNote !== null
      ? 0.523 * (continuousMidiNote - targetMidiNote)
      : 0;
  const sharpNote = Tone.Frequency(targetMidiNote + 1, "midi").toNote();
  const flatNote = Tone.Frequency(targetMidiNote - 1, "midi").toNote();

  return (
    <>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMinYMin"
        x={x - width / 2}
        y={y - width / 2}
        height={width}
        width={width}
      >
        <circle r="15" cx="50" cy="50" strokeWidth="3px" stroke="white" />
        {note !== "" && (
          <>
            <circle
              r="80"
              cx="50"
              cy="130"
              strokeWidth={5}
              fill="transparent"
              stroke="white"
            ></circle>
            <circle
              r="10"
              cx={50 + 80 * Math.sin(noteError)}
              cy={130 - 80 * Math.cos(noteError)}
              fill="white"
              stroke="none"
            ></circle>
            <text
              fontSize="10px"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              stroke="none"
              fill="black"
              x={50 + 80 * Math.sin(noteError)}
              y={130 - 80 * Math.cos(noteError)}
            >
              {note}
            </text>
            <circle
              r="10"
              cx={50 + 80 * Math.sin(noteError - 0.523)}
              cy={130 - 80 * Math.cos(noteError - 0.523)}
              fill="white"
              stroke="none"
            ></circle>
            <text
              fontSize="10px"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              stroke="none"
              fill="black"
              x={50 + 80 * Math.sin(noteError - 0.523)}
              y={130 - 80 * Math.cos(noteError - 0.523)}
            >
              {sharpNote}
            </text>
            <circle
              r="10"
              cx={50 + 80 * Math.sin(noteError + 0.523)}
              cy={130 - 80 * Math.cos(noteError + 0.523)}
              fill="white"
              stroke="none"
            ></circle>
            <text
              fontSize="10px"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              stroke="none"
              fill="black"
              x={50 + 80 * Math.sin(noteError + 0.523)}
              y={130 - 80 * Math.cos(noteError + 0.523)}
            >
              {flatNote}
            </text>
          </>
        )}
      </svg>
    </>
  );
};

export default TuningGauge;
