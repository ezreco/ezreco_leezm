import React, { useState, useEffect, useMemo } from "react";

interface InferenceLoadingAnimationProps {
  size?: number; // Size in pixels
  fps?: number; // Frames per second
  loop?: boolean; // Whether to loop the animation
  showText?: boolean; // Whether to show "추론 중..." text
}

// Import all loading animation frames using Vite's glob import
const loadingFrames = import.meta.glob<{ default: string }>(
  "../assets/loading/vi_loading_*.png",
  { eager: true }
);

const InferenceLoadingAnimation: React.FC<InferenceLoadingAnimationProps> = ({
  size = 100,
  fps = 30,
  loop = true,
  showText = true,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Convert glob imports to sorted array of image paths
  const frameImages = useMemo(() => {
    const frames = Object.entries(loadingFrames)
      .map(([path, module]) => ({
        path,
        url: module.default,
      }))
      .sort((a, b) => a.path.localeCompare(b.path));
    return frames.map((f) => f.url);
  }, []);

  const totalFrames = frameImages.length; // Should be 209 frames

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= totalFrames - 1) {
          return loop ? 0 : prev;
        }
        return prev + 1;
      });
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [fps, loop, totalFrames]);

  const framePath = frameImages[currentFrame];

  return (
    <div
      className="relative"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <img
        src={framePath}
        alt="Loading animation"
        className="w-full h-full object-contain"
      />
      {showText && (
        <div className="absolute flex flex-col font-sans font-semibold justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#5372ff] text-[14px] text-center whitespace-nowrap"></div>
      )}
    </div>
  );
};

export default InferenceLoadingAnimation;
