import React, { useRef, useEffect } from "react";
import InferenceProgressCard from "./InferenceProgressCard";
import InferenceChatCard from "./InferenceChatCard";
import DonutChart from "./DonutChart";
import TagCloud from "./TagCloud";
import WeightAnalysisCard from "./WeightAnalysisCard";
import WeightListCard from "./WeightListCard";
import ConditionTagsCard from "./ConditionTagsCard";
import WeightPercentageCard from "./WeightPercentageCard";
import InferenceLoadingAnimation from "./InferenceLoadingAnimation";
import { inferenceStore } from "../store/inferenceStore";

import btnClose from "../assets/icons/close-icon.svg";
interface InferenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userMessage?: string;
}

interface CardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  bottom?: number;
}

const InferenceDialog: React.FC<InferenceDialogProps> = ({
  isOpen,
  onClose,
  userMessage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [data] = React.useState(() => inferenceStore.getData());
  const chatCardHeight = 60;

  // Define card positions (same as InferenceView)
  const getCardPositions = (
    _containerWidth: number,
    containerHeight: number,
    chatHeight: number = 60
  ): Record<string, CardPosition> => {
    const chatCardGap = 20;
    const chatCardCenterY = 348;

    const progress1Height = 204;
    const progress1BottomY = chatCardCenterY - chatHeight / 2 - chatCardGap;

    const progress2TopY = chatCardCenterY + chatHeight / 2 + chatCardGap;

    return {
      loadingSpinner: {
        x: 38,
        y: progress2TopY + 70 - 65,
        width: 100,
        height: 100,
      },
      progress1: {
        x: 1213,
        y: progress1BottomY - progress1Height,
        bottom: containerHeight - progress1BottomY,
        width: 352,
        height: progress1Height,
      },
      chatCardBetween: {
        x: 1390,
        y: chatCardCenterY,
        width: 450,
        height: chatHeight,
      },
      progress2: {
        x: 1640 - 320 - 75 - 16,
        y: progress2TopY,
        width: 320,
        height: 140,
      },
      progress3: {
        x: 1640 - 320 - 75 - 16,
        y: progress2TopY + 140 + 16 + 10,
        width: 320,
        height: 100,
      },
      progress4: {
        x: 1640 - 320 - 75 - 16,
        y: progress2TopY + 140 + 16 + 100 + 16 + 10,
        width: 320,
        height: 100,
      },
      progress5: {
        x: 1640 - 320 - 75 - 16 - 492 - 80,
        y: progress2TopY + 100 + 10,
        width: 492,
        height: 330,
      },
      progress6: {
        x: 1640 - 320 - 75 - 16 - 492 - 80 - 274 - 80,
        y: progress2TopY + 100 + (330 - 252) / 2 - 20 + 10,
        width: 274,
        height: 252 + 34,
      },
      progress7: {
        x: 1640 - 320 - 75 - 16 - 492 - 80 - 274 - 80 + 274 / 2 - 214 / 2,
        y: progress2TopY + 20,
        width: 214,
        height: 66 + 34,
      },
      progress8: {
        x: 1640 - 320 - 75 - 16 - 492 - 80 - 274 - 80,
        y: progress1BottomY - 130,
        width: 584,
        height: 76 + 34,
      },
    };
  };

  const containerWidth = 1640;
  const containerHeight = 900;
  const positions = getCardPositions(
    containerWidth,
    containerHeight,
    chatCardHeight
  );

  // Draw all connection lines (static, no animation)
  useEffect(() => {
    if (!isOpen) return;

    const drawConnections = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#0106FF";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Draw bidirectional arrow between progress1 and progress2
      if (
        positions.chatCardBetween &&
        positions.progress1 &&
        positions.progress2
      ) {
        const chatCard = positions.chatCardBetween;
        const progress1 = positions.progress1;
        const progress2 = positions.progress2;

        const chatCenterX = chatCard.x;
        const chatCenterY = chatCard.y;

        const progress1CenterX = progress1.x + progress1.width / 2;
        const progress1ActualBottom =
          containerHeight - (progress1.bottom || 0) + 2;

        const progress2CenterX = progress2.x + progress2.width / 2;
        const progress2Top = progress2.y - 2;

        const arrowLength = 4;
        const arrowWidth = 4;

        // Line to progress1 (upward)
        ctx.beginPath();
        ctx.moveTo(chatCenterX, chatCenterY);
        ctx.lineTo(progress1CenterX, progress1ActualBottom);
        ctx.stroke();

        // Arrow at progress1 (pointing up)
        ctx.beginPath();
        ctx.moveTo(progress1CenterX, progress1ActualBottom);
        ctx.lineTo(
          progress1CenterX - arrowWidth,
          progress1ActualBottom + arrowLength
        );
        ctx.moveTo(progress1CenterX, progress1ActualBottom);
        ctx.lineTo(
          progress1CenterX + arrowWidth,
          progress1ActualBottom + arrowLength
        );
        ctx.stroke();

        // Line to progress2 (downward)
        ctx.beginPath();
        ctx.moveTo(chatCenterX, chatCenterY);
        ctx.lineTo(progress2CenterX, progress2Top);
        ctx.stroke();

        // Arrow at progress2 (pointing down)
        ctx.beginPath();
        ctx.moveTo(progress2CenterX, progress2Top);
        ctx.lineTo(progress2CenterX - arrowWidth, progress2Top - arrowLength);
        ctx.moveTo(progress2CenterX, progress2Top);
        ctx.lineTo(progress2CenterX + arrowWidth, progress2Top - arrowLength);
        ctx.stroke();
      }

      // Draw line from progress2 to progress3
      if (positions.progress2 && positions.progress3) {
        const progress2 = positions.progress2;
        const progress3 = positions.progress3;

        const titleHeight = 34;
        const startX = progress2.x + progress2.width;
        const startY = progress2.y + progress2.height / 2 - titleHeight + 17;
        const endX = progress3.x + progress3.width + 2;
        const endY = progress3.y + progress3.height / 2 - titleHeight + 17;

        const arrowLength = 6;
        const arrowWidth = 4;
        const horizontalExtension = 40;
        const midX = startX + horizontalExtension;
        const cornerRadius = 12;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(midX - cornerRadius, startY);
        ctx.arcTo(midX, startY, midX, endY, cornerRadius);
        ctx.lineTo(midX, endY - cornerRadius);
        ctx.arcTo(midX, endY, endX, endY, cornerRadius);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow
        ctx.beginPath();
        ctx.moveTo(endX + arrowLength, endY - arrowWidth);
        ctx.lineTo(endX, endY);
        ctx.lineTo(endX + arrowLength, endY + arrowWidth);
        ctx.stroke();
      }

      // Draw line from progress2 to progress4
      if (positions.progress2 && positions.progress4) {
        const progress2 = positions.progress2;
        const progress4 = positions.progress4;

        const titleHeight = 34;
        const startX = progress2.x + progress2.width;
        const startY = progress2.y + progress2.height / 2 - titleHeight + 17;
        const endX = progress4.x + progress4.width + 2;
        const endY = progress4.y + progress4.height / 2 - titleHeight + 17;

        const arrowLength = 6;
        const arrowWidth = 4;
        const horizontalExtension = 40;
        const midX = startX + horizontalExtension;
        const cornerRadius = 12;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(midX - cornerRadius, startY);
        ctx.arcTo(midX, startY, midX, endY, cornerRadius);
        ctx.lineTo(midX, endY - cornerRadius);
        ctx.arcTo(midX, endY, endX, endY, cornerRadius);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow
        ctx.beginPath();
        ctx.moveTo(endX + arrowLength, endY - arrowWidth);
        ctx.lineTo(endX, endY);
        ctx.lineTo(endX + arrowLength, endY + arrowWidth);
        ctx.stroke();
      }

      // Draw line from progress3 to progress5
      if (positions.progress3 && positions.progress5) {
        const progress3 = positions.progress3;
        const progress5 = positions.progress5;

        const titleHeight = 34;
        const startX = progress3.x - 2;
        const startY = progress3.y + progress3.height / 2 - titleHeight + 17;
        const endX = progress5.x + progress5.width + 2;
        const endY = progress5.y + progress5.height / 2 - titleHeight + 17;

        const arrowLength = 6;
        const arrowWidth = 4;
        const horizontalExtension = 40;
        const midX = startX - horizontalExtension;
        const cornerRadius = 12;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(midX + cornerRadius, startY);
        ctx.arcTo(midX, startY, midX, endY, cornerRadius);
        ctx.lineTo(midX, endY + cornerRadius * Math.sign(startY - endY));
        ctx.arcTo(midX, endY, endX, endY, cornerRadius);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow
        ctx.beginPath();
        ctx.moveTo(endX + arrowLength, endY - arrowWidth);
        ctx.lineTo(endX, endY);
        ctx.lineTo(endX + arrowLength, endY + arrowWidth);
        ctx.stroke();
      }

      // Draw line from progress4 to progress5
      if (positions.progress4 && positions.progress5) {
        const progress4 = positions.progress4;
        const progress5 = positions.progress5;

        const titleHeight = 34;
        const startX = progress4.x - 2;
        const startY = progress4.y + progress4.height / 2 - titleHeight + 17;
        const endX = progress5.x + progress5.width + 2;
        const endY = progress5.y + progress5.height / 2 - titleHeight + 17;

        const arrowLength = 6;
        const arrowWidth = 4;
        const horizontalExtension = 40;
        const midX = startX - horizontalExtension;
        const cornerRadius = 12;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(midX + cornerRadius, startY);
        ctx.arcTo(midX, startY, midX, endY, cornerRadius);
        ctx.lineTo(midX, endY + cornerRadius * Math.sign(startY - endY));
        ctx.arcTo(midX, endY, endX, endY, cornerRadius);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow
        ctx.beginPath();
        ctx.moveTo(endX + arrowLength, endY - arrowWidth);
        ctx.lineTo(endX, endY);
        ctx.lineTo(endX + arrowLength, endY + arrowWidth);
        ctx.stroke();
      }

      // Draw line from progress1 through progress8 to loadingSpinner
      if (
        positions.progress1 &&
        positions.progress8 &&
        positions.loadingSpinner
      ) {
        const progress1 = positions.progress1;
        const progress8 = positions.progress8;
        const spinner = positions.loadingSpinner;

        const titleHeight = 34;
        const arrowLength = 6;
        const arrowWidth = 4;
        const cornerRadius = 12;

        const startX = progress1.x + progress1.width / 2;
        const startY = containerHeight - (progress1.bottom || 0);

        const passThroughX = progress8.x - 2;
        const passThroughY =
          progress8.y + progress8.height / 2 - titleHeight + 17;

        const turnX = spinner.x + spinner.width / 2;
        const endX = spinner.x + spinner.width / 2;
        const endY = spinner.y - 20;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, passThroughY);
        ctx.lineTo(passThroughX, passThroughY);
        ctx.lineTo(turnX + cornerRadius, passThroughY);
        ctx.arcTo(turnX, passThroughY, turnX, endY, cornerRadius);
        ctx.lineTo(turnX, endY);
        ctx.stroke();

        // Arrow
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowWidth, endY - arrowLength);
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX + arrowWidth, endY - arrowLength);
        ctx.stroke();
      }

      // Draw line from progress2 through progress7 to loadingSpinner
      if (
        positions.progress2 &&
        positions.progress7 &&
        positions.loadingSpinner
      ) {
        const progress2 = positions.progress2;
        const progress7 = positions.progress7;
        const spinner = positions.loadingSpinner;

        const titleHeight = 34;
        const arrowLength = 4;
        const arrowWidth = 4;

        const startX = progress2.x + progress2.width + 2;
        const startY = progress2.y + progress2.height / 2 - titleHeight + 17;

        const passThroughLeftX = progress7.x - 2;
        const passThroughY =
          progress7.y + progress7.height / 2 - titleHeight + 17;

        const passThroughRightX = progress7.x + progress7.width + 2;
        const endX = spinner.x + spinner.width + 20;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(passThroughLeftX, startY);
        ctx.lineTo(passThroughLeftX, passThroughY);
        ctx.lineTo(passThroughRightX, passThroughY);
        ctx.lineTo(endX, passThroughY);
        ctx.stroke();

        // Arrow
        ctx.beginPath();
        ctx.moveTo(endX, passThroughY);
        ctx.lineTo(endX + arrowLength, passThroughY - arrowWidth);
        ctx.moveTo(endX, passThroughY);
        ctx.lineTo(endX + arrowLength, passThroughY + arrowWidth);
        ctx.stroke();
      }

      // Draw line from progress5 through progress6 to loadingSpinner
      if (
        positions.progress5 &&
        positions.progress6 &&
        positions.loadingSpinner
      ) {
        const progress5 = positions.progress5;
        const spinner = positions.loadingSpinner;

        const titleHeight = 34;
        const arrowLength = 6;
        const arrowWidth = 4;
        const cornerRadius = 12;

        const startX = progress5.x - 2;
        const startY = progress5.y + progress5.height / 2 - titleHeight + 17;

        const passThroughY =
          positions.progress6.y +
          positions.progress6.height / 2 -
          titleHeight +
          17;

        const turnX = spinner.x + spinner.width / 2;
        const endX = spinner.x + spinner.width / 2;
        const endY = spinner.y + spinner.height + 20;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(turnX + cornerRadius, passThroughY);
        ctx.arcTo(turnX, passThroughY, turnX, endY, cornerRadius);
        ctx.lineTo(turnX, endY);
        ctx.stroke();

        // Arrow
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowWidth, endY + arrowLength);
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX + arrowWidth, endY + arrowLength);
        ctx.stroke();
      }
    };

    drawConnections();
  }, [isOpen, positions, containerHeight]);

  const chartData =
    data.step2?.pieChart.map((item) => ({
      value: item.percentage,
      label: item.label,
    })) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-[20px] shadow-2xl overflow-hidden [&_*]:!transition-none [&_*]:!animate-none">
        {/* Title */}
        <div className="absolute top-[36px] left-1/2  z-10">
          <div className="text-[24px] font-semibold leading-[32px] text-black">
            추천 과정
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[36px] right-[43px] z-10 w-[36px] h-[36px] flex items-center justify-center "
        >
          <img src={btnClose} className="w-[18px] h-[18px]" alt="Close" />
        </button>

        {/* Content area */}
        <div className="w-[1650px] h-[900px] overflow-auto">
          <div ref={containerRef} className="relative w-full h-full">
            {/* Canvas for connection lines */}
            <canvas
              ref={canvasRef}
              width={containerWidth}
              height={containerHeight}
              className="absolute top-0 left-0 pointer-events-none"
            />

            {/* Loading spinner - static version */}
            <div
              className="absolute"
              style={{
                left: `${positions.loadingSpinner.x}px`,
                top: `${positions.loadingSpinner.y}px`,
              }}
            >
              <InferenceLoadingAnimation
                size={100}
                fps={0}
                loop={false}
                showText={false}
              />
            </div>

            {/* Progress1 with DonutChart */}
            {data.step1 && positions.progress1 && (
              <div
                className="absolute"
                style={{
                  left: `${positions.progress1.x}px`,
                  bottom: `${positions.progress1.bottom}px`,
                }}
              >
                <InferenceProgressCard
                  text={data.step1.progress1}
                  loading={false}
                  width={positions.progress1.width}
                  height={positions.progress1.height}
                  showTitle={false}
                >
                  <DonutChart
                    segments={chartData}
                    width={positions.progress1.width - 30}
                    height={170}
                  />
                </InferenceProgressCard>
              </div>
            )}

            {/* Chat Card Between */}
            {positions.chatCardBetween && (
              <div
                className="absolute"
                style={{
                  left: `${positions.chatCardBetween.x}px`,
                  top: `${positions.chatCardBetween.y}px`,
                  minWidth: "200px",
                  maxWidth: "600px",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <InferenceChatCard
                  text={
                    userMessage ||
                    "삼성과 엘지 브랜드 65인치 4K TV중에서 거실에서 영화를 주로 보긴 하는데&#10;가끔 스포츠도 보기에 적합한 모델 추천해줘"
                  }
                />
              </div>
            )}

            {/* Progress2 with TagCloud */}
            {positions.progress2 && (
              <div
                className="absolute"
                style={{
                  left: `${positions.progress2.x}px`,
                  top: `${positions.progress2.y}px`,
                }}
              >
                <InferenceProgressCard
                  text={data.step1.progress2}
                  loading={false}
                  width={positions.progress2.width}
                  height={positions.progress2.height}
                  showTitle={false}
                >
                  <TagCloud
                    tags={data.step2?.userPreferences || []}
                    width={positions.progress2.width}
                    height={positions.progress2.height}
                    disableAnimation={true}
                  />
                </InferenceProgressCard>
              </div>
            )}

            {/* Progress3 with environment tags */}
            {positions.progress3 && data.step1?.progress3 && (
              <div
                className="absolute"
                style={{
                  left: `${positions.progress3.x}px`,
                  top: `${positions.progress3.y}px`,
                }}
              >
                <InferenceProgressCard
                  text={data.step1.progress3}
                  loading={false}
                  width={positions.progress3.width}
                  height={positions.progress3.height}
                  showTitle={false}
                >
                  <TagCloud
                    tags={data.step2?.environmentTags || []}
                    width={positions.progress3.width}
                    height={66}
                    layout="horizontal"
                    disableAnimation={true}
                  />
                </InferenceProgressCard>
              </div>
            )}

            {/* Progress4 with context tags */}
            {positions.progress4 && data.step1?.progress4 && (
              <div
                className="absolute"
                style={{
                  left: `${positions.progress4.x}px`,
                  top: `${positions.progress4.y}px`,
                }}
              >
                <InferenceProgressCard
                  text={data.step1.progress4}
                  loading={false}
                  width={positions.progress4.width}
                  height={positions.progress4.height}
                  showTitle={false}
                >
                  <TagCloud
                    tags={data.step2?.contextTags || []}
                    width={positions.progress4.width}
                    height={66}
                    layout="horizontal"
                    disableAnimation={true}
                  />
                </InferenceProgressCard>
              </div>
            )}

            {/* Progress5 with WeightAnalysis */}
            {positions.progress5 && data.step1?.progress5 && (
              <div
                className="absolute"
                style={{
                  left: `${positions.progress5.x}px`,
                  top: `${
                    positions.progress5.y + positions.progress5.height / 2
                  }px`,
                  transform: "translateY(-50%)",
                }}
              >
                <InferenceProgressCard
                  text={data.step1.progress5Title2 || data.step1.progress5}
                  loading={false}
                  width={positions.progress5.width}
                  height={positions.progress5.height}
                  showTitle={false}
                >
                  <WeightAnalysisCard
                    bubbles={data.step2?.weightAnalysis.bubbles || []}
                    disclaimer={data.step2?.weightAnalysis.disclaimer || ""}
                  />
                </InferenceProgressCard>
              </div>
            )}

            {/* Progress6 with WeightList */}
            {positions.progress6 && data.step1?.progress6 && (
              <div
                className="absolute"
                style={{
                  left: `${positions.progress6.x}px`,
                  top: `${positions.progress6.y}px`,
                }}
              >
                <InferenceProgressCard
                  text={data.step1.progress6}
                  loading={false}
                  width={positions.progress6.width}
                  height={positions.progress6.height}
                  showTitle={false}
                >
                  <WeightListCard items={data.step2?.weightList || []} />
                </InferenceProgressCard>
              </div>
            )}

            {/* Progress7 with ConditionTags */}
            {positions.progress7 && (
              <div
                className="absolute"
                style={{
                  left: `${positions.progress7.x}px`,
                  top: `${positions.progress7.y}px`,
                }}
              >
                <InferenceProgressCard
                  text="선택한 조건이 반영되었어요"
                  loading={false}
                  width={positions.progress7.width}
                  height={positions.progress7.height}
                  showTitle={false}
                >
                  <ConditionTagsCard tags={["삼성", "엘지", "65인치"]} />
                </InferenceProgressCard>
              </div>
            )}

            {/* Progress8 with WeightPercentage */}
            {positions.progress8 && (
              <div
                className="absolute"
                style={{
                  left: `${positions.progress8.x}px`,
                  top: `${positions.progress8.y}px`,
                }}
              >
                <InferenceProgressCard
                  text="전문가 의견에 따른 중요도가 반영되었어요"
                  loading={false}
                  width={positions.progress8.width}
                  height={positions.progress8.height}
                  showTitle={false}
                >
                  <WeightPercentageCard
                    items={chartData.map((item) => ({
                      percentage: item.value,
                      label: item.label,
                    }))}
                  />
                </InferenceProgressCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InferenceDialog;
