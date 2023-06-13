import { useRef, useState, useEffect } from "react";
import Subtitle from "../Subtitle";

const Editor = ({ selected, subtitles = [] }) => {
  const imgRef = useRef(null);

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

  const handleSubtitleMove = (index, newPos) => {};

  return (
    <div
      className="editor"
      style={{ position: "relative", outline: "4px solid white" }}>
      {subtitles &&
        subtitles.map((sub, index) => (
          <Subtitle
            key={index}
            index={index}
            imagePos={imagePos}
            position={{
              top: sub.bbox[0],
              left: sub.bbox[1],
            }}
            onSubtitleMove={handleSubtitleMove}>
            {sub.text}
          </Subtitle>
        ))}
      <img
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
