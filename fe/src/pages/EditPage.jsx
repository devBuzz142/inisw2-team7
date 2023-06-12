import Editor from "../components/Editor";
import Frame from "../components/Frame";
import Subtitle from "../components/Subtitle";
import { useState } from "react";

const EditPage = () => {
  const [selected, setSeletced] = useState(0);

  const handleSelect = (index) => setSeletced(index);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="frame">Text Box</div>
        <div className="frame">Without Box</div>
      </div>
      <Editor selected={selected} />
      <div>{selected} / 503</div>
      <Frame length={503} handleSelect={handleSelect} />
      <div style={{ marginTop: 16 }}>
        <button>Restore</button>
        <button>Edit</button>
      </div>
    </div>
  );
};

export default EditPage;
