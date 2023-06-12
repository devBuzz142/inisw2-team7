import Frame from "../components/Frame";
import { useState } from "react";

const EditPage = () => {
  const [selected, setSeletced] = useState(0);

  const handleSelect = (index) => setSeletced(index);

  return (
    <div>
      <div style={{ width: 720, height: 480, border: "1px solid white" }}>
        <img
          src={`/src/assets/pyframes/${String(selected).padStart(6, "0")}.jpg`}
        />
      </div>
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
