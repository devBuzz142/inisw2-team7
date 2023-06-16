const Badge = ({ hidden, onClick, isEdit }) => {
  return (
    <div
      className="badge"
      onClick={onClick}
      style={{ visibility: hidden ? "hidden" : "visible" }}>
      {isEdit ? "DONE" : "EDIT"}
    </div>
  );
};

export default Badge;
