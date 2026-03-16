import React from "react";

interface PreferenceCardProps {
  title: string;
  value: string;
  show?: boolean;
  animationDelay?: number;
}

const PreferenceCard: React.FC<PreferenceCardProps> = ({
  title,
  value,
  show = true,
  animationDelay = 0,
}) => {
  // Don't render if there's no value and show is based on value
  if (!value || value === "-") {
    return <div className="h-[65px] w-[130px]" />; // Placeholder to maintain layout
  }

  return (
    <div
      className={`h-[65px] w-[190px] transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transitionDelay: `${animationDelay}ms`,
        opacity: 0,
        animation: show
          ? `fadeIn 0.5s ease-out ${animationDelay}ms forwards`
          : "none",
      }}
    >
      <div className="h-full rounded-[12px] relative overflow-hidden">
        {/* Gradient background - updated with new specification */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(117deg, var(--Effect-Gradient-Start, #7850FF) 0%, var(--Effect-Gradient-End, #37D7FF) 100%)",
          }}
        />

        {/* Title section */}
        <div className="absolute inset-[3.08%_6.84%_72.31%_6.84%] flex flex-col ,_sans-serif] justify-center leading-[0] not-italic text-[12px] text-center text-white z-10">
          <div className="leading-[16px]">{title}</div>
        </div>

        {/* White content area */}
        <div className="absolute bg-white inset-[30.77%_0.53%_1.54%_0.53%] rounded-[11px]" />

        {/* Value section */}
        <div className="absolute inset-[49.23%_6.84%_20%_6.84%] flex flex-col ,_sans-serif] justify-center leading-[0] not-italic text-[14px] text-black text-center z-10">
          <div className="leading-[20px]">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceCard;
