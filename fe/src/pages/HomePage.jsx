import { Tab, TabItem } from "../components/Tab";
import VideoUploader from "../components/VideoUploader";

const HomePage = () => {
  const handleVideoUpload = (formData) => {
    console.log("Video ready for upload:", formData);
    // Here you might want to handle the formData, e.g. send it to a server.
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>WhoSpeak</h1>
        <Tab label="Select Your Language">
          <TabItem label="한국어"></TabItem>
          <TabItem label="English"></TabItem>
          <TabItem label="中国语"></TabItem>
          <TabItem label="日本語"></TabItem>
        </Tab>
        <VideoUploader onUpload={handleVideoUpload} />
      </header>
    </div>
  );
};

export default HomePage;
