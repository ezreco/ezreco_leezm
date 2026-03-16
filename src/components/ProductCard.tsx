import React from "react";

// Import cancel icon
import icCancel from "@/assets/icons/ic_cancel.svg";

interface ProductCardProps {
  title?: string;
  image?: string;
  width?: number; // 카드 너비 (기본값: 206)
  height?: number; // 카드 높이 (기본값: 228)
  className?: string;
  onClick?: () => void;
  onRemove?: () => void; // 삭제 버튼 클릭 핸들러
  showRemoveButton?: boolean; // 삭제 버튼 표시 여부
  isEmpty?: boolean; // 빈 카드 여부
  emptyText?: string; // 빈 카드에 표시할 텍스트
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  image,
  width = 206,
  height = 228,
  className = "",
  onClick,
  onRemove,
  showRemoveButton = false,
  isEmpty = false,
  emptyText = "제품 2",
}) => {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={onClick}
    >
      {/* Card Background */}
      <div className="absolute inset-0 bg-white border border-[#d5d8dc] rounded-[20px] p-[4px]">
        <div className="w-[198px] h-[138px] bg-[#f8f8fa] rounded-[16px]" />
      </div>

      {isEmpty ? (
        /* Empty Card */
        <div className="absolute left-[103px] top-[184px] transform -translate-x-1/2 -translate-y-1/2 w-[178px]">
          <div className="text-[#989ba2] text-[16px] leading-[26px] font-normal text-center">
            {emptyText}
          </div>
        </div>
      ) : (
        <>
          {/* Product Image */}
          <div className="absolute left-[3px] top-[2px] w-[200px] h-[140px] overflow-hidden">
            <div className="absolute left-[10px] top-[11px] w-[180px] h-[120px]">
              <img
                src={image}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />
            </div>
          </div>

          {/* Product Title */}
          <div className="absolute left-[103px] top-[184px] transform -translate-x-1/2 -translate-y-1/2 w-[178px]">
            <div
              className={`text-[16px] leading-[26px] font-normal text-center whitespace-pre-wrap ${
                isEmpty ? "text-[#989ba2]" : ""
              }`}
            >
              {title}
            </div>
          </div>
        </>
      )}

      {/* Remove Button */}
      {showRemoveButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) onRemove();
          }}
          className="absolute left-[186px] top-[-8px] w-[28px] h-[28px] bg-white rounded-full border border-[#d5d8dc] flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm z-10"
        >
          <img alt="Remove" className="w-[14px] h-[14px]" src={icCancel} />
        </button>
      )}
    </div>
  );
};

export default ProductCard;
