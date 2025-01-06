import React, { useEffect, useRef, useState } from "react";

const TestComponent = () => {
  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [color, setColor] = useState("green");
  const colorRef = useRef("green");

  useEffect(() => {
    const interval = setInterval(() => {
      if (colorRef.current === "green") {
        setColor("red");
        colorRef.current = "red";
        console.log("turned red");
      } else {
        setColor("green");
        colorRef.current = "green";
        console.log("turned green");
      }
    }, 250);
  }, []);

  return (
    <div style={{ height: color === "red" ? 100 : 50, backgroundColor: color }}>
      TestComponent
    </div>
  );
};

export default TestComponent;
