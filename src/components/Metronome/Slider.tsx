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
  const trackRef = useRef<HTMLDivElement>(null);
  const getTrackPosition = () => {
    if (trackRef.current != null) {
      return trackRef.current.getBoundingClientRect().x;
    } else return 0;
  };

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

  const onMouseDown = (downEvent: React.MouseEvent<HTMLDivElement>) => {
    const clickPosition =
      downEvent.clientX - getTrackPosition() - 0.5 * thumbwidth;
    const newThumbLeft = Math.max(
      0,
      Math.min(width - thumbwidth, clickPosition)
    );
    const clickedValue =
      min + (max - min) * (newThumbLeft / (width - thumbwidth));
    onChange(clickedValue);
    setThumbLeft(newThumbLeft);
    downEvent.preventDefault();

    const mouseMoveHandler = (e: MouseEvent) => {
      const dragPosition = Math.max(
        0,
        Math.min(
          width - thumbwidth,
          newThumbLeft + (e.clientX - downEvent.clientX)
        )
      );
      const draggedValue =
        min + (max - min) * (dragPosition / (width - thumbwidth));
      setThumbLeft(dragPosition);
      onChange(draggedValue);
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
        display: "flex",
        alignItems: "center",
        width: width,
        position: "relative",
      }}
    >
      <div
        ref={trackRef}
        className="big-d"
        onMouseDown={onMouseDown}
        style={{
          // border: "none",
          display: "flex",
          position: "absolute",
        }}
      >
        <div
          className="bpm-slider-track-left"
          style={{
            border: "none",
            borderRadius: 5,
            height: 10,
            width: thumbLeft + 0.5 * thumbwidth,
          }}
        ></div>
        <div
          className="bpm-slider-track-right"
          style={{
            border: "none",
            borderRadius: 5,
            width: width - 0.5 * thumbwidth - thumbLeft,
          }}
        ></div>
      </div>
      <div
        className="bpm-slider-thumb"
        onMouseDown={onMouseDown}
        ref={thumbRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          height: 25,
          padding: "0.5ch 2ch 0.5ch 2ch",
          borderRadius: "3ch",
          position: "absolute",
          left: thumbLeft,
        }}
      >
        <div>
          <input
            className="bpm-slider-input"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            ref={inputRef}
            style={{
              textAlign: "right",
              margin: "auto",
              border: "none",
              background: "transparent",
              color: "black",
            }}
            type="text"
            maxLength={3}
            onKeyDown={(event) => {
              var chr = event.key;

              if (
                event.ctrlKey ||
                event.altKey ||
                typeof event.key !== "string" ||
                event.key.length !== 1
              ) {
                return;
              }
              if ("0123456789".indexOf(chr) < 0) {
                event.preventDefault();
                return true;
              } else {
                return false;
              }
            }}
            min={min}
            max={max}
            onBlur={(e) => {
              const newValue = Math.max(
                min,
                Math.min(max, Number(e.target.value))
              );
              e.target.value = newValue.toString();
              onChange(newValue);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                inputRef.current?.blur();
              }
            }}
          ></input>
          <label
            className="bpm-slider-bpm-label"
            style={{ color: "black", fontWeight: "bold", fontSize: "0.5em" }}
          >
            Bpm
          </label>
        </div>
      </div>
    </div>
  );
};

export default Slider;
