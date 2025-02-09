import React, { useEffect, useRef, useState } from "react";
import { measureTextWidth } from "../utils/measureTextWidth";

interface Props {
  children: string;
  onEditCompleted: (newString: string, oldString: string) => boolean;
}

const EditableText = ({ children, onEditCompleted }: Props) => {
  const [transitoryValue, setTransitoryValue] = useState(children);
  const onFocusRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [textWidth, setTextWidth] = useState(0);
  useEffect(() => {
    const tWidth = measureTextWidth(children, inputRef.current?.style.font);
    setTextWidth(tWidth);
    setTransitoryValue(children);
  }, [children]);

  return (
    <input
      ref={inputRef}
      className="tuning-name-input"
      type="text"
      value={transitoryValue}
      onFocus={(e) => {
        onFocusRef.current = e.target.value;
      }}
      onChange={(e) => {
        setTransitoryValue(e.target.value);
      }}
      onBlur={(e) => {
        if (!onEditCompleted(e.target.value, onFocusRef.current)) {
          setTransitoryValue(onFocusRef.current);
        }
        onFocusRef.current = "";
      }}
      style={{ width: textWidth }}
    ></input>
  );
};

export default EditableText;
