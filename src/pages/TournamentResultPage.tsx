import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store";
import FullScreenLoading from "../components/FullScreenLoading";

const TournamentResultPage: React.FC = () => {
  const { allProducts, finalWinner, semifinalWinners } = useSelector(
    (state: RootState) => state.tournament
  );
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  // 0: 초기 상태 (하단 4개만 흰색)
  // 1: 1경기 완료 (라인 애니메이션, 패배 제품 회색, 준결승1 흰색)
  // 2: 2경기 완료 (라인 애니메이션, 패배 제품 회색, 준결승2 흰색)
  // 3: 결승 완료 (라인 애니메이션, 패배 준결승 회색, 결승 흰색)

  // 데이터 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (
      !finalWinner ||
      !semifinalWinners ||
      semifinalWinners.length < 2 ||
      !allProducts ||
      allProducts.length < 4
    ) {
      navigate("/");
    }
  }, [finalWinner, semifinalWinners, allProducts, navigate]);

  // 페이지 진입 시 로딩 화면 표시 및 자동 숨김
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setShowLoading(false);
    }, 2000); // 2초 후 로딩 화면 숨김

    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  // 페이지 진입 시 순차 애니메이션
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStep(1), 500); // 0.5초 후 1경기
    const timer2 = setTimeout(() => setAnimationStep(2), 1500); // 1.5초 후 2경기
    const timer3 = setTimeout(() => setAnimationStep(3), 2500); // 2.5초 후 결승

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Canvas 라인 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 크기 설정
    const width = 1286;
    const height = 774;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);

    const defaultColor = "#d5d8dc";
    const animatedColor = "#0106FF"; // 푸른색
    const lineWidth = 1;
    const radius = 8;

    // 좌표 계산
    const finalX = 387 + 512 / 2; // 643 (우승자 카드 중앙)
    const finalY = 260;
    const semi1X = 151 + 260 / 2; // 281
    const semi1Y = 330;
    const semi1Height = 146;
    const semi1MidY = semi1Y + semi1Height / 2; // 403 (준결승1 카드 높이 중간)
    const semi1Right = 151 + 260; // 411 (준결승1 카드 우측)
    const semi2X = 875 + 260 / 2; // 1005
    const semi2MidY = semi1Y + semi1Height / 2; // 403 (준결승2 카드 높이 중간)
    const semi2Left = 875; // 875 (준결승2 카드 좌측)
    const product1X = 0 + 260 / 2; // 130
    const product2X = 302 + 260 / 2; // 432
    const product3X = 724 + 260 / 2; // 854
    const product4X = 1026 + 260 / 2; // 1156
    const productY = 546;

    // 1경기 승자 판별 (제품 1 or 제품 2)
    const winner1IsProduct1 = semifinalWinners[0]?.id === allProducts[0]?.id;
    const winner1IsProduct2 = semifinalWinners[0]?.id === allProducts[1]?.id;

    // 2경기 승자 판별 (제품 3 or 제품 4)
    const winner2IsProduct3 = semifinalWinners[1]?.id === allProducts[2]?.id;
    const winner2IsProduct4 = semifinalWinners[1]?.id === allProducts[3]?.id;

    // 결승 승자 판별
    const finalWinnerIsSemi1 = finalWinner?.id === semifinalWinners[0]?.id;
    const finalWinnerIsSemi2 = finalWinner?.id === semifinalWinners[1]?.id;

    // 1단계: 모든 라인을 회색으로 그리기
    ctx.strokeStyle = defaultColor;
    ctx.lineWidth = lineWidth;

    // 제품 1 -> 준결승 1
    ctx.beginPath();
    ctx.moveTo(product1X, productY);
    ctx.lineTo(product1X, 511 + radius);
    ctx.arcTo(product1X, 511, product1X + radius, 511, radius);
    ctx.lineTo(semi1X - radius, 511);
    ctx.arcTo(semi1X, 511, semi1X, 511 - radius, radius);
    ctx.lineTo(semi1X, semi1Y + 146);
    ctx.stroke();

    // 제품 2 -> 준결승 1
    ctx.beginPath();
    ctx.moveTo(product2X, productY);
    ctx.lineTo(product2X, 511 + radius);
    ctx.arcTo(product2X, 511, product2X - radius, 511, radius);
    ctx.lineTo(semi1X + radius, 511);
    ctx.arcTo(semi1X, 511, semi1X, 511 - radius, radius);
    ctx.stroke();

    // 제품 3 -> 준결승 2
    ctx.beginPath();
    ctx.moveTo(product3X, productY);
    ctx.lineTo(product3X, 511 + radius);
    ctx.arcTo(product3X, 511, product3X + radius, 511, radius);
    ctx.lineTo(semi2X - radius, 511);
    ctx.arcTo(semi2X, 511, semi2X, 511 - radius, radius);
    ctx.lineTo(semi2X, semi1Y + 146);
    ctx.stroke();

    // 제품 4 -> 준결승 2
    ctx.beginPath();
    ctx.moveTo(product4X, productY);
    ctx.lineTo(product4X, 511 + radius);
    ctx.arcTo(product4X, 511, product4X - radius, 511, radius);
    ctx.lineTo(semi2X + radius, 511);
    ctx.arcTo(semi2X, 511, semi2X, 511 - radius, radius);
    ctx.stroke();

    // 준결승 1 -> 결승 (왼쪽 카드의 우측면 중간에서 출발하여 우승자 카드 상단 중앙으로)
    ctx.beginPath();
    ctx.moveTo(semi1Right, semi1MidY);
    ctx.lineTo(finalX - radius, semi1MidY);
    ctx.arcTo(finalX, semi1MidY, finalX, semi1MidY - radius, radius);
    ctx.lineTo(finalX, finalY);
    ctx.stroke();

    // 준결승 2 -> 결승 (오른쪽 카드의 좌측면 중간에서 출발하여 우승자 카드 상단 중앙으로)
    ctx.beginPath();
    ctx.moveTo(semi2Left, semi2MidY);
    ctx.lineTo(finalX + radius, semi2MidY);
    ctx.arcTo(finalX, semi2MidY, finalX, semi2MidY - radius, radius);
    ctx.lineTo(finalX, finalY + radius);
    ctx.lineTo(finalX, finalY);
    ctx.stroke();

    // 2단계: 승자의 라인만 파란색으로 위에 덮어 그리기
    ctx.strokeStyle = animatedColor;
    ctx.lineWidth = lineWidth;

    // 1경기 승자 라인 (파란색) - 준결승까지 또는 최종 우승자까지
    if (animationStep >= 1 && winner1IsProduct1) {
      ctx.beginPath();
      ctx.moveTo(product1X, productY);
      ctx.lineTo(product1X, 511 + radius);
      ctx.arcTo(product1X, 511, product1X + radius, 511, radius);
      ctx.lineTo(semi1X - radius, 511);
      ctx.arcTo(semi1X, 511, semi1X, 511 - radius, radius);
      ctx.lineTo(semi1X, semi1Y + 146);
      ctx.stroke();

      // 결승까지 이어지는 경우
      if (animationStep >= 3 && finalWinnerIsSemi1) {
        ctx.beginPath();
        ctx.moveTo(semi1Right, semi1MidY);
        ctx.lineTo(finalX - radius, semi1MidY);
        ctx.arcTo(finalX, semi1MidY, finalX, semi1MidY - radius, radius);
        ctx.lineTo(finalX, finalY);
        ctx.stroke();
      }
    }

    if (animationStep >= 1 && winner1IsProduct2) {
      ctx.beginPath();
      ctx.moveTo(product2X, productY);
      ctx.lineTo(product2X, 511 + radius);
      ctx.arcTo(product2X, 511, product2X - radius, 511, radius);
      ctx.lineTo(semi1X + radius, 511);
      ctx.arcTo(semi1X, 511, semi1X, 511 - radius, radius);
      ctx.lineTo(semi1X, semi1Y + 146);
      ctx.stroke();

      // 결승까지 이어지는 경우
      if (animationStep >= 3 && finalWinnerIsSemi1) {
        ctx.beginPath();
        ctx.moveTo(semi1Right, semi1MidY);
        ctx.lineTo(finalX - radius, semi1MidY);
        ctx.arcTo(finalX, semi1MidY, finalX, semi1MidY - radius, radius);
        ctx.lineTo(finalX, finalY);
        ctx.stroke();
      }
    }

    // 2경기 승자 라인 (파란색) - 준결승까지 또는 최종 우승자까지
    if (animationStep >= 2 && winner2IsProduct3) {
      ctx.beginPath();
      ctx.moveTo(product3X, productY);
      ctx.lineTo(product3X, 511 + radius);
      ctx.arcTo(product3X, 511, product3X + radius, 511, radius);
      ctx.lineTo(semi2X - radius, 511);
      ctx.arcTo(semi2X, 511, semi2X, 511 - radius, radius);
      ctx.lineTo(semi2X, semi1Y + 146);
      ctx.stroke();

      // 결승까지 이어지는 경우
      if (animationStep >= 3 && finalWinnerIsSemi2) {
        ctx.beginPath();
        ctx.moveTo(semi2Left, semi2MidY);
        ctx.lineTo(finalX + radius, semi2MidY);
        ctx.arcTo(finalX, semi2MidY, finalX, semi2MidY - radius, radius);
        ctx.lineTo(finalX, finalY);
        ctx.stroke();
      }
    }

    if (animationStep >= 2 && winner2IsProduct4) {
      ctx.beginPath();
      ctx.moveTo(product4X, productY);
      ctx.lineTo(product4X, 511 + radius);
      ctx.arcTo(product4X, 511, product4X - radius, 511, radius);
      ctx.lineTo(semi2X + radius, 511);
      ctx.arcTo(semi2X, 511, semi2X, 511 - radius, radius);
      ctx.lineTo(semi2X, semi1Y + 146);
      ctx.stroke();

      // 결승까지 이어지는 경우
      if (animationStep >= 3 && finalWinnerIsSemi2) {
        ctx.beginPath();
        ctx.moveTo(semi2Left, semi2MidY);
        ctx.lineTo(finalX + radius, semi2MidY);
        ctx.arcTo(finalX, semi2MidY, finalX, semi2MidY - radius, radius);
        ctx.lineTo(finalX, finalY);
        ctx.stroke();
      }
    }
  }, [animationStep, allProducts, semifinalWinners, finalWinner]);

  // 패배한 제품 판별
  const isProductDefeated = (index: number) => {
    if (animationStep === 0) return false;
    if (index === 0 || index === 1) {
      return (
        animationStep >= 1 && semifinalWinners[0]?.id !== allProducts[index]?.id
      );
    }
    if (index === 2 || index === 3) {
      return (
        animationStep >= 2 && semifinalWinners[1]?.id !== allProducts[index]?.id
      );
    }
    return false;
  };

  // 패배한 준결승 판별
  const isSemiDefeated = (index: number) => {
    if (animationStep < 3) return false;
    return semifinalWinners[index]?.id !== finalWinner?.id;
  };

  return (
    <div className="w-full h-screen relative bg-[#f8f8fa]">
      {/* Full Screen Loading */}
      <FullScreenLoading isOpen={showLoading} text="토너먼트 결과를 불러오는 중..." />

      <div className="relative w-full h-full flex flex-col items-center">
        {/* Title */}
        <div className="mt-[60px] mb-[24px]">
          <div className="text-[18px] leading-[24px] font-semibold text-center text-black">
            EZ 토너먼트
          </div>
        </div>

        {/* Final Winner Title */}
        <div className="flex flex-col items-center mt-[24px] h-[108px]">
          <div
            className="flex flex-col justify-center font-semibold bg-clip-text h-[34px]"
            style={{
              WebkitTextFillColor: "transparent",
              backgroundImage: "linear-gradient(to right, #7850ff, #37d7ff)",
            }}
          >
            <div className="leading-[34px] text-[28px]">
              {animationStep >= 3 ? "당신의 원픽은 바로!" : " "}
            </div>
          </div>
          <div
            className="flex flex-col justify-center font-semibold bg-clip-text mt-[6px] mb-[24px] h-[34px]"
            style={{
              WebkitTextFillColor: "transparent",
              backgroundImage: "linear-gradient(to right, #7850ff, #37d7ff)",
            }}
          >
            <div className="leading-[34px] text-[28px]">
              {animationStep >= 3 && finalWinner
                ? `"${finalWinner.title}"`
                : " "}
            </div>
          </div>
        </div>
        {/* Tournament Bracket Container */}
        <div className="relative w-[1286px] h-[774px]">
          {/* Canvas for lines */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 pointer-events-none"
          />

          {/* Top - Final Winner */}
          <div
            className={`absolute w-[512px] h-[260px] border rounded-[20px] overflow-hidden transition-all duration-500 ${
              animationStep >= 3
                ? "bg-white border-[#0106FF]"
                : "bg-[#eef0f3] border-[#d5d8dc]"
            }`}
            style={{ left: "387px", top: "0px" }}
          >
            {animationStep >= 3 && finalWinner && (
              <>
                {/* 제품 이미지 */}
                <div className="absolute left-[20px] top-[20px] w-[200px] h-[140px] overflow-hidden">
                  <img
                    src={finalWinner.image}
                    alt={finalWinner.title}
                    className="object-contain w-[180px] h-[120px] ml-[10px] mt-[11px]"
                  />
                </div>

                {/* 제품 정보 */}
                <div className="absolute left-[230px] top-[34px] w-[242px]">
                  {/* 스펙 정보 */}
                  <div className="text-[14px] leading-[20px] text-[#989ba2] mb-[4px]">
                    {finalWinner.highlightedSpecs &&
                      finalWinner.highlightedSpecs.length > 0 && (
                        <div>
                          {finalWinner.highlightedSpecs.map((spec, idx) => (
                            <span key={idx}>{spec.text}</span>
                          ))}
                        </div>
                      )}
                  </div>

                  {/* 가격 정보 */}
                  <div className="text-[18px] leading-[24px] font-semibold text-black ">
                    {finalWinner.highlightedSpecs &&
                      finalWinner.highlightedSpecs.find((spec) =>
                        spec.text.includes("가격")
                      )?.text}
                  </div>
                </div>

                {/* 구분선 */}
                <div className="absolute left-[40px] bottom-[88px] w-[432px] h-[1px] bg-[#d5d8dc]" />

                {/* 구매 바로가기 버튼 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[32px]">
                  <div className="bg-[#f0f1f3] rounded-[24px] w-[132px] h-[38px] flex items-center justify-center">
                    <span className="text-[14px] leading-[32px] font-semibold text-black">
                      구매 바로가기
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Middle row - Semifinal Winners */}
          {/* 준결승 1 */}
          <div
            className={`absolute w-[260px] h-[146px] border rounded-[20px] flex items-center justify-center overflow-hidden transition-all duration-500 ${
              isSemiDefeated(0)
                ? "bg-[#eef0f3] border-[#d5d8dc]"
                : animationStep >= 1
                ? "bg-white border-[#0106FF]"
                : "bg-[#eef0f3] border-[#d5d8dc]"
            }`}
            style={{ left: "151px", top: "330px" }}
          >
            {animationStep >= 1 && semifinalWinners[0] && (
              <img
                src={semifinalWinners[0].image}
                alt={semifinalWinners[0].title}
                className="object-contain max-w-[180px] max-h-[120px]"
              />
            )}
          </div>

          {/* 준결승 2 */}
          <div
            className={`absolute w-[260px] h-[146px] border rounded-[20px] flex items-center justify-center overflow-hidden transition-all duration-500 ${
              isSemiDefeated(1)
                ? "bg-[#eef0f3] border-[#d5d8dc]"
                : animationStep >= 2
                ? "bg-white border-[#0106FF]"
                : "bg-[#eef0f3] border-[#d5d8dc]"
            }`}
            style={{ left: "875px", top: "330px" }}
          >
            {animationStep >= 2 && semifinalWinners[1] && (
              <img
                src={semifinalWinners[1].image}
                alt={semifinalWinners[1].title}
                className="object-contain max-w-[180px] max-h-[120px]"
              />
            )}
          </div>

          {/* Bottom row - 4 products */}
          {allProducts.map((product, index) => {
            const positions = [
              { left: 0, top: 546 },
              { left: 302, top: 546 },
              { left: 724, top: 546 },
              { left: 1026, top: 546 },
            ];
            const labelPositions = [
              { left: 130, top: 704 },
              { left: 432, top: 704 },
              { left: 854, top: 704 },
              { left: 1156, top: 704 },
            ];

            return (
              <React.Fragment key={product.id}>
                {/* Product Card */}
                <div
                  className={`absolute w-[260px] h-[146px] border rounded-[20px] overflow-hidden transition-all duration-500 ${
                    isProductDefeated(index)
                      ? "bg-[#eef0f3] border-[#d5d8dc]"
                      : "bg-white border-[#0106FF]"
                  }`}
                  style={{
                    left: `${positions[index].left}px`,
                    top: `${positions[index].top}px`,
                  }}
                >
                  <div
                    className={`w-[252px] h-[138px]  rounded-[16px] m-[4px] flex items-center justify-center {
                    isProductDefeated(index)
                      ? "bg-[#eef0f3] border-[#d5d8dc]"
                      : "bg-white border-[#0106FF]"
                  }`}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-contain max-w-[180px] max-h-[120px]"
                    />
                  </div>
                </div>

                {/* Product Label */}
                <div
                  className="absolute text-[14px] leading-[20px] text-[#252525] text-center w-[260px]"
                  style={{
                    left: `${labelPositions[index].left}px`,
                    top: `${labelPositions[index].top}px`,
                    transform: "translateX(-50%)",
                    color: isProductDefeated(index) ? "#989BA2" : "#252525",
                  }}
                >
                  {product.title}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TournamentResultPage;
