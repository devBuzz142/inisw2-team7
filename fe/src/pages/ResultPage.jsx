import { useRef, useState } from "react";
import Logo from "../components/Logo";

const ResultPage = () => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <div>
      <Logo />
      {videoUrl && (
        <div style={{ marginTop: "20px" }}>
          <video width="320" height="240" controls ref={videoRef}>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <button>Download</button>
    </div>
  );
};

export default ResultPage;
