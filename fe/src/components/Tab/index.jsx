import React from "react";

export const TabItem = ({ label, isActive, onClick }) => {
  return (
    <div
      className={isActive ? "Tab_Item_Active" : "Tab_Item"}
      onClick={onClick}>
      {label}
    </div>
  );
};

export const Tab = ({ children, label, activeTab, setActiveTab }) => {
  const haneldClick = (index) => setActiveTab(index);

  return (
    <div
      className="Tab"
      style={{
        paddingTop: 48,
      }}>
      <div className="Tab_Label">
        <h2>{label}</h2>
      </div>
      <div className="Tab_Items">
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            isActive: index === activeTab,
            onClick: () => haneldClick(index),
          });
        })}
      </div>
    </div>
  );
};
