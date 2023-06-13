import { useRef, useState, useEffect } from "react";
import Subtitle from "../Subtitle";

const Editor = ({ selected, subtitles }) => {
  const imgRef = useRef(null);
  const [imagePos, setImagePos] = useState({ pageX: 0, pageY: 0 });
  console.log(subtitles);

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
    <div draggable={false} style={{ border: "1px solid white" }}>
      {subtitles &&
        subtitles.map((text, index) => (
          <Subtitle key={index} position={imagePos}>
            {text}
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
