const FrameItem = ({ src, onClick }) => {
  return (
    <div className="frame" onClick={onClick}>
      <img
        src={src}
        loading="lazy"
        width={120}
        height={80}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};

const Frame = ({ length, handleSelect }) => {
  return (
    <div
      className="frame_container"
      style={{ display: "flex", width: 720, overflow: "scroll" }}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <FrameItem
            key={"frame" + index}
            src={
              "/src/assets/pyframes/" + String(index).padStart(6, "0") + ".jpg"
            }
            onClick={() => handleSelect(index)}
          />
        ))}
    </div>
  );
};

export default Frame;
