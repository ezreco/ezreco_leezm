import React from "react";

interface PatternItem {
  percentage: number;
  label: string;
}

interface UsagePatternCardProps {
  patterns: PatternItem[];
}

const UsagePatternCard: React.FC<UsagePatternCardProps> = ({ patterns }) => {
  return (
    <div className="bg-white rounded-[12px] border border-[#e5e5e5] px-[24px] py-[20px] shadow-sm">
      <div className="flex items-center gap-[16px]">
        {patterns.map((pattern, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-[6px]">
              <span className="text-[20px] font-semibold text-[#4169E1]">
                {pattern.percentage}%
              </span>
              <span className="text-[14px] font-normal text-[#666666]">
                {pattern.label}
              </span>
            </div>
            {index < patterns.length - 1 && (
              <div className="w-[1px] h-[40px] bg-[#e5e5e5]" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default UsagePatternCard;