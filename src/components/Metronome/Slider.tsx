import React, { useRef, useState } from "react";

interface Props {
  width: number;
  min: number;
  max: number;
  value: number;
  onChangeCallback: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider = ({ width, min, max, value, onChangeCallback }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const clickRef = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    clickRef.current = e.clientX;
    console.log(clickRef.current);
    onmouseup = (e) => {
      setIsDragging(false);
      setThumbLeft(thumbLeft + (e.clientX - clickRef.current));
    };
    onmousemove = (e) => {
      const pos = Math.max(
        0,
        Math.min(width, thumbLeft + (e.clientX - clickRef.current))
      );
      const fraction = pos / width;
      setSliderValue(Math.round(min + fraction * (max - min)));
      setMouseX(e.clientX);
    };
  };

  return (
    <div
      style={{
        backgroundColor: "red",
        width: width,
        height: 20,
        position: "relative",
      }}
    >
      <label
        style={{
          position: "absolute",
          left: isDragging
            ? Math.max(
                0,
                Math.min(width, thumbLeft + (mouseX - clickRef.current))
              )
            : thumbLeft,
        }}
        onMouseDown={onMouseDown}
      >
        {sliderValue} bpm
      </label>
    </div>
  );
};

export default Slider;
