import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import Main from "../components/Main";
import PageTemplate from "./PageTemplate";
import { useStateContext } from "../context/StateProvider";

const ResultPage = () => {
  const { state, dispatch } = useStateContext();
  const { resultUrl } = state;

  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleInit = async () => {
      if (resultUrl) {
        const file = await fetch(resultUrl);
        const fileBlob = await file.blob();

        const fileUrl = URL.createObjectURL(fileBlob);
        setVideoUrl(fileUrl);
      }
    };

    handleInit();
  }, [resultUrl]);

  const handleDownloadClick = async () => {
    try {
      const fileLink = document.createElement("a");

      fileLink.display = "none";
      fileLink.href = videoUrl;
      fileLink.download = "result.mp4";
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageTemplate pageName="Result">
      <Nav>
        <button onClick={handleDownloadClick}>Download</button>
      </Nav>
      <Main>
        {videoUrl && (
          <div style={{ marginTop: "20px" }}>
            <video controls ref={videoRef}>
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
