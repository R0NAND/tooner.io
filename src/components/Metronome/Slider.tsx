import React, { useEffect, useRef, useState } from "react";
import MetronomeVector from "./assets/MetronomeVector";
import "./Slider.css";

interface Props {
  width: number;
  min: number;
  max: number;
  value: number;
  onChange: (percentage: number) => void;
}

const Slider = ({ width, min, max, value, onChange }: Props) => {
  useEffect(() => {
    if (value < min || value > max) {
      throw new Error("value not within range");
    }
  }, []);

  const [thumbLeft, setThumbLeft] = useState(
    width * ((value - min) / (max - min))
  );

  const clickRef = useRef(0);
  const thumbLeftRef = useRef(0);
  const onMouseDown = (downEvent: React.MouseEvent) => {
    downEvent.preventDefault();
    clickRef.current = downEvent.clientX;
    thumbLeftRef.current = thumbLeft;
    const mouseMoveHandler = (e: MouseEvent) => {
      const pos = Math.max(
        0,
        Math.min(width, thumbLeftRef.current + (e.clientX - clickRef.current))
      );
      setThumbLeft(pos);
      const returnValue = min + (max - min) * (pos / width);
      onChange(returnValue);
    };
    addEventListener("mousemove", mouseMoveHandler);
    addEventListener(
      "mouseup",
      (upEvent: MouseEvent) => {
        removeEventListener("mousemove", mouseMoveHandler);
      },
      { once: true }
    );
  };

  return (
    <div
      className="bpm-slider"
      style={{
        width: width,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", position: "absolute" }}>
        <div
          className="bpm-slider-track-left"
          style={{
            borderRadius: 5,
            height: 10,
            width: thumbLeft,
          }}
        ></div>
        <div
          className="bpm-slider-track-right"
          style={{
            borderRadius: 5,
            width: width - thumbLeft,
          }}
        ></div>
      </div>
      <svg
        className="bpm-slider-thumb"
        style={{
          position: "absolute",
          left: thumbLeft,
        }}
        onMouseDown={onMouseDown}
        height="30"
        width="60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="30" cy="15" rx="30" ry="15" />
      </svg>
    </div>
  );
};

export default Slider;
