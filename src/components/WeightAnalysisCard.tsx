import React from "react";

interface BubbleData {
  label: string;
  percentage: number;
  x: number;
  y: number;
  size: number;
}

interface WeightAnalysisCardProps {
  bubbles: BubbleData[];
  disclaimer?: string;
}

const WeightAnalysisCard: React.FC<WeightAnalysisCardProps> = ({
  bubbles,
  disclaimer,
}) => {
  // Background labels (light gray, less prominent) - exact positions from Figma
  const backgroundLabels = [
    { text: "Style", x: 41.57, y: 37.16 },
    { text: "Black", x: 35.67, y: 16.72 },
    { text: "Motion Interpolation", x: 50.51, y: 20.44 },
    { text: "Stutter", x: 61.48, y: 26.01 },
    { text: "Gray Uniformity", x: 66.57, y: 13.51 },
    { text: "Interface", x: 56.2, y: 55.24 },
    { text: "Pre Callibration", x: 77.74, y: 45.95 },
    { text: "Color Volume", x: 20.84, y: 60.81 },
    { text: "Variable Refresh Rate", x: 34.25, y: 75.84 },
    { text: "Audio Passthrough", x: 52.95, y: 69.43 },
    { text: "Blooming", x: 71.54, y: 57.43 },
  ];

  // Color mapping based on percentage (exact colors from Figma design system)
  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 15)
      return { bg: "#f5e3fd", border: "#c153f4", text: "#c153f4" };
    if (percentage >= 3)
      return { bg: "#d6d7ff", border: "#0106ff", text: "#0106ff" };
    return { bg: "#d6f8ee", border: "#00d694", text: "#00d694" };
  };

  // Get font size based on bubble size (exact sizes from Figma)
  const getFontSize = (bubbleSize: number) => {
    if (bubbleSize >= 48) return { size: 14, lineHeight: 20 }; // Large bubbles (15%)
    if (bubbleSize >= 36) return { size: 12, lineHeight: 16 }; // Medium bubbles (3%)
    return { size: 10, lineHeight: 12 }; // Small bubbles (1%)
  };

  // Determine label color - main feature labels are dark (#252525), others are light
  const getLabelColor = (label: string) => {
    const mainLabels = [
      "Viewing Angle",
      "Reflections",
      "Contrast",
      "Apps and Features",
      "Supported Resolutions",
      "BFI",
      "Color Gamut",
    ];
    return mainLabels.includes(label) ? "#252525" : "#d5d8dc";
  };

  return (
    <div className="relative w-full h-full">
      {/* Bubble Chart Container */}
      <div className="relative w-full mt-[20px] h-[240px] mb-[15px]">
        {/* Background labels */}
        {backgroundLabels.map((bgLabel, index) => (
          <div
            key={`bg-${index}`}
            className="absolute text-center whitespace-nowrap"
            style={{
              left: `${bgLabel.x}%`,
              top: `${bgLabel.y}%`,
              transform: "translate(-50%, -50%)",
              fontSize: "10px",
              lineHeight: "12px",
              color: "#d5d8dc",
              fontFamily: "'One UI Sans GUI', sans-serif",
              fontWeight: 400,
            }}
          >
            {bgLabel.text}
          </div>
        ))}

        {/* Bubbles with labels */}
        {bubbles.map((bubble, index) => {
          const colors = getColorByPercentage(bubble.percentage);
          const font = getFontSize(bubble.size);
          const labelColor = getLabelColor(bubble.label);
          return (
            <div
              key={index}
              className="absolute flex flex-col items-center"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              {/* Bubble Circle */}
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  backgroundColor: colors.bg,
                }}
              >
                <span
                  className="text-center"
                  style={{
                    fontSize: `${font.size}px`,
                    color: colors.text,
                    lineHeight: `${font.lineHeight}px`,
                    fontFamily: "'One UI Sans GUI', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {bubble.percentage}%
                </span>
              </div>
              {/* Label below bubble */}
              <span
                className="text-center whitespace-nowrap mt-[6px]"
                style={{
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: labelColor,
                  fontFamily: "'One UI Sans GUI', sans-serif",
                  fontWeight: 600,
                }}
              >
                {bubble.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <div
          className="text-center"
          style={{
            fontSize: "10px",
            lineHeight: "12px",
            color: "#989ba2",
            fontFamily: "'One UI Sans GUI', sans-serif",
            fontWeight: 400,
          }}
        >
          {disclaimer}
        </div>
      )}
    </div>
  );
};

export default WeightAnalysisCard;
