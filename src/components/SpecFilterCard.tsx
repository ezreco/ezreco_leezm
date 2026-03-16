import React from "react";

interface SpecFilterCardProps {
  specs: string[];
}

const SpecFilterCard: React.FC<SpecFilterCardProps> = ({ specs }) => {
  return (
    <div className="bg-white rounded-[12px] border border-[#e5e5e5] px-[24px] py-[16px] shadow-sm">
      <div className="flex items-center gap-[24px]">
        {specs.map((spec, index) => (
          <span key={index} className="text-[16px] font-normal text-[#1a1a1a]">
            {spec}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SpecFilterCard;