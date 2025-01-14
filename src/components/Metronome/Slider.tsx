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
  }, [min, max, value]);

  const inputRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  let thumbwidth = 0;
  if (thumbRef.current != null) {
    thumbwidth = thumbRef.current.clientWidth;
  }
  const [thumbLeft, setThumbLeft] = useState(
    (width - thumbwidth) * ((value - min) / (max - min))
  );
  useEffect(() => {
    if (inputRef.current != null) {
      inputRef.current.value = value.toString();
    }
    setThumbLeft((width - thumbwidth) * ((value - min) / (max - min)));
  }, [value]);

  const clickRef = useRef(0);
  const thumbLeftRef = useRef(0);
  const onMouseDown = (downEvent: React.MouseEvent<HTMLDivElement>) => {
    // const formElement = downEvent.currentTarget;
    // setTimeout(() => {
    //   console.log(formElement.getBoundingClientRect());
    // }, 100);
    setThumbLeft(
      downEvent.clientX - downEvent.currentTarget.getBoundingClientRect().x
    );
    downEvent.preventDefault();
    clickRef.current = downEvent.clientX;
    thumbLeftRef.current = thumbLeft;
    const mouseMoveHandler = (e: MouseEvent) => {
      const pos = Math.max(
        0,
        Math.min(
          width - thumbwidth,
          thumbLeftRef.current + (e.clientX - clickRef.current)
        )
      );
      setThumbLeft(pos);
      const returnValue = min + (max - min) * (pos / (width - thumbwidth));
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
        border: "2px solid red",
        width: width,
        position: "relative",
      }}
    >
      <div
        className="big-d"
        onMouseDown={onMouseDown}
        style={{ border: "none", display: "flex", position: "absolute" }}
      >
        <div
          className="bpm-slider-track-left"
          style={{
            border: "none",
            borderRadius: 5,
            height: 10,
            width: thumbLeft,
          }}
        ></div>
        <div
          className="bpm-slider-track-right"
          style={{
            border: "none",
            borderRadius: 5,
            width: width - thumbLeft,
          }}
        ></div>
      </div>
      <div
        ref={thumbRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          height: 15,
          width: 50,
          borderRadius: 7.5,
          backgroundColor: "white",
          position: "absolute",
          left: thumbLeft,
        }}
      >
        <input
          ref={inputRef}
          style={{
            margin: "auto",
            border: "none",
            background: "transparent",
            color: "black",
            width: 40,
          }}
          type="number"
          min={min}
          max={max}
          onBlur={(e) => {
            const newValue = Math.max(
              min,
              Math.min(max, Number(e.target.value))
            );
            onChange(newValue);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              inputRef.current?.blur();
            }
          }}
        ></input>
      </div>
    </div>
  );
};

export default Slider;
