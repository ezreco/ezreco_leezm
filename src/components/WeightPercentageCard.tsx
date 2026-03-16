import React from "react";

interface WeightItem {
  percentage: number;
  label: string;
}

interface WeightPercentageCardProps {
  items: WeightItem[];
}

const WeightPercentageCard: React.FC<WeightPercentageCardProps> = ({
  items,
}) => {
  // Sort items by percentage descending (largest first)
  const sortedItems = [...items].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="relative w-full h-full flex items-center justify-center px-[20px]">
      <div className="flex items-center justify-between w-full">
        {sortedItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className="w-px h-[40px] bg-[#d5d8dc] mx-[10px]" />
            )}
            <div className="flex flex-col items-center justify-center w-[92px]">
              <div
                className="text-[14px] font-semibold leading-[20px] text-[#0106ff] text-center"
                style={{
                  fontFamily: "'One UI Sans GUI', sans-serif",
                  fontWeight: 600,
                }}
              >
                {item.percentage}%
              </div>
              <div
                className="text-[12px] leading-[16px] text-black text-center mt-[2px]"
                style={{
                  fontFamily: "'One UI Sans GUI', sans-serif",
                  fontWeight: 400,
                }}
              >
                {item.label}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeightPercentageCard;
