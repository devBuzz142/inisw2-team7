import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../../api";
import JSZip from "jszip";
import { useStateContext } from "../../context/StateProvider";

const VideoUploader = ({ language, setIsLoading }) => {
  const navigate = useNavigate();

  const { state, dispatch } = useStateContext();

  const [video, setVideo] = useState();
  const [videoUrl, setVideoUrl] = useState();
  const videoRef = useRef(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);

    // Create a URL to preview the video
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    // Load the new video source
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);

    // api
    const url = await uploadVideo(video, language);

    // zip
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    // jszip 객체 생성
    const jszip = new JSZip();

    // zip 파일 내용 로드
    const zip = await jszip.loadAsync(arrayBuffer);

    // zip 파일의 각 항목에 대해 압축 해제
    const frames = {};

    await zip.forEach(async (relativePath, file) => {
      if (relativePath === "pyframe/") return;
      if (relativePath.endsWith(".json")) {
        let data = await file.async("string");
        data = await JSON.parse(data);
        const subtitles = data.data;

        const subs = subtitles.map((sub, index) => ({
          index: index + 1,
          startTime: sub.start_time,
          endTime: sub.end_time,
          startFrame: sub.start_frame,
          endFrame: sub.end_frame,
          text: sub.text,
          pos: sub.pos,
        }));

        const origs = subtitles.map((sub, index) => ({
          index: index + 1,
          startTime: sub.start_time,
          endTime: sub.end_time,
          startFrame: sub.start_frame,
          endFrame: sub.end_frame,
          text: sub.text,
          pos: sub.pos,
        }));

        dispatch({
          type: "SET_SELECTED",
          payload: { frame: subs[0].startFrame, scene: 1 },
        });
        dispatch({
          type: "SET_SUBTITLES",
          payload: [null, ...subs],
        });
        dispatch({
          type: "SET_ORIGINALS",
          payload: [null, ...origs],
        });

        return;
      }

      const fileBlob = await file.async("blob");
      const fileUrl = URL.createObjectURL(fileBlob);
      frames[Number(relativePath.replace(".jpg", "").replace("pyframe/", ""))] =
        fileUrl;
    });

    await new Promise((resolve) => setTimeout(resolve, 1000 * 5));

    dispatch({
      type: "SET_FRAMES",
      payload: frames,
    });

    // image loading...
    await new Promise((resolve) => setTimeout(resolve, 1000 * 4));
    setIsLoading(false);

    navigate("/edit");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        marginTop: "8px",
        marginBottom: "8px",
        marginLeft: "120px",
      }}>
      <div style={{ paddingTop: 24 }}>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          id="videoInput"
          style={{ display: "none" }}
        />
        <label htmlFor="videoInput" className="button-label">
          {video ? "동영상 선택" : "동영상 변경"}
        </label>
        <button
          onClick={handleUpload}
          disabled={!video}
          style={{
            fontSize: "20px",
            width: "280px",
            marginLeft: "8px",
          }}>
          자막 생성
        </button>
      </div>
      {
        <div style={{ marginTop: "20px" }}>
          {videoUrl ? (
            <video width="1080px" controls ref={videoRef}>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src="/src/assets/cover.png" width="1080" />
          )}
        </div>
      }
    </div>
  );
};

export default VideoUploader;
