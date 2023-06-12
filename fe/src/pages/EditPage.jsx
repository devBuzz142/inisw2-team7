const EditPage = () => {
  return (
    <div>
      <div style={{ width: 720, height: 480, border: "1px solid white" }}>
        <img src="/src/assets/sample01.jpg" />
      </div>
      <div style={{ display: "flex" }}>
        <div className="frame">image01</div>
        <div className="frame">image02</div>
        <div className="frame">image03</div>
        <div className="frame">image04</div>
        <div className="frame">image05</div>
        <div className="frame">image06</div>
        <div className="frame">image07</div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button>Restore</button>
        <button>Edit</button>
      </div>
    </div>
  );
};

export default EditPage;
