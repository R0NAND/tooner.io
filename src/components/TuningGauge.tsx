import React, { useState } from "react";
import * as Tone from "tone";

interface Props {
  children: number;
}

const TuningGauge = ({ children }: Props) => {
  let note = Tone.Frequency(children).toNote();
  let target = Tone.Frequency(note).toFrequency();
  let lower_bound = target / 1.02930223664;
  let upper_bound = target * 1.02930223664;

  let fraction = 1;
  if (children < target) {
    fraction = (target - children) / (target - lower_bound);
  } else {
    fraction = (children - target) / (upper_bound - target);
  }

  return (
    <>
      <div style={{ position: "relative" }}>
        <svg
          style={{ position: "absolute" }}
          height="100"
          width="100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle r="50" cx="50" cy="50" stroke="white" />
        </svg>
        <svg
          style={{ position: "absolute" }}
          height="140"
          width="100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            rx={children >= target ? 50 - 40 * fraction : "49"}
            ry={children < target ? 50 - 40 * fraction : "49"}
            cx="50"
            cy="50"
            fill={fraction <= 0.2 ? "green" : "red"}
            stroke="yellow"
          />
        </svg>
        <h1 style={{ position: "absolute" }}>
          {Tone.Frequency(children).toNote()}
        </h1>
      </div>
    </>
  );
};

export default TuningGauge;
