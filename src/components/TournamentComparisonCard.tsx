import React from "react";

interface HighlightedText {
  text: string;
  isHighlighted: boolean;
}

interface TournamentComparisonCardProps {
  title: string;
  image: string;
  differentiators?: HighlightedText[];
  specs?: HighlightedText[];
  onSelect: () => void;
}

const TournamentComparisonCard: React.FC<TournamentComparisonCardProps> = ({
  title,
  image,
  differentiators = [],
  specs = [],
  onSelect,
}) => {
  return (
    <div className="w-[448px] bg-white border border-[#d5d8dc] rounded-[20px] py-[26px] flex flex-col h-[732px]">
      <div className="h-[282px] w-full">
        {/* Product Image */}
        <div className="w-[260px] h-[182px] mx-auto flex items-center justify-center overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Name */}
        <div className="text-[18px] leading-[24px] font-semibold mb-[40px] text-center whitespace-pre-wrap text-black">
          {title}
        </div>
      </div>
      {/* Horizontal Divider */}
      <div className="w-full h-[1px] bg-[#d5d8dc] mb-[40px]" />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-[8px]">
        {/* 차별화 포인트 Section */}
        {differentiators.length > 0 && (
          <div className="mb-[39px]">
            <div className="text-[18px] leading-[24px] font-semibold mb-[8px] text-center text-black">
              차별화 포인트
            </div>
            <div className="text-center">
              {differentiators.map((item, index) => (
                <div
                  key={index}
                  className={`text-[16px] leading-[26px] mb-0 ${
                    item.isHighlighted
                      ? "font-semibold text-[#f85057]"
                      : "text-black"
                  }`}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 스펙 정보 Section */}
        {specs.length > 0 && (
          <div className="mb-[24px]">
            <div className="text-[18px] leading-[24px] font-semibold mb-[22px] text-center text-black">
              스펙 정보
            </div>
            <div className="text-center">
              {specs.map((item, index) => {
                // Check if this is part of a multi-part line (like "Quantum Matrix" + ", Glare Free 기술")
                const isInlinePart = item.text.startsWith(",");
                const prevItem = index > 0 ? specs[index - 1] : null;
                // const shouldInline =
                  isInlinePart ||
                  (prevItem && specs[index + 1]?.text.startsWith(","));

                if (isInlinePart && prevItem) {
                  // This is handled by the previous item, skip rendering
                  return null;
                }

                // Check if next item should be inline
                const nextItem = specs[index + 1];
                const hasInlineNext = nextItem?.text.startsWith(",");

                if (hasInlineNext) {
                  // Render this item and next item together
                  return (
                    <div
                      key={index}
                      className="text-[16px] leading-[26px] mb-0"
                    >
                      <span
                        className={
                          item.isHighlighted
                            ? "font-semibold text-[#f85057]"
                            : "text-black"
                        }
                      >
                        {item.text}
                      </span>
                      <span
                        className={
                          nextItem.isHighlighted
                            ? "font-semibold text-[#f85057]"
                            : "text-black"
                        }
                      >
                        {nextItem.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className={`text-[16px] leading-[26px] mb-0 ${
                      item.isHighlighted
                        ? "font-semibold text-[#f85057]"
                        : "text-black"
                    }`}
                  >
                    {item.text}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="w-[8px] h-[230px] absolute right-[46px] top-[589px]">
        <div className="w-full h-full bg-[#d5d8dc] rounded-full" />
      </div>

      {/* 선택 Button */}
      <div className="mt-[40px]">
        <button
          className="w-[132px] h-[38px] mx-auto block bg-[#f0f1f3] rounded-[24px] hover:bg-[#e0e1e3] transition-colors"
          onClick={onSelect}
        >
          <div className="text-black text-[14px] leading-[32px] font-semibold text-center">
            선택
          </div>
        </button>
      </div>
    </div>
  );
};

export default TournamentComparisonCard;
