import { useEffect, useRef, useState } from "react";
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
  const calcWidth = () => {
    const font = window
      //@ts-ignore
      .getComputedStyle(inputRef.current, null)
      .getPropertyValue("font");
    const tWidth = measureTextWidth(children, font, 1);
    setTextWidth(tWidth);
  };

  useEffect(() => {
    calcWidth();
    setTransitoryValue(children);
  }, [children]);

  useEffect(() => {
    //Handles my case where I change font size with screen size
    addEventListener("resize", calcWidth);
    return () => {
      removeEventListener("resize", calcWidth);
    };
  }, []);

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
      style={{ width: textWidth, fontFamily: "inherit" }}
    ></input>
  );
};

export default EditableText;
