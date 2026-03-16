import React, { useState } from "react";

// Import the send icon from Figma
import sendIcon from "@/assets/icons/arrow-icon.svg";

interface AuxiliaryOption {
  id: string;
  label: string;
  subLabel?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

interface AuxChooseInputProps {
  options: AuxiliaryOption[];
  onSend?: () => void;
  onDirectInput?: (value: string) => void;
  onMultiSelect?: (selectedIds: string[]) => void;
  onOptionClick?: (label: string) => void; // 옵션 버튼 클릭 시 호출되는 콜백
  label?: string;
  containerWidth?: number; // 컨테이너 폭 (기본값: 852)
  alwaysShowSend?: boolean; // 보내기 버튼을 항상 표시할지 여부 (기본값: false)
  sendButtonText?: string; // 보내기 버튼 텍스트 (기본값: 없음, 아이콘만)
  hideRightButton?: boolean; // 오른쪽 보내기 버튼 숨김 여부 (기본값: false)
}

const AuxChooseInput: React.FC<AuxChooseInputProps> = ({
  options,
  onSend,
  onDirectInput,
  onOptionClick,
  label = "여러가지 선택이 가능해요",
  containerWidth = 800,
  alwaysShowSend = false,
  sendButtonText,
  hideRightButton = false,
}) => {
  const [showDirectInput, setShowDirectInput] = useState(false);
  const [directInputValue, setDirectInputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Limit to max 6 options (5 regular + 1 direct input)
  const limitedOptions = options.slice(0, 5);
  const directInputOption = {
    id: "direct",
    label: "직접 입력",
    subLabel: "직접 입력",
  };
  const finalOptions = [...limitedOptions, directInputOption];

  // Calculate button width to fit within container
  const calculateButtonWidth = () => {
    const gapBetweenButtons = 8; // Gap between option buttons
    const buttonCount = finalOptions.length;

    let availableWidth: number;
    let totalGaps: number;

    if (hideRightButton) {
      // 전송 버튼이 없을 때: 모든 공간을 버튼들이 균등하게 차지
      totalGaps = (buttonCount - 1) * gapBetweenButtons;
      availableWidth = containerWidth - totalGaps;
      // 균등한 크기로 계산 (min/max 제한 없이)
      return Math.floor(availableWidth / buttonCount);
    } else {
      // 전송 버튼이 있을 때: 기존 로직
      const sendButtonWidth = 38; // Send button width
      const gapBeforeSend = 16; // Gap before send button
      totalGaps = (buttonCount - 1) * gapBetweenButtons + gapBeforeSend;
      availableWidth = containerWidth - sendButtonWidth - totalGaps;

      // Width per button
      const buttonWidth = Math.floor(availableWidth / buttonCount);

      // Minimum width is 100px, maximum is 138px (original min-width)
      return Math.max(100, Math.min(138, buttonWidth));
    }
  };

  const buttonWidth = calculateButtonWidth();
  return (
    <div className="flex flex-col gap-[13px] w-full items-center">
      {/* Label - Using Figma design */}
      <div className="flex justify-center">
        <div
          className="flex flex-col font-semibold justify-center leading-[0] text-[16px] text-center text-nowrap bg-gradient-to-r from-[#7850ff] to-[#37d7ff] bg-clip-text"
          style={{ WebkitTextFillColor: "transparent" }}
        >
          <p className="leading-[26px] my-[0px] whitespace-pre">{label}</p>
        </div>
      </div>

      {/* Options and Send Button */}
      <div
        className="flex gap-[16px] items-center justify-center"
        style={{ width: `${containerWidth}px`, minWidth: "400px" }}
      >
        {/* Options Container */}
        <div className="flex gap-[8px] items-center flex-1  p-[2px]">
          {finalOptions.map((option) => {
            const isSelected = selectedOptions.includes(option.id);
            const isDirectInputButton = option.subLabel === "직접 입력";
            const showInputInThisButton =
              showDirectInput && isDirectInputButton;

            return (
              <div
                key={option.id}
                className={`
                  bg-white box-border flex flex-col gap-[2px] h-[60px] items-center
                  justify-center px-[12px] py-[20px] rounded-[12px]
                  transition-all hover:shadow-md border flex-shrink-0
                  active:border-[#0106ff] cursor-pointer
                  ${
                    isSelected
                      ? "ring-2 ring-[#0106ff] border-transparent"
                      : "border-[#d5d8dc]"
                  }
                `}
                style={{ width: `${buttonWidth}px` }}
                onClick={() => {
                  if (!showInputInThisButton) {
                    if (isDirectInputButton) {
                      setShowDirectInput(true);
                    } else {
                      // Call onOptionClick if provided (for SmartRecommendPage single-select mode)
                      if (onOptionClick) {
                        onOptionClick(option.label);
                      } else {
                        // Multi-selection logic (default behavior)
                        if (isSelected) {
                          const newSelected = selectedOptions.filter(
                            (id) => id !== option.id
                          );
                          setSelectedOptions(newSelected);
                        } else {
                          const newSelected = [...selectedOptions, option.id];
                          setSelectedOptions(newSelected);
                        }
                      }
                    }
                  }
                }}
              >
                {showInputInThisButton ? (
                  /* Direct Input Field within button area */
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <input
                      type="text"
                      value={directInputValue}
                      onChange={(e) => setDirectInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && directInputValue.trim()) {
                          onDirectInput?.(directInputValue.trim());
                          setDirectInputValue("");
                          setShowDirectInput(false);
                        }
                      }}
                      onBlur={() => {
                        if (!directInputValue.trim()) {
                          setShowDirectInput(false);
                        }
                      }}
                      placeholder="입력..."
                      className="w-full text-center border-none outline-none ,_sans-serif] text-[12px] leading-[16px] text-black placeholder-[#989ba2] bg-transparent"
                      autoFocus
                    />
                  </div>
                ) : (
                  /* Regular button content */
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <p
                      className={`text-[14px] py-[0px] my-[0px] leading-[20px]`}
                    >
                      {option.label}
                    </p>
                    {option.subLabel && (
                      <p className="text-[12px] py-[0px] my-[0px] leading-[16px] text-[#989ba2]">
                        {option.subLabel}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Send Button - Using Figma design */}
        {!hideRightButton &&
          (alwaysShowSend ||
            onSend ||
            showDirectInput ||
            selectedOptions.length > 0) && (
            <button
              onClick={() => {
                if (showDirectInput && directInputValue.trim()) {
                  onDirectInput?.(directInputValue.trim());
                  setDirectInputValue("");
                  setShowDirectInput(false);
                } else if (selectedOptions.length > 0) {
                  // Send selected options
                  const selectedLabels = finalOptions
                    .filter((opt) => selectedOptions.includes(opt.id))
                    .map((opt) => opt.label);

                  // Send the selected labels as comma-separated string
                  if (selectedLabels.length > 0) {
                    const combinedLabels = selectedLabels.join(", ");
                    onDirectInput?.(combinedLabels); // Use onDirectInput to send the combined text
                  }
                  setSelectedOptions([]);
                } else {
                  onSend?.();
                }
              }}
              disabled={
                (showDirectInput && !directInputValue.trim()) ||
                (!showDirectInput && selectedOptions.length === 0 && !onSend)
              }
              className={`
              box-border flex items-center justify-center rounded-[19px] transition-colors
              ${
                sendButtonText
                  ? "px-[12px] py-[9px] h-[38px]"
                  : "p-[9px] size-[38px]"
              }
              ${
                (showDirectInput && !directInputValue.trim()) ||
                (!showDirectInput && selectedOptions.length === 0 && !onSend)
                  ? "bg-[#989ba2] cursor-not-allowed"
                  : "bg-[#0106ff] hover:bg-[#0106ff]/90 cursor-pointer"
              }
            `}
            >
              {sendButtonText ? (
                <div className="flex flex-col font-semibold justify-center leading-[0] text-[14px] text-center text-white w-[37px]">
                  <p className="leading-[20px]">{sendButtonText}</p>
                </div>
              ) : (
                <div className="overflow-clip relative shrink-0 size-[20px]">
                  <div className="absolute h-[14.086px] left-[3.29px] top-[2.91px] w-[13.414px]">
                    <img
                      alt=""
                      className="block max-w-none size-full"
                      src={sendIcon}
                    />
                  </div>
                </div>
              )}
            </button>
          )}
      </div>
    </div>
  );
};

export default AuxChooseInput;
