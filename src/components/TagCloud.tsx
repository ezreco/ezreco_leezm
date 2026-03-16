import React, { useState, useEffect } from "react";

interface TagCloudProps {
  tags: string[];
  width?: number;
  height?: number;
  onAnimationComplete?: () => void;
  layout?: "custom" | "horizontal";
  disableAnimation?: boolean;
}

interface TagStyle {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  rotation: number;
  opacity: number;
}

const TagCloud: React.FC<TagCloudProps> = ({
  tags,
  width = 320,
  height = 106,
  onAnimationComplete,
  layout = "custom",
  disableAnimation = false,
}) => {
  const [tagStyles, setTagStyles] = useState<TagStyle[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    let finalPositions: Omit<TagStyle, "rotation" | "opacity">[];

    if (layout === "horizontal") {
      // Calculate horizontal centered positions with 24px gap
      const gap = 24;
      const fontSize = 14;
      const color = "#252525";
      const y = height / 2;

      // Calculate total width needed
      const totalGapWidth = (tags.length - 1) * gap;
      const estimatedTextWidths = tags.map((tag) => tag.length * 8); // Rough estimate
      const totalTextWidth = estimatedTextWidths.reduce((a, b) => a + b, 0);
      const totalWidth = totalTextWidth + totalGapWidth;

      // Start position for centering
      let currentX = (width - totalWidth) / 2;

      finalPositions = tags.map((tag, index) => {
        const textWidth = estimatedTextWidths[index];
        const centerX = currentX + textWidth / 2;
        currentX += textWidth + gap;

        return {
          text: tag,
          x: centerX,
          y: y,
          fontSize: fontSize,
          color: color,
        };
      });
    } else {
      // Define final positions and styles based on Figma layout (progress2)
      finalPositions = [
        { text: "삼성", x: 34, y: 35, fontSize: 16, color: "#252525" },
        { text: "엘지", x: 65.5, y: 44, fontSize: 12, color: "#989ba2" },
        { text: "영화용", x: 109.5, y: 55.5, fontSize: 12, color: "#252525" },
        { text: "65인치", x: 132, y: 29, fontSize: 16, color: "#252525" },
        { text: "거실에서", x: 196, y: 39, fontSize: 12, color: "#252525" },
        { text: "영화", x: 236, y: 61, fontSize: 16, color: "#252525" },
        { text: "를 주로", x: 277, y: 61, fontSize: 16, color: "#989ba2" },
        { text: "가끔", x: 148, y: 77, fontSize: 16, color: "#989ba2" },
        { text: "스포츠", x: 187, y: 77, fontSize: 16, color: "#252525" },
        { text: "관람", x: 82, y: 75, fontSize: 16, color: "#252525" },
      ];
    }

    // Create tag styles with random initial positions and rotations
    const initialStyles: TagStyle[] = tags.map((tag, index) => {
      const finalPos =
        finalPositions.find((p) => p.text === tag) || finalPositions[index];
      return {
        ...finalPos,
        text: tag,
        rotation: disableAnimation ? 0 : Math.random() * 60 - 30, // Random angle between -30 and 30 degrees
        opacity: disableAnimation ? 1 : 0,
      };
    });

    setTagStyles(initialStyles);

    if (disableAnimation) {
      // Skip animation, show final state immediately
      setIsAnimating(false);
      onAnimationComplete?.();
      return;
    }

    // Wait for title to disappear (300ms), then start animating tags
    const initialDelay = 300;

    // Animate each tag with staggered timing
    tags.forEach((_, index) => {
      setTimeout(() => {
        setTagStyles((prev) =>
          prev.map((style, i) =>
            i === index
              ? { ...style, rotation: 0, opacity: 1 }
              : style
          )
        );
      }, initialDelay + index * 100); // Initial delay + stagger by 100ms
    });

    // Call onAnimationComplete when all animations are done
    const totalDuration = initialDelay + tags.length * 100 + 600; // Initial delay + stagger time + animation time
    setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete?.();
    }, totalDuration);
  }, [tags, onAnimationComplete, layout, width, height, disableAnimation]);

  return (
    <div
      className="relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {tagStyles.map((style, index) => (
        <div
          key={index}
          className="absolute font-semibold whitespace-nowrap transition-all duration-600 ease-out"
          style={{
            left: `${style.x}px`,
            top: `${style.y}px`,
            fontSize: `${style.fontSize}px`,
            color: style.color,
            lineHeight: style.fontSize === 16 ? "26px" : "16px",
            transform: `translate(-50%, -50%) rotate(${style.rotation}deg) translateY(${isAnimating && style.opacity === 0 ? "-100px" : "0px"})`,
            opacity: style.opacity,
          }}
        >
          {style.text}
        </div>
      ))}
    </div>
  );
};

export default TagCloud;
