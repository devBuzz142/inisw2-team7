import { useState } from "react";

const Badge = () => {
  const [isEdit, setIsEdit] = useState(true);

  const handleClick = () => {
    setIsEdit(!isEdit);
  };

  return (
    <div className="badge" onClick={handleClick}>
      {isEdit ? "EDIT" : "DONE"}
    </div>
  );
};

export default Badge;
