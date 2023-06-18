import { useRef, useEffect } from "react";
import { useStateContext } from "../../context/StateProvider";

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

const FrameDetector = ({ selected, handleSelected, scene, previews }) => {
  const scrollRef = useRef(null);
  const selectedRef = useRef(null);
  const frameWidth = 120;
  const frameHeight = 80;

  const { state } = useStateContext();
  const { subtitles, frames } = state;

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
      {Array(scene ? subtitles.length : frames.frameCount)
        .fill(0)
        .map((_, index) => (
          <FrameItem
            itemRef={index === selected ? selectedRef : null}
            key={"frame" + index}
            frame={index + 1}
            width={frameWidth}
            isSelected={index === selected}
            src={frames[scene ? previews[index] : index]}
            onClick={() => handleSelected(scene ? "scene" : "frame", index)}
          />
        ))}
    </div>
  );
};

export default FrameDetector;
