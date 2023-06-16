const UPLOAD_URL = "http://20.214.104.8:8000/video/upload/";
const EDIT_URL = "http://20.214.104.8:8000/video/edit/";

const uploadVideo = async (video) => {
  const formData = new FormData();
  await formData.append("video", video, "video-orig.mp4");

  try {
    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      contentType: "multipart/form-data",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const json = await response.json();
    const { data } = json;
    const { url } = data;
    console.log("Download url:", url);
  } catch (error) {
    console.error("Error in uploading file:", error);
  }
};

const editVideo = async (subtitles) => {
  try {
    const response = await fetch(EDIT_URL, {
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify({ data: subtitles }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const json = await response.json();
    const { data } = json;
    const { url } = data;
    console.log("Download url:", url);
  } catch (error) {
    console.error("Error in uploading file:", error);
  }
};

export { uploadVideo, editVideo };
