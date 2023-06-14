import Editor from "../components/Editor";
import FrameDetector from "../components/Frame";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSubtitlesFaces } from "../utils/fetchSubtitlesFaces";
import PageTemplate from "./PageTemplate";
import Nav from "../components/Nav";
import Main from "../components/Main";

const EditPage = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState({ frame: 1, scene: 0 });
  const [srt, setSrt] = useState([]);
  const [frameCount, setFrameCount] = useState(0);

  const handleSelected = (type, index) => {
    if (type === "frame") {
      const frameIndex = index;
      const sceneIndex = srt.findIndex(
        (sub) => sub.start <= frameIndex && sub.end >= frameIndex
      );

      setSelected({ frame: frameIndex, scene: sceneIndex });
    } else if (type === "scene") {
      const sceneIndex = index;
      const frameIndex = srt[sceneIndex].start;

      setSelected({ frame: frameIndex, scene: sceneIndex });
    }
  };

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

      setSelected({ frame: subs[0].start, scene: 0 });
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
          FRAME
          {selected.frame} / {frameCount}
        </div>
        <FrameDetector
          length={frameCount}
          selected={selected.frame}
          handleSelected={handleSelected}
        />
      </Nav>
      <Nav>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 80,
          }}>
          SCENE
          {selected.scene} / {srt.length}
        </div>
        <FrameDetector
          length={srt.length}
          selected={selected.scene}
          handleSelected={handleSelected}
          scene
          previews={srt.map((sub) => sub.start)}
        />
      </Nav>
      <Main>
        {srt?.length && (
          <Editor
            maxWidth={1440}
            selected={selected.frame}
            subtitles={srt.filter(
              ({ start, end }) =>
                start <= selected.frame && end >= selected.frame
            )}
            onSubtitleMove={handleSubtitleMove}
          />
        )}

        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-evenly",
          }}>
          <button>Restore</button>
          <button onClick={handleEditClick}>Edit</button>
        </div>
      </Main>
    </PageTemplate>
  );
};

export default EditPage;
