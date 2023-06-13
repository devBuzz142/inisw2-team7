import { useRef, useState, useEffect } from "react";
import Subtitle from "../Subtitle";

const Editor = ({ selected }) => {
  const imgRef = useRef(null);
  const [imagePos, setImagePos] = useState({ pageX: 0, pageY: 0 });

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
    <div
      draggable={false}
      style={{ width: 720, height: 480, border: "1px solid white" }}>
      <Subtitle position={imagePos}>subtitle subtitle</Subtitle>
      <img
        draggable={false}
        ref={imgRef}
        src={`/src/assets/pyframes/${String(selected).padStart(6, "0")}.jpg`}
      />
    </div>
  );
};

export default Editor;
