import file from "./assets/loki01/loki01.mp4";

const uploadVideo = async (file) => {
  const url = "http://20.214.104.8:8000/video/upload/";

  let video = await fetch(file);
  video = await video.blob();

  const formData = new FormData();
  await formData.append("video", video, "loki01.mp4");

  try {
    const response = await fetch(url, {
      method: "POST",
      contentType: "multipart/form-data",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const json = await response.json();
    const downloadUrl = json.download_url;
    console.log("Download url:", downloadUrl);
  } catch (error) {
    console.error("Error in uploading file:", error);
  }
};

uploadVideo(file);
