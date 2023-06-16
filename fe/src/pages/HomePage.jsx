import { Tab, TabItem } from "../components/Tab";
import VideoUploader from "../components/VideoUploader";
import { useNavigate } from "react-router-dom";
import PageTemplate from "./PageTemplate";
import Nav from "../components/Nav";
import Main from "../components/Main";
import { useState } from "react";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <PageTemplate pageName="Home">
      <Nav>
        <Tab
          label="Select Your Language"
          activeTab={activeTab}
          setActiveTab={setActiveTab}>
          <TabItem label="한국어"></TabItem>
          <TabItem label="English"></TabItem>
          <TabItem label="中国语"></TabItem>
          <TabItem label="日本語"></TabItem>
        </Tab>
      </Nav>
      <Main>
        <VideoUploader />
      </Main>
    </PageTemplate>
  );
};

export default HomePage;
