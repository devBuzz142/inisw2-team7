import { useNavigate } from "react-router-dom";

const Logo = ({ label = "WhoSpeak" }) => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/")}>
      <h2 style={{ marginBottom: 4, marginTop: 4 }}>{label}</h2>
    </button>
  );
};

export default Logo;
