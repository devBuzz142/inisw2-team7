import VideoUploader from "../components/VideoUploader";

const HomePage = () => {
  const handleVideoUpload = (formData) => {
    console.log("Video ready for upload:", formData);
    // Here you might want to handle the formData, e.g. send it to a server.
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Video Uploader</h1>
        <VideoUploader onUpload={handleVideoUpload} />
      </header>
    </div>
  );
};

export default HomePage;
