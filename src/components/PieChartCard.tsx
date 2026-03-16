import React from "react";

interface PieSegment {
  label: string;
  percentage: number;
  color: string;
}

interface PieChartCardProps {
  segments: PieSegment[];
}

const PieChartCard: React.FC<PieChartCardProps> = ({ segments }) => {
  // Calculate cumulative percentages for SVG path generation
  let cumulativePercentage = 0;

  const createArcPath = (
    startPercentage: number,
    endPercentage: number
  ): string => {
    const startAngle = (startPercentage / 100) * 2 * Math.PI - Math.PI / 2;
    const endAngle = (endPercentage / 100) * 2 * Math.PI - Math.PI / 2;

    const radius = 50;
    const centerX = 60;
    const centerY = 60;

    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = endPercentage - startPercentage > 50 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#e5e5e5] px-[24px] py-[20px] shadow-sm">
      <div className="flex items-center gap-[24px]">
        {/* Pie Chart */}
        <div className="relative w-[120px] h-[120px]">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="transform -rotate-90"
          >
            {segments.map((segment, index) => {
              const startPercentage = cumulativePercentage;
              cumulativePercentage += segment.percentage;
              const endPercentage = cumulativePercentage;

              return (
                <path
                  key={index}
                  d={createArcPath(startPercentage, endPercentage)}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-[12px]">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-[8px]">
              <div
                className="w-[12px] h-[12px] rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex items-baseline gap-[8px]">
                <span className="text-[16px] font-semibold text-[#1a1a1a]">
                  {segment.percentage}%
                </span>
                <span className="text-[12px] font-normal text-[#666666]">
                  {segment.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartCard;