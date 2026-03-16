import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { semantic } from "../styles/color";
import HistoryList from "./HistoryList";
import { useAuth } from "../contexts/AuthContext";
import ProfileMenu from "./ProfileMenu";
import FavoritesDialog from "./FavoritesDialog";
import SearchDialog from "./SearchDialog";
import { aiResponseStore } from "../store/aiResponseStore";
import { resetUI } from "../store/slices/uiSlice";
import { resetSmartCompare } from "../store/slices/smartCompareSlice";
import { resetPersonaDiscussion } from "../store/slices/personaDiscussionSlice";
import { resetTournament } from "../store/slices/tournamentSlice";

// Image assets
import icLogo from "@/assets/icons/ic-logo.svg";
import icChat from "@/assets/icons/ic_chat.svg";
import icFav from "@/assets/icons/ic_favorite.svg";
import icInfo from "@/assets/icons/ic_commoninfo.svg";
import icSetting from "@/assets/icons/ic_setting.svg";
import icSearch from "@/assets/icons/ic_search.svg";
import icHistory from "@/assets/icons/ic-history.svg";
import icSidebar from "@/assets/icons/ic_sidebar_close.svg";
import icLogin from "@/assets/icons/ic_btn_login.svg";

// Resource Components
function ResourceIcLogo() {
  return (
    <div className="relative w-full h-full">
      <img alt="" className="block max-w-none w-full h-full" src={icLogo} />
    </div>
  );
}

// Icon Components
function IconChat() {
  return (
    <div className="w-[20px] h-[20px] relative">
      <img alt="" className="block max-w-none w-full h-full" src={icChat} />
    </div>
  );
}

function IconFav() {
  return (
    <div className="w-[20px] h-[20px] relative">
      <img alt="" className="block max-w-none w-full h-full" src={icFav} />
    </div>
  );
}

function IconInfo() {
  return (
    <div className="w-[20px] h-[20px] relative">
      <img alt="" className="block max-w-none w-full h-full" src={icInfo} />
    </div>
  );
}

function IconSetting() {
  return (
    <div className="w-[20px] h-[20px] relative">
      <img alt="" className="block max-w-none w-full h-full" src={icSetting} />
    </div>
  );
}

function IconSearch() {
  return (
    <div className="w-[20px] h-[20px] relative">
      <img alt="" className="block max-w-none w-full h-full" src={icSearch} />
    </div>
  );
}

function IconHistory() {
  return (
    <div className="w-[20px] h-[20px] relative">
      <img alt="" className="block max-w-none w-full h-full" src={icHistory} />
    </div>
  );
}

function IconLogin() {
  return (
    <div className="w-[20px] h-[20px] relative">
      <img src={icLogin} className="block max-w-none w-full h-full" />
    </div>
  );
}

function IconSidebar() {
  return (
    <div className="w-[32px] h-[32px] rounded-full bg-[#EDEDF1]  flex items-center justify-center ">
      <img
        alt=""
        className="block max-w-none w-[20px] h-[20px]"
        src={icSidebar}
      />
    </div>
  );
}

// Menu Component
interface MenuItemProps {
  icon?: React.ReactNode;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

function MenuItem({
  icon,
  text,
  isCollapsed,
  onClick,
}: MenuItemProps & { isCollapsed?: boolean }) {
  return (
    <div
      className="px-[10px] py-[2px] cursor-pointer relative group"
      onClick={onClick}
      title={isCollapsed ? text : undefined}
    >
      <div
        className="flex items-center px-[20px] py-[12px] h-[20px] rounded-[8px] transition-all"
        style={{
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#ededf1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <div className="w-[20px] h-[20px] flex items-center justify-center">
          {icon}
        </div>
        {!isCollapsed && (
          <span className="text-[14px] font-semibold text-black ml-[10px]">
            {text}
          </span>
        )}
      </div>
    </div>
  );
}

// Sidebar Component
interface SidebarProps {
  onLoginClick?: () => void;
  isVisible?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onLoginClick,
  isVisible = true,
  onToggle,
}) => {
  // Determine if sidebar is collapsed (folded) based on visibility
  const isCollapsed = !isVisible;

  // Navigation and dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get auth state
  const { isAuthenticated, user } = useAuth();

  // Profile menu state
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileMenuPosition, setProfileMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  // Favorites dialog state
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Search dialog state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Hover state for collapsed sidebar
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Handle login/logout action
  const handleAuthAction = () => {
    if (isAuthenticated) {
      // For authenticated users, show profile menu instead of immediate logout
      return;
    } else {
      onLoginClick?.();
    }
  };

  // Get user's initial for profile icon
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "S";
  };

  const showProfileMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();

    // Position menu to the right of the profile button
    setProfileMenuPosition({
      x: rect.right + 10,
      y: rect.top,
    });
    setIsProfileMenuOpen(true);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };

