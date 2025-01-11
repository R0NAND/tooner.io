import { faCancel, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

const PracticeTimer = () => {
  const defaultPracticeMinutes = 30;

  const [hasStarted, setHasStarted] = useState(false);
  const [isTiming, setIsTiming] = useState(false);
  const [practiceHours, setPracticeHours] = useState(0);
  const [practiceMinutes, setPracticeMinutes] = useState(
    defaultPracticeMinutes
  );
  const [practiceSeconds, setPracticeSeconds] = useState(0);

  const endTime = useRef(-1);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const onClick = () => {
    if (!isTiming) {
      setPracticeHours(Math.floor(practiceMinutes / 60));
      setPracticeMinutes(practiceMinutes % 60);
      endTime.current =
        Date.now() + practiceMinutes * 60000 + practiceSeconds * 1000;
      timer.current = setInterval(() => {
        const time = Date.now();
        if (time >= endTime.current) {
          setPracticeSeconds(0);
          setPracticeMinutes(0);
          setHasStarted(false);
          setIsTiming(false);
          endTime.current = -1;
          clearInterval(timer.current);
          return;
        }
        setPracticeSeconds(
          Math.round(((endTime.current - time) % 60000) / 1000) % 60
        );
        setPracticeMinutes(Math.floor((endTime.current - time) / 60000) % 60);
        setPracticeHours(Math.floor((endTime.current - time) / 3600000));
      }, 1000);
      setHasStarted(true);
      setIsTiming(true);
    } else {
      if (timer !== null) {
        clearInterval(timer.current);
      }
      setIsTiming(false);
    }
    return {};
  };

  const cancelPractice = () => {
    setHasStarted(false);
    setIsTiming(false);
    clearInterval(timer.current);
    setPracticeSeconds(0);
    setPracticeMinutes(defaultPracticeMinutes);
  };

  return (
    <div>
      {hasStarted ? (
        <h1>
          {practiceHours}h:{practiceMinutes.toString().padStart(2, "0")}m:
          {practiceSeconds.toString().padStart(2, "0")}s
        </h1>
      ) : (
        <>
          <label>Practice Minutes</label>
          <input
            defaultValue={defaultPracticeMinutes}
            onChange={(e) => {
              setPracticeMinutes(Number(e.target.value));
            }}
            type="number"
          ></input>
        </>
      )}
      <button
        onClick={() => {
          onClick();
        }}
        title={isTiming ? "Pause practice" : "Start practice"}
      >
        <FontAwesomeIcon icon={isTiming ? faPause : faPlay}></FontAwesomeIcon>
      </button>
      {hasStarted && (
        <button onClick={cancelPractice} title="Cancel Practice">
          <FontAwesomeIcon icon={faCancel}></FontAwesomeIcon>
        </button>
      )}
    </div>
  );
};

export default PracticeTimer;
