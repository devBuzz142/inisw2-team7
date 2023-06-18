import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import Main from "../components/Main";
import PageTemplate from "./PageTemplate";
import { useStateContext } from "../context/StateProvider";

const ResultPage = () => {
  const videoRef = useRef(null);

  const { state, dispatch } = useStateContext();
  const { resultUrl } = state;

  const handleDownloadClick = async () => {
    try {
      const file = await fetch(resultUrl);
      const fileBlob = await file.blob();
      const fileUrl = URL.createObjectURL(fileBlob);
      const fileLink = document.createElement("a");

      fileLink.display = "none";
      fileLink.href = fileUrl;
      fileLink.download = "result.mp4";
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {});

  return (
    <PageTemplate pageName="Result">
      <Nav>
        <button onClick={handleDownloadClick}>Download</button>
      </Nav>
      <Main>
        {resultUrl && (
          <div style={{ marginTop: "20px" }}>
            <video width="320" height="240" controls ref={videoRef}>
              <source src={resultUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </Main>
    </PageTemplate>
  );
};

export default ResultPage;
