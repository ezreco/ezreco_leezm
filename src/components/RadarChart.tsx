import React from "react";
import type { ProductScore } from "../store/aiRecommendResultStore";

interface RadarChartProps {
  scores: ProductScore[]; // 5개 항목의 점수
  size?: number; // 차트 크기 (기본: 156)
  rank?: number; // 순위 (1, 2, 3)
}

const RadarChart: React.FC<RadarChartProps> = ({
  scores,
  size = 156,
  rank = 1,
}) => {
  // 순위에 따른 색상 결정
  const getColor = () => {
    if (rank === 1) return "#f85057";
    if (rank === 2) return "#00d694";
    return "#ff9500";
  };

  const chartColor = getColor();
  // 5각형 레이더 차트를 위한 각도 계산
  const angleStep = (Math.PI * 2) / 5; // 72도씩
  const startAngle = -Math.PI / 2; // 12시 방향부터 시작

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = 52; // 원의 반지름 52px (지름 104px)

  // 레이블 위치 (순서: 화질, 가성비, 사용성, 기능성, 음질)
  const labels = ["화질", "가성비", "사용성", "기능성", "음질"];

  // 점수를 0-100 범위에서 반지름 비율로 변환
  const getPoint = (index: number, percentage: number) => {
    const angle = startAngle + angleStep * index;
    const r = radius * (percentage / 100);
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  // 실제 데이터 점들
  const dataPoints = scores.map((score, index) => {
    const percentage = (score.score / score.maxScore) * 100;
    return getPoint(index, percentage);
  });

  const dataPolygonPoints = dataPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  // 레이블 위치 계산
  const getLabelPosition = (index: number) => {
    const angle = startAngle + angleStep * index;
    const labelRadius = radius + 18; // 차트 바깥쪽 (원의 가장자리에서 18px)
    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle),
    };
  };

  return (
    <div
      className="relative"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 배경 원들 (4개 레이어) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="#d5d8dc"
          strokeWidth="1"
          opacity="1"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.8}
          fill="none"
          stroke="#d5d8dc"
          strokeWidth="1"
          opacity="1"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.6}
          fill="none"
          stroke="#d5d8dc"
          strokeWidth="1"
          opacity="1"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.4}
          fill="none"
          stroke="#d5d8dc"
          strokeWidth="1"
          opacity="1"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.2}
          fill="none"
          stroke="#d5d8dc"
          strokeWidth="1"
          opacity="1"
        />

        {/* 중심에서 각 꼭지점으로 선 */}
        {Array.from({ length: 5 }, (_, i) => {
          const angle = startAngle + angleStep * i;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#d5d8dc"
              strokeWidth="1"
              opacity="1"
            />
          );
        })}

        {/* 실제 데이터 5각형 (꼭지점 없음) */}
        <polygon
          points={dataPolygonPoints}
          fill={chartColor}
          fillOpacity="0.2"
          stroke={chartColor}
          strokeWidth="1"
        />
      </svg>

      {/* 레이블 */}
      {labels.map((label, index) => {
        const pos = getLabelPosition(index);
        return (
          <div
            key={label}
            className="absolute text-[10px] leading-[12px] text-[#989ba2] text-center whitespace-nowrap"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default RadarChart;
