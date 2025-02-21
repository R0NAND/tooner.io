import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Slider.css";

interface Props {
  width: number | string;
  min: number;
  max: number;
  value: number;
  updateOnDrag?: boolean;
  onChange: (percentage: number) => void;
}

const Slider = ({
  width,
  min,
  max,
  value,
  updateOnDrag = true,
  onChange,
}: Props) => {
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
    console.log("ayo");
    setDimensions();
    return () => window.removeEventListener("resize", setDimensions);
  }, []);

  const getTrackPosition = () => {
    if (trackRef.current !== null) {
      return trackRef.current.getBoundingClientRect().x;
    } else return 0;
  };

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.value = value.toString();
    }
    setThumbLeft((trackWidth - thumbWidth) * ((value - min) / (max - min)));
  }, [value]);

  const getEventX = (e: MouseEvent | TouchEvent): number => {
    if ("touches" in e) {
      return e.touches[0].clientX;
    } else {
      return e.clientX;
    }
  };

  const dragValueRef = useRef(0);
  const onPressDown = (downEvent: React.MouseEvent | React.TouchEvent) => {
    downEvent.preventDefault();
    const clickPosition = getEventX(downEvent.nativeEvent) - getTrackPosition();
    const newThumbLeft = Math.max(
      0.5 * thumbWidth,
      Math.min(trackWidth - 0.5 * thumbWidth, clickPosition)
    );
    const clickedValue =
      min + (max - min) * (newThumbLeft / (trackWidth - thumbWidth));
    if (updateOnDrag) {
      onChange(clickedValue);
    }
    setThumbLeft(newThumbLeft);

    const dragHandler = (e: MouseEvent | TouchEvent) => {
      const dragPosition = Math.max(
        0.5 * thumbWidth,
        Math.min(
          trackWidth - 0.5 * thumbWidth,
          newThumbLeft + (getEventX(e) - getEventX(downEvent.nativeEvent))
        )
      );
      dragValueRef.current =
        min + (max - min) * (dragPosition / (trackWidth - 0.5 * thumbWidth));
      setThumbLeft(dragPosition);
      if (updateOnDrag) {
        onChange(dragValueRef.current);
      }
    };
    addEventListener("mousemove", dragHandler);
    addEventListener("touchmove", dragHandler);

    addEventListener(
      "mouseup",
      () => {
        removeEventListener("mousemove", dragHandler);
        removeEventListener("touchmove", dragHandler);
        if (!updateOnDrag) {
          onChange(dragValueRef.current);
        }
      },
      { once: true }
    );
    addEventListener(
      "touchend",
      () => {
        removeEventListener("mousemove", dragHandler);
        removeEventListener("touchmove", dragHandler);
        if (!updateOnDrag) {
          onChange(dragValueRef.current);
        }
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
    debugger;
    onChange(blurValue);
  };

  return (
    <div
      ref={trackRef}
      className="big-d"
      onMouseDown={onPressDown}
      onTouchStart={onPressDown}
      style={{
        width: width,
        height: "5em",
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
          position: "absolute",
          top: "0.5em",
          left: "0",
          border: "none",
          borderRadius: 5,
          width: thumbLeft,
        }}
      ></div>
      <div
        className="bpm-slider-track-right"
        style={{
          height: "0.5em",
          position: "absolute",
          top: "0.5em",
          left: thumbLeft,
          border: "none",
          borderRadius: 5,
          width: trackWidth - thumbLeft,
        }}
      ></div>
      <div
        className="bpm-slider-thumb"
        onMouseDown={onPressDown}
        onTouchStart={onPressDown}
        ref={thumbRef}
        style={{
          height: "1.5em",
          width: "1.5em",
          top: "0",
          borderRadius: "50%",
          position: "absolute",
          transform: "translateX(-50%)",
          left: thumbLeft,
        }}
      ></div>
      <input
        style={{
          position: "absolute",
          top: "2.5em",
          left: thumbLeft,
          transform: "translateX(-50%)",
          width: "7ch",
          borderRadius: "0.5em",
        }}
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
  );
};

export default Slider;
