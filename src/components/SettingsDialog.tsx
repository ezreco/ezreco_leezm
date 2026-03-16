import React from "react";
import ReactDOM from "react-dom";
import icCancel from "@/assets/icons/ic_cancel.svg";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  subtitleOn: boolean;
  onSubtitleToggle: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  selectedVoice,
  onVoiceChange,
  subtitleOn,
  onSubtitleToggle,
  speed,
  onSpeedChange,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      {/* Dim Background (click to close) */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Dialog */}
      <div
        className="relative bg-white rounded-[20px] w-[408px] shadow-lg"
        style={{ padding: "36px" }}
      >
        {/* Header: Title and Close Button */}
        <div className="flex items-center justify-between mb-[30px]">
          <div className="text-[24px] leading-[32px] font-semibold text-black">
            음성 채팅 설정
          </div>
          <button
            className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity"
            onClick={onClose}
          >
            <img src={icCancel} alt="Close" className="w-[32px] h-[32px]" />
          </button>
        </div>

        {/* Voice Selection */}
        <div className="mb-[30px]">
          <h3 className="text-[16px] leading-[26px]  text-[#252525] mb-[12px]">
            음성 선택
          </h3>
          <div className="grid grid-cols-2 gap-[12px]">
            {[
              { name: "Justin", desc: "자신있고 개방적인" },
              { name: "Liama", desc: "호기심 많고 솔직한" },
              { name: "Jason", desc: "차분하고 묵직한" },
              { name: "Rosaline", desc: "느긋하고 따뜻한" },
            ].map((voice) => (
              <button
                key={voice.name}
                className={`h-[48px] rounded-[24px] px-[12px] py-[7px]  transition-colors ${
                  selectedVoice === voice.name
                    ? "bg-[#0106ff] text-white"
                    : "bg-[#f8f8fa] text-[#252525] hover:bg-[#eef0f3]"
                }`}
                onClick={() => onVoiceChange(voice.name)}
              >
                <div className="text-[14px] leading-[20px] font-semibold">
                  {voice.name}
                </div>
                <div
                  className={`text-[12px] leading-[16px]  ${
                    selectedVoice === voice.name
                      ? "text-[#d5d8dc]"
                      : "text-[#989ba2]"
                  }`}
                >
                  {voice.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Subtitle Toggle */}
        <div className="flex items-center justify-between mb-[30px]">
          <h3 className="text-[16px] leading-[26px] font-semibold text-[#252525]">
            자막 On/Off
          </h3>
          <button
            className={`w-[34px] h-[20px] rounded-[999px] transition-colors ${
              subtitleOn ? "bg-[#0106ff]" : "bg-[#d5d8dc]"
            }`}
            onClick={onSubtitleToggle}
          >
            <div
              className={`w-[16px] h-[16px] bg-white rounded-full transition-transform ${
                subtitleOn ? "translate-x-[16px]" : "translate-x-[2px]"
              }`}
            />
          </button>
        </div>

        {/* Speed Slider */}
        <div>
          <div className="flex items-center justify-between mb-[12px]">
            <h3 className="text-[16px] leading-[26px] font-semibold text-[#252525]">
              AI 말하기 속도
            </h3>
            <span className="text-[16px] font-semibold leading-[26px]  text-[#252525]">
              {speed.toFixed(1)}배
            </span>
          </div>
          <div className="relative h-[30px] flex items-center">
            {/* Slider Track Background */}
            <div className="absolute w-full h-[10px] bg-[#eef0f3] rounded-[10px]" />
            {/* Slider Track Active */}
            <div
              className="absolute h-[10px] bg-[#0106ff] rounded-[10px]"
              style={{
                width: `${((speed - 0.5) / 1.0) * 100}%`,
              }}
            />

            {/* Slider Dots - 11 dots from 0.5 to 1.5 */}
            {Array.from({ length: 11 }, (_, index) => {
              const dotValue = 0.5 + index * 0.1;
              let rawPosition = ((dotValue - 0.5) / 1.0) * 100;
              if (index == 0) rawPosition = rawPosition + 1;
              if (index == 10) rawPosition = rawPosition - 0.4;

              return (
                <div
                  key={index}
                  className="absolute w-[5px] h-[5px] rounded-full pointer-events-none z-20"
                  style={{
                    left: `calc(${rawPosition}% - 2.5px)`,
                    backgroundColor: "#d5d8dc",
                  }}
                />
              );
            })}

            {/* Slider Input */}
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="absolute w-full h-[30px] opacity-0 cursor-pointer z-10"
            />

            {/* Slider Thumb */}
            <div
              className="absolute w-[6px] h-[6px] bg-white rounded-full pointer-events-none border-2 border-[#0106ff] z-30"
              style={{
                left:
                  speed === 0.5
                    ? `calc(${((speed - 0.5) / 1.0) * 100}% + 2px - 3px)`
                    : speed === 1.5
                    ? `calc(${((speed - 0.5) / 1.0) * 100}% - 2px - 5px)`
                    : `calc(${((speed - 0.5) / 1.0) * 100}% - 5px)`,
              }}
            />
          </div>
          {/* Speed Labels */}
          <div className="flex justify-between mt-[1px] text-[12px]  text-[#989ba2] ">
            <span>0.5</span>
            <span className="text-center">1.0</span>
            <span className="text-right">1.5</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SettingsDialog;
