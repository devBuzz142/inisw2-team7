import { useRef, useState } from "react";
import Logo from "../components/Logo";
import Nav from "../components/Nav";
import Main from "../components/Main";
import PageTemplate from "./PageTemplate";

const ResultPage = () => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <PageTemplate pageName="Result">
      <Nav>
        <button>Download</button>
      </Nav>
      <Main>
        {videoUrl && (
          <div style={{ marginTop: "20px" }}>
            <video width="320" height="240" controls ref={videoRef}>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </Main>
    </PageTemplate>
  );
};

export default ResultPage;
