import React from "react";

interface InferenceChatCardProps {
  text: string;
}

const InferenceChatCard: React.FC<InferenceChatCardProps> = ({ text }) => {
  return (
    <div className="bg-white box-border flex items-center justify-center px-[16px] py-[12px] relative rounded-[22px]">
      <div
        aria-hidden="true"
        className="absolute border border-[#d5d8dc] border-solid inset-0 pointer-events-none rounded-[22px]"
      />
      <div className="flex flex-col ,_sans-serif] justify-center leading-[20px] not-italic relative text-[14px] text-black whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
};

export default InferenceChatCard;
