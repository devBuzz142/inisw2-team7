const fetchSubtitles = async () => {
  const res = await fetch("/src/assets/loki01/temp/subtitles.json");
  const json = await res.json();
  const data = await json.data;

  return data;
};

export { fetchSubtitles };
