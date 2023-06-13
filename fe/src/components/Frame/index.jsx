import { useRef, useEffect } from "react";

const FrameItem = ({ src, frame, width, isSelected, onClick }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: isSelected
          ? "rgba(255, 255, 255, 0.5)"
          : "transparent",
      }}
      className="frame"
      onClick={onClick}>
      <img
        src={src}
        loading="lazy"
        width={width}
        height={80}
        style={{ objectFit: "cover" }}
      />
      <div className="frame_number">{frame}</div>
    </div>
  );
};

const Frame = ({ length, selected, handleSelect }) => {
  const scrollRef = useRef(null);
  const frameWidth = 120;

  useEffect(() => {
    if (scrollRef.current && selected) {
      scrollRef.current.scrollLeft =
        frameWidth * selected + scrollRef.current.offsetWidth;
    }
  }, [scrollRef.current]);

  return (
    <div
      ref={scrollRef}
      className="frame_container"
      style={{ display: "flex", width: 1200, overflow: "scroll" }}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <FrameItem
            key={"frame" + index + 1}
            frame={index + 1}
            width={frameWidth}
            isSelected={index + 1 === selected}
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
