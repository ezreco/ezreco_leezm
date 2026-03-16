import React, { useState, useEffect, useRef } from "react";

interface InferenceProgressCardProps {
  text: string;
  loading?: boolean;
  width?: number;
  height?: number;
  showTitle?: boolean;
  children?: React.ReactNode;
}

const InferenceProgressCard: React.FC<InferenceProgressCardProps> = ({
  text,
  loading = false,
  width = 320,
  height = 140,
  showTitle = true,
  children,
}) => {
  const [rotation, setRotation] = useState(0);
  const [titleOffset, setTitleOffset] = useState(34); // Always start hidden (pushed down below)
  const [fontSize, setFontSize] = useState(15);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 30) % 360); // Rotate 30 degrees every interval (12 steps for 360)
    }, 1000 / 12); // 12 fps for smooth rotation (completes 360° in 1 second)

    return () => clearInterval(interval);
  }, [loading]);

  // Title slide-up animation
  useEffect(() => {
    if (showTitle) {
      // Slide up from hidden to visible
      setTitleOffset(0);
    } else {
      // Keep hidden
      setTitleOffset(34);
    }
  }, [showTitle]);

  // Auto-adjust font size based on text width
  useEffect(() => {
    const adjustFontSize = () => {
      const textElement = textRef.current;
      if (!textElement) return;

      const containerWidth = width - 36 - (loading ? 24 : 0); // width - padding - icon space
      let currentFontSize = 16;

      // Reset to default size first
      setFontSize(currentFontSize);

      // Wait for next frame to get accurate measurements
      requestAnimationFrame(() => {
        if (!textElement) return;

        // Reduce font size if text overflows
        while (
          textElement.scrollWidth > containerWidth &&
          currentFontSize > 10
        ) {
          currentFontSize -= 0.5;
          setFontSize(currentFontSize);

          // Force sync update to get new measurement
          textElement.style.fontSize = `${currentFontSize}px`;

          if (textElement.scrollWidth <= containerWidth) break;
        }
      });
    };

    adjustFontSize();
  }, [text, width, loading, showTitle]);

  // Progress icon component (spinner from Figma)
  const ProgressIcon = () => (
    <div
      className="w-[20px] h-[20px] transition-transform duration-[83ms] ease-linear"
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.5 16.002L8.5 13.002"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          opacity="0.8"
          d="M8.5 4L8.5 1"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.8047 13.8047L11.6822 11.6822"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          opacity="0.6"
          d="M5.32031 5.32031L3.19781 3.19781"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 8.5L13 8.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          opacity="0.4"
          d="M4 8.5L1 8.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.8047 3.19781L11.6822 5.32031"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          opacity="0.2"
          d="M5.32031 11.6822L3.19781 13.8047"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  // Fixed gradient section height
  const gradientHeight = 34;

  return (
    <div
      className="relative transition-all duration-300 ease-out"
      style={{ width: `${width}px`, height: `${height - titleOffset}px` }}
    >
      {/* Gradient border wrapper */}
      <div
        className="rounded-[12px]  h-full p-[1px]"
        style={{
          background:
            "linear-gradient(117deg, var(--Effect-Gradient-Start, #7850FF) 0%, var(--Effect-Gradient-End, #37D7FF) 100%)",
        }}
      >
        <div className="rounded-[12px] overflow-hidden bg-white h-full flex flex-col">
          {/* Gradient title section */}
          <div
            className="w-full flex gap-[4px] items-center px-[18px] transition-all duration-300 ease-out"
            style={{
              height: `${gradientHeight - titleOffset}px`,
              background:
                "linear-gradient(117deg, var(--Effect-Gradient-Start, #7850FF) 0%, var(--Effect-Gradient-End, #37D7FF) 100%)",
            }}
          >
            {loading && (
              <div className="relative shrink-0 size-[20px]">
                <ProgressIcon />
              </div>
            )}
            <p
              ref={textRef}
              className="font-semibold leading-[26px] text-white whitespace-nowrap"
              style={{ fontSize: `${fontSize}px` }}
            >
              {text}
            </p>
          </div>

          {/* White body section */}
          <div className="flex-1 bg-white flex items-center justify-center p-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InferenceProgressCard;
