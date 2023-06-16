import Editor from "../components/Editor";
import FrameDetector from "../components/Frame";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSubtitles } from "../utils/fetchSubtitles";
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
        (sub) => sub.startFrame <= frameIndex && sub.endFrame >= frameIndex
      );

      setSelected({ frame: frameIndex, scene: sceneIndex });
    } else if (type === "scene") {
      const sceneIndex = index;
      const frameIndex = srt[sceneIndex].startFrame;

      setSelected({ frame: frameIndex, scene: sceneIndex });
    }
  };

  const handleEditClick = () => {
    navigate("/result");
  };

  const FRAME_LEN = 2596;
  useEffect(() => {
    (async () => {
      const subtitles = await fetchSubtitles();

      const subs = subtitles.map((sub, index) => ({
        index,
        startFrame: sub.start_frame,
        endFrame: sub.end_frame,
        text: sub.text,
        pos: sub.pos,
      }));

      setSelected({ frame: subs[0].startFrame, scene: 0 });
      setFrameCount(FRAME_LEN);
      setSrt(subs);
    })();
  }, []);

  const handleSubtitleMove = (index, newPos) => {
    const newSrt = [...srt];
    newSrt[index].pos = [newPos.left, newPos.top];

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
          previews={srt.map((sub) => sub.startFrame)}
        />
      </Nav>
      <Main>
        {srt?.length && (
          <Editor
            maxWidth={1440}
            selected={selected.frame}
            subtitles={srt.filter(
              ({ startFrame, endFrame }) =>
                startFrame <= selected.frame && endFrame >= selected.frame
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
