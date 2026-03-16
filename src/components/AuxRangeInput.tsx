import React, { useCallback, useMemo, useRef, useState } from "react";

// Import assets from Figma
import checkIcon from "@/assets/icons/ic_check.svg";

interface RangeValue {
  label: string;
  value: number;
}

interface AuxRangeInputProps {
  values: RangeValue[];
  selectedRange?: [number, number];
  onRangeChange?: (range: [number, number]) => void;
  onSend?: () => void;
  onRangeSelect?: (rangeText: string) => void; // 범위 선택 시 텍스트 전달
  containerWidth?: number; // 컨테이너 너비 (기본값: 718)
}

const AuxRangeInput: React.FC<AuxRangeInputProps> = ({
  values,
  selectedRange = [0, values.length - 1],
  onRangeChange,
  onSend,
  onRangeSelect,
  containerWidth = 718,
}) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRangeChange = useCallback(
    (startIndex: number, endIndex: number) => {
      onRangeChange?.([startIndex, endIndex]);
    },
    [onRangeChange]
  );

  // 컨테이너와 패딩 설정
  const CONTAINER_WIDTH = containerWidth;
  const HORIZONTAL_PADDING = 30;
  const USABLE_WIDTH = CONTAINER_WIDTH - HORIZONTAL_PADDING * 2;

  // 실제 값의 비율에 따라 닷 위치 계산
  const dotPositions = useMemo(() => {
    if (values.length === 0) return [];

    // 최소값과 최대값 찾기
    const minValue = values[0].value;
    const maxValue = values[values.length - 1].value;
    const valueRange = maxValue - minValue;

    // 각 값의 비율에 따라 위치 계산
    const positions = values.map((v) => {
      const ratio = valueRange === 0 ? 0 : (v.value - minValue) / valueRange;
      return HORIZONTAL_PADDING + ratio * USABLE_WIDTH;
    });

    return positions;
  }, [values, HORIZONTAL_PADDING, USABLE_WIDTH]);

  // 회색 배경 위치 (첫 닷 바깥쪽 가장자리 - 2px, 마지막 닷 바깥쪽 가장자리 + 2px)
  // dot은 6px이므로 중심에서 좌우로 3px
  const grayBgLeft = dotPositions[0] - 3 - 2; // dot left edge - 2px
  const grayBgRight =
    CONTAINER_WIDTH - (dotPositions[dotPositions.length - 1] + 3 + 2); // container - (dot right edge + 2px)

  // 액티브 영역 위치 (회색바와 동일하게 닷 바깥쪽 가장자리 - 2px / + 2px)
  const activeLeft = dotPositions[selectedRange[0]] - 3 - 2; // dot left edge - 2px
  const activeRight =
    CONTAINER_WIDTH - (dotPositions[selectedRange[1]] + 3 + 2); // container - (dot right edge + 2px)

  // 마우스 위치로부터 가장 가까운 dot index 찾기
  const findClosestDotIndex = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return 0;

      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;

      let closestIndex = 0;
      let minDistance = Infinity;

      dotPositions.forEach((pos, index) => {
        const distance = Math.abs(relativeX - pos);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    },
    [dotPositions]
  );

  // 드래그 중 마우스 이동 처리
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingIndex === null) return;

      const newIndex = findClosestDotIndex(e.clientX);
      const currentRange = selectedRange || [0, values.length - 1];

      // 시작점을 드래그 중인 경우
      if (draggingIndex === currentRange[0]) {
        if (newIndex <= currentRange[1]) {
          handleRangeChange(newIndex, currentRange[1]);
        }
      }
      // 끝점을 드래그 중인 경우
      else if (draggingIndex === currentRange[1]) {
        if (newIndex >= currentRange[0]) {
          handleRangeChange(currentRange[0], newIndex);
        }
      }
    },
    [
      draggingIndex,
      selectedRange,
      values.length,
      findClosestDotIndex,
      handleRangeChange,
    ]
  );

  // 드래그 종료
  const handleMouseUp = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  // 드래그 이벤트 리스너 등록/해제
  React.useEffect(() => {
    if (draggingIndex !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggingIndex, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`flex items-center w-[822px] gap-[26px] rounded-[12px] bg-white mt-[10px]`}
    >
      {/* Range Input Container */}
      <div
        ref={containerRef}
        className="h-[60px] relative"
        style={{ width: `${CONTAINER_WIDTH}px` }}
      >
        <div className={`relative size-full`}>
          {/* Background */}
          <div className="absolute bg-white inset-0 rounded-[12px]" />

          {/* Range Labels */}
          {values.map((value, index) => {
            const dotLeft = dotPositions[index];
            const isFirst = index === 0;
            const isLast = index === values.length - 1;

            return (
              <div
                key={index}
                className={`absolute flex flex-col justify-center leading-[0] not-italic text-[14px] text-black ${
                  isFirst ? "text-left" : isLast ? "text-right" : "text-center"
                }`}
                style={{
                  left: isFirst
                    ? `${dotLeft}px`
                    : isLast
                    ? "auto"
                    : `${dotLeft}px`,
                  right: isLast ? `${CONTAINER_WIDTH - dotLeft}px` : "auto",
                  transform: !isFirst && !isLast ? "translateX(-50%)" : "none",
                  top: "53.33%",
                  bottom: "20%",
                }}
              >
                <p className="leading-[20px]">{value.label}</p>
              </div>
            );
          })}

          {/* Gray Background Track */}
          <div
            className="absolute bg-[#eef0f3] rounded-[10px]"
            style={{
              top: "14px",
              height: "10px",
              left: `${grayBgLeft}px`,
              right: `${grayBgRight}px`,
            }}
          />

          {/* Active Range Track */}
          <div
            className="absolute bg-[#0106ff] rounded-[10px]"
            style={{
              top: "14px",
              height: "10px",
              left: `${activeLeft}px`,
              right: `${activeRight}px`,
            }}
          />

          {/* Range Handles (Dots) */}
          {values.map((_, index) => {
            const dotLeft = dotPositions[index];
            // 버튼 left = 닷 중심 - 버튼 너비 / 2 = dotLeft - 10px
            const buttonLeft = dotLeft - 10;

            return (
              <button
                key={index}
                className="absolute cursor-pointer z-10 w-[20px] h-[20px] flex items-center justify-center"
                style={{
                  left: `${buttonLeft}px`,
                  top: "9px",
                  opacity: 1,
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  const currentRange = selectedRange || [0, values.length - 1];

                  // 범위의 가장자리 dot만 드래그 가능
                  if (index === currentRange[0] || index === currentRange[1]) {
                    setDraggingIndex(index);
                  }
                }}
                onClick={() => {
                  const currentRange = selectedRange || [0, values.length - 1];

                  // If clicking outside current range, expand range
                  if (index < currentRange[0]) {
                    handleRangeChange(index, currentRange[1]);
                  } else if (index > currentRange[1]) {
                    handleRangeChange(currentRange[0], index);
                  } else {
                    // Clicking inside range (including edges)
                    // Determine which edge to move based on distance
                    const distToStart = index - currentRange[0];
                    const distToEnd = currentRange[1] - index;

                    if (distToStart < distToEnd) {
                      // Closer to start - move start to this point
                      handleRangeChange(index, currentRange[1]);
                    } else if (distToEnd < distToStart) {
                      // Closer to end - move end to this point
                      handleRangeChange(currentRange[0], index);
                    } else {
                      // Equal distance - move start (arbitrary choice)
                      handleRangeChange(index, currentRange[1]);
                    }
                  }
                }}
              >
                <div className="rounded-full bg-white w-[6px] h-[6px]" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-[1px] bg-[#D5D8DC] h-[32px]   " />
      {/* Send Button */}
      <button
        onClick={() => {
          if (onRangeSelect) {
            // Convert selected range to text
            const startValue = values[selectedRange[0]]?.label;
            const endValue = values[selectedRange[1]]?.label;
            const rangeText =
              startValue === endValue
                ? startValue
                : `${startValue} ~ ${endValue}`;
            onRangeSelect(rangeText);
          } else {
            onSend();
          }
        }}
        className={`bg-[#0106ff] box-border flex items-center justify-center rounded-[19px] hover:bg-[#0106ff]/90 transition-colors p-[9px] size-[38px]`}
      >
        <div className="absolute h-[20px]  w-[20px]">
          <img alt="" className="block max-w-none size-full" src={checkIcon} />
        </div>
      </button>
    </div>
  );
};

export default AuxRangeInput;
