import Logo from "../Logo";

const Nav = ({ children }) => {
  return (
    <div className="Nav Nav-bar">
      <div className="Nav-logo">
        <Logo />
      </div>
      <div className="Nav-item-container">{children}</div>
    </div>
  );
};

export default Nav;
