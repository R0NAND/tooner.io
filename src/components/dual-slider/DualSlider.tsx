import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { clamp } from "../../utils/clamp";
import "./DualSlider.css";
import { playerTimeToSeconds, secondsToPlayerTime } from "../../utils/time";

interface Props {
  width: number | string;
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  displayType?: "number" | "time";
  updateOnDrag?: boolean;
  label?: string;
  inputPosition?: "none" | "top" | "bottom";
  rounding?: (v: number) => number;
  onMinChange: (percentage: number) => void;
  onMaxChange: (percentage: number) => void;
}

const Slider = ({
  width,
  min,
  max,
  minValue,
  maxValue,
  displayType,
  updateOnDrag = true,
  label = "",
  inputPosition = "bottom",
  rounding = (v: number) => {
    return Math.round(v);
  },
  onMinChange,
  onMaxChange,
}: Props) => {
  useEffect(() => {
    if (minValue < min || minValue > max || maxValue < min || maxValue > max) {
      throw new Error("minValue not within range");
    }
  }, [min, max, minValue, maxValue]);

  const minInputRef = useRef<HTMLInputElement | null>(null);
  const maxInputRef = useRef<HTMLInputElement | null>(null);
  const minThumbRef = useRef<HTMLDivElement | null>(null);
  const maxThumbRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [topThumb, setTopThumb] = useState("max");
  const [minPercentage, setMinPercentage] = useState(0);
  const [maxPercentage, setMaxPercentage] = useState(0);
  const trackWidthRef = useRef(0);
  const thumbWidthRef = useRef(0);
  useEffect(() => {
    if (!trackRef.current) return;

    const observer = new ResizeObserver(() => {
      if (trackRef.current && minThumbRef.current) {
        trackWidthRef.current = trackRef.current.getBoundingClientRect().width;
        thumbWidthRef.current =
          minThumbRef.current.getBoundingClientRect().width;
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

  const valueToPercentage = (value: number) => {
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
      if (trackRef.current !== null && minThumbRef.current !== null) {
        trackWidthRef.current = trackRef.current.getBoundingClientRect().width;
        thumbWidthRef.current =
          minThumbRef.current.getBoundingClientRect().width;
        setMinPercentage(valueToPercentage(minValue));
        setMaxPercentage(valueToPercentage(maxValue));
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

  const minDragPositionRef = useRef(0);
  const minDragHandler = (e: MouseEvent | TouchEvent) => {
    minDragPositionRef.current = clamp(
      0.5 * thumbWidthRef.current,
      getEventX(e) - getTrackX(),
      Math.floor(0.01 * maxPercentage * trackWidthRef.current - 1)
    );

    if (updateOnDrag) {
      onMinChange(rounding(positionToValue(minDragPositionRef.current)));
    } else {
      setMinPercentage(
        (100 * minDragPositionRef.current) / trackWidthRef.current
      );
      setMinInputValue(
        rounding(positionToValue(minDragPositionRef.current)).toString()
      );
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [isSliderHovering, setIsSliderHovering] = useState(false);
  const [isMinInputHovering, setIsMinInputHovering] = useState(false);
  const [isMinInputFocused, setIsMinInputFocused] = useState(false);
  const onPressDown = (downEvent: React.MouseEvent | React.TouchEvent) => {
    downEvent.preventDefault();
    const clickPosition = getEventX(downEvent.nativeEvent) - getTrackX();
    if (
      Math.abs(0.01 * minPercentage * trackWidthRef.current - clickPosition) <
      Math.abs(0.01 * maxPercentage * trackWidthRef.current - clickPosition)
    ) {
      setTopThumb("min");
      setIsDragging(true);
      minDragPositionRef.current = clamp(
        0.5 * thumbWidthRef.current,
        clickPosition,
        trackWidthRef.current - 0.5 * thumbWidthRef.current
      );
      if (updateOnDrag) {
        onMinChange(rounding(positionToValue(minDragPositionRef.current)));
      } else {
        setMinPercentage(minDragPositionRef.current / trackWidthRef.current);
        setMinInputValue(
          rounding(positionToValue(minDragPositionRef.current)).toString()
        );
      }
      addEventListener("mousemove", minDragHandler);
      addEventListener("touchmove", minDragHandler);
      addEventListener("mouseup", onMinRelease);
      addEventListener("touchend", onMinRelease);
    } else {
      setTopThumb("max");
      setIsDragging(true);
      maxDragPositionRef.current = clamp(
        0.5 * thumbWidthRef.current,
        clickPosition,
        trackWidthRef.current - 0.5 * thumbWidthRef.current
      );
      if (updateOnDrag) {
        onMaxChange(rounding(positionToValue(maxDragPositionRef.current)));
      } else {
        setMaxPercentage(
          (100 * maxDragPositionRef.current) / trackWidthRef.current
        );
        setMaxInputValue(
          rounding(positionToValue(maxDragPositionRef.current)).toString()
        );
      }
      addEventListener("mousemove", maxDragHandler);
      addEventListener("touchmove", maxDragHandler);
      addEventListener("mouseup", onMaxRelease);
      addEventListener("touchend", onMaxRelease);
    }
  };

  const onMinRelease = () => {
    setIsDragging(false);
    if (!updateOnDrag) {
      onMinChange(rounding(positionToValue(minDragPositionRef.current)));
    }
    removeEventListener("mousemove", minDragHandler);
    removeEventListener("touchmove", minDragHandler);
    removeEventListener("mouseup", onMinRelease);
    removeEventListener("touchend", onMinRelease);
  };

  const [minInputValue, setMinInputValue] = useState(minValue.toString());
  useEffect(() => {
    setMinPercentage(valueToPercentage(minValue));
    if (displayType === "number") {
      setMinInputValue(minValue.toString());
    } else if (displayType === "time") {
      setMinInputValue(secondsToPlayerTime(minValue));
    }
  }, [minValue]);
  const handleMinBlur = () => {
    let blurValue = minValue;
    const numberConversion =
      displayType === "time" ? playerTimeToSeconds : parseFloat;
    try {
      blurValue = numberConversion(minInputValue);
    } catch {}
    if (isNaN(blurValue)) {
      blurValue = min;
    } else {
      blurValue = clamp(min, blurValue, maxValue - 1);
    }
    setMinInputValue(
      displayType === "number"
        ? blurValue.toString()
        : secondsToPlayerTime(blurValue)
    );
    onMinChange(blurValue);
  };

  const maxDragPositionRef = useRef(0);
  const maxDragHandler = (e: MouseEvent | TouchEvent) => {
    maxDragPositionRef.current = clamp(
      Math.ceil(0.01 * minPercentage * trackWidthRef.current + 1),
      getEventX(e) - getTrackX(),
      trackWidthRef.current - 0.5 * thumbWidthRef.current
    );

    if (updateOnDrag) {
      onMaxChange(rounding(positionToValue(maxDragPositionRef.current)));
    } else {
      setMaxPercentage(
        (100 * maxDragPositionRef.current) / trackWidthRef.current
      );
      setMaxInputValue(
        rounding(positionToValue(maxDragPositionRef.current)).toString()
      );
    }
  };

  const [isMaxInputHovering, setIsMaxInputHovering] = useState(false);
  const [isMaxInputFocused, setIsMaxInputFocused] = useState(false);

  const onMaxRelease = () => {
    setIsDragging(false);
    if (!updateOnDrag) {
      onMaxChange(rounding(positionToValue(maxDragPositionRef.current)));
    }
    removeEventListener("mousemove", maxDragHandler);
    removeEventListener("touchmove", maxDragHandler);
    removeEventListener("mouseup", onMaxRelease);
    removeEventListener("touchend", onMaxRelease);
  };

  const [maxInputValue, setMaxInputValue] = useState(maxValue.toString());
  useEffect(() => {
    setMaxPercentage(valueToPercentage(maxValue));
    if (displayType === "number") {
      setMaxInputValue(maxValue.toString());
    } else if (displayType === "time") {
      setMaxInputValue(secondsToPlayerTime(maxValue));
    }
  }, [maxValue]);
  const handleMaxBlur = () => {
    let blurValue = maxValue;
    const numberConversion =
      displayType === "time" ? playerTimeToSeconds : parseFloat;
    try {
      blurValue = numberConversion(maxInputValue);
    } catch {}
    if (isNaN(blurValue)) {
      blurValue = max;
    } else {
      blurValue = clamp(minValue + 1, blurValue, max);
    }
    setMaxInputValue(
      displayType === "number"
        ? blurValue.toString()
        : secondsToPlayerTime(blurValue)
    );
    onMaxChange(blurValue);
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
      if (isMinInputFocused) {
        minInputRef.current?.blur();
      } else {
        maxInputRef.current?.blur();
      }
    }
  };

  const [isActivated, setIsActivated] = useState(false);
  useEffect(() => {
    if (
      isDragging ||
      isMinInputHovering ||
      isSliderHovering ||
      isMinInputFocused ||
      isMaxInputHovering ||
      isMaxInputFocused
    ) {
      setIsActivated(true);
    } else {
      setIsActivated(false);
    }
  }, [
    isDragging,
    isMinInputHovering,
    isSliderHovering,
    isMinInputFocused,
    isMaxInputHovering,
    isMaxInputFocused,
  ]);
  return (
    <div
      ref={trackRef}
      className="dual-slider"
      style={{
        width: width,
      }}
      onMouseDown={onPressDown}
      onTouchStart={onPressDown}
      onMouseEnter={() => setIsSliderHovering(true)}
      onMouseLeave={() => setIsSliderHovering(false)}
    >
      <div
        className={`dual-slider-track-left ${isActivated ? "activated" : ""}`}
        style={{ width: `${minPercentage}%` }}
      ></div>
      <div
        className={`dual-slider-track-middle ${isActivated ? "activated" : ""}`}
        style={{ width: `${maxPercentage - minPercentage}%` }}
      ></div>
      <div
        className={`dual-slider-track-right ${isActivated ? "activated" : ""}`}
        style={{ width: `${100 - maxPercentage}%` }}
      ></div>
      <div
        className="dual-slider-thumb"
        ref={minThumbRef}
        style={{
          left: `${minPercentage}%`,
          zIndex: topThumb === "min" ? 10 : 1,
        }}
      ></div>
      <div
        className={`dual-slider-panel acrylic ${
          isActivated ? "visible" : "fade-out"
        }`}
        style={{
          top: inputPosition === "bottom" ? "1.25em" : "-1.75em",
          left: `${minPercentage}%`,
          zIndex: topThumb === "min" ? 10 : 1,
        }}
        onMouseEnter={() => setIsMinInputHovering(true)}
        onMouseLeave={() => setIsMinInputHovering(false)}
      >
        <input
          className="dual-slider-input"
          style={{
            width: (minInputValue.length + 1).toString() + "ch",
          }}
          ref={minInputRef}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="text"
          value={minInputValue}
          onChange={(e) => {
            setMinInputValue(e.target.value);
          }}
          onFocus={() => setIsMinInputFocused(true)}
          onBlur={() => {
            setIsMinInputFocused(false);
            handleMinBlur();
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
      <div
        className="dual-slider-thumb"
        ref={maxThumbRef}
        style={{
          left: `${maxPercentage}%`,
          zIndex: topThumb === "max" ? 10 : 1,
        }}
      ></div>
      <div
        className={`dual-slider-panel acrylic ${
          isActivated ? "visible" : "fade-out"
        }`}
        style={{
          top: inputPosition === "bottom" ? "-1.75em" : "1.25em",
          left: `${maxPercentage}%`,
          zIndex: topThumb === "max" ? 10 : 1,
        }}
        onMouseEnter={() => setIsMaxInputHovering(true)}
        onMouseLeave={() => setIsMaxInputHovering(false)}
      >
        <input
          className="dual-slider-input"
          style={{
            width: (maxInputValue.length + 1).toString() + "ch",
          }}
          ref={maxInputRef}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          type="text"
          value={maxInputValue}
          onChange={(e) => {
            setMaxInputValue(e.target.value);
          }}
          onFocus={() => setIsMaxInputFocused(true)}
          onBlur={() => {
            setIsMaxInputFocused(false);
            handleMaxBlur();
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
