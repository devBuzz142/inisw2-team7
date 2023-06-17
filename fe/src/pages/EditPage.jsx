import Editor from "../components/Editor";
import FrameDetector from "../components/Frame";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "./PageTemplate";
import Nav from "../components/Nav";
import Main from "../components/Main";
import { editVideo } from "../api";
import { useStateContext } from "../context/StateProvider";

const EditPage = () => {
  const navigate = useNavigate();

  const { state, dispatch } = useStateContext();
  const { selected, subtitles, frames } = state;
  console.log(state);

  const handleSelected = (type, index) => {
    if (type === "frame") {
      const frameIndex = index;
      const sceneIndex = subtitles.findIndex(
        (sub) => sub.startFrame <= frameIndex && sub.endFrame >= frameIndex
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

  const handleEditClick = () => {
    editVideo(subtitles);
    navigate("/result");
  };

  useEffect(() => {
    // (async () => {
    //   const subtitles = await fetchSubtitles();
    //   const subs = subtitles.map((sub, index) => ({
    //     index,
    //     startFrame: sub.start_frame,
    //     endFrame: sub.end_frame,
    //     text: sub.text,
    //     pos: sub.pos,
    //   }));
    //   dispatch({
    //     type: "SET_SELECTED",
    //     payload: { frame: subs[0].startFrame, scene: 0 },
    //   });
    //   dispatch({
    //     type: "SET_FRAME_COUNT",
    //     payload: FRAME_LEN,
    //   });
    //   dispatch({
    //     type: "SET_SUBTITLES",
    //     payload: subs,
    //   });
    // })();
  }, []);

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
          {selected.frame} / {frames.length}
        </div>
        <FrameDetector
          length={frames.length}
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
          {selected.scene} / {subtitles.length}
        </div>
        <FrameDetector
          length={subtitles.length}
          selected={selected.scene}
          handleSelected={handleSelected}
          scene
          previews={subtitles.map((sub) => sub.startFrame)}
        />
      </Nav>
      <Main>
        {subtitles?.length && (
          <Editor
            maxWidth={1440}
            selected={selected.frame}
            subtitles={subtitles.filter(
              ({ startFrame, endFrame }) =>
                startFrame <= selected.frame && endFrame >= selected.frame
            )}
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
          <button>Restore</button>
          <button onClick={handleEditClick}>Edit</button>
        </div>
      </Main>
    </PageTemplate>
  );
};

export default EditPage;
