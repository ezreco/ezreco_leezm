import React, { useState } from "react";
import AuxChooseInput from "./AuxChooseInput";
import AuxRangeInputForEdit from "./AuxRangeInputForEdit";

interface CardEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cardTitle: string;
  cardValue: string;
  onSave: (newValue: string) => void;
  keywords?: string[];
  cardPosition?: { x: number; y: number; width: number; height: number };
  panelWidth?: number;
}

const CardEditDialog: React.FC<CardEditDialogProps> = ({
  isOpen,
  onClose,
  cardTitle,
  onSave,
  keywords = [],
  cardPosition,
  panelWidth = 800,
}) => {
  // 가격대 범위 선택을 위한 상태
  const [selectedRange, setSelectedRange] = useState<[number, number]>([0, 3]);

  if (!isOpen || !cardPosition) return null;

  // 가격대인지 확인
  const isPriceBudget = cardTitle === "가격대";

  // 다이얼로그 최소 폭
  const minDialogWidth = 697;
  const dialogWidth = Math.max(minDialogWidth, panelWidth * 0.9);
  const dialogTop = cardPosition.y + cardPosition.height + 4;

  // 카드 중앙 위치 계산
  const cardCenter = cardPosition.x + cardPosition.width / 2;
  const leftThreshold = panelWidth / 3;
  const rightThreshold = (panelWidth * 2) / 3;

  // 카드 위치에 따라 다이얼로그 정렬 결정
  let dialogLeft: number;
  let dialogRight: number | undefined;

  if (cardCenter < leftThreshold) {
    // 왼쪽 카드: left 정렬
    dialogLeft = cardPosition.x;
  } else if (cardCenter > rightThreshold) {
    // 오른쪽 카드: right 정렬
    dialogRight = panelWidth - (cardPosition.x + cardPosition.width);
    dialogLeft = panelWidth - dialogRight - dialogWidth;
  } else {
    // 중앙 카드: center 정렬
    dialogLeft = cardCenter - dialogWidth / 2;
  }

  // 패널 경계를 벗어나지 않도록 조정
  dialogLeft = Math.max(0, Math.min(dialogLeft, panelWidth - dialogWidth));

  // 가격대 범위 값들
  const priceRangeValues = [
    { label: "200만원", value: 0 },
    { label: "300만원", value: 25 },
    { label: "400만원", value: 50 },
    { label: "500만원", value: 75 },
    { label: "600만원+", value: 100 },
  ];

  // AuxChooseInput에 전달할 options 생성
  const options = keywords.map((keyword) => ({
    id: keyword,
    label: keyword,
  }));

  // 카드 제목을 포함한 라벨 생성
  const dialogLabel = `'${cardTitle}' 여러가지 선택이 가능해요`;

  // 입력값을 받아서 저장하고 닫기
  const handleDirectInput = (value: string) => {
    onSave(value);
    onClose();
  };

  // 범위 선택 완료 핸들러
  const handleRangeSend = () => {
    const startLabel = priceRangeValues[selectedRange[0]].label;
    const endLabel = priceRangeValues[selectedRange[1]].label;
    const rangeText = `${startLabel} ~ ${endLabel}`;
    onSave(rangeText);
    onClose();
  };

  return (
    <>
      {/* Popover Dialog */}
      <div
        className="absolute z-50 bg-white border border-[#d5d8dc] rounded-[12px] shadow-lg"
        style={{
          left: `${dialogLeft}px`,
          top: `${dialogTop}px`,
        }}
      >
        <div className="p-[20px] relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-[12px] top-[12px] w-[20px] h-[20px] flex items-center justify-center z-10"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Input Component - 가격대면 AuxRangeInput, 아니면 AuxChooseInput */}
          {isPriceBudget ? (
            <div className="flex flex-col gap-[13px] w-full">
              {/* 라벨 - 그라디언트 텍스트 */}
              <div className="flex justify-center">
                <div
                  className="flex flex-col font-semibold justify-center leading-[0] text-[16px] text-center text-nowrap bg-gradient-to-r from-[#7850ff] to-[#37d7ff] bg-clip-text"
                  style={{ WebkitTextFillColor: "transparent" }}
                >
                  <p className="leading-[26px] my-[0px] whitespace-pre">
                    '가격대' 선택이 가능해요
                  </p>
                </div>
              </div>

              {/* Range Input과 입력 버튼 */}
              <div className="flex gap-[20px] items-center w-full">
                <AuxRangeInputForEdit
                  values={priceRangeValues}
                  selectedRange={selectedRange}
                  onRangeChange={setSelectedRange}
                  onSend={handleRangeSend}
                  containerWidth={620}
                  sendButtonText="입력"
                />
              </div>
            </div>
          ) : (
            <AuxChooseInput
              options={options}
              onDirectInput={handleDirectInput}
              label={dialogLabel}
              containerWidth={810}
              alwaysShowSend={true}
              sendButtonText="입력"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CardEditDialog;
