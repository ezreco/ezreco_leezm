import React, { useEffect } from "react";

// Import icon assets
import icShare from "@/assets/icons/ic_share.png";
import icPin from "@/assets/icons/ic_pin.png";
import icFavorite from "@/assets/icons/ic_favorite.svg";
import icRename from "@/assets/icons/ic_rename.png";
import icDelete from "@/assets/icons/ic_delete.png";

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onShare?: () => void;
  onPin?: () => void;
  onFavorite?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}

const HistoryContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  x,
  y,
  onClose,
  onShare,
  onPin,
  onFavorite,
  onRename,
  onDelete,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const menu = document.querySelector("[data-context-menu]") as HTMLElement;

      // 메뉴 내부를 클릭한 경우가 아니면 메뉴 닫기
      if (menu && !menu.contains(target)) {
        onClose();
      }
    };

    // 다음 프레임에서 이벤트 리스너 추가 (현재 클릭 이벤트가 처리된 후)
    setTimeout(() => {
      document.addEventListener("click", handleDocumentClick, true);
    }, 0);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: (
        <img
          src={icShare}
          alt="공유"
          width="20"
          height="20"
          style={{ display: "block" }}
        />
      ),
      label: "공유",
      onClick: onShare,
    },
    {
      icon: (
        <img
          src={icPin}
          alt="대화 고정"
          width="20"
          height="20"
          style={{ display: "block" }}
        />
      ),
      label: "대화 고정",
      onClick: onPin,
    },
    {
      icon: (
        <img
          src={icFavorite}
          alt="즐겨찾기 추가"
          width="20"
          height="20"
          style={{ display: "block" }}
        />
      ),
      label: "즐겨찾기 추가",
      onClick: onFavorite,
    },
  ];

  const bottomMenuItems = [
    {
      icon: (
        <img
          src={icRename}
          alt="이름 바꾸기"
          width="20"
          height="20"
          style={{ display: "block" }}
        />
      ),
      label: "이름 바꾸기",
      onClick: onRename,
    },
    {
      icon: (
        <img
          src={icDelete}
          alt="삭제"
          width="20"
          height="20"
          style={{ display: "block" }}
        />
      ),
      label: "삭제",
      onClick: onDelete,
    },
  ];

  return (
    <div
      data-context-menu
      style={{
        position: "fixed",
        top: y,
        left: x,
        width: "262px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "12px 12px 26px 0px rgba(235, 235, 237, 1)",
        border: "1px solid #d5d8dc",
        zIndex: 40,
        padding: "8px 0",
      }}
    >
      {/* Top menu items */}
      <div>
        {menuItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#000000",
              transition: "background-color 0.2s ease",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f9fafb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
          >
            <div style={{ flexShrink: 0, display: "flex" }}>{item.icon}</div>
            <span
              style={{
                lineHeight: "20px",
                flex: 1,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          backgroundColor: "#d5d8dc",
          margin: "8px 14px",
        }}
      />

      {/* Bottom menu items */}
      <div>
        {bottomMenuItems.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 14px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#000000",
              transition: "background-color 0.2s ease",
              userSelect: "none",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              console.log("DDDD");
              e.currentTarget.style.backgroundColor = "#f9fafb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
          >
            <div style={{ flexShrink: 0, display: "flex" }}>{item.icon}</div>
            <span
              style={{
                lineHeight: "20px",
                flex: 1,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryContextMenu;
