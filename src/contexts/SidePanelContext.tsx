import React, { createContext, useContext, useState, type ReactNode } from "react";

interface SidePanelContextType {
  showSidePanel: boolean;
  setShowSidePanel: (show: boolean) => void;
}

const SidePanelContext = createContext<SidePanelContextType | undefined>(undefined);

export const SidePanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showSidePanel, setShowSidePanel] = useState(false);

  return (
    <SidePanelContext.Provider value={{ showSidePanel, setShowSidePanel }}>
      {children}
    </SidePanelContext.Provider>
  );
};

export const useSidePanel = () => {
  const context = useContext(SidePanelContext);
  if (!context) {
    throw new Error("useSidePanel must be used within a SidePanelProvider");
  }
  return context;
};
