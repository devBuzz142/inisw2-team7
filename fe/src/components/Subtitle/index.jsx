import { useState, useRef } from "react";

const Subtitle = ({ children, position }) => {
  const [top, setTop] = useState(position.top);
  const [left, setLeft] = useState(position.left);

  console.log("position: ", position);
  console.log("subtitle: ", top, left);

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
      const newLeft = e.clientX + offset.x;
      const newTop = e.clientY + offset.y;
      setLeft(newLeft);
      setTop(newTop);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <div
      ref={ref}
      style={{
        fontSize: 24,
        position: "absolute",

        top: top,
        left: left,

        color: "black",
        backgroundColor: "rgba(255,255,255, 0.4)",

        maxWidth: 160,
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
