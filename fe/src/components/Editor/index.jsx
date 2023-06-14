import { useRef, useState, useEffect } from "react";
import Subtitle from "../Subtitle";

const Editor = ({
  selected,
  subtitles = [],
  onSubtitleMove,
  maxWidth = 1440,
}) => {
  const imgRef = useRef(null);
  console.log(subtitles[0].bbox);

  const [imagePos, setImagePos] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleImageLoad = () => {
      if (!imgRef.current) return;

      const rect = imgRef.current.getBoundingClientRect();
      setImagePos({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    if (imgRef.current) {
      imgRef.current.addEventListener("load", handleImageLoad);
      return () => {
        if (!imgRef.current) return;
        imgRef.current.removeEventListener("load", handleImageLoad);
      };
    }
  }, [selected, imgRef]);

  return (
    <div
      className="Editor"
      style={{
        position: "relative",
        outline: "4px solid white",
        width: imgRef?.current?.offsetWidth || maxWidth,
      }}>
      {subtitles &&
        subtitles.map((sub) => (
          <Subtitle
            key={"subtitle" + sub.index}
            index={sub.index}
            imagePos={imagePos}
            position={{
              top: sub.bbox[1],
              left: sub.bbox[0],
            }}
            onSubtitleMove={onSubtitleMove}>
            {sub.text}
          </Subtitle>
        ))}
      <img
        draggable={false}
        ref={imgRef}
        src={`/src/assets/loki01/pyframes/${String(selected).padStart(
          6,
          "0"
        )}.jpg`}
      />
    </div>
  );
};

export default Editor;
