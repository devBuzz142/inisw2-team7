const FrameItem = ({ src, frame, onClick }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className="frame"
      onClick={onClick}>
      <img
        src={src}
        loading="lazy"
        width={120}
        height={80}
        style={{ objectFit: "cover" }}
      />
      <div className="frame_number">{frame}</div>
    </div>
  );
};

const Frame = ({ length, handleSelect }) => {
  return (
    <div
      className="frame_container"
      style={{ display: "flex", width: 1200, overflow: "scroll" }}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <FrameItem
            key={"frame" + index + 1}
            frame={index + 1}
            src={
              "/src/assets/loki01/pyframes/" +
              String(index + 1).padStart(6, "0") +
              ".jpg"
            }
            onClick={() => handleSelect(index + 1)}
          />
        ))}
    </div>
  );
};

export default Frame;
