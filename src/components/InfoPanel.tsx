import React, { useEffect, useRef } from "react";
import PreferenceCard from "./PreferenceCard";
import type { UserPreferences } from "../store/aiResponseStore";
import { preferenceCardsStore } from "../store/preferenceCardsStore";

interface JourneyCard {
  id: string;
  title: string;
  content: string;
}

interface InfoPanelProps {
  journeyCards?: JourneyCard[];
  userPreferences?: UserPreferences;
}

interface CardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ userPreferences = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update store when preferences change
  useEffect(() => {
    console.log("[InfoPanel] userPreferences updated:", userPreferences);
    preferenceCardsStore.getState().updateFromPreferences(userPreferences);
  }, [userPreferences]);

  // Define all possible cards with their data
  const allCards = [
    {
      title: "사용목적",
      value: userPreferences.purpose?.join(", ") || "",
      priority: 1,
    },
    {
      title: "크기",
      value: userPreferences.screenSize || "",
      priority: 2,
    },
    {
      title: "가격대",
      value: userPreferences.budget || "",
      priority: 3,
    },
    {
      title: "시청거리",
      value: userPreferences.viewingDistance || "",
      priority: 4,
    },
    {
      title: "공간밝기",
      value: userPreferences.spaceBrightness || "",
      priority: 5,
    },
    {
      title: "관람공간",
      value: userPreferences.viewingArea || "",
      priority: 6,
    },
    {
      title: "실사용자",
      value: userPreferences.users?.join(", ") || "",
      priority: 7,
    },
    {
      title: "사용공간",
      value: userPreferences.installationSpace || "",
      priority: 8,
    },
    {
      title: "선호브랜드",
      value: userPreferences.brand || "",
      priority: 9,
    },
    {
      title: "패널타입",
      value: userPreferences.panelType || "",
      priority: 10,
    },
    {
      title: "해상도",
      value: userPreferences.resolution || "",
      priority: 11,
    },
    {
      title: "출시연도",
      value: userPreferences.releaseYear || "",
      priority: 12,
    },
  ];

  // Filter cards that have values - only show if user has provided relevant info
  const hasRelevantPreferences =
    userPreferences &&
    (userPreferences.purpose?.length ||
      userPreferences.screenSize ||
      userPreferences.budget ||
      userPreferences.users?.length ||
      userPreferences.installationSpace ||
      userPreferences.brand ||
      userPreferences.viewingDistance ||
      userPreferences.spaceBrightness ||
      userPreferences.viewingArea ||
      userPreferences.panelType ||
      userPreferences.resolution ||
      userPreferences.releaseYear);

  // Filter and sort cards based on user input order
  const visibleCards = hasRelevantPreferences
    ? (() => {
        const filtered = allCards.filter(
          (card) => card.value && card.value !== ""
        );

        // Sort by input order if available
        const inputOrder = userPreferences.inputOrder || [];
        console.log("[InfoPanel] inputOrder:", inputOrder);
        console.log(
          "[InfoPanel] filtered cards:",
          filtered.map((c) => c.title)
        );

        if (inputOrder.length > 0) {
          const sorted = filtered.sort((a, b) => {
            // Map card title to preference key
            const titleToKey: Record<string, string> = {
              사용목적: "purpose",
              크기: "screenSize",
              가격대: "budget",
              시청거리: "viewingDistance",
              공간밝기: "spaceBrightness",
              관람공간: "viewingArea",
              실사용자: "users",
              사용공간: "installationSpace",
              선호브랜드: "brand",
              패널타입: "panelType",
              해상도: "resolution",
              출시연도: "releaseYear",
            };

            const keyA = titleToKey[a.title];
            const keyB = titleToKey[b.title];

            const indexA = inputOrder.indexOf(keyA);
            const indexB = inputOrder.indexOf(keyB);

            // If both are in the order list, sort by their position
            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }

            // If only one is in the order list, prioritize it
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;

            // If neither is in the order list, maintain original order
            return 0;
          });

          console.log(
            "[InfoPanel] sorted cards:",
            sorted.map((c) => c.title)
          );
          return sorted;
        }

        return filtered;
      })()
    : [];

  // Calculate card positions - grid-based zigzag flow
  const getCardPositions = (cardCount: number): CardPosition[] => {
    const cardWidth = 190; // PreferenceCard의 실제 너비
    const cardHeight = 65; // PreferenceCard의 실제 높이
    const horizontalGap = 80;
    const gridYGap = 85; // 그리드 Y 간격
    const groupGap = 80; // 카드4→카드5 사이 추가 간격
    const startY = 20;

    // 3 column layout
    const col1X = 30;
    const col2X = col1X + cardWidth + horizontalGap;
    const col3X = col2X + cardWidth + horizontalGap;

    // Grid-based card pattern (9 cards, then cycle)
    // [x, gridY] where x: 0(left), 1(center), 2(right), gridY: grid unit
    const gridPattern: [number, number][] = [
      [0, 0], // 카드1: (0, 0)
      [0, 2], // 카드2: (0, 2)
      [1, 1], // 카드3: (1, 1)
      [2, 2], // 카드4: (2, 2) - 첫 번째 그룹 끝
      [2, 3], // 카드5: (2, 3) - 두 번째 그룹 시작, +80px 추가
      [1, 4], // 카드6: (1, 4)
      [1, 6], // 카드7: (1, 6)
      [0, 7], // 카드8: (0, 7)
      [0, 9], // 카드9: (0, 9) - 8번 카드에서 2 gridY 증가 (170px)
    ];

    const positions: CardPosition[] = [];

    for (let i = 0; i < cardCount; i++) {
      const pattern = i % 9;
      const cycle = Math.floor(i / 9);
      const [gridX, gridY] = gridPattern[pattern];

      // X 좌표 계산
      let x: number;
      switch (gridX) {
        case 0:
          x = col1X;
          break;
        case 1:
          x = col2X;
          break;
        case 2:
          x = col3X;
          break;
        default:
          x = col1X;
      }

      // Y 좌표 계산
      // baseY = gridY × 85px
      // gridY >= 3이면 80px 추가 (카드5부터)
      let y = startY + gridY * gridYGap;
      if (gridY >= 3) {
        y += groupGap;
      }

      // 사이클 반복 시 오프셋 추가 (2번째 사이클부터)
      if (cycle > 0) {
        // 한 사이클의 전체 높이 = 마지막 카드(gridY=9)의 Y 위치 + (gridY 0→2 증가분)
        // 마지막 카드(9번)의 baseY = 9 × 85px + 80px(그룹간격) = 845px
        // 1번째→2번째 카드 증가분 = 2 × 85px = 170px
        const lastCardBaseY = 9 * gridYGap + groupGap; // 845px
        const cycleHeight = lastCardBaseY + 2 * gridYGap; // 845 + 170 = 1015px
        y += cycle * cycleHeight;
      }

      positions.push({
        x,
        y,
        width: cardWidth,
        height: cardHeight,
      });

      // 디버깅: 8번째와 9번째 카드 위치 로그
      if (i === 7 || i === 8) {
        const cycleHeightCalc =
          cycle > 0 ? 7 * gridYGap + groupGap + cardHeight : 0;
        console.log(`[InfoPanel] Card ${i + 1} (index ${i}):`, {
          pattern,
          cycle,
          gridX,
          gridY,
          x,
          y,
          cardBottom: y + cardHeight,
          cycleHeight: cycleHeightCalc,
          calculation: `startY(${startY}) + gridY(${gridY}) × ${gridYGap} + groupGap(${
            gridY >= 3 ? groupGap : 0
          }) + cycle(${cycle}) × ${cycleHeightCalc}`,
        });
      }
    }

    return positions;
  };

  const cardPositions = getCardPositions(visibleCards.length);

  // Calculate dynamic container height based on card positions
  const containerHeight = React.useMemo(() => {
    if (cardPositions.length === 0) return 400;

    // Find the card with the highest bottom position
    const maxBottom = cardPositions.reduce((max, pos) => {
      const bottom = pos.y + pos.height;
      return Math.max(max, bottom);
    }, 0);

    // Add some padding at the bottom
    return maxBottom + 40;
  }, [cardPositions]);

  // Redraw when cards change
  useEffect(() => {
    const drawConnections = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // HiDPI/Retina display support for crisp lines
      const dpr = window.devicePixelRatio || 1;
      const canvasWidth = 800;
      const canvasHeight = containerHeight;

      // Set canvas internal resolution to match device pixel ratio
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;

      // Scale context to match
      ctx.scale(dpr, dpr);

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const positions = getCardPositions(visibleCards.length);

      console.log("Drawing connections for", visibleCards.length, "cards");
      console.log("Positions:", positions);
      console.log("Device pixel ratio:", dpr);

      if (positions.length < 2) return;

      // Set line style with improved rendering quality
      ctx.strokeStyle = "#0106FF";
      ctx.lineWidth = 1.2; // Slightly thicker for better visibility
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Enable anti-aliasing for smoother curves
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      console.log(
        "Line style set:",
        ctx.strokeStyle,
        "width:",
        ctx.lineWidth,
        "dpr:",
        dpr
      );

      // Draw connection from card i to card i+1
      const drawConnection = (from: CardPosition, to: CardPosition) => {
        let startX, startY, endX, endY;

        // Determine connection direction
        const isVertical = Math.abs(to.y - from.y) > Math.abs(to.x - from.x);

        if (isVertical) {
          // 수직 이동
          const fromCenterX = from.x + from.width / 2;
          const toCenterX = to.x + to.width / 2;

          startX = fromCenterX;
          endX = toCenterX;

          // 시작점: 아래로 가면 bottom edge, 위로 가면 top edge
          if (from.y < to.y) {
            startY = from.y + from.height; // bottom edge
            endY = to.y; // top edge
          } else {
            startY = from.y; // top edge
            endY = to.y + to.height; // bottom edge
          }

          console.log(
            `Vertical: from(${from.x}, ${from.y}, w:${from.width}) -> to(${to.x}, ${to.y}, w:${to.width})`
          );
          console.log(`  fromCenterX: ${fromCenterX}, toCenterX: ${toCenterX}`);
          console.log(`  startX: ${startX}, endX: ${endX}`);
        } else {
          // 수평 이동
          const fromCenterY = from.y + from.height / 2;
          const toCenterY = to.y + to.height / 2;

          startY = fromCenterY;
          endY = toCenterY;

          // 시작점: 오른쪽으로 가면 right edge, 왼쪽으로 가면 left edge
          if (from.x < to.x) {
            startX = from.x + from.width; // right edge
            endX = to.x; // left edge
          } else {
            startX = from.x; // left edge
            endX = to.x + to.width; // right edge
          }

          console.log(
            `Horizontal: from(${from.x}, ${from.y}) -> to(${to.x}, ${to.y})`
          );
          console.log(`  fromCenterY: ${fromCenterY}, toCenterY: ${toCenterY}`);
          console.log(`  startY: ${startY}, endY: ${endY}`);
        }

        // Draw simplified curved connection
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        if (isVertical) {
          // Simple vertical line
          ctx.lineTo(endX, endY);
        } else {
          // 수평 이동 - L자 곡선 경로
          const midX = startX + (endX - startX) / 2;
          const cornerRadius = 16;
          const isRightToLeft = startX > endX;

          // Use quadratic curves for smoother paths
          if (Math.abs(endY - startY) > 20) {
            if (isRightToLeft) {
              // Right to left: flip control point offsets
              ctx.lineTo(midX + cornerRadius, startY);
              ctx.quadraticCurveTo(
                midX,
                startY,
                midX,
                startY + Math.sign(endY - startY) * cornerRadius
              );
              ctx.lineTo(midX, endY - Math.sign(endY - startY) * cornerRadius);
              ctx.quadraticCurveTo(midX, endY, midX - cornerRadius, endY);
              ctx.lineTo(endX, endY);
            } else {
              // Left to right: existing logic
              ctx.lineTo(midX - cornerRadius, startY);
              ctx.quadraticCurveTo(
                midX,
                startY,
                midX,
                startY + Math.sign(endY - startY) * cornerRadius
              );
              ctx.lineTo(midX, endY - Math.sign(endY - startY) * cornerRadius);
              ctx.quadraticCurveTo(midX, endY, midX + cornerRadius, endY);
              ctx.lineTo(endX, endY);
            }
          } else {
            // Simple horizontal line
            ctx.lineTo(endX, endY);
          }
        }

        ctx.stroke();

        // Arrowhead
        const arrowLength = 4;

        ctx.beginPath();
        if (isVertical) {
          // Vertical arrow
          if (from.y < to.y) {
            // Pointing down
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - 4, endY - arrowLength);
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX + 4, endY - arrowLength);
          } else {
            // Pointing up
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - 4, endY + arrowLength);
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX + 4, endY + arrowLength);
          }
        } else {
          // Horizontal arrow
          if (from.x < to.x) {
            // Pointing right
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - arrowLength, endY - 4);
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - arrowLength, endY + 4);
          } else {
            // Pointing left
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX + arrowLength, endY - 4);
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX + arrowLength, endY + 4);
          }
        }
        ctx.stroke();
      };

      // Draw all sequential connections
      console.log("Drawing", positions.length - 1, "connections");
      for (let i = 0; i < positions.length - 1; i++) {
        console.log(
          `Connection ${i} -> ${i + 1}:`,
          positions[i],
          "->",
          positions[i + 1]
        );
        drawConnection(positions[i], positions[i + 1]);
      }
    };

    drawConnections();
  }, [visibleCards.length, containerHeight]);

  // Update positions in store
  useEffect(() => {
    preferenceCardsStore.getState().setPositions(cardPositions);
  }, [cardPositions]);

  return (
    <div className="w-full bg-white border-l border-[#d5d8dc] pt-[130px] relative z-0">
      <div className="flex items-start justify-center">
        <div
          ref={containerRef}
          className="relative w-[800px]"
          style={{ height: `${containerHeight}px` }}
        >
          {/* Canvas for lines and arrows */}
          <canvas
            ref={canvasRef}
            width={800}
            height={containerHeight}
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: "800px",
              height: `${containerHeight}px`,
              willChange: "transform",
            }}
          />

          {/* Cards positioned according to layout */}
          {visibleCards.map((card, index) => {
            const position = cardPositions[index];
            if (!position) return null;

            return (
              <div
                key={card.title}
                className="absolute"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                }}
              >
                <PreferenceCard
                  title={card.title}
                  value={card.value}
                  animationDelay={index * 100}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
