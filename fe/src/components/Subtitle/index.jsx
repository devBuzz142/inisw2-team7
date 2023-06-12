const Subtitle = ({ children, top = 0, left = 0 }) => {
  const [top, setTop] = useState(top);
  const [left, setLeft] = useState(left);

  return (
    <div
      style={{
        fontSize: 24,
        position: "relative",

        color: "black",
        backgroundColor: "rgba(255,255,255, 0.4)",

        maxWidth: 160,
      }}>
      {children}
    </div>
  );
};

export default Subtitle;
