import { useState, useRef, useEffect } from "react";

const Subtitle = ({ children, imagePos, position, onSubtitleMove }) => {
  const [top, setTop] = useState(position.top);
  const [left, setLeft] = useState(position.left);
  const [width, setWidth] = useState(160);
  const [height, setHeight] = useState(0);

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
      console.log(
        ref.current.offsetTop,
        ref.current.offsetLeft,
        ref.current.offsetWidth,
        ref.current.offsetHeight
      );

      const newLeft = e.clientX + offset.x;
      const newTop = e.clientY + offset.y;
      setLeft(
        newLeft < 4
          ? left
          : newLeft + width > imagePos.left + imagePos.width
          ? left
          : newLeft
      );
      setTop(
        newTop < 4
          ? top
          : newTop + ref.current.offsetHeight >
            imagePos.top - 4 + imagePos.height
          ? top
          : newTop
      );
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",

        fontSize: 24,

        top: top,
        left: left,

        color: "black",
        backgroundColor: "rgba(255,255,255, 0.4)",

        cursor: "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}>
      {children}
    </div>
  );
};

export default Subtitle;
