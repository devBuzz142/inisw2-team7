import { AiFillEdit } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";

const Badge = ({ hidden, onClick, isEdit }) => {
  return (
    <div
      className="badge"
      onClick={onClick}
      style={{ visibility: hidden ? "hidden" : "visible" }}>
      {isEdit ? <FiCheck /> : <AiFillEdit />}
    </div>
  );
};

export default Badge;
