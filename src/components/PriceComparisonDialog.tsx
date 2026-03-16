import React, { useState } from "react";
import { createPortal } from "react-dom";
import PriceGraph from "./PriceGraph";
import type { PriceAnalysis } from "../store/aiRecommendResultStore";
import closeIcon from "../assets/icons/close-icon.svg";
import upArrowIcon from "../assets/icons/fa1b141e0cac4f517907ebf4cc746932939f403f.svg";
import downArrowIcon from "../assets/icons/133af7cf8c4293b527905b52adbb90f00d073424.svg";

interface PriceComparisonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  priceAnalysis?: PriceAnalysis;
}

const PriceComparisonDialog: React.FC<PriceComparisonDialogProps> = ({
  isOpen,
  onClose,
  priceAnalysis,
}) => {
  const [priceAlert, setPriceAlert] = useState(4390000);
  const [isAlertEnabled, setIsAlertEnabled] = useState(true);

  if (!isOpen) return null;

  // 기본값 설정
  const dateRange = priceAnalysis?.dateRange || [
    "08/10",
    "08/20",
    "08/30",
    "09/10",
    "09/20",
    "09/30",
    "10/10",
    "10/20",
    "10/30",
  ];
  const highestPrice = priceAnalysis?.highestPrice || 4467200;
  const lowestPrice = priceAnalysis?.lowestPrice || 4337900;
  const averagePrice = priceAnalysis?.averagePrice || 4406715;
  const highestPriceDate = priceAnalysis?.highestPriceDate || "09/03";
  const lowestPriceDate = priceAnalysis?.lowestPriceDate || "09/10";

  // 라벨 위치 계산 함수
  const calculateLabelPosition = (targetDate: string) => {
    const horizontalPadding = 22;
    const graphWidth = 668 - horizontalPadding * 2;
    const gridInterval = graphWidth / (dateRange.length - 1);
    const offsetRatio = 1 / 10;

    // priceHistory에서 해당 날짜 찾기
    const historyIndex = priceAnalysis?.priceHistory.findIndex(
      (item) => item.date === targetDate
    );

    if (historyIndex === -1 || historyIndex === undefined) {
      return 0;
    }

    // dateRange에서 가장 가까운 그리드 찾기
    let closestGridIndex = 0;
    let minDiff = Infinity;

    dateRange.forEach((gridDate, index) => {
      const historyDate = new Date(targetDate);
      const currentGridDate = new Date(gridDate);
      const diff = Math.abs(historyDate.getTime() - currentGridDate.getTime());

      if (diff < minDiff) {
        minDiff = diff;
        closestGridIndex = index;
      }
    });

    // 그리드 위치 + 1/10 오프셋
    const baseX = (closestGridIndex / (dateRange.length - 1)) * graphWidth;
    return horizontalPadding + baseX + gridInterval * offsetRatio;
  };

  const highestPriceLabelX = calculateLabelPosition(highestPriceDate);
  const lowestPriceLabelX = calculateLabelPosition(lowestPriceDate);
  const optimalBuyLabelX = priceAnalysis?.optimalBuyDate
    ? calculateLabelPosition(priceAnalysis.optimalBuyDate)
    : 0;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] flex items-center justify-center"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      />

      {/* Dialog */}
      <div
        className="fixed z-[9999] w-[740px] h-[532px] bg-white rounded-[20px] shadow-lg"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[36px] pt-[36px] mb-[66px]">
          <div className="text-[24px] font-semibold leading-[32px] text-black">
            실시간 가격 추적 및 알림
          </div>
          <button
            onClick={onClose}
            className="w-[32px] h-[32px] flex items-center justify-center"
          >
            <img src={closeIcon} alt="닫기" className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Graph Section */}
        <div className="px-[36px] mb-[24px] ">
          <div className="relative h-[160px]  mb-[20px]">
            {/* Price Graph - Canvas (그리드 포함) */}
            <PriceGraph
              width={668}
              height={160}
              priceAnalysis={priceAnalysis}
              dateRange={dateRange}
              showOptimalBuyLine={!!priceAnalysis?.optimalBuyDate}
              optimalBuyDate={priceAnalysis?.optimalBuyDate}
              horizontalPadding={22}
            />

            {/* Labels */}
            <div
              className="absolute text-[12px] leading-[16px] text-[#00d694]"
              style={{
                top: "-24px",
                left: `${highestPriceLabelX}px`,
              }}
            >
              역대최고가 {highestPrice.toLocaleString()}원
            </div>
            <div
              className="absolute text-[12px] leading-[20px] text-[#f85057]"
              style={{
                bottom: "8px",
                left: `${lowestPriceLabelX}px`,
              }}
            >
              역대최저가 {lowestPrice.toLocaleString()}원
            </div>
            {priceAnalysis?.optimalBuyDate && (
              <div
                className="absolute text-[12px] leading-[16px] text-[#0106ff]"
                style={{
                  top: "-8px",
                  left: `${optimalBuyLabelX}px`,
                }}
              >
                최적의 구매 시점
              </div>
            )}
          </div>

          {/* Date Labels */}
          <div className="relative h-[20px] text-[14px] leading-[20px] text-black mb-[36px] w-[668px]">
            {dateRange.map((date, index) => {
              const horizontalPadding = 22;
              const graphWidth = 668 - horizontalPadding * 2;
              const left =
                horizontalPadding +
                (index / (dateRange.length - 1)) * graphWidth;

              return (
                <div
                  key={date}
                  className="absolute"
                  style={{
                    left: `${left}px`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {date}
                </div>
              );
            })}
          </div>

          {/* Price Stats */}
          <div className="border border-[#d5d8dc] rounded-[10px] overflow-hidden">
            <div className="flex h-[72px]">
              {/* 역대최고가 */}
              <div className="flex-1 flex flex-col items-center justify-center border-r border-[#d5d8dc]">
                <div className="flex items-center gap-[4px] mb-[4px]">
                  <img
                    src={upArrowIcon}
                    alt="상승"
                    className="w-[10px] h-[8px]"
                  />
                  <span className="text-[14px] leading-[20px] text-black">
                    역대최고가
                  </span>
                </div>
                <div className="text-[14px] font-semibold leading-[20px] text-[#00d694]">
                  {highestPrice.toLocaleString()}원
                </div>
              </div>

              {/* 역대최저가 */}
              <div className="flex-1 flex flex-col items-center justify-center border-r border-[#d5d8dc]">
                <div className="flex items-center gap-[4px] mb-[4px]">
                  <img
                    src={downArrowIcon}
                    alt="하락"
                    className="w-[10px] h-[8px]"
                  />
                  <span className="text-[14px] leading-[20px] text-black">
                    역대최저가
                  </span>
                </div>
                <div className="text-[14px] font-semibold leading-[20px] text-[#f85057]">
                  {lowestPrice.toLocaleString()}원
                </div>
              </div>

              {/* 평균가 */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-center gap-[4px] mb-[4px]">
                  <div className="w-[10px] h-px bg-black" />
                  <span className="text-[14px] leading-[20px] text-black">
                    평균가
                  </span>
                </div>
                <div className="text-[14px] font-semibold leading-[20px] text-black">
                  {averagePrice.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Alert Section */}
        <div className="px-[36px] flex items-center justify-center gap-[12px]">
          <div className="flex items-center gap-[4px]">
            <input
              type="text"
              value={priceAlert.toLocaleString()}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, "");
                if (!isNaN(Number(value))) {
                  setPriceAlert(Number(value));
                }
              }}
              className="w-[76px] text-[16px] leading-[26px] text-black outline-none border-none"
              style={{ border: "none" }}
            />
            <span className="text-[16px] leading-[26px] text-black">
              원 정정 가격 알람 설정
            </span>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setIsAlertEnabled(!isAlertEnabled)}
            className={`w-[34px] h-[20px] rounded-[999px] relative transition-colors ${
              isAlertEnabled ? "bg-[#0106ff]" : "bg-[#d5d8dc]"
            }`}
          >
            <div
              className={`absolute top-[2px] w-[16px] h-[16px] bg-white rounded-full transition-transform ${
                isAlertEnabled ? "right-[2px]" : "left-[2px]"
              }`}
            />
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default PriceComparisonDialog;
