import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { clamp } from "../../utils/clamp";
import "./Slider.css";
import { playerTimeToSeconds, secondsToPlayerTime } from "../../utils/time";

interface Props {
  width: number | string;
  min: number;
  max: number;
  value: number;
  displayType?: "number" | "time";
  updateOnDrag?: boolean;
  label?: string;
  inputPosition?: "none" | "top" | "bottom";
  rounding?: (v: number) => number;
  onChange: (percentage: number) => void;
}

const Slider = ({
  width,
  min,
  max,
  value,
  displayType = "number",
  updateOnDrag = true,
  label = "",
  inputPosition = "bottom",
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

  const [percentage, setPercentage] = useState(0);

  const trackWidthRef = useRef(0);
  const thumbWidthRef = useRef(0);
  useEffect(() => {
    if (!trackRef.current) return;

    const observer = new ResizeObserver(() => {
      if (trackRef.current && thumbRef.current) {
        trackWidthRef.current = trackRef.current.getBoundingClientRect().width;
        thumbWidthRef.current = thumbRef.current.getBoundingClientRect().width;
      }
    });

    observer.observe(trackRef.current);

    return () => observer.disconnect();
  }, []);

  const positionToValue = (pos: number) => {
    const adjustedPos = pos - 0.5 * thumbWidthRef.current;
    return (
      min +
      (max - min) *
        (adjustedPos / (trackWidthRef.current - thumbWidthRef.current))
    );
  };

  const valueToPosition = (value: number) => {
    const thumbPadding =
      100 * 0.5 * (thumbWidthRef.current / trackWidthRef.current);
    const valuePercentage = (100 * (value - min)) / (max - min);
    const adjustedTrackWidth = trackWidthRef.current - thumbWidthRef.current;
    return (
      thumbPadding +
      (valuePercentage * adjustedTrackWidth) / trackWidthRef.current
    );
  };

  useLayoutEffect(() => {
    const setDimensions = () => {
      if (trackRef.current !== null && thumbRef.current !== null) {
        trackWidthRef.current = trackRef.current.getBoundingClientRect().width;
        thumbWidthRef.current = thumbRef.current.getBoundingClientRect().width;
        const pos = valueToPosition(value);
        setPercentage(pos);
      }
    };
    setDimensions();
  }, []);

  const getTrackX = () => {
    if (trackRef.current !== null) {
      return trackRef.current.getBoundingClientRect().x;
    } else return 0;
  };

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
      setPercentage((100 * dragPositionRef.current) / trackWidthRef.current);
      setInputValue(
        rounding(positionToValue(dragPositionRef.current)).toString()
      );
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [isSliderHovering, setIsSliderHovering] = useState(false);
  const [isInputHovering, setIsInputHovering] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const onPressDown = (downEvent: React.MouseEvent | React.TouchEvent) => {
    downEvent.preventDefault();
    setIsDragging(true);
    dragPositionRef.current = clamp(
      0.5 * thumbWidthRef.current,
      getEventX(downEvent.nativeEvent) - getTrackX(),
      trackWidthRef.current - 0.5 * thumbWidthRef.current
    );
    if (updateOnDrag) {
      onChange(rounding(positionToValue(dragPositionRef.current)));
    } else {
      setPercentage((100 * dragPositionRef.current) / trackWidthRef.current);
      setInputValue(
        rounding(positionToValue(dragPositionRef.current)).toString()
      );
    }
    addEventListener("mousemove", dragHandler);
    addEventListener("touchmove", dragHandler);
    addEventListener("mouseup", onRelease);
    addEventListener("touchend", onRelease);
  };

  const onRelease = () => {
    setIsDragging(false);
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
    setPercentage(valueToPosition(value));
    if (displayType === "number") {
      setInputValue(value.toString());
    } else if (displayType === "time") {
      setInputValue(secondsToPlayerTime(value));
    }
  }, [value]);
  const handleBlur = () => {
    let blurValue = value;
    const numberConversion =
      displayType === "time" ? playerTimeToSeconds : parseFloat;
    try {
      blurValue = numberConversion(inputValue);
    } catch {}
    if (isNaN(blurValue)) {
      blurValue = min;
    } else {
      blurValue = clamp(min, blurValue, max);
    }
    setInputValue(
      displayType === "number"
        ? blurValue.toString()
        : secondsToPlayerTime(blurValue)
    );
    onChange(blurValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Enter",
    ];

    const validCharsExp = displayType === "number" ? /[\d-]/ : /[\d-:]/;
    if (!validCharsExp.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  const [isActivated, setIsActivated] = useState(false);
  useEffect(() => {
    if (isDragging || isInputHovering || isSliderHovering || isInputFocused) {
      setIsActivated(true);
    } else {
      setIsActivated(false);
    }
  }, [isDragging, isInputHovering, isSliderHovering, isInputFocused]);

  return (
    <div
      ref={trackRef}
      className="custom-slider"
      onMouseDown={onPressDown}
      onTouchStart={onPressDown}
      onMouseEnter={() => setIsSliderHovering(true)}
      onMouseLeave={() => setIsSliderHovering(false)}
      style={{
        width: width,
      }}
    >
      <div
        className={`custom-slider-track-left ${isActivated ? "activated" : ""}`}
        style={{ width: `${percentage}%` }}
      ></div>
      <div
        className={`custom-slider-track-right ${
          isActivated ? "activated" : ""
        }`}
        style={{ width: `${100 - percentage}%` }}
      ></div>
      <div
        className="custom-slider-thumb"
        onMouseDown={onPressDown}
        onTouchStart={onPressDown}
        ref={thumbRef}
        style={{ left: `${percentage}%` }}
      ></div>
      <div
        className={`custom-slider-panel acrylic ${
          isActivated ? "visible" : "fade-out"
        }`}
        style={{
          top: inputPosition === "bottom" ? "1.25em" : "-1.75em",
          left: `${percentage}%`,
        }}
        onMouseEnter={() => setIsInputHovering(true)}
        onMouseLeave={() => setIsInputHovering(false)}
      >
        <input
          className="custom-slider-input"
          style={{
            width: (inputValue.length + 1).toString() + "ch",
          }}
          ref={inputRef}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            setIsInputFocused(false);
            handleBlur();
          }}
          min={min}
          max={max}
          maxLength={
            displayType === "number"
              ? Math.max(min.toString().length, max.toString().length)
              : Math.max(
                  secondsToPlayerTime(min).length,
                  secondsToPlayerTime(max).length
                )
          }
          onKeyDown={handleKeyDown}
        ></input>
        <label style={{ fontSize: "0.5em" }}>{label}</label>
      </div>
    </div>
  );
};

export default Slider;
