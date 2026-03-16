import React from "react";
import icLoading from "../assets/icons/ic_loading.png";

interface BubbleLoadingProps {
  className?: string;
}

const BubbleLoading: React.FC<BubbleLoadingProps> = ({ className = "" }) => {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-[22px] px-[16px] py-[12px] ${className}`}
      style={{
        background: "linear-gradient(90deg, #7850ff 0%, #37d7ff 100%)",
      }}
    >
      <img
        src={icLoading}
        alt="Loading"
        className="w-[20px] h-[20px] animate-spin"
        style={{
          animation: "spin 1s linear infinite",
        }}
      />
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

export default BubbleLoading;
