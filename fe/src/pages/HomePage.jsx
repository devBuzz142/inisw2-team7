import { Tab, TabItem } from "../components/Tab";
import VideoUploader from "../components/VideoUploader";
import PageTemplate from "./PageTemplate";
import Nav from "../components/Nav";
import Main from "../components/Main";
import { useState } from "react";
import Loading from "../components/Loading";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <PageTemplate pageName="Home">
      {isLoading && <Loading />}
      <Nav>
        <Tab
          label="Select Your Language"
          activeTab={activeTab}
          setActiveTab={setActiveTab}>
          <TabItem label="한국어" />
          <TabItem label="English" />
          <TabItem label="中国语" />
          <TabItem label="日本語" />
        </Tab>
      </Nav>
      <Main>
        <VideoUploader
          language={["ko", "en", "zh-CN", "ja"][activeTab]}
          setIsLoading={setIsLoading}
        />
      </Main>
    </PageTemplate>
  );
};

export default HomePage;
