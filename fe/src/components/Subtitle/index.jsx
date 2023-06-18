import { useState, useRef, useEffect } from "react";
import Badge from "../Badge";

const Subtitle = ({
  children,
  imagePos,
  position,
  index,
  text,
  onSubtitleMove,
  onSubtitleEdit,
}) => {
  const [top, setTop] = useState(position.top);
  const [left, setLeft] = useState(position.left);
  const [width, setWidth] = useState(160);
  const [height, setHeight] = useState(0);

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [isHover, setIsHover] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const ref = useRef(null);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: ref.current.offsetLeft - e.clientX,
      y: ref.current.offsetTop - e.clientY,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      e.preventDefault();

      const newLeft = e.clientX + offset.x;
      const newTop = e.clientY + offset.y;
      setLeft(
        newLeft < 4
          ? left
          : newLeft > imagePos.width - width - 4
          ? left
          : newLeft
      );
      setTop(
        newTop < 4 ? top : newTop > imagePos.height - height - 4 ? top : newTop
      );
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  useEffect(() => {
    const changeSubtitlePosition = () => {
      if (dragging) return;

      onSubtitleMove(index, { top, left });
    };

    changeSubtitlePosition();
  }, [dragging]);

  useEffect(() => {
    if (!ref.current) return;

    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  });

  const handleEdit = () => setIsEdit(!isEdit);

  const handleTextChange = (e) => setEditedText(e.target.value);

  useEffect(() => {
    onSubtitleEdit(index, editedText);
  }, [isEdit]);

  return (
    <div
      className="subtitle"
      ref={ref}
      style={{
        position: "absolute",

        fontSize: 24,

        top: top,
        left: left,

        padding: 8,

        color: "black",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <Badge hidden={!isHover} onClick={handleEdit} isEdit={isEdit} />
      <div
        className="subtitle-text"
        style={{
          padding: 2,
          backgroundColor: "rgba(255,255,255, 0.4)",
          cursor: "grab",
        }}>
        {isEdit ? (
          <>
            <input type="text" value={editedText} onChange={handleTextChange} />
          </>
        ) : (
          editedText
        )}
      </div>
    </div>
  );
};

export default Subtitle;
