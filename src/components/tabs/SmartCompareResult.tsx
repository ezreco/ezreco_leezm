import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const SmartCompareResult: React.FC = () => {
  const { productList } = useSelector((state: RootState) => state.smartCompare);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex bg-white gap-[0px] border rounded-[20px] border-[#D5D8DC]">
        {productList.map((product, index) => (
          <div
            key={product.id}
            className={`relative w-[280px] h-[680px] flex-shrink-0 ${
              index < productList.length - 1 ? "border-r" : ""
            } border-r} border-[#D5D8DC]`}
          >
            {/* Product Image */}
            <div className="absolute left-[40px] top-[18px] w-[200px] h-[140px] overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover object-center mt-[5px]"
              />
            </div>

            {/* Product Title */}
            <div className="absolute left-[140px] top-[180px] transform -translate-x-1/2 -translate-y-1/2 w-[200px]">
              <div className="text-black text-[16px] leading-[26px] font-semibold text-center whitespace-pre-wrap">
                {product.title}
              </div>
            </div>

            {/* Divider */}
            <div className="absolute left-0  top-[226px] w-[280px] h-[1px] bg-[#d5d8dc]" />

            {/* Product Details */}
            {product.details && (
              <div className="absolute left-[40px] top-[247px] w-[200px] flex flex-col gap-[20px]">
                {product.details.map((detail, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-start leading-[0] text-[14px]"
                  >
                    {/* Label */}
                    <div className="flex flex-col font-semibold justify-center w-full text-black">
                      <div className="leading-[20px]">{detail.label}</div>
                    </div>
                    {/* Value */}
                    <div
                      className={`flex flex-col font-normal justify-center w-full ${
                        detail.highlight ? "text-[#f85057]" : "text-[#252525]"
                      }`}
                    >
                      <div className="leading-[20px] whitespace-pre-wrap">
                        {detail.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 구매 바로가기 Button */}
            <div className="absolute bottom-[40px] left-[74px]">
              <div className="bg-[#f0f1f3] h-[38px] w-[132px] rounded-[24px] flex items-center justify-center hover:bg-[#e5e6e8] transition-colors cursor-pointer">
                <div className="text-black text-[14px] leading-[20px] font-semibold text-center">
                  구매 바로가기
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartCompareResult;
