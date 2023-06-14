import { useRef, useEffect } from "react";

const FrameItem = ({ src, frame, width, isSelected, onClick, itemRef }) => {
  return (
    <div
      ref={itemRef}
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

const FrameDetector = ({
  length,
  selected,
  handleSelected,
  scene,
  previews,
}) => {
  const scrollRef = useRef(null);
  const selectedRef = useRef(null);
  const frameWidth = 120;
  const frameHeight = 80;

  useEffect(() => {
    if (scrollRef.current && selectedRef.current) {
      scrollRef.current.scrollTop = Math.max(
        0,
        selectedRef.current.offsetTop - 80 * 3
      );
    }
  }, [scrollRef.current, selectedRef.current]);

  return (
    <div
      ref={scrollRef}
      className="frame_container"
      style={{
        display: "flex",
        flexDirection: "column",

        height: "80%",

        overflowY: "scroll",
      }}>
      {Array(length)
        .fill(0)
        .map((_, index) => {
          const itemIndex = scene ? index : index + 1;

          return (
            <FrameItem
              itemRef={itemIndex === selected ? selectedRef : null}
              key={"frame" + itemIndex}
              frame={itemIndex + 1}
              width={frameWidth}
              isSelected={itemIndex === selected}
              src={
                "/src/assets/loki01/pyframes/" +
                String(scene ? previews[itemIndex] : itemIndex).padStart(
                  6,
                  "0"
                ) +
                ".jpg"
              }
              onClick={() =>
                handleSelected(scene ? "scene" : "frame", itemIndex)
              }
            />
          );
        })}
    </div>
  );
};

export default FrameDetector;
