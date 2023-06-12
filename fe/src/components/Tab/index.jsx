import { useState } from "react";
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

export const Tab = ({ children, label }) => {
  const [activeTab, setActiveTab] = useState(0);

  const haneldClick = (index) => setActiveTab(index);

  return (
    <div className="Tab">
      <div className="Tab_Label">{label}</div>
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
