import React from "react";

interface ConditionTagsCardProps {
  tags: string[];
}

const ConditionTagsCard: React.FC<ConditionTagsCardProps> = ({ tags }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-[20px]">
      <div className="flex gap-[24px] items-center">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="text-[14px] font-semibold leading-[20px] text-[#0106ff] whitespace-nowrap"
            style={{
              fontFamily: "'One UI Sans GUI', sans-serif",
              fontWeight: 600,
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConditionTagsCard;
