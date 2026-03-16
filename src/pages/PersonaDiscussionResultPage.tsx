import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  autoAddProducts,
  loadChatMessages,
} from "../store/slices/personaDiscussionSlice";
import ProductCard from "../components/ProductCard";

// Import persona icons
import davidIcon from "@/assets/icons/david.png";
import jeffIcon from "@/assets/icons/jeff.png";
import peterIcon from "@/assets/icons/peter.png";
import steveIcon from "@/assets/icons/steve.png";
import mirandaIcon from "@/assets/icons/miranda.png";

const PersonaDiscussionResultPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { productList, chatMessages } = useSelector(
    (state: RootState) => state.personaDiscussion
  );
  const [showChatScreen, setShowChatScreen] = useState(false);
  const [showSummaryScreen, setShowSummaryScreen] = useState(false);

  // 제품 데이터가 없으면 자동으로 로드
  useEffect(() => {
    if (productList.length === 0) {
      dispatch(autoAddProducts());
    }
  }, [productList.length, dispatch]);

  // 채팅 메시지 로드
  useEffect(() => {
    if (chatMessages.length === 0) {
      dispatch(loadChatMessages());
    }
  }, [chatMessages.length, dispatch]);

  // 3초 후 채팅 화면으로 전환
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatScreen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Persona data
  const personas = [
    {
      name: "Steve",
      role: "스펙비교 전문가",
      icon: steveIcon,
      highlight: "화질 역대 최고",
      details: [
        "Quantum Matrix Technology Core로 디테일이 살아있는 대비감 선사",
        "초대형 화질 강화 4K AI 업스케일링",
      ],
    },
    {
      name: "Jeff",
      role: "서비스 비교 전문가",
      icon: jeffIcon,
      highlight: "가성비 최고",
      details: [
        "돌비 비전 & 필름메이커 모드로 즐기는 홈 시네마",
        "사용자 최적화 서비스 제공",
      ],
    },
    {
      name: "Miranda",
      role: "디자인 비교 전문가",
      icon: mirandaIcon,
      highlight: "화질 역대 최고",
      details: [
        "Quantum Matrix Technology Core로 디테일이 살아있는 대비감 선사",
        "초대형 화질 강화 4K AI 업스케일링",
      ],
    },
  ];

  // 라운드 종료 핸들러
  const handleRoundEnd = () => {
    setShowSummaryScreen(true);
  };

  // 써머리 화면 렌더링
  if (showSummaryScreen) {
    return (
      <div className="flex flex-col items-center w-full h-full pt-[60px]">
        {/* Title */}
        <div className="flex flex-col justify-center leading-[0] text-[#000000] text-[18px] text-center font-semibold mb-[32px]">
          <div className="leading-[24px]">페르소나 토론</div>
        </div>

        {/* Subtitle */}
        <div
          className="flex flex-col justify-center leading-[0] text-[28px] text-center font-semibold bg-clip-text mb-[56px] mt-[12px]"
          style={{
            WebkitTextFillColor: "transparent",
            backgroundImage: "linear-gradient(to right, #7850ff, #37d7ff)",
          }}
        >
          <div className="leading-[34px]">대화 내용 써머리</div>
        </div>

        {/* Persona Cards Grid */}
        <div className="flex gap-[32px] items-start ">
          {personas.map((persona, index) => {
            const product = productList[index];
            if (!product) return null;

            return (
              <div key={index} className="flex flex-col items-center w-[392px]">
                {/* Card */}
                <div className="bg-white border border-[#d5d8dc] rounded-[20px] w-full pt-[80px] flex flex-col items-center mt-[180px] pb-[49px]">
                  {/* Name */}
                  <div className="flex flex-col justify-center leading-[0] text-black text-[24px] text-center font-semibold mb-[6px]">
                    <div className="leading-[32px]">{persona.name}</div>
                  </div>

                  {/* Role */}
                  <div className="flex flex-col justify-center leading-[0] text-[#989ba2] text-[14px] text-center mb-[32px]">
                    <div className="leading-[20px]">{persona.role}</div>
                  </div>

                  {/* Divider */}
                  <div className="w-[312px] h-px bg-[#d5d8dc] mb-[40px] " />

                  {/* Highlight */}
                  <div className="flex flex-col justify-center leading-[0] text-[#f85057] text-[18px] text-center font-semibold mb-[26px]">
                    <div className="leading-[24px]">{persona.highlight}</div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-[16px] mb-[32px] w-full ">
                    {persona.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col justify-center leading-[24px] text-black text-[18px] text-center px-[45px] "
                      >
                        <div>{detail}</div>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button className="bg-[#f0f1f3] mt-[92px] rounded-[24px] h-[38px] px-[24px] flex items-center justify-center hover:bg-[#e5e6e8] transition-colors">
                    <span className="text-black text-[14px] leading-[20px] font-semibold">
                      구매 바로가기
                    </span>
                  </button>
                </div>
                {/* Avatar */}
                <div className="absolute top-[320px]  w-[120px] h-[120px] rounded-full bg-white border border-[#d5d8dc] overflow-hidden ">
                  <img
                    src={persona.icon}
                    alt={persona.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 채팅 화면 렌더링
  if (showChatScreen) {
    return (
      <div
        className="flex flex-col items-center w-full overflow-hidden"
        style={{ height: "calc(100vh - 90px)" }}
      >
        {/* Title */}
        <div className="flex flex-col justify-center pt-[60px] pb-[44px] leading-[0] text-[#000000] text-[18px] text-center font-semibold bg-transparent">
          <div className="leading-[24px]">페르소나 토론</div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col items-center flex-1 w-full overflow-y-auto pb-[100px]">
          {/* Persona Chat Area - Vertical Chat Flow */}
          <div className="w-full max-w-[1000px] flex flex-col gap-[20px]  px-[40px]">
            {chatMessages.map((message, index) => {
              // 좌우 교대 정렬 (짝수 인덱스: 왼쪽, 홀수 인덱스: 오른쪽)
              const isLeft = index % 2 === 0;

              // 페르소나별 아이콘 매핑
              const getPersonaIcon = (name: string) => {
                switch (name) {
                  case "David":
                    return davidIcon;
                  case "Jeff":
                    return jeffIcon;
                  case "Peter":
                    return peterIcon;
                  case "Steve":
                    return steveIcon;
                  case "Miranda":
                    return mirandaIcon;
                  default:
                    return davidIcon;
                }
              };

              return (
                <div
                  key={message.id}
                  className={`flex gap-[12px] items-start ${
                    isLeft ? "" : "flex-row-reverse"
                  }`}
                >
                  {/* Avatar and Info */}
                  <div className="flex flex-col items-center">
                    <div className="w-[120px] h-[120px] rounded-full bg-white border border-[#d5d8dc] overflow-hidden">
                      <img
                        src={getPersonaIcon(message.personaName)}
                        alt={message.personaName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col justify-center leading-[0] text-[#252525] text-[14px] text-center mb-[8px] whitespace-pre-line mt-[10px]">
                      <div className="leading-[20px]">
                        {message.personaRole}
                      </div>
                      <div className="leading-[20px]">
                        {message.personaName}
                      </div>
                    </div>
                  </div>
                  {/* Chat Bubble */}
                  <div
                    className={`relative px-[16px] py-[12px]  max-w-[600px] bottom-[-75px]
                    ${
                      isLeft
                        ? "rounded-br-[22px] rounded-tl-[22px] rounded-tr-[22px] left-[0px]"
                        : "rounded-bl-[22px] rounded-tl-[22px] rounded-tr-[22px] right-[0px]"
                    },
                  `}
                    style={{
                      background:
                        "linear-gradient(92deg, var(--Effect-Gradient-Start, #7850FF) 0%, var(--Effect-Gradient-End, #37D7FF) 100%)",
                    }}
                  >
                    <div className="text-white text-[14px] leading-[20px]">
                      {message.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Round End Button - Fixed at bottom */}
        <div className="bg-transparent pb-[0px] w-full  max-w-[1000px] flex flex-col justify-center items-center">
          <div className="bg-[#d5d8dc] w-full h-[1px] mb-[24px]" />
          <div className="relative  w-[180px] h-[48px]">
            {/* Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7850ff] to-[#37d7ff] rounded-[24px]" />
            {/* White Background Button */}
            <button
              onClick={handleRoundEnd}
              className="absolute inset-[1px] bg-white box-border flex items-center justify-center rounded-[23px] hover:bg-[#f8f8fa] transition-colors"
            >
              <p className="text-black text-[16px] leading-[26px] font-semibold text-center">
                라운드 종료
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 초기 매칭 화면
  return (
    <div className="flex flex-col h-screen w-full">
      {/* Title */}
      <div className=" justify-center leading-[0] text-[#000000] text-[18px] text-center font-semibold mb-[32px] mt-[60px]">
        <div className="leading-[24px]">페르소나 토론</div>
      </div>

      <div className="flex flex-col items-center w-full  pt-[120px]">
        {/* Subtitle */}
        <div
          className="flex flex-col justify-center leading-[0] text-[28px] text-center font-semibold bg-clip-text mb-[56px]"
          style={{
            WebkitTextFillColor: "transparent",
            backgroundImage: "linear-gradient(to right, #7850ff, #37d7ff)",
          }}
        >
          <div className="leading-[34px]">
            브랜드 대표 주자가 매칭되었습니다.
          </div>
        </div>

        {/* Personas and Products Grid */}
        <div className="flex gap-[180px] items-start">
          {personas.map((persona, index) => {
            const product = productList[index];
            if (!product) return null;

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Persona Role */}
                <div className="flex flex-col justify-center leading-[0] text-black text-[16px] text-center font-normal mb-[8px]">
                  <div className="leading-[26px]">{persona.role}</div>
                </div>

                {/* Persona Name */}
                <div className="flex flex-col justify-center leading-[0] text-black text-[24px] text-center font-semibold mb-[40px]">
                  <div className="leading-[32px]">{persona.name}</div>
                </div>

                {/* Persona Avatar */}
                <div className="w-[206px] h-[206px] rounded-full bg-white border border-[#d5d8dc] overflow-hidden  relative">
                  <img
                    src={persona.icon}
                    alt={persona.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Connector Line */}
                <div className=" left-1/2 top-full w-[1px] h-[80px] bg-[#d5d8dc] transform -translate-x-1/2" />

                {/* Product Card */}
                <ProductCard title={product.title} image={product.image} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PersonaDiscussionResultPage;
