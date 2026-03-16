import React, { useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

import icAccount from "@/assets/icons/ic_account.png";
import icLogout from "@/assets/icons/ic_logout.png";

// Icon Components - Using same icons as Sidebar
function IconAccount() {
  return <img src={icAccount} className="block max-w-none w-full h-full" />;
}

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

// =============================================================================
// PROFILE MENU COMPONENT
// =============================================================================
const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isOpen,
  onClose,
  position,
}) => {
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => document.removeEventListener("keydown", handleEscapeKey);
    }
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50"
      style={{
        left: Math.max(10, Math.min(position.x, window.innerWidth - 272)), // 262px width + 10px margin
        top: Math.max(10, Math.min(position.y, window.innerHeight - 125)), // Approximate height + margin
      }}
    >
      {/* Dialog List Container - matches Figma structure */}
      <div className="flex flex-col items-start justify-start px-0 py-[8px] w-[262px]">
        {/* Background Dialog */}
        <div className="relative w-full">
          <div className="bg-white rounded-[12px] border border-[#d5d8dc] shadow-[12px_12px_26px_0px_#ebebed] overflow-hidden">
            {/* Dialog Content */}
            <div className="flex flex-col gap-[8px] items-center justify-center">
              <div className="flex flex-col items-start justify-start w-[262px]">
                {/* User Email Dialog Element */}
                <div className="flex flex-col items-start justify-start overflow-hidden px-[14px] py-[12px] w-full ">
                  <div className="flex gap-[10px] items-center justify-start w-full h-[20px]">
                    <div className="w-[20px] h-[20px] overflow-hidden flex-shrink-0">
                      <IconAccount />
                    </div>
                    <div className="flex flex-col justify-center leading-[0] w-[204px] text-[#989BA2] text-[14px] font-normal h-[20px]">
                      <p className="leading-[20px]">
                        {user?.email || "ezroco.dev@gmail.com"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout Dialog Element */}
                <div
                  className="flex flex-col items-start justify-start overflow-hidden px-[14px] py-[12px] w-full h-[20px] cursor-pointer"
                  onClick={handleLogout}
                >
                  <div className="flex gap-[10px] items-center justify-start w-full h-[20px]">
                    <div className="w-[20px] h-[20px] overflow-hidden flex-shrink-0">
                      <img src={icLogout} />
                    </div>
                    <div className="flex flex-col justify-center leading-[0] w-[204px] text-[#000] text-[14px] font-normal h-[20px]">
                      <p className="leading-[20px]">로그아웃</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
