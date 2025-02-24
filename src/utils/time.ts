export const secondsToPlayerTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  seconds = Math.floor((seconds % 3600) % 60);

  return hours > 0
    ? hours.toString() + ":"
    : "" +
        minutes.toString().padStart(hours === 0 && minutes < 10 ? 1 : 2, "0") +
        ":" +
        seconds.toString().padStart(2, "0");
};

export const playerTimeToSeconds = (time: string): number => {
  const timeRegExp = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/;
  const result = timeRegExp.exec(time);
  if (result === null) {
    throw new Error(`Invalid time format detected in input: ${time}`);
  }

  return (
    (result[1] ? Number(result[1]) * 3600 : 0) +
    (result[2] ? Number(result[2]) * 60 : 0) +
    (result[3] ? Number(result[3]) : 0)
  );
};
