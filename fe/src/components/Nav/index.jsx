import Logo from "../Logo";

const Nav = ({ children, logo = true }) => {
  return (
    <div className="Nav Nav-bar">
      <div
        className="Nav-logo"
        style={{ display: "flex", justifyContent: "center" }}>
        {logo && <Logo />}
      </div>
      <div className="Nav-item-container">{children}</div>
    </div>
  );
};

export default Nav;
