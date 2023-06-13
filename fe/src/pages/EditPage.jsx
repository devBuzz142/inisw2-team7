import Editor from "../components/Editor";
import Frame from "../components/Frame";
import Logo from "../components/Logo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditPage = () => {
  const navigate = useNavigate();

  const [selected, setSeletced] = useState(0);

  const handleSelect = (index) => setSeletced(index);

  const handleEditClick = () => {
    navigate("/result");
  };

  return (
    <div>
      <Logo />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="frame">Text Box</div>
        <div className="frame">Without Box</div>
      </div>
      <Editor selected={selected} />
      <div>{selected} / 503</div>
      <Frame length={503} handleSelect={handleSelect} />
      <div style={{ marginTop: 16 }}>
        <button>Restore</button>
        <button onClick={handleEditClick}>Edit</button>
      </div>
    </div>
  );
};

export default EditPage;
