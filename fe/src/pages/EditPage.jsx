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

      const subs = subtitles.map((sub, index) => ({
        index,
        start: sub[0],
        mid: sub[1],
        end: sub[2],
        text: sub[3],
        bbox: faces[sub[1]][0]?.bbox || [0, 0, 0, 0],
      }));

      setSeletced(subs[0].start);
      setFrameCount(faces.length);
      setSrt(subs);
    })();
  }, []);

  const handleSubtitleMove = (index, newPos) => {
    const newSrt = [...srt];
    newSrt[index].bbox = [
      newPos.top,
      newPos.left,
      newSrt[index].bbox[2],
      newSrt[index].bbox[3],
    ];

    setSrt(newSrt);
  };

  return (
    <div>
      <Logo />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="frame">Text Box</div>
        <div className="frame">Without Box</div>
      </div>
      {srt?.length && (
        <Editor
          selected={selected}
          subtitles={srt.filter(
            ({ start, end }) => start <= selected && end >= selected
          )}
          onSubtitleMove={handleSubtitleMove}
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
