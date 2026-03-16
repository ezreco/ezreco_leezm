import React from "react";

interface BubbleAIProps {
  children: React.ReactNode;
  className?: string;
}

const BubbleAI: React.FC<BubbleAIProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`inline-block rounded-[22px] px-[16px] py-[12px] ${className}`}
      style={{
        background: "linear-gradient(90deg, #7850ff 0%, #37d7ff 100%)",
      }}
    >
      <div className="text-[14px] leading-[20px] text-white">{children}</div>
    </div>
  );
};

export default BubbleAI;
