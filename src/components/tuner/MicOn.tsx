import React from "react";
import micOn from "./assets/mic-on.svg";

interface Props {
  size: number;
}

const MicOn = ({ size }: Props) => {
  console.log(micOn);
  return (
    <svg x="50" height={size} width={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="black"></circle>
    </svg>
  );
};
export default MicOn;
