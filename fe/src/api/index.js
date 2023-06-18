const UPLOAD_URL = "http://20.214.104.8:8000/video/upload/";
const EDIT_URL = "http://20.214.104.8:8000/video/edit/";

const uploadVideo = async (video, language) => {
  const formData = new FormData();
  await formData.append("video", video, "video-orig.mp4");
  await formData.append("language", language);

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

    return url;
  } catch (error) {
    console.error("Error in uploading file:", error);
  }
};

const editVideo = async (subtitles) => {
  const sub = subtitles.slice(1).map((subtitle) => ({
    start_time: subtitle.startTime,
    end_time: subtitle.endTime,
    text: subtitle.text,
    pos: subtitle.pos,
  }));

  try {
    const response = await fetch(EDIT_URL, {
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify({ data: sub }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const json = await response.json();
    const { data } = json;
    const { url } = data;

    return url;
  } catch (error) {
    console.error("Error in uploading file:", error);
  }
};

export { uploadVideo, editVideo };
