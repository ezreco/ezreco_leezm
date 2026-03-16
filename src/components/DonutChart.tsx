import React, { useRef, useEffect } from "react";

interface DonutChartSegment {
  value: number;
  label: string;
}

interface DonutChartProps {
  segments: DonutChartSegment[];
  width?: number;
  height?: number;
}

// Opacity values for segments (from Figma)
const OPACITIES = [1.0, 0.7, 0.5, 0.3, 0.15];

const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  width = 352,
  height = 170,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate total value
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  // Calculate segments with percentages
  // If total is 100, assume values are already percentages (no rounding needed)
  const segmentsWithPercentage = segments.map((segment) => {
    const percentage = total === 100
      ? segment.value
      : Math.round((segment.value / total) * 100);
    return {
      ...segment,
      percentage,
    };
  });

  // Sort by value descending for display (largest first)
  const sortedSegments = [...segmentsWithPercentage].sort(
    (a, b) => b.value - a.value
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sort by value descending for drawing (largest first)
    const sortedForDrawing = [...segmentsWithPercentage].sort(
      (a, b) => b.value - a.value
    );

    // Apply 2x scaling for anti-aliasing
    const scale = 2;
    const displayWidth = 120; // Chart width
    const displayHeight = 120; // Chart height
    canvas.width = displayWidth * scale;
    canvas.height = displayHeight * scale;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    ctx.scale(scale, scale);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions matching Figma (120x120)
    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;
    const innerRadius = 18; // Fixed inner radius for all segments
    const maxOuterRadius = 56; // Maximum outer radius

    // Calculate varying outer radius for each segment
    const minOuterRadius = 32; // Minimum outer radius
    const radiusStep =
      (maxOuterRadius - minOuterRadius) /
      Math.max(sortedForDrawing.length - 1, 1);

    // Draw donut segments with varying outer radius but same inner radius
    let currentAngle = -Math.PI / 2; // Start from top

    sortedForDrawing.forEach((segment, index) => {
      const segmentAngle = (segment.value / total) * 2 * Math.PI;
      const endAngle = currentAngle + segmentAngle;

      // Calculate segment-specific outer radius (largest first, decreasing)
      const outerRadius = maxOuterRadius - radiusStep * index;
      const segmentLineWidth = outerRadius - innerRadius;
      const segmentRadius = innerRadius + segmentLineWidth / 2;

      // Use base color with varying opacity
      const opacity = OPACITIES[index] || 0.15;
      const baseColor = "#0106FF"; // Figma color

      // Draw donut segment with custom radius and opacity
      ctx.beginPath();
      ctx.arc(centerX, centerY, segmentRadius, currentAngle, endAngle);
      ctx.lineWidth = segmentLineWidth;
      ctx.strokeStyle = baseColor;
      ctx.globalAlpha = opacity;
      ctx.stroke();
      ctx.globalAlpha = 1.0; // Reset alpha

      currentAngle = endAngle;
    });
  }, [segmentsWithPercentage, total]);

  return (
    <div
      className="relative flex items-center gap-[28px]"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Canvas with chart */}
      <canvas ref={canvasRef} className="shrink-0" />

      {/* Right Legend */}
      <div className="flex flex-col gap-[8px]">
        {sortedSegments.map((segment, index) => {
          const opacity = OPACITIES[index] || 0.15;
          return (
            <div key={index} className="flex items-center gap-[8px]">
              {/* Color dot */}
              <div
                className="w-[8px] h-[8px] rounded-full shrink-0"
                style={{
                  backgroundColor: "#0106FF",
                  opacity: opacity,
                }}
              />
              {/* Percentage */}
              <span className="text-[12px] font-semibold leading-[16px] text-[#000000] min-w-[30px]">
                {segment.percentage}%
              </span>
              {/* Label */}
              <span className="text-[12px] font-normal leading-[16px] text-[#000000]">
                {segment.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonutChart;
