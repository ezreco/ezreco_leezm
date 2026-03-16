import React from "react";
import viLoading2 from "../assets/icons/vi_loading_2.png";

interface FullScreenLoadingProps {
  isOpen: boolean;
  text?: string;
}

const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  isOpen,
  text = "Loading...",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
    >
      {/* Loading Icon */}
      <div className="w-[140px] h-[140px] mb-[28px]">
        <img
          src={viLoading2}
          alt="Loading"
          className="w-full h-full animate-spin"
          style={{
            animation: "spin 1s linear infinite",
          }}
        />
      </div>

      {/* Loading Text */}
      <p className="text-[24px] leading-[32px] text-[#d5d8dc] text-center">
        {text}
      </p>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default FullScreenLoading;
