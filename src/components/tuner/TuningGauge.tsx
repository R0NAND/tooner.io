import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import "./TuningGauge.css";

interface Props {
  children: number;
  x: number;
  y: number;
  width: number;
  cents: number;
}

const TuningGauge = ({ children, x, y, width, cents = 5 }: Props) => {
  console.log(children);
  const [isTuned, setIsTuned] = useState(false);
  const [note, setNote] = useState("");
  const [radianError, setRadianError] = useState(0);

  const twelthRadian = (2 * Math.PI) / 12;
  const midiNoteZeroFreq = Tone.Frequency(0, "midi").toFrequency();
  const twelthRootOfTwo = 1.05946309436;
  const cent = 1.0005777895; // 1200th root of 2
  useEffect(() => {
    if (children !== 0) {
      const newNote = Tone.Frequency(children).toNote();
      const targetMidiNote = Tone.Frequency(newNote).toMidi();
      const continuousMidiNote =
        Math.log(children / midiNoteZeroFreq) / Math.log(twelthRootOfTwo);
      const newRadianError =
        twelthRadian * (continuousMidiNote - targetMidiNote);
      const targetFrequency = Tone.Frequency(newNote).toFrequency();
      const isTuned =
        children <= targetFrequency * Math.pow(cent, cents) &&
        children >= targetFrequency * Math.pow(cent, -cents);
      setNote(newNote);
      setRadianError(newRadianError);
      setIsTuned(isTuned);
    } else {
      setNote("");
      setRadianError(0);
      setIsTuned(false);
    }
  }, [children]);

  const tuningCircleRadius = 150;
  const tuningCircleX = 50;
  const tuningCircleY = 200;
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
        <circle
          className={`tuning-ring${
            isTuned ? " tuning-ring-green" : " tuning-ring-red"
          }`}
          r={tuningCircleRadius}
          cx={tuningCircleX}
          cy={tuningCircleY}
        ></circle>
        <circle
          className={`tuning-target${
            isTuned ? " tuning-target-green" : " tuning-target-red"
          }`}
          r="15"
          cx="50"
          cy="50"
        />
        {note !== "" && (
          <>
            <circle
              className={`${isTuned ? "tuning-note-green" : "tuning-note-red"}`}
              r="12"
              cx={tuningCircleX + tuningCircleRadius * Math.sin(radianError)}
              cy={tuningCircleY - tuningCircleRadius * Math.cos(radianError)}
              fill="white"
              stroke="none"
            ></circle>
            <text
              fontSize="10px"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="black"
              stroke="none"
              x={tuningCircleX + tuningCircleRadius * Math.sin(radianError)}
              y={tuningCircleY - tuningCircleRadius * Math.cos(radianError)}
            >
              {note}
            </text>
            <circle
              r="10"
              cx={
                tuningCircleX +
                tuningCircleRadius *
                  Math.sin(
                    radianError +
                      (radianError > 0 ? -twelthRadian : -twelthRadian)
                  )
              }
              cy={
                tuningCircleY -
                tuningCircleRadius * Math.cos(radianError - twelthRadian)
              }
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
              x={
                tuningCircleX +
                tuningCircleRadius * Math.sin(radianError - twelthRadian)
              }
              y={
                tuningCircleY -
                tuningCircleRadius * Math.cos(radianError - twelthRadian)
              }
            >
              {Tone.Frequency(note).transpose(1).toNote()}
            </text>
          </>
        )}
      </svg>
    </>
  );
};

export default TuningGauge;
