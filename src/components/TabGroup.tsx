import React, { useState } from "react";
import TabElement from "./TabElement";

interface Tab {
  id: string;
  label: string;
}

interface TabGroupProps {
  tabs: Tab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  tabWidth?: number;
}

const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  tabWidth = 112,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    activeTabId || tabs[0]?.id || ""
  );

  const currentActiveTab =
    activeTabId !== undefined ? activeTabId : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (activeTabId === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  return (
    <div
      style={{
        backgroundColor: "#EEF0F3",
        borderRadius: "24px",
        display: "flex",
        alignItems: "center",
        gap: "0px",
        height: "48px",
      }}
    >
      {tabs.map((tab) => (
        <TabElement
          key={tab.id}
          label={tab.label}
          isActive={currentActiveTab === tab.id}
          onClick={() => handleTabClick(tab.id)}
          width={tabWidth}
        />
      ))}
    </div>
  );
};

export default TabGroup;
