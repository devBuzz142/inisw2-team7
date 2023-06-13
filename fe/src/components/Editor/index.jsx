import { useRef, useState, useEffect } from "react";
import Subtitle from "../Subtitle";

const Editor = ({ selected, subtitles = [], faces = [] }) => {
  const { bbox } = faces?.at(0) || { bbox: [0, 0, 0, 0] };

  const imgRef = useRef(null);

  const [imagePos, setImagePos] = useState({ top: 0, left: 0 });

  console.log(subtitles);
  console.log("imagePost: ", imagePos);
  console.log("bbox: ", bbox);

  useEffect(() => {
    const handleImageLoad = () => {
      if (!imgRef.current) return;

      const rect = imgRef.current.getBoundingClientRect();
      setImagePos({ top: rect.top, left: rect.left });
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
    <div className="editor" style={{ outline: "4px solid white" }}>
      {subtitles &&
        subtitles.map((text, index) => (
          <Subtitle
            key={index}
            position={{
              top: imagePos.top + bbox[0],
              left: imagePos.left + bbox[1],
            }}>
            {text}
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
