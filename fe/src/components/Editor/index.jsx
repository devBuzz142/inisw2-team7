import Subtitle from "../Subtitle";

const Editor = ({ selected }) => {
  return (
    <div style={{ width: 720, height: 480, border: "1px solid white" }}>
      <Subtitle>subtitle subtitle</Subtitle>
      <img
        src={`/src/assets/pyframes/${String(selected).padStart(6, "0")}.jpg`}
      />
    </div>
  );
};

export default Editor;
