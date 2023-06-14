const PageTemplate = ({ children, pageName = "home" }) => {
  return <div className={`${pageName}-page page-template`}>{children}</div>;
};

export default PageTemplate;
