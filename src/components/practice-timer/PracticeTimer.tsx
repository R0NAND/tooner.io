import React, { useEffect, useState } from "react";

const PracticeTimer = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time + 1);
    }, 1000);
  }, [time]);
  return <div>{time}</div>;
};

export default PracticeTimer;
