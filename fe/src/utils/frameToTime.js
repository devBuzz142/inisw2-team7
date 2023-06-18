const frameToTime = (frame, fps, totalFrame) => {
  const time = (frame - 1) / fps;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor(time - hours * 3600 - minutes * 60);
  const milliseconds = Math.floor((time - Math.floor(time)) * 1000);

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};

export { frameToTime };
