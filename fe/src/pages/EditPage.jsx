import Editor from "../components/Editor";
import Frame from "../components/Frame";
import Logo from "../components/Logo";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSubtitlesFaces } from "../utils/fetchSubtitlesFaces";
import PageTemplate from "./PageTemplate";
import Nav from "../components/Nav";
import Main from "../components/Main";

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
    <PageTemplate pageName="Edit">
      <Nav>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 80,
          }}>
          {selected} / {frameCount}
        </div>
        <Frame
          length={frameCount}
          selected={selected}
          handleSelect={handleSelect}
        />
      </Nav>
      <Main>
        {srt?.length && (
          <Editor
            selected={selected}
            subtitles={srt.filter(
              ({ start, end }) => start <= selected && end >= selected
            )}
            onSubtitleMove={handleSubtitleMove}
          />
        )}

        <div style={{ marginTop: 16 }}>
          <button>Restore</button>
          <button onClick={handleEditClick}>Edit</button>
        </div>
      </Main>
    </PageTemplate>
  );
};

export default EditPage;
