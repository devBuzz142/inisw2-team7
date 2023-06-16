import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../../api";
import JSZip from "jszip";

const VideoUploader = () => {
  const navigate = useNavigate();

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
    // api
    const url = await uploadVideo(video);

    // zip
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    // jszip 객체 생성
    const jszip = new JSZip();

    // zip 파일 내용 로드
    const zip = await jszip.loadAsync(arrayBuffer);

    // zip 파일의 각 항목에 대해 압축 해제
    const contents = {};
    zip.forEach(async (relativePath, file) => {
      const content = await file.async("arraybuffer");
      contents[relativePath] = content;
    });

    console.log(contents);

    navigate("/edit");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        marginTop: "8px",
        marginBottom: "8px",
      }}>
      <div style={{ paddingTop: 24 }}>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          id="videoInput"
          style={{ display: "none" }}
        />
        <label htmlFor="videoInput" className="Button">
          {video ? "Change a video" : "Choose a video"}
        </label>
        <button
          onClick={handleUpload}
          disabled={!video}
          style={{ marginLeft: "8px" }}>
          Upload
        </button>
      </div>
      {videoUrl && (
        <div style={{ marginTop: "20px" }}>
          <video width="1080" controls ref={videoRef}>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
