import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { clamp } from "../../utils/clamp";
import "./Slider.css";

interface Props {
  width: number | string;
  min: number;
  max: number;
  value: number;
  updateOnDrag?: boolean;
  label?: string;
  rounding?: (v: number) => number;
  onChange: (percentage: number) => void;
}

const Slider = ({
  width,
  min,
  max,
  value,
  updateOnDrag = true,
  label = "",
  rounding = (v: number) => {
    return Math.round(v);
  },
  onChange,
}: Props) => {
  useEffect(() => {
    if (value < min || value > max) {
      throw new Error("value not within range");
    }
  }, [min, max, value]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [thumbPos, setThumbPos] = useState(0);
  const trackWidthRef = useRef(0);
  const thumbWidthRef = useRef(0);

  const positionToValue = (pos: number) => {
    const adjustedPos = pos - 0.5 * thumbWidthRef.current;
    return (
      min +
      (max - min) *
        (adjustedPos / (trackWidthRef.current - thumbWidthRef.current))
    );
  };

  const valueToPosition = (value: number) => {
    return (
      0.5 * thumbWidthRef.current +
      (trackWidthRef.current - thumbWidthRef.current) *
        ((value - min) / (max - min))
    );
  };

  useLayoutEffect(() => {
    const setDimensions = () => {
      if (trackRef.current !== null && thumbRef.current !== null) {
        trackWidthRef.current = trackRef.current.getBoundingClientRect().width;
        thumbWidthRef.current = thumbRef.current.getBoundingClientRect().width;
        const pos =
          0.5 * thumbRef.current.getBoundingClientRect().width +
          (trackRef.current.getBoundingClientRect().width -
            thumbRef.current.getBoundingClientRect().width) *
            ((value - min) / (max - min));
        setThumbPos(pos);
      }
    };

    window.addEventListener("resize", setDimensions);
    setDimensions();
    return () => window.removeEventListener("resize", setDimensions);
  }, []);

  const getTrackX = () => {
    if (trackRef.current !== null) {
      return trackRef.current.getBoundingClientRect().x;
    } else return 0;
  };

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.value = value.toString();
    }
    setThumbPos(valueToPosition(value));
  }, [value]);

  const getEventX = (e: MouseEvent | TouchEvent): number => {
    if ("touches" in e) {
      return e.touches[0].clientX;
    } else {
      return e.clientX;
    }
  };

  const dragPositionRef = useRef(0);
  const dragHandler = (e: MouseEvent | TouchEvent) => {
    dragPositionRef.current = clamp(
      0.5 * thumbWidthRef.current,
      getEventX(e) - getTrackX(),
      trackWidthRef.current - 0.5 * thumbWidthRef.current
    );

    if (updateOnDrag) {
      onChange(rounding(positionToValue(dragPositionRef.current)));
    } else {
      setThumbPos(dragPositionRef.current);
      setInputValue(
        rounding(positionToValue(dragPositionRef.current)).toString()
      );
    }
  };

  const onPressDown = (downEvent: React.MouseEvent | React.TouchEvent) => {
    dragPositionRef.current = clamp(
      0.5 * thumbWidthRef.current,
      getEventX(downEvent.nativeEvent) - getTrackX(),
      trackWidthRef.current - 0.5 * thumbWidthRef.current
    );
    if (updateOnDrag) {
      onChange(rounding(positionToValue(dragPositionRef.current)));
    } else {
      setThumbPos(dragPositionRef.current);
      setInputValue(
        rounding(positionToValue(dragPositionRef.current)).toString()
      );
    }
    addEventListener("mousemove", dragHandler);
    addEventListener("touchmove", dragHandler);
    addEventListener("mouseup", onRelease);
    addEventListener("touchend", onRelease);
  };

  const onRelease = (e: MouseEvent | TouchEvent) => {
    if (!updateOnDrag) {
      onChange(rounding(positionToValue(dragPositionRef.current)));
    }
    removeEventListener("mousemove", dragHandler);
    removeEventListener("touchmove", dragHandler);
    removeEventListener("mouseup", onRelease);
    removeEventListener("touchend", onRelease);
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
      blurValue = clamp(min, blurValue, max);
    }
    setInputValue(blurValue.toString());
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
        className="bpm-slider-track-right"
        style={{
          width: "100%",
          height: "0.5em",
          position: "absolute",
          top: "0.5em",
          border: "none",
          borderRadius: 5,
        }}
      >
        <div
          className="bpm-slider-track-left"
          style={{
            height: "0.5em",
            border: "none",
            borderRadius: 5,
            width: thumbPos,
          }}
        ></div>
      </div>
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
          left: thumbPos,
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "2em",
          left: thumbPos,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input
          style={{
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
        {label !== "" && <label>{label}</label>}
      </div>
    </div>
  );
};

export default Slider;
