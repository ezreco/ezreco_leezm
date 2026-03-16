import React from "react";

interface ButtonTextIconProps {
  onClick?: () => void;
  text?: string;
  isExpanded?: boolean; // 확장 상태를 prop으로 받음
}

const ButtonTextIcon: React.FC<ButtonTextIconProps> = ({
  onClick,
  text = "추천 과정 숨기기",
  isExpanded
}) => {
  // text 기반 회전 로직 (기존 동작 유지)
  const isHideText = text === "추천 과정 숨기기";

  // isExpanded가 제공되면 우선 사용, 아니면 기존 로직 사용
  const shouldRotate = isExpanded !== undefined ? isExpanded : isHideText;

  return (
    <div className="flex gap-[4px] items-center cursor-pointer" onClick={onClick}>
      <div className="flex flex-col font-sans justify-center text-[#989ba2] text-[14px]">
        <span className="leading-[20px]">{text}</span>
      </div>
      <div className="overflow-clip relative shrink-0 size-[20px]">
        <svg
          className="absolute h-[5.439px] left-[4.65px] top-[7.15px] w-[10.707px]"
          viewBox="0 0 11 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: shouldRotate ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <path
            d="M1 1L5.35355 5.35355L9.70711 1"
            stroke="#989BA2"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default ButtonTextIcon;