  // Handle new chat - clear data and navigate to home
  const handleNewChat = () => {
    // Clear old store
    aiResponseStore.clearUserPreferences();

    // Reset all Redux slices except login
    dispatch(resetUI());
    dispatch(resetSmartCompare());
    dispatch(resetPersonaDiscussion());
    dispatch(resetTournament());

    // Navigate to home
    navigate("/");
  };

  // Handle EZWiki click - navigate to EZWiki page
  const handleEZWikiClick = () => {
    navigate("/ezwiki");
  };

  return (
    <div
      className={`absolute left-0 top-0 ${
        isCollapsed ? "w-[80px]" : "w-[280px]"
      } h-full border-gray-200 transition-all duration-300`}
      style={{ backgroundColor: semantic.background, zIndex: 50 }}
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
      {/* Logo Section */}
      <div
        className={`h-[44px] mt-[30px] flex items-center  border-gray-100 ${
          isCollapsed ? "pl-[20px]" : "pl-[30px] pr-[14px]"
        }`}
      >
        {isCollapsed ? (
          // Collapsed state: show Logo or IconSidebar based on hover
          <div
            className="w-[40px] h-[32px] transition-all cursor-pointer relative"
            onClick={onToggle}
          >
            {/* Logo - visible when not hovered */}
            <div
              className={`absolute inset-0 transition-opacity duration-200  ${
                isSidebarHovered ? "opacity-0" : "opacity-100"
              }`}
            >
              <ResourceIcLogo />
            </div>
            {/* IconSidebar - visible when hovered, rotated 180deg */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                isSidebarHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="rotate-180">
                <IconSidebar />
              </div>
            </div>
          </div>
        ) : (
          // Expanded state: show Logo and IconSidebar button
          <>
            <div
              className="w-[40px] h-[32px] transition-all cursor-pointer"
              onClick={handleNewChat}
            >
              <ResourceIcLogo />
            </div>
            <div
              className="ml-auto w-[20px] h-[20px] cursor-pointer mr-[10px] transition-all"
              onClick={onToggle}
            >
              <IconSidebar />
            </div>
          </>
        )}
      </div>

      {/* Menu Section */}
      <div className="mt-[52px]">
        <MenuItem
          icon={<IconChat />}
          text="새 채팅"
          isActive
          isCollapsed={isCollapsed}
          onClick={handleNewChat}
        />
        <MenuItem
          icon={<IconFav />}
          text="즐겨찾기"
          isCollapsed={isCollapsed}
          onClick={() => setIsFavoritesOpen(true)}
        />
        <MenuItem
          icon={<IconInfo />}
          text="EZWiki"
          isCollapsed={isCollapsed}
          onClick={handleEZWikiClick}
        />
        <MenuItem
          icon={<IconSetting />}
          text="설정"
          isCollapsed={isCollapsed}
        />
        <MenuItem
          icon={<IconSearch />}
          text="검색"
          isCollapsed={isCollapsed}
          onClick={() => setIsSearchOpen(true)}
        />
      </div>

      {/* History Section */}
      <div
        className={`mt-[72px] transition-all ${
          isCollapsed ? "opacity-0 invisible h-0" : "opacity-100 visible"
        }`}
      >
        <MenuItem
          icon={<IconHistory />}
          text="히스토리"
          isActive
          isCollapsed={isCollapsed}
        />

        {/* History List */}
        <HistoryList />
      </div>

      {/* Login Button / Profile */}
      <div
        className={`absolute bottom-[30px] ${
          isCollapsed ? "left-[26px]" : "left-[30px]"
        } transition-all`}
      >
        {isAuthenticated ? (
          // User is logged in - show profile
          <div
            className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all"
            onClick={showProfileMenu}
          >
            <div className="w-[30px] h-[30px] bg-[#666666] rounded-full flex items-center justify-center">
              <span className="text-white text-[12px] font-semibold">
                {getUserInitial()}
              </span>
            </div>
          </div>
        ) : (
          // User is not logged in - show login button
          <>
            <button
              onClick={handleAuthAction}
              className={`flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all `}
            >
              <IconLogin />
              {!isCollapsed && (
                <span className="text-[14px]  ml-[4px] text-[#ㄷ252525] transition-all">
                  로그인
                </span>
              )}
            </button>
          </>
        )}
      </div>

      {/* Profile Menu Dialog */}
      <ProfileMenu
        isOpen={isProfileMenuOpen}
        onClose={closeProfileMenu}
        position={profileMenuPosition}
      />

      {/* Favorites Dialog */}
      <FavoritesDialog
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
