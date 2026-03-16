import React from "react";

interface TechSpecItem {
  label: string;
  percentage: number;
}

interface TechSpecListCardProps {
  specs: TechSpecItem[];
}

const TechSpecListCard: React.FC<TechSpecListCardProps> = ({ specs }) => {
  return (
    <div className="bg-white rounded-[12px] border border-[#e5e5e5] px-[24px] py-[20px] shadow-sm">
      <div className="space-y-[12px]">
        {specs.map((spec, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-[14px] font-normal text-[#1a1a1a]">
              {spec.label}
            </span>
            <span className="text-[16px] font-semibold text-[#4169E1]">
              {spec.percentage}%
            </span>
          </div>
        ))}
        {specs.length > 0 && (
          <div className="border-t border-[#e5e5e5] pt-[8px] mt-[8px]">
            <div className="h-[1px] bg-[#e5e5e5]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TechSpecListCard;