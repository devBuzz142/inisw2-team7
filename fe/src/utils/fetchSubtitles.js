// const fetchFaces = async () => {
//   const res = await fetch("/src/assets/loki01/faces.json");
//   const json = await res.json();
//   const data = await json.data;

//   return data;
// };

// const fetchSubtitles = async () => {
//   const res = await fetch("/src/assets/loki01/subtitles.json");
//   const json = await res.json();
//   const data = await json.data;

//   return data;
// };

// const fetchSubtitlesFaces = async () => {
//   const faces = await fetchFaces();
//   const subtitles = await fetchSubtitles();

//   return { faces, subtitles };
// };

// export { fetchSubtitlesFaces };

const fetchSubtitles = async () => {
  const res = await fetch("/src/assets/loki01/temp/subtitles.json");
  const json = await res.json();
  const data = await json.data;

  return data;
};

export { fetchSubtitles };
