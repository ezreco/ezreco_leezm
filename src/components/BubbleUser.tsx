import React from "react";

interface BubbleUserProps {
  children: React.ReactNode;
  className?: string;
}

const BubbleUser: React.FC<BubbleUserProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`inline-block rounded-[22px] px-[16px] bg-white py-[12px] border-1 border-[#D5D8DC] ${className}`}
    >
      <div className="text-[14px] leading-[20px] text-[#1a1a1a] whitespace-pre-line">
        {children}
      </div>
    </div>
  );
};

export default BubbleUser;
