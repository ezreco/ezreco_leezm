import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BubbleAI from "../components/BubbleAI";
import BubbleUser from "../components/BubbleUser";
import SettingsDialog from "../components/SettingsDialog";
import { aiResponseStore } from "../store/aiResponseStore";
import { useSidePanel } from "../contexts/SidePanelContext";

// Image assets
// import icNotification from "@/assets/icons/ic-notification.svg";
import voiceVideo from "@/assets/voice/Voice.mp4";
import icCamera from "@/assets/icons/ic_camera.svg";
import icMicOff from "@/assets/icons/ic_mic_off.svg";
import icCancel from "@/assets/icons/ic_cancel.svg";
import icPause from "@/assets/icons/ic_pause.svg";
import icSetting from "@/assets/icons/ic_setting.svg";

// function IconNotification() {
//   return (
//     <div className="w-[18px] h-[18px] relative">
//       <img
//         alt=""
//         className="block max-w-none w-full h-full"
//         src={icNotification}
//       />
//     </div>
//   );
// }

const VoiceChatPage: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const [showTooltip, setShowTooltip] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("Justin");
  const [subtitleOn, setSubtitleOn] = useState(true);
  const [speed, setSpeed] = useState(1.0);
  const { setShowSidePanel } = useSidePanel();

  // Get conversation history from store
  const userPreferences = aiResponseStore.getUserPreferences();
  const conversationHistory = userPreferences.conversationHistory || [];

  // Move Beta Info to left when entering VoiceChatPage
  useEffect(() => {
    setShowSidePanel(true);
    return () => {
      setShowSidePanel(false);
    };
  }, [setShowSidePanel]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationHistory]);

  return (
    <div className="flex h-screen w-full">
      {/* Left Panel - Voice Recording Area */}
      <div className="w-1/2 relative flex flex-col overflow-hidden">
        {/* Gradient Background - matching Figma exactly */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* First gradient blob - rotated 210deg, positioned at top-left area */}
          <div
            className="absolute"
            style={{
              width: "431px",
              height: "561.5px",
              left: "25%",
              top: "23%",
              transform: "rotate(210deg)",
              background:
                "linear-gradient(135deg, rgba(124, 132, 251, 0.38) 0%, rgba(153, 204, 245, 0.38) 100%)",
              filter: "blur(90px)",
              opacity: 0.5,
            }}
          />
          {/* Second gradient blob - rotated 354.432deg, positioned at center-right */}
          <div
            className="absolute"
            style={{
              width: "260px",
              height: "185.5px",
              left: "55%",
              top: "52%",
              transform: "translate(-50%, -50%) rotate(354.432deg)",
              background:
                "linear-gradient(135deg, rgba(124, 132, 251, 0.5) 0%, rgba(153, 204, 245, 0.38) 100%)",
              filter: "blur(60px)",
              opacity: 1,
            }}
          />
          {/* Additional blue tint overlay */}
          <div
            className="absolute"
            style={{
              width: "100%",
              height: "100%",
              left: "0",
              top: "0",
            }}
          />
        </div>

        {/* Header */}
        <div className="relative pt-[60px] text-center">
          <h1 className="text-[18px] leading-[24px] font-semibold text-black">
            스마트 추천
          </h1>
        </div>

        {/* Voice Animation Area */}
        <div className="relative flex-1 flex flex-col items-center justify-center">
          {/* Settings Button */}
          <div
            className="absolute top-[50px] left-[30px] flex items-center gap-[4px] cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => setShowSettingsDialog(true)}
          >
            <div className="w-[20px] h-[20px] flex items-center justify-center">
              <img
                src={icSetting}
                alt="Settings"
                className="w-[16px] h-[16px]"
              />
            </div>
            <span className="text-[14px] leading-[20px] text-[#252525] font-['One_UI_Sans_GUI:400_Regular',_sans-serif]">
              음성 채팅 설정
            </span>
          </div>

          {/* Voice Animation - Video */}
          <div className="relative w-[260px] h-[260px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{
                mixBlendMode: "lighten",
                opacity: 0.9,
              }}
            >
              <source src={voiceVideo} type="video/mp4" />
            </video>
          </div>

          {/* Voice Controls - positioned at bottom */}
          <div className="absolute bottom-[56px] left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className="bg-white rounded-[999px] shadow-[12px_12px_26px_0px_#ebebed] px-[32px] py-[14px] flex items-end gap-[32px]">
              {/* Camera Button */}
              <button className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity">
                <img
                  src={icCamera}
                  alt="Camera"
                  className="w-[32px] h-[32px]"
                />
              </button>

              {/* Mic Off Button */}
              <button className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity">
                <img
                  src={icMicOff}
                  alt="Mic Off"
                  className="w-[32px] h-[32px]"
                />
              </button>

              {/* Cancel Button */}
              <button
                className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity"
                onClick={() => navigate(-1)}
              >
                <img
                  src={icCancel}
                  alt="Cancel"
                  className="w-[32px] h-[32px]"
                />
              </button>

              {/* Pause Button */}
              <button className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity">
                <img src={icPause} alt="Pause" className="w-[32px] h-[32px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="w-px h-full bg-[#d5d8dc]" />

      {/* Right Panel - Chat Messages */}
      <div className="w-1/2 flex flex-col ">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-[30px] pt-[120px]">
          {conversationHistory.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#989ba2]">
              대화 내역이 없습니다.
            </div>
          ) : (
            <>
              {conversationHistory.map((message, index) => {
                // Determine if it's user or AI message based on index (alternating pattern)
                const isUserMessage = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={`mb-[16px] flex ${
                      isUserMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    {isUserMessage ? (
                      <BubbleUser>{message}</BubbleUser>
                    ) : (
                      <BubbleAI>{message}</BubbleAI>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        selectedVoice={selectedVoice}
        onVoiceChange={setSelectedVoice}
        subtitleOn={subtitleOn}
        onSubtitleToggle={() => setSubtitleOn(!subtitleOn)}
        speed={speed}
        onSpeedChange={setSpeed}
      />
    </div>
  );
};

export default VoiceChatPage;
