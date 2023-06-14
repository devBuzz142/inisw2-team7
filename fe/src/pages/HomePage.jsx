import Logo from "../components/Logo";
import { Tab, TabItem } from "../components/Tab";
import VideoUploader from "../components/VideoUploader";
import { useNavigate } from "react-router-dom";
import PageTemplate from "./PageTemplate";

const HomePage = () => {
  const navigate = useNavigate();

  const handleVideoUpload = (formData) => {
    console.log("Video ready for upload:", formData);
    // Here you might want to handle the formData, e.g. send it to a server.

    navigate("/edit");
  };

  return (
    <PageTemplate pageName="Home">
      <header className="App-header">
        <Logo />
        <Tab label="Select Your Language">
          <TabItem label="한국어"></TabItem>
          <TabItem label="English"></TabItem>
          <TabItem label="中国语"></TabItem>
          <TabItem label="日本語"></TabItem>
        </Tab>
        <VideoUploader onUpload={handleVideoUpload} />
      </header>
    </PageTemplate>
  );
};

export default HomePage;
