import React from "react";

interface WeightItem {
  percentage: number;
  labels: string[];
}

interface WeightListCardProps {
  items: WeightItem[];
}

const WeightListCard: React.FC<WeightListCardProps> = ({ items }) => {
  return (
    <div className="relative w-full h-full px-[20px] pt-[35px] pb-[0px]">
      {items.map((item, groupIndex) => (
        <div key={groupIndex}>
          {/* Percentage */}
          <div
            className="text-[14px] font-semibold leading-[20px] text-[#0106ff]"
            style={{
              fontWeight: 600,
            }}
          >
            {item.percentage}%
          </div>

          {/* Labels */}
          {item.labels.map((label, labelIndex) => (
            <div
              key={labelIndex}
              className="text-[12px] leading-[16px] text-black mt-[4px]"
              style={{
                fontWeight: 400,
              }}
            >
              {label}
            </div>
          ))}

          {/* Divider line (except for last item) */}
          {groupIndex < items.length - 1 && (
            <div className="w-full h-px bg-[#d5d8dc] my-[16px]" />
          )}
        </div>
      ))}
    </div>
  );
};

export default WeightListCard;
