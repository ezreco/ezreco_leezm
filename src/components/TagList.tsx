import React from "react";

interface TagListProps {
  tags: string[];
  width?: number;
  height?: number;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  width = 320,
  height = 66,
}) => {
  return (
    <div
      className="relative flex items-center justify-center gap-6"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex flex-col justify-center font-semibold text-[14px] leading-[20px] text-[#252525] text-center whitespace-nowrap"
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

export default TagList;
