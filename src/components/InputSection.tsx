import React, { useState, useEffect, useRef } from "react";
import InputGalleryMenu from "./InputGalleryMenu";

// Image assets
import icVoice from "@/assets/icons/ic_voice.svg";
import icMic from "@/assets/icons/ic_mic.svg";
import icGallery from "@/assets/icons/ic_gallery.svg";
import sendIcon from "@/assets/icons/arrow-icon.svg";
import auxBg from "@/assets/icons/auxBg.svg";

import tooltipImg from "@/assets/icons/6652640c392354fa29dd4000181c1c184d55074f.svg";

// Icon Components
function IconVoice() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute left-[3px] size-[14px] top-[3px]">
        <img alt="" className="block max-w-none size-full" src={icVoice} />
      </div>
    </div>
  );
}

function IconMic() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute h-[16px] left-[4px] top-[2px] w-[12px]">
        <img alt="" className="block max-w-none size-full" src={icMic} />
      </div>
    </div>
  );
}

function IconGallery() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute h-[15.5px] left-[4.5px] top-[2.25px] w-[11px]">
        <img alt="" className="block max-w-none size-full" src={icGallery} />
      </div>
    </div>
  );
}

// Action Button Component
interface ActionButtonProps {
  icon: React.ReactNode;
  variant?: "default" | "primary";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function ActionButton({
  icon,
  variant = "default",
  onClick,
}: ActionButtonProps) {
  const bgClass = variant === "primary" ? "bg-[#0106ff]" : "bg-[#eef0f3]";

  return (
    <button
      className={`box-border content-stretch flex items-center justify-center p-[9px] relative rounded-[19px] shrink-0 size-[38px] ${bgClass} transition-colors hover:opacity-90`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

interface InputSectionProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onGalleryClick?: () => void;
  onMicClick?: () => void;
  onVoiceClick?: () => void;
  onFileUpload?: () => void;
  onImageUpload?: () => void;
  onScreenshot?: () => void;
  onVoiceChatClick?: () => void; // Voice chat page navigation
  maxWidthClass?: string;
  minWidthClass?: string;
  auxiliaryInputs?: React.ReactNode;
  submitIcon?: boolean;
  variant?: "default" | "compare" | "tournament"; // 비교하기 탭에서 그라디언트 스타일
  compareTitle?: string; // 비교하기 탭의 타이틀
  hideVoiceButton?: boolean; // Voice chat 버튼 숨김 여부
  showSubmitButton?: boolean; // Submit 버튼 표시 여부 (voice 버튼 대신)
  position?: "absolute" | "relative"; // Position 설정
}

const InputSection: React.FC<InputSectionProps> = ({
  placeholder = "EZRoco에게 찾고 싶은 제품을 알려주세요.",
  value: controlledValue,
  onChange,
  onSubmit,
  onGalleryClick,
  onMicClick,
  onVoiceClick,
  onFileUpload,
  onImageUpload,
  onScreenshot,
  onVoiceChatClick,
  maxWidthClass = "max-w-[884px]",
  minWidthClass = "min-w-[822px]",
  auxiliaryInputs,
  variant = "default",
  compareTitle = "제품 1",
  hideVoiceButton = false,
  showSubmitButton = false,
  position = "absolute",
}) => {
  const [internalValue, setInternalValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showMicTooltip, setShowMicTooltip] = useState(false);
  const [galleryMenu, setGalleryMenu] = useState<{
    isOpen: boolean;
    x: number;
    y: number;
  }>({
    isOpen: false,
    x: 0,
    y: 0,
  });
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // 디버깅용 - galleryMenu 상태 변화 감지
  useEffect(() => {
    console.log("Gallery menu state changed:", galleryMenu);
  }, [galleryMenu]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (controlledValue !== undefined) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.(value);
    }
  };

  const handleGalleryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Gallery button clicked"); // 디버깅용
    event.preventDefault();
    event.stopPropagation();

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    console.log("Button rect:", rect); // 디버깅용

    // 메뉴 높이를 고려하여 위치 결정
    const menuHeight = 140; // 예상 메뉴 높이 (3개 아이템 * ~44px)
    const spaceAbove = rect.top;

    let menuY;
    if (spaceAbove > menuHeight + 20) {
      // 위쪽에 충분한 공간이 있으면 위에 표시
      menuY = rect.top - menuHeight - 8;
    } else {
      // 아니면 아래쪽에 표시
      menuY = rect.bottom + 8;
    }

    const newMenuState = {
      isOpen: true,
      x: rect.left - 100, // 메뉴가 버튼 중앙에 오도록 조정
      y: menuY,
    };

    console.log("Setting gallery menu state:", newMenuState); // 디버깅용
    setGalleryMenu(newMenuState);

    // 기존 onGalleryClick 콜백도 호출
    onGalleryClick?.();
  };

  const closeGalleryMenu = () => {
    setGalleryMenu((prev) => ({ ...prev, isOpen: false }));
  };

  const handleMenuAction = (action: string) => {
    console.log(`Gallery menu action: ${action}`);
    switch (action) {
      case "fileUpload":
        onFileUpload?.();
        break;
      case "imageUpload":
        onImageUpload?.();
        break;
      case "screenshot":
        onScreenshot?.();
        break;
    }
  };
  const positionClass =
    position === "relative"
      ? "relative mb-[56px] mt-[20px] mx-auto"
      : "absolute bottom-[56px] left-1/2 transform -translate-x-1/2";

  return (
    <>
      <div
        className={`${positionClass} flex flex-col items-center gap-[16px] z-20  ${maxWidthClass} ${minWidthClass}`}
      >
        {/* Auxiliary Inputs - Vue slot-like pattern */}
        {auxiliaryInputs && (
          <div className="relative w-full  pb-[10px]">
            {/* Content - render first to establish height */}
            <div className="relative" style={{ zIndex: 1 }}>
              {auxiliaryInputs}
            </div>
            {/* Background SVG - positioned behind content */}
            <div
              className="absolute pointer-events-none overflow-hidden"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "150%",
                height: "200%",
                zIndex: 0,
              }}
            >
              <img
                src={auxBg}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Input Box - Compare/Tournament Variant */}
        {variant === "compare" || variant === "tournament" ? (
          <div
            className={`relative w-full ${
              variant === "compare" ? "h-[151px]" : "h-[116px]"
            }`}
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7850ff] to-[#37d7ff] rounded-[21px] shadow-[12px_12px_26px_0px_#ebebed]" />

            {/* Title - Hidden for tournament variant */}
            {variant === "compare" && (
              <div className="absolute left-[27px] top-[17px] transform -translate-y-1/2">
                <p className="text-white text-[16px] leading-[26px] font-semibold">
                  {compareTitle}
                </p>
              </div>
            )}

            {/* White Card */}
            <div
              className={`absolute left-px  w-[calc(100%-2px)]  bg-white rounded-[20px] ${
                variant === "compare"
                  ? "top-[34px] h-[116px]"
                  : "top-[1px] h-[114px]"
              }`}
            >
              {/* Text Field */}
              <div className="absolute left-[26px] top-[24px] w-[calc(100%-52px)] h-[20px] overflow-hidden">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  className="w-full h-full resize-none border-none outline-none font-['One_UI_Sans_GUI:400_Regular',_sans-serif] text-[16px] text-black placeholder-[#989ba2] bg-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="absolute right-[26px] top-[54px] flex gap-[12px] h-[32px] items-center justify-end">
                <ActionButton
                  icon={<IconGallery />}
                  onClick={handleGalleryClick}
                />
                <div
                  className="relative"
                  onMouseEnter={() => setShowMicTooltip(true)}
                  onMouseLeave={() => setShowMicTooltip(false)}
                >
                  <ActionButton icon={<IconMic />} onClick={onMicClick} />
                  {showMicTooltip && (
                    <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2">
                      <div className="relative w-[136px] h-[52px]">
                        <img
                          alt=""
                          className="block max-w-none w-full h-full"
                          src={tooltipImg}
                        />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="text-[14px] leading-[10px] text-white text-center whitespace-nowrap ">
                            개발 진행 중입니다.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {value.trim() && (
                  <button
                    className="bg-[#0106ff] box-border content-stretch flex h-[38px] w-[132px] items-center justify-center px-[12px] py-[9px] rounded-[19px] shrink-0 transition-colors hover:opacity-90"
                    onClick={() => onSubmit?.(value)}
                  >
                    <p className="text-white text-[14px] leading-[20px] font-semibold">
                      리스트에 추가
                    </p>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Input Box - Default Variant */
          <div className="relative w-full bg-white rounded-[20px] shadow-[12px_12px_26px_0px_#ebebed] w-[224px] py-[24px] ">
            {/* Text Field */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full px-[26px] resize-none border-none outline-none font-['One_UI_Sans_GUI:400_Regular',_sans-serif] text-[16px] leading-[26px] text-black placeholder-[#989ba2] bg-transparent overflow-hidden h-[26px] p-[0px]"
            />

            {/* Action Buttons */}
            <div className="relative flex gap-[12px] px-[26px] h-[32px] items-center justify-end mt-[3px]">
              <ActionButton
                icon={<IconGallery />}
                onClick={handleGalleryClick}
              />
              <div
                className="relative"
                onMouseEnter={() => setShowMicTooltip(true)}
                onMouseLeave={() => setShowMicTooltip(false)}
              >
                <ActionButton icon={<IconMic />} onClick={onMicClick} />
                {showMicTooltip && (
                  <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2">
                    <div className="relative w-[136px] h-[52px]">
                      <img
                        alt=""
                        className="block max-w-none w-full h-full"
                        src={tooltipImg}
                      />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="text-[14px] leading-[10px] text-white text-center whitespace-nowrap ">
                          개발 진행 중입니다.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!hideVoiceButton && (
                <>
                  {/* showSubmitButton이 true이거나 텍스트가 있으면 전송 버튼 표시 */}
                  {showSubmitButton || value.trim() ? (
                    <button
                      onClick={() => value.trim() && onSubmit?.(value)}
                      disabled={!value.trim()}
                      className={`
                        box-border flex items-center justify-center p-[9px] size-[38px]
                        rounded-[19px] transition-colors
                        ${
                          value.trim()
                            ? "bg-[#0106ff] hover:bg-[#0106ff]/90 cursor-pointer"
                            : "bg-[#989ba2] cursor-not-allowed"
                        }
                      `}
                    >
                      <div className="overflow-clip relative shrink-0 size-[20px]">
                        <div className="absolute h-[14.086px] left-[3.29px] top-[2.91px] w-[13.414px]">
                          <img
                            alt="전송"
                            className="block max-w-none size-full"
                            src={sendIcon}
                          />
                        </div>
                      </div>
                    </button>
                  ) : (
                    /* 텍스트가 없으면 Voice 버튼 표시 */
                    <ActionButton
                      icon={<IconVoice />}
                      variant="primary"
                      onClick={onVoiceChatClick || onVoiceClick}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gallery Menu - InputSection 컨테이너 밖에 렌더링 */}
      <InputGalleryMenu
        isOpen={galleryMenu.isOpen}
        x={galleryMenu.x + 100}
        y={galleryMenu.y - 10}
        onClose={closeGalleryMenu}
        onFileUpload={() => handleMenuAction("fileUpload")}
        onImageUpload={() => handleMenuAction("imageUpload")}
        onScreenshot={() => handleMenuAction("screenshot")}
      />
    </>
  );
};

export default InputSection;
