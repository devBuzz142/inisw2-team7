import { useRef, useState, useEffect } from "react";
import Subtitle from "../Subtitle";
import { useStateContext } from "../../context/StateProvider";

const Editor = ({ onSubtitleMove, onSubtitleEdit, maxWidth = 1440 }) => {
  const imgRef = useRef(null);

  const { state, dispatch } = useStateContext();
  const { subtitles, selected, frames } = state;

  const frameSubtitles = subtitles.filter(
    ({ startFrame, endFrame }) =>
      startFrame <= selected.frame && endFrame >= selected.frame
  );

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
      {frameSubtitles &&
        frameSubtitles.map((sub) => (
          <Subtitle
            key={"subtitle" + sub.index}
            index={sub.index}
            imagePos={imagePos}
            position={{
              left: sub.pos[0],
              top: sub.pos[1],
            }}
            text={sub.text}
            onSubtitleMove={onSubtitleMove}
            onSubtitleEdit={onSubtitleEdit}
          />
        ))}
      <img draggable={false} ref={imgRef} src={frames[selected.frame || 1]} />
    </div>
  );
};

export default Editor;
