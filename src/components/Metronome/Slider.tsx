import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import MetronomeVector from "./assets/MetronomeVector";
import "./Slider.css";

interface Props {
  width: number | string;
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

  const [thumbLeft, setThumbLeft] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const setDimensions = () => {
      if (trackRef.current !== null && thumbRef.current !== null) {
        setTrackWidth(trackRef.current.getBoundingClientRect().width);
        setThumbWidth(thumbRef.current.getBoundingClientRect().width);
        setThumbLeft(
          (trackRef.current.getBoundingClientRect().width -
            thumbRef.current.getBoundingClientRect().width) *
            ((value - min) / (max - min))
        );
      }
    };
    window.addEventListener("resize", setDimensions);
    setDimensions();
    return () => window.removeEventListener("resize", setDimensions);
  });

  const getTrackPosition = () => {
    if (trackRef.current != null) {
      return trackRef.current.getBoundingClientRect().x;
    } else return 0;
  };

  useEffect(() => {
    if (inputRef.current != null) {
      inputRef.current.value = value.toString();
    }
    setThumbLeft((trackWidth - thumbWidth) * ((value - min) / (max - min)));
  }, [value]);

  const onMouseDown = (downEvent: React.MouseEvent<HTMLDivElement>) => {
    const clickPosition =
      downEvent.clientX - getTrackPosition() - 0.5 * thumbWidth;
    const newThumbLeft = Math.max(
      0,
      Math.min(trackWidth - thumbWidth, clickPosition)
    );
    const clickedValue =
      min + (max - min) * (newThumbLeft / (trackWidth - thumbWidth));
    onChange(clickedValue);
    setThumbLeft(newThumbLeft);
    downEvent.preventDefault();

    const mouseMoveHandler = (e: MouseEvent) => {
      const dragPosition = Math.max(
        0,
        Math.min(
          trackWidth - thumbWidth,
          newThumbLeft + (e.clientX - downEvent.clientX)
        )
      );
      const draggedValue =
        min + (max - min) * (dragPosition / (trackWidth - thumbWidth));
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
      ref={trackRef}
      className="big-d"
      onMouseDown={onMouseDown}
      style={{
        width: width,
        height: "1.5em",
        border: "none",
        display: "flex",
        position: "relative",
        alignItems: "center",
      }}
    >
      <div
        className="bpm-slider-track-left"
        style={{
          height: "0.5em",
          border: "none",
          borderRadius: 5,
          width: thumbLeft + 0.5 * thumbWidth,
        }}
      ></div>
      <div
        className="bpm-slider-track-right"
        style={{
          height: "0.5em",
          border: "none",
          borderRadius: 5,
          width: trackWidth - 0.5 * thumbWidth - thumbLeft,
        }}
      ></div>
      <div
        className="bpm-slider-thumb"
        onMouseDown={onMouseDown}
        ref={thumbRef}
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          height: "1.5em",
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
          <span
            className="bpm-slider-bpm-label"
            style={{ color: "black", fontWeight: "bold", fontSize: "0.5em" }}
          >
            Bpm
          </span>
        </div>
      </div>
    </div>
  );
};

export default Slider;
