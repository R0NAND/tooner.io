import { useState } from "react";
import Slider from "./slider/Slider";

const TestComponent = () => {
  // const getRandomColor = () => {
  //   var letters = "0123456789ABCDEF";
  //   var color = "#";
  //   for (var i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // };

  // const [color, setColor] = useState("green");
  // const colorRef = useRef("green");

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (colorRef.current === "green") {
  //       setColor("red");
  //       colorRef.current = "red";
  //       console.log("turned red");
  //     } else {
  //       setColor("green");
  //       colorRef.current = "green";
  //       console.log("turned green");
  //     }
  //   }, 250);
  // }, []);

  const [sliderValue, setSliderValue] = useState(50);
  return (
    <div style={{ display: "grid", gridTemplate: "50% 50%" }}>
      <div>
        <h1>My Slider</h1>
        <Slider
          width={"auto"}
          min={0}
          max={100}
          value={sliderValue}
          onChange={setSliderValue}
        ></Slider>
        <p>This is test text to see how my slider responds to drrrraggginngg</p>
      </div>
      <div>
        <h1>Default Slider</h1>
        <input
          style={{
            display: "inline",
            width: "auto",
            fontSize: "inherit",
          }}
          min={0}
          max={100}
          defaultValue={50}
          type="range"
        ></input>
        <p>This is test text to see how my slider responds to drrrraggginngg</p>
      </div>
    </div>
    // <div style={{ height: color === "red" ? 100 : 50, backgroundColor: color }}>
    //   TestComponent
    // </div>
  );
};

export default TestComponent;
