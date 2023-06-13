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
  const [frameCount, setFrameCount] = useState(0);

  const handleSelect = (index) => setSeletced(index);

  const handleEditClick = () => {
    navigate("/result");
  };

  useEffect(() => {
    (async () => {
      const { faces, subtitles } = await fetchSubtitlesFaces();

      const subs = Array.from(Array(faces.length + 1), () => []);
      for (const [start, mid, end, text] of subtitles) {
        for (let i = start; i <= end; i++) {
          if (subs[i].length && subs[i][subs[i].length - 1] == text) continue;

          subs[i].push(text);
        }
      }

      setSeletced(subs.findIndex((sub) => sub.length));
      setFrameCount(faces.length);
      setSrt(subs);
    })();
  }, []);

  return (
    <div>
      <Logo />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="frame">Text Box</div>
        <div className="frame">Without Box</div>
      </div>
      <Editor selected={selected} subtitles={srt[selected]} />
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
