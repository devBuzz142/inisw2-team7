import nyancat from "../../assets/nyancat.gif";

const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255,255,255, 0.8)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <img width={320} src={nyancat} alt="Loading..." />
    </div>
  );
};

export default Loading;
