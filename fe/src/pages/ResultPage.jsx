import { useRef, useState } from "react";

const ResultPage = () => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <div>
      <button>
        <h2 style={{ marginBottom: 4, marginTop: 4 }}>WhoSpeak</h2>
      </button>
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
