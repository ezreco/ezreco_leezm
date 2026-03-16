import React from "react";

interface KeywordOption {
  id: string;
  label: string;
}

interface AuxKeywordProps {
  keywords: KeywordOption[];
  onKeywordClick: (keyword: string) => void;
}

const AuxKeyword: React.FC<AuxKeywordProps> = ({
  keywords,
  onKeywordClick,
}) => {
  return (
    <div className="flex flex-col gap-[12px]  items-center">
      {/* Keywords Grid */}
      <div className="flex flex-wrap gap-[12px] justify-center max-w-[760px]">
        {keywords.map((keyword) => (
          <button
            key={keyword.id}
            onClick={() => onKeywordClick(keyword.label)}
            className="bg-white border border-[#d5d8dc] rounded-[20px] px-[20px] py-[10px] transition-all hover:border-[#0106ff] hover:bg-[#f8f8fa]"
          >
            <span className="text-[16px] leading-[26px] font-normal text-[#252525]">
              {keyword.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AuxKeyword;
