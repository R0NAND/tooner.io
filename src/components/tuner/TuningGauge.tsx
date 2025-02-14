import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import interpolate from "color-interpolate";
import "./TuningGauge.css";
import TuningFork from "../../resources/tuning-fork.svg?react";

interface Props {
  children: number;
  x: number;
  y: number;
  width: number;
  cents: number;
}

const TuningGauge = ({ children, x, y, width, cents = 5 }: Props) => {
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
  const [isTuned, setIsTuned] = useState(false);
  const [note, setNote] = useState("");
  const [radianError, setRadianError] = useState(0);
  const [color, setColor] = useState(outline_color);

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
      const centsOff = 1200 * Math.log2(children / targetFrequency);
      const isTuned = Math.abs(centsOff) <= 5;
      setNote(newNote);
      setRadianError(newRadianError);
      setIsTuned(isTuned);
      setColor(isTuned ? colorMap(0) : colorMap(Math.abs(centsOff) / 50));
    } else {
      setNote("");
      setRadianError(0);
      setIsTuned(false);
      setColor(outline_color);
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
