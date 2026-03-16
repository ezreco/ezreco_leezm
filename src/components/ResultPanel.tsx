import React, { useEffect, useRef } from "react";
import PreferenceCard from "./PreferenceCard";
import CardEditDialog from "./CardEditDialog";
import type { UserPreferences } from "../store/aiResponseStore";
import { aiResponseStore } from "../store/aiResponseStore";
import { preferenceCardsStore } from "../store/preferenceCardsStore";
import { inferenceStore } from "../store/inferenceStore";
import triangleIcon from "../assets/icons/triangle.png";

interface ResultPanelProps {
  userPreferences?: UserPreferences;
}

interface CardPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ userPreferences = {} }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pieChartCanvasRef = useRef<HTMLCanvasElement>(null);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [handlePositions, setHandlePositions] = React.useState<
    Array<{ x: number; y: number; angle: number }>
  >([]);
  const [draggingHandleIndex, setDraggingHandleIndex] = React.useState<
    number | null
  >(null);
  const chartCenterRef = useRef({ x: 140, y: 140 });
  const [segmentPercentages, setSegmentPercentages] = React.useState<number[]>(
    []
  );
  const [originalPercentages, setOriginalPercentages] = React.useState<
    number[]
  >([]);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [bottomSheetHeight, setBottomSheetHeight] = React.useState(0);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingCard, setEditingCard] = React.useState<{
    title: string;
    value: string;
    position: { x: number; y: number; width: number; height: number };
  } | null>(null);

  // 카드 값들을 로컬 상태로 관리
  const [cardValues, setCardValues] = React.useState<Record<string, string>>(
    {}
  );

  // 카드 제목을 AI Response의 preference key로 매핑
  const cardTitleToPreferenceKey: Record<string, string> = {
    사용목적: "purpose",
    크기: "screenSize",
    가격대: "budget",
    시청거리: "viewingDistance",
    해상도: "resolution",
    공간밝기: "spaceBrightness",
    선호브랜드: "brand",
    패널타입: "panelType",
  };

  // 카드별 옵션을 aiResponseStore에서 가져오는 함수
  const getCardOptions = (cardTitle: string): string[] => {
    // Get current preferences
    const currentPrefs = aiResponseStore.getUserPreferences();

    // Create temp preferences without the specific preference to get its options
    const tempPrefs = { ...currentPrefs };
    delete tempPrefs[
      cardTitleToPreferenceKey[cardTitle] as keyof UserPreferences
    ];

    // Save original prefs
    const allPrefs = aiResponseStore.getUserPreferences();

    // Temporarily set temp prefs
    aiResponseStore.clearUserPreferences();
    Object.entries(tempPrefs).forEach(([key, value]) => {
      aiResponseStore.updateUserPreference(key as keyof UserPreferences, value);
    });

    // Get response which should contain options for the missing preference
    const response = aiResponseStore.getResponse("");

    // Restore original preferences
    aiResponseStore.clearUserPreferences();
    Object.entries(allPrefs).forEach(([key, value]) => {
      aiResponseStore.updateUserPreference(key as keyof UserPreferences, value);
    });

    // Extract options from response, limit to 4 (direct input makes it 5 total)
    const options = response.auxInput?.options?.map((opt) => opt.label) || [];
    return options.slice(0, 4);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (
    title: string,
    value: string,
    position: { x: number; y: number; width: number; height: number }
  ) => {
    setEditingCard({ title, value, position });
    setEditDialogOpen(true);
  };

  // 다이얼로그에서 값 저장
  const handleSaveCardValue = (newValue: string) => {
    if (editingCard) {
      console.log(`Saving ${editingCard.title}: ${newValue}`);
      setCardValues((prev) => ({
        ...prev,
        [editingCard.title]: newValue,
      }));
      setHasChanges(true);
    }
  };

  // Update store when preferences change
  useEffect(() => {
    console.log("[ResultPanel] userPreferences updated:", userPreferences);
    preferenceCardsStore.getState().updateFromPreferences(userPreferences);

    // Initialize cardValues from userPreferences
    setCardValues({
      사용목적: userPreferences.purpose?.join(", ") || "",
      크기: userPreferences.screenSize || "",
      가격대: userPreferences.budget || "",
      시청거리: userPreferences.viewingDistance || "",
      해상도: userPreferences.resolution || "",
      공간밝기: userPreferences.spaceBrightness || "",
      선호브랜드: userPreferences.brand || "",
      패널타입: userPreferences.panelType || "",
    });
  }, [userPreferences]);

  // Define all possible cards with their data
  const allCards = [
    {
      title: "사용목적",
      value:
        cardValues["사용목적"] || userPreferences.purpose?.join(", ") || "",
      priority: 1,
    },
    {
      title: "크기",
      value: cardValues["크기"] || userPreferences.screenSize || "",
      priority: 2,
    },
    {
      title: "가격대",
      value: cardValues["가격대"] || userPreferences.budget || "",
      priority: 3,
    },
    {
      title: "시청거리",
      value: cardValues["시청거리"] || userPreferences.viewingDistance || "",
      priority: 4,
    },
    {
      title: "공간밝기",
      value: cardValues["공간밝기"] || userPreferences.spaceBrightness || "",
      priority: 5,
    },
    {
      title: "관람공간",
      value: cardValues["관람공간"] || userPreferences.viewingArea || "",
      priority: 6,
    },
    {
      title: "실사용자",
      value: cardValues["실사용자"] || userPreferences.users?.join(", ") || "",
      priority: 7,
    },
    {
      title: "사용공간",
      value: cardValues["사용공간"] || userPreferences.installationSpace || "",
      priority: 8,
    },
    {
      title: "선호브랜드",
      value: cardValues["선호브랜드"] || userPreferences.brand || "",
      priority: 9,
    },
    {
      title: "패널타입",
      value: cardValues["패널타입"] || userPreferences.panelType || "",
      priority: 10,
    },
    {
      title: "해상도",
      value: cardValues["해상도"] || userPreferences.resolution || "",
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
        console.log("[ResultPanel] inputOrder:", inputOrder);
        console.log(
          "[ResultPanel] filtered cards:",
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
            "[ResultPanel] sorted cards:",
            sorted.map((c) => c.title)
          );
          return sorted;
        }

        return filtered;
      })()
    : [];

  // Calculate card positions - grid-based zigzag flow
  const getCardPositions = (cardCount: number): CardPosition[] => {
    const cardWidth = 190;
    const cardHeight = 65;
    const horizontalGap = 80;
    const gridYGap = 85;
    const groupGap = 80;
    const startY = 20;

    // 3 column layout
    const col1X = 30;
    const col2X = col1X + cardWidth + horizontalGap;
    const col3X = col2X + cardWidth + horizontalGap;

    // Grid-based card pattern (9 cards, then cycle)
    const gridPattern: [number, number][] = [
      [0, 0], // 카드1: (0, 0)
      [0, 2], // 카드2: (0, 2)
      [1, 1], // 카드3: (1, 1)
      [2, 2], // 카드4: (2, 2)
      [2, 3], // 카드5: (2, 3)
      [1, 4], // 카드6: (1, 4)
      [1, 6], // 카드7: (1, 6)
      [0, 7], // 카드8: (0, 7)
      [0, 9], // 카드9: (0, 9)
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
      let y = startY + gridY * gridYGap;
      if (gridY >= 3) {
        y += groupGap;
      }

      // 사이클 반복 시 오프셋 추가
      if (cycle > 0) {
        const lastCardBaseY = 9 * gridYGap + groupGap;
        const cycleHeight = lastCardBaseY + 2 * gridYGap;
        y += cycle * cycleHeight;
      }

      positions.push({
        x,
        y,
        width: cardWidth,
        height: cardHeight,
      });
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
      ctx.lineWidth = 1.2;
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

  // Draw pie chart
  useEffect(() => {
    const canvas = pieChartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get pie chart data from store
    const inferenceData = inferenceStore.getData();
    const pieChartData = inferenceData.step2?.customizationImportance || [];

    if (pieChartData.length === 0) return;

    // Use current segment percentages if available, otherwise use store data
    const currentPercentages =
      segmentPercentages.length > 0
        ? segmentPercentages
        : pieChartData.map((s) => s.percentage);

    // HiDPI support
    const dpr = window.devicePixelRatio || 1;
    const size = 280;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Chart settings
    const centerX = 140;
    const centerY = 140;
    const outerRadius = 134;
    const innerRadius = 90;

    // Convert degrees to radians
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    // Helper function to draw donut segment
    const drawDonutSegment = (
      startAngle: number,
      endAngle: number,
      color: string,
      opacity: number
    ) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();

      // Outer arc
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle, false);

      // Inner arc (reversed)
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Starting from top (-90 degrees)
    const startTop = toRad(-90);

    // Gap between segments (in radians)
    // 5px gap on a circle with radius ~112px
    const gapAngle = 5 / 112; // radians

    // Draw segments based on current percentages
    let currentAngle = startTop;
    pieChartData.forEach((segment, index) => {
      const percentage = currentPercentages[index];
      const segmentAngle = toRad((percentage / 100) * 360);
      // Calculate opacity based on index (lightest to darkest)
      const opacity = 1.0 - index * 0.35;

      drawDonutSegment(
        currentAngle + gapAngle / 2,
        currentAngle + segmentAngle - gapAngle / 2,
        segment.color,
        opacity
      );

      currentAngle += segmentAngle;
    });

    // Draw divider circles (168 diameter = 84 radius, 280 diameter = 140 radius)
    ctx.strokeStyle = "#D5D8DC";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1.0;

    // Inner divider circle (168 diameter)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 84, 0, Math.PI * 2);
    ctx.stroke();

    // Outer divider circle (280 diameter)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
    ctx.stroke();

    // Draw percentage labels at the center of each segment
    ctx.globalAlpha = 1.0;
    ctx.font =
      '600 14px "One UI Sans GUI", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Label distance from center (on the donut arc)
    // Position at the middle of the donut ring: (innerRadius + outerRadius) / 2
    const labelRadius = (innerRadius + outerRadius) / 2;

    // Helper function to calculate label position
    const getLabelPosition = (startAngle: number, endAngle: number) => {
      const midAngle = (startAngle + endAngle) / 2;
      const x = centerX + Math.cos(midAngle) * labelRadius;
      const y = centerY + Math.sin(midAngle) * labelRadius;
      return { x, y };
    };

    // Draw labels for each segment
    let labelAngle = startTop;
    pieChartData.forEach((_, index) => {
      const percentage = currentPercentages[index];
      const segmentAngle = toRad((percentage / 100) * 360);
      const labelPos = getLabelPosition(
        labelAngle + gapAngle / 2,
        labelAngle + segmentAngle - gapAngle / 2
      );

      ctx.fillStyle = "#FFF";
      ctx.fillText(`${Math.round(percentage)}%`, labelPos.x, labelPos.y);

      labelAngle += segmentAngle;
    });

    // Calculate handle positions at segment boundaries
    const handles: Array<{ x: number; y: number; angle: number }> = [];
    const handleRadius = 150; // 10px more than outer circle (140 + 10)
    let boundaryAngle = startTop;

    pieChartData.forEach((_segment, index) => {
      const percentage = currentPercentages[index];
      const segmentAngle = toRad((percentage / 100) * 360);

      // Position handle at the boundary (end of current segment)
      boundaryAngle += segmentAngle;

      const x = centerX + Math.cos(boundaryAngle) * handleRadius;
      const y = centerY + Math.sin(boundaryAngle) * handleRadius;

      handles.push({
        x,
        y,
        angle: boundaryAngle * (180 / Math.PI), // Convert back to degrees for rotation
      });
    });

    setHandlePositions(handles);
  }, [segmentPercentages]);

  // Initialize segment percentages once
  useEffect(() => {
    const inferenceData = inferenceStore.getData();
    const pieChartData = inferenceData.step2?.customizationImportance || [];
    if (pieChartData.length > 0 && segmentPercentages.length === 0) {
      const initialPercentages = pieChartData.map(
        (segment) => segment.percentage
      );
      setSegmentPercentages(initialPercentages);
      setOriginalPercentages(initialPercentages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if percentages have changed
  useEffect(() => {
    if (originalPercentages.length === 0 || segmentPercentages.length === 0)
      return;

    const changed = segmentPercentages.some(
      (val, idx) => Math.abs(val - originalPercentages[idx]) > 0.1
    );
    setHasChanges(changed);
  }, [segmentPercentages, originalPercentages]);

  // Handle cancel - reset to original values
  const handleCancel = () => {
    setSegmentPercentages([...originalPercentages]);
    setHasChanges(false);
  };

  // Handle re-search with new values
  const handleReSearch = () => {
    console.log("Re-searching with new percentages:", segmentPercentages);
    // TODO: Implement re-search logic
    setOriginalPercentages([...segmentPercentages]);
    setHasChanges(false);
  };

  // Handle drag functionality
  const handleMouseDown = (index: number) => {
    setDraggingHandleIndex(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingHandleIndex === null) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const centerX = chartCenterRef.current.x;
    const centerY = chartCenterRef.current.y;

    // Calculate angle from center to mouse position
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    let angleRad = Math.atan2(dy, dx);
    const angleDeg = angleRad * (180 / Math.PI);

    // Normalize angle to 0-360 range
    if (angleRad < 0) angleRad += 2 * Math.PI;

    // Starting angle is -90 degrees (-PI/2)
    const startAngle = -Math.PI / 2;
    let normalizedAngle = angleRad - startAngle;
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

    // Calculate new position maintaining the radius
    const handleRadius = 150;
    const newX = centerX + Math.cos(angleRad) * handleRadius;
    const newY = centerY + Math.sin(angleRad) * handleRadius;

    // Calculate new percentages
    const newPercentages = [...segmentPercentages];
    const totalSegments = segmentPercentages.length;

    // Convert angle to percentage (0-360 degrees = 0-100%)
    const totalAngle = normalizedAngle * (180 / Math.PI);
    const cumulativePercentage = (totalAngle / 360) * 100;

    let newSegmentPercentage: number;
    let diff: number;
    let affectedSegmentIndex: number;

    // Special handling for the first handle (index 0)
    if (draggingHandleIndex === 0) {
      // First handle controls the LAST segment, not the first
      // The angle represents where segment 0 ENDS, which is where segment (last) STARTS from the other direction
      newSegmentPercentage = cumulativePercentage;

      // Clamp to reasonable values (min 5%, max 90%)
      if (newSegmentPercentage < 5 || newSegmentPercentage > 90) return;

      diff = newSegmentPercentage - newPercentages[0];

      // Update first segment
      newPercentages[0] = newSegmentPercentage;

      // Adjust LAST segment to compensate
      affectedSegmentIndex = totalSegments - 1;
      newPercentages[affectedSegmentIndex] = Math.max(
        5,
        newPercentages[affectedSegmentIndex] - diff
      );
    } else {
      // For other handles, calculate normally
      // Calculate cumulative percentages before the dragged handle
      let cumulativeBefore = 0;
      for (let i = 0; i < draggingHandleIndex; i++) {
        cumulativeBefore += newPercentages[i];
      }

      // The dragged handle defines the end of segment[draggingHandleIndex]
      newSegmentPercentage = cumulativePercentage - cumulativeBefore;

      // Clamp to reasonable values (min 5%, max 90%)
      if (newSegmentPercentage < 5 || newSegmentPercentage > 90) return;

      diff = newSegmentPercentage - newPercentages[draggingHandleIndex];

      // Update the segment
      newPercentages[draggingHandleIndex] = newSegmentPercentage;

      // Adjust the next segment
      affectedSegmentIndex = (draggingHandleIndex + 1) % totalSegments;
      newPercentages[affectedSegmentIndex] = Math.max(
        5,
        newPercentages[affectedSegmentIndex] - diff
      );
    }

    // Ensure total is exactly 100
    const total = newPercentages.reduce((sum, p) => sum + p, 0);
    if (Math.abs(total - 100) > 0.1) {
      const adjustment = (100 - total) / totalSegments;
      for (let i = 0; i < totalSegments; i++) {
        newPercentages[i] += adjustment;
      }
    }

    setSegmentPercentages(newPercentages);

    // Update handle position
    setHandlePositions((prev) => {
      const newPositions = [...prev];
      newPositions[draggingHandleIndex] = {
        x: newX,
        y: newY,
        angle: angleDeg,
      };
      return newPositions;
    });
  };

  const handleMouseUp = () => {
    setDraggingHandleIndex(null);
  };

  useEffect(() => {
    if (draggingHandleIndex !== null) {
      const listener = () => handleMouseUp();
      document.addEventListener("mouseup", listener);
      return () => {
        document.removeEventListener("mouseup", listener);
      };
    }
  }, [draggingHandleIndex]);

  // Set bottom sheet height based on hasChanges
  useEffect(() => {
    // When sheet appears, use fixed height (matching max-h-[200px])
    // When sheet disappears, use 0
    setBottomSheetHeight(hasChanges ? 200 : 0);

    // Scroll to bottom when sheet appears
    if (hasChanges && scrollContainerRef.current) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop =
            scrollContainerRef.current.scrollHeight;
        }
      }, 50); // Small delay to ensure height change is applied
    }
  }, [hasChanges]);

  return (
    <>
      <div className="w-full h-full border-l border-[#d5d8dc] relative z-0 flex flex-col overflow-hidden">
        {/* Scrollable Content Area */}
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto pt-[60px] transition-all duration-300 ease-out"
          style={{
            height:
              bottomSheetHeight > 0
                ? `calc(100% - ${bottomSheetHeight}px)`
                : "100%",
          }}
        >
          {/* Header Section */}
          <div className="mb-[54px]">
            <div className="text-[18px] font-semibold text-[#1a1a1a] text-center mb-[24px]">
              추천 반영 정보
            </div>
            <div
              className="text-[28px] font-semibold text-center"
              style={{
                background: "linear-gradient(90deg, #7850ff 0%, #37d7ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              원하는 정보를 수정하실 수 있어요
            </div>
          </div>

          {/* Cards Section */}
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
                    className="absolute cursor-pointer"
                    style={{
                      left: `${position.x}px`,
                      top: `${position.y}px`,
                    }}
                    onClick={() =>
                      handleCardClick(card.title, card.value, position)
                    }
                  >
                    <PreferenceCard
                      title={card.title}
                      value={card.value}
                      animationDelay={index * 100}
                    />
                  </div>
                );
              })}

              {/* Card Edit Dialog */}
              {editingCard && (
                <CardEditDialog
                  isOpen={editDialogOpen}
                  onClose={() => {
                    setEditDialogOpen(false);
                    setEditingCard(null);
                  }}
                  cardTitle={editingCard.title}
                  cardValue={editingCard.value}
                  onSave={handleSaveCardValue}
                  keywords={getCardOptions(editingCard.title)}
                  cardPosition={editingCard.position}
                  panelWidth={800}
                />
              )}
            </div>
          </div>

          {/* Customization Importance Section */}
          <div className="mt-[80px] mb-[60px]">
            <h2 className="text-[18px] font-semibold text-[#1a1a1a] text-center mb-8">
              맞춤형 중요도
            </h2>

            {/* Pie Chart */}
            <div className="flex justify-center items-center mb-[28px] mt-[46px]">
              <div
                className="relative w-[280px] h-[280px]"
                onMouseMove={handleMouseMove}
              >
                <canvas
                  ref={pieChartCanvasRef}
                  width={280}
                  height={280}
                  style={{ width: "280px", height: "280px" }}
                />
                {/* Handles at segment boundaries */}
                {handlePositions.map((handle, index) => (
                  <div
                    key={index}
                    className="absolute cursor-pointer select-none"
                    style={{
                      left: `${handle.x}px`,
                      top: `${handle.y}px`,
                      transform: `translate(-50%, -50%) rotate(${
                        handle.angle + 90
                      }deg)`,
                      transformOrigin: "center",
                    }}
                    onMouseDown={() => handleMouseDown(index)}
                  >
                    <img
                      src={triangleIcon}
                      alt="handle"
                      className="w-[16px] h-[16px] pointer-events-none"
                      draggable={false}
                    />
                  </div>
                ))}

                {/* Legend in center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="flex flex-col gap-0">
                    {inferenceStore
                      .getData()
                      .step2?.customizationImportance.map((segment, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-[8px]"
                        >
                          <div
                            className="w-[8px] h-[8px] rounded-full shrink-0"
                            style={{
                              backgroundColor: segment.color,
                              opacity: 1.0 - index * 0.35,
                            }}
                          ></div>
                          <span
                            className="text-[12px] text-[#000000] whitespace-nowrap leading-[16px]"
                            style={{
                              fontFamily: '"One UI Sans GUI", sans-serif',
                              fontWeight: 400,
                            }}
                          >
                            {segment.label}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="text-center text-[14px] text-[#989ba2] mb-8">
              <div className="mb-[6px]">핸들러로 중요도 순서를 변경하면</div>
              <div>맞춤형 최적의 추천을 다시 제공해드려요</div>
            </div>
          </div>
          {/* End of Customization Importance Section */}
        </div>
        {/* End of Scrollable Content Area */}

        {/* Bottom-up Sheet - Action Buttons (Outside scroll area) */}
        <div
          ref={bottomSheetRef}
          className="transition-all duration-300 ease-out"
          style={{
            display: hasChanges ? "block" : "none",
          }}
        >
          <div className="width-full bg-[#d5d8dc] mx-[40px] h-[1px]"></div>
          <div className="px-6 py-5">
            {/* Buttons */}
            <div className="flex justify-center gap-[12px] mt-[21px] pb-[100px]">
              <button
                onClick={handleReSearch}
                className="flex items-center justify-center h-[38px] w-[132px] px-3 py-2 bg-[#0106FF] text-white text-[14px] font-semibold rounded-[19px] hover:bg-[#0004CC] transition-colors leading-[20px]"
                style={{
                  fontFamily: '"One UI Sans GUI", sans-serif',
                  fontWeight: 600,
                }}
              >
                재검색
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center justify-center h-[38px] w-[132px] px-3 py-2 bg-white text-[#000000] text-[14px] font-semibold rounded-[19px]  hover:bg-[#f5f5f5] transition-colors leading-[20px]"
                style={{
                  fontFamily: '"One UI Sans GUI", sans-serif',
                  fontWeight: 600,
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultPanel;
