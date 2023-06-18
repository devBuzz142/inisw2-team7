import Editor from "../components/Editor";
import FrameDetector from "../components/Frame";
import { useNavigate } from "react-router-dom";
import PageTemplate from "./PageTemplate";
import Nav from "../components/Nav";
import Main from "../components/Main";
import { editVideo } from "../api";
import { useStateContext } from "../context/StateProvider";
import { useState } from "react";
import Loading from "../components/Loading";

const EditPage = () => {
  const navigate = useNavigate();

  const { state, dispatch } = useStateContext();
  const { selected, subtitles, frames, originals } = state;

  const [isLoading, setIsLoading] = useState(false);

  const handleSelected = (type, index) => {
    if (type === "frame") {
      const frameIndex = index;
      const sceneIndex = subtitles.findIndex(
        (sub) => sub?.startFrame <= frameIndex && sub?.endFrame >= frameIndex
      );

      dispatch({
        type: "SET_SELECTED",
        payload: { frame: frameIndex, scene: sceneIndex },
      });
    } else if (type === "scene") {
      const sceneIndex = index;
      const frameIndex = subtitles[sceneIndex].startFrame;

      dispatch({
        type: "SET_SELECTED",
        payload: { frame: frameIndex, scene: sceneIndex },
      });
    }
  };

  const handleEditClick = async () => {
    setIsLoading(true);
    const url = await editVideo(subtitles);

    dispatch({
      type: "SET_RESULT_URL",
      payload: url,
    });

    await setTimeout(() => {}, 1000);

    setIsLoading(false);
    navigate("/result");
  };

  const handleSubtitleMove = (index, newPos) => {
    const newSrt = [...subtitles];
    newSrt[index].pos = [newPos.left, newPos.top];

    dispatch({
      type: "SET_SUBTITLES",
      payload: newSrt,
    });
  };

  const handleSubtitleEdit = (index, newText) => {
    const newSrt = [...subtitles];
    newSrt[index].text = newText;

    dispatch({
      type: "SET_SUBTITLES",
      payload: newSrt,
    });
  };

  const handleRestoreClick = () => {
    dispatch({
      type: "SET_SUBTITLES",
      payload: originals,
    });
  };

  return (
    <PageTemplate pageName="Edit">
      {isLoading && <Loading />}
      <Nav>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: 80,
          }}>
          <div>SCENE</div>
          <div>
            {selected.scene === -1 ? "-" : selected.scene} /{" "}
            {subtitles.length - 1}
          </div>
        </div>
        <FrameDetector
          length={subtitles.length - 1}
          selected={selected.scene}
          handleSelected={handleSelected}
          scene
          previews={subtitles.map((sub) => sub?.startFrame)}
        />
      </Nav>
      <Nav logo={false}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: 80,
          }}>
          <div>FRAME</div>
          <div>
            {selected.frame} / {Object.keys(frames).length}
          </div>
        </div>
        <FrameDetector
          length={frames.length}
          selected={selected.frame}
          handleSelected={handleSelected}
        />
      </Nav>
      <Main>
        {subtitles?.length && (
          <Editor
            maxWidth={1440}
            selected={selected.frame}
            onSubtitleMove={handleSubtitleMove}
            onSubtitleEdit={handleSubtitleEdit}
          />
        )}

        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-evenly",
          }}>
          <button
            className="hover-button"
            onClick={handleRestoreClick}
            style={{
              fontSize: 24,
              paddingLeft: 120,
              paddingRight: 120,
            }}>
            처음으로
          </button>
          <button
            className="hover-button"
            disabled={isLoading}
            onClick={handleEditClick}
            style={{
              fontSize: 24,
              paddingLeft: 120,
              paddingRight: 120,
            }}>
            자막 수정
          </button>
        </div>
      </Main>
    </PageTemplate>
  );
};

export default EditPage;
