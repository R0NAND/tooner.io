import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import interpolate from "color-interpolate";
import "./TuningGauge.css";
import TuningFork from "../../resources/tuning-fork.svg?react";

interface Props {
  frequency: number;
  x: number;
  y: number;
  width: number;
  holdDuration: number;
  cents: number;
  pitchShift: number; //In cents
  onTuned: (note: string) => void;
}

const TuningGauge = ({
  frequency,
  x,
  y,
  width,
  holdDuration = 1,
  cents = 5,
  pitchShift = 0,
  onTuned,
}: Props) => {
  if (Math.abs(pitchShift) > 50) {
    throw new Error(
      "Invalid pitch shift detected. Value must be between -50 and 50 cents"
    );
  }
  //Below is not the best practice, but I don't plan on using this component anywhere else for the time being
  const outline_color = getComputedStyle(document.body).getPropertyValue(
    "--secondary-color"
  );
  const deny_color = getComputedStyle(document.body).getPropertyValue(
    "--deny-color"
  );
  const confirm_color = getComputedStyle(document.body).getPropertyValue(
    "--confirm-color"
  );
  const colorMap = interpolate([confirm_color, deny_color]);
  const [note, setNote] = useState("");
  const [radianError, setRadianError] = useState(0);
  const [color, setColor] = useState(outline_color);

  const twelthRadian = (2 * Math.PI) / 12;
  const midiNoteZeroFreq = Tone.Frequency(0, "midi").toFrequency();
  const twelthRootOfTwo = 1.05946309436;
  const initialHeardTime = useRef(Date.now());
  const lastHeardNote = useRef("");
  useEffect(() => {
    if (frequency !== 0) {
      const pitchShiftCoeff = Math.pow(1.0005777895, pitchShift);
      const newNote = Tone.Frequency(frequency / pitchShiftCoeff).toNote();
      const targetMidiNote = Tone.Frequency(newNote).toMidi();
      const continuousMidiNote =
        Math.log(frequency / pitchShiftCoeff / midiNoteZeroFreq) /
        Math.log(twelthRootOfTwo);
      const newRadianError =
        twelthRadian * (continuousMidiNote - targetMidiNote);
      const targetFrequency =
        Tone.Frequency(newNote).toFrequency() * pitchShiftCoeff;
      const centsOff = 1200 * Math.log2(frequency / targetFrequency);
      const isTuned = Math.abs(centsOff) <= cents;
      setNote(newNote);
      setRadianError(newRadianError);
      console.log(centsOff);
      setColor(isTuned ? colorMap(0) : colorMap(Math.abs(centsOff) / 50));
      if (isTuned) {
        if (newNote === lastHeardNote.current) {
          if (Date.now() - initialHeardTime.current >= holdDuration * 1000) {
            onTuned(newNote);
            lastHeardNote.current = "";
          }
        } else {
          lastHeardNote.current = newNote;
          initialHeardTime.current = Date.now();
        }
      } else {
        lastHeardNote.current = "";
      }
    } else {
      lastHeardNote.current = "";
      setNote("");
      setRadianError(0);
      setColor(outline_color);
    }
  }, [frequency]);

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
        <g>
          <circle
            r={tuningCircleRadius}
            cx={tuningCircleX}
            cy={tuningCircleY}
            strokeWidth="2px"
            fill="transparent"
            stroke={color}
          ></circle>
          <circle
            stroke={color}
            fill="black"
            strokeWidth="2px"
            r="15"
            cx="50"
            cy="50"
            filter={`drop-shadow(0px 0px 4px ${color})`}
          />
          {note === "" && (
            <TuningFork
              className="tuning-gauge-fork"
              preserveAspectRatio="xMinYMin"
              x={tuningCircleX - 7.5}
              y={tuningCircleX - 7.5}
              height={15}
              stroke={"none"}
              color={outline_color}
            ></TuningFork>
          )}
          {note !== "" && (
            <>
              <circle
                fill={color}
                r="12"
                cx={tuningCircleX + tuningCircleRadius * Math.sin(radianError)}
                cy={tuningCircleY - tuningCircleRadius * Math.cos(radianError)}
                stroke="none"
                filter={`drop-shadow(0px 0px 4px ${color})`}
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
                filter={`drop-shadow(0px 0px 4px black)`}
              >
                {note}
              </text>
              <circle
                fill={color}
                filter={`drop-shadow(0px 0px 1px ${color})`}
                r="12"
                cx={
                  tuningCircleX +
                  tuningCircleRadius *
                    Math.sin(
                      radianError +
                        (radianError > 0 ? -twelthRadian : twelthRadian)
                    )
                }
                cy={
                  tuningCircleY -
                  tuningCircleRadius *
                    Math.cos(
                      radianError +
                        (radianError > 0 ? -twelthRadian : twelthRadian)
                    )
                }
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
                  tuningCircleRadius *
                    Math.sin(
                      radianError +
                        (radianError > 0 ? -twelthRadian : twelthRadian)
                    )
                }
                y={
                  tuningCircleY -
                  tuningCircleRadius *
                    Math.cos(
                      radianError +
                        (radianError > 0 ? -twelthRadian : twelthRadian)
                    )
                }
                filter={`drop-shadow(0px 0px 1px black)`}
              >
                {Tone.Frequency(note)
                  .transpose(radianError > 0 ? 1 : -1)
                  .toNote()}
              </text>
            </>
          )}
        </g>
      </svg>
    </>
  );
};

export default TuningGauge;
