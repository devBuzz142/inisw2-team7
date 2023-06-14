import { useRef, useState } from "react";

const VideoUploader = ({ onUpload }) => {
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

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("video", video);

    // You might want to send formData to your server here.
    // For example, using fetch:
    // fetch('your-server-url', {
    //   method: 'POST',
    //   body: formData
    // })

    // Call the onUpload callback
    if (onUpload) {
      onUpload(formData);
    }
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
