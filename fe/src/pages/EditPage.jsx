import Editor from "../components/Editor";
import Frame from "../components/Frame";
import Logo from "../components/Logo";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSubtitlesFaces } from "../utils/fetchSubtitlesFaces";

const EditPage = () => {
  const navigate = useNavigate();

  const [selected, setSeletced] = useState(1);
  const [srt, setSrt] = useState([]);
  const [faces, setFaces] = useState([]); // [start, mid, end, text]
  const [frameCount, setFrameCount] = useState(0);

  const handleSelect = (index) => setSeletced(index);

  const handleEditClick = () => {
    navigate("/result");
  };

  useEffect(() => {
    (async () => {
      const { faces, subtitles } = await fetchSubtitlesFaces();

      for (const [start, mid, end, text] of subtitles) {
        for (let i = start; i <= end; i++) {}
      }

      setSeletced(subtitles[0][0]);
      setFaces([[], ...faces]);
      setFrameCount(faces.length);
      setSrt(subtitles);
    })();
  }, []);

  return (
    <div>
      <Logo />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="frame">Text Box</div>
        <div className="frame">Without Box</div>
      </div>
      {srt?.length && faces?.length && (
        <Editor
          selected={selected}
          subtitles={srt
            .filter(
              ([start, mid, end, _]) => start <= selected && end >= selected
            )
            .map(([_, __, ___, text]) => text)}
          faces={faces[selected]}
        />
      )}
      <div>
        {selected} / {frameCount}
      </div>
      <Frame length={frameCount} handleSelect={handleSelect} />
      <div style={{ marginTop: 16 }}>
        <button>Restore</button>
        <button onClick={handleEditClick}>Edit</button>
      </div>
    </div>
  );
};

export default EditPage;
