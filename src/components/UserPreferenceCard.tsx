import React from "react";

interface UserPreferenceCardProps {
  tags: string[];
}

const UserPreferenceCard: React.FC<UserPreferenceCardProps> = ({ tags }) => {
  return (
    <div className="bg-white rounded-[12px] border border-[#e5e5e5] px-[24px] py-[16px] shadow-sm">
      <div className="flex flex-wrap items-center gap-[12px]">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-[16px] font-normal text-[#1a1a1a] whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UserPreferenceCard;