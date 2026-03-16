import React, { useState } from "react";
import Sidebar from "./Sidebar";
import icNotification from "@/assets/icons/ic-notification.svg";
import { useSidePanel } from "../contexts/SidePanelContext";

function IconNotification() {
  return (
    <div className="w-[18px] h-[18px] relative">
      <img
        alt=""
        className="block max-w-none w-full h-full"
        src={icNotification}
      />
    </div>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  onLoginClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLoginClick }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const { showSidePanel } = useSidePanel();

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="bg-[#f8f8fa] w-full min-h-screen relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onLoginClick={onLoginClick}
        isVisible={isSidebarVisible}
        onToggle={handleToggleSidebar}
      />

      {/* Main Content */}
      <div
        className={`min-h-screen relative flex-1 transition-all duration-300 ${
          isSidebarVisible ? "ml-[279px]" : "ml-[80px]"
        }`}
      >
        {children}

        {/* Beta Info */}
        <div
          className={`absolute bottom-[20px] z-30 transition-all duration-300 ${
            showSidePanel ? "left-[415px] " : "left-1/2 -translate-x-1/2"
          }`}
        >
          <div className="relative flex items-center gap-[4px]">
            <div
              className="flex items-center gap-[4px] cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <IconNotification />
              <span className="text-[#989BA2] text-[16px]">Beta</span>
            </div>

            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute bottom-full mb-[10px] left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-white relative rounded-[24px] shadow-[24px_24px_52px_0px_#ebebed]">
                  <div
                    aria-hidden="true"
                    className="absolute border-2 border-[#d5d8dc] border-solid inset-0 pointer-events-none rounded-[24px]"
                  />
                  <div className="relative px-[20px] py-[14px]">
                    <div className="text-[14px] text-[#989BA2] leading-[30px] whitespace-nowrap">
                      Please note that EZReco in currently in
                      <br />
                      development stage and is not for public use.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
