import { useState } from "react";

const VideoUploader = ({ onUpload }) => {
  const [video, setVideo] = useState();
  const [videoUrl, setVideoUrl] = useState();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);

    // Create a URL to preview the video
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
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
    <div>
      <input type="file" accept="video/*" onChange={handleVideoChange} />
      <button onClick={handleUpload} disabled={!video}>
        Upload
      </button>
      {videoUrl && (
        <div style={{ marginTop: "20px" }}>
          <video width="320" height="240" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
