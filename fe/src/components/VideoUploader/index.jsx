import { useState } from "react";

const VideoUploader = ({ onUpload }) => {
  const [video, setVideo] = useState();

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
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
    </div>
  );
};

export default VideoUploader;
