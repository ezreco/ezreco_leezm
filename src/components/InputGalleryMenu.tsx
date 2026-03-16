import React, { useEffect } from "react";

// Import icon assets (same as HistoryContextMenu)
import icUpload from "@/assets/icons/ic_upload.svg";
import icImage from "@/assets/icons/ic_image.svg";
import icScreenshot from "@/assets/icons/ic_favorite.svg";

interface InputGalleryMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  onFileUpload?: () => void;
  onImageUpload?: () => void;
  onScreenshot?: () => void;
}

const InputGalleryMenu: React.FC<InputGalleryMenuProps> = ({
  isOpen,
  x,
  y,
  onClose,
  onFileUpload,
  onImageUpload,
  onScreenshot,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const menu = document.querySelector(
        "[data-input-gallery-menu]"
      ) as HTMLElement;

      console.log("Document click detected in gallery menu"); // 디버깅용

      // 메뉴 내부를 클릭한 경우가 아니면 메뉴 닫기
      if (menu && !menu.contains(target)) {
        console.log("Closing gallery menu"); // 디버깅용
        onClose();
      }
    };

    // 다음 프레임에서 이벤트 리스너 추가 (현재 클릭 이벤트가 처리된 후)
    const timer = setTimeout(() => {
      document.addEventListener("click", handleDocumentClick, true);
    }, 100); // 100ms로 증가

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  console.log("InputGalleryMenu rendering at:", { x, y }); // 디버깅용

  const menuItems = [
    {
      icon: (
        <div className="overflow-clip relative shrink-0 size-[20px]">
          <div className="absolute h-[13.5px] left-[3.25px] top-[3.25px] w-[13.502px]">
            <img alt="" className="block max-w-none size-full" src={icUpload} />
          </div>
        </div>
      ),
      label: "파일 업로드",
      onClick: onFileUpload,
    },
    {
      icon: (
        <div className="overflow-clip relative shrink-0 size-[20px]">
          <div className="absolute inset-[11.62%_10.15%_15.9%_17.35%]">
            <img alt="" className="block max-w-none size-full" src={icImage} />
          </div>
        </div>
      ),
      label: "이미지 업로드",
      onClick: onImageUpload,
    },
    {
      icon: (
        <div className="overflow-clip relative shrink-0 size-[20px]">
          <div className="absolute h-[14.163px] left-[2.59px] top-[2.75px] w-[14.815px]">
            <img
              alt=""
              className="block max-w-none size-full"
              src={icScreenshot}
            />
          </div>
        </div>
      ),
      label: "스크린샷 캡쳐하기",
      onClick: onScreenshot,
    },
  ];

  return (
    <div
      data-input-gallery-menu
      style={{
        position: "fixed",
        top: y,
        left: x,
        width: "262px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "12px 12px 26px 0px rgba(235, 235, 237, 1)",
        border: "1px solid #d5d8dc",
        zIndex: 100000,
        padding: "8px 0",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          border: "1px solid #d5d8dc",
          inset: 0,
          pointerEvents: "none",
          borderRadius: "12px",
          boxShadow: "12px 12px 26px 0px #ebebed",
        }}
      />

      <div style={{ position: "relative" }}>
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
            <div style={{ flexShrink: 0 }}>{item.icon}</div>
            <span
              style={{
                fontFamily: "'One UI Sans GUI', sans-serif",
                lineHeight: "20px",
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

export default InputGalleryMenu;
