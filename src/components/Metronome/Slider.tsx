import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

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

  const [inputValue, setInputValue] = useState(value.toString());
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);
  const handleBlur = () => {
    let blurValue = parseFloat(inputValue);
    if (isNaN(blurValue)) {
      blurValue = min;
    } else {
      blurValue = Math.min(Math.max(blurValue, min), max);
    }
    setInputValue(blurValue.toString());
    onChange(blurValue);
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
          borderRadius: "0.5em",
          position: "absolute",
          left: thumbLeft,
        }}
      >
        <input
          style={{ width: "7ch", borderRadius: "0.5em" }}
          ref={inputRef}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="number"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onBlur={() => {
            handleBlur();
          }}
          min={min}
          max={max}
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
