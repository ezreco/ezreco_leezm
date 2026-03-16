import React from "react";

interface TabElementProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  width?: number;
}

const TabElement: React.FC<TabElementProps> = ({
  label,
  isActive = false,
  onClick,
  width = 112,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        height: "48px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <div
        style={{
          position: "absolute",
          backgroundColor: isActive ? "#0106FF" : "transparent",
          display: "flex",
          height: "48px",
          alignItems: "center",
          justifyContent: "center",
          left: 0,
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "14px",
          paddingBottom: "14px",
          borderRadius: "24px",
          top: 0,
          width: `${width}px`,
          boxSizing: "border-box",
          transition: "all 0.2s ease",
        }}
      >
        <span
          style={{
            fontFamily: "'One UI Sans GUI', sans-serif",
            color: isActive ? "#ffffff" : "#989BA2",
            fontSize: "18px",
            fontWeight: isActive ? 600 : 400,
            textAlign: "center",
            lineHeight: "24px",
            transition: "color 0.2s ease",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default TabElement;
