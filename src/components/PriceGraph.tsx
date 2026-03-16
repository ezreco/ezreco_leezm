import React, { useEffect, useRef } from "react";
import type { PriceAnalysis } from "../store/aiRecommendResultStore";

interface PriceGraphProps {
  width: number;
  height: number;
  priceAnalysis?: PriceAnalysis;
  dateRange?: string[];
  showOptimalBuyLine?: boolean;
  optimalBuyDate?: string;
  horizontalPadding?: number;
}

const PriceGraph: React.FC<PriceGraphProps> = ({
  width,
  height,
  priceAnalysis,
  dateRange = [],
  showOptimalBuyLine = false,
  optimalBuyDate,
  horizontalPadding = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 그래프 영역 계산 (좌우 패딩 제외)
    const graphWidth = width - horizontalPadding * 2;

    // 그리드 그리기 (세로 라인) - 패딩 안쪽에 그리기
    if (dateRange.length > 0) {
      ctx.save();
      ctx.strokeStyle = "#d5d8dc";
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      dateRange.forEach((_, index) => {
        const x = horizontalPadding + (index / (dateRange.length - 1)) * graphWidth;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      });
      ctx.restore();
    }

    // 최적의 구매 시점 라인 (파란색) - 패딩 안쪽에 그리기
    if (showOptimalBuyLine && optimalBuyDate && dateRange.length > 0) {
      const optimalIndex = dateRange.indexOf(optimalBuyDate);
      if (optimalIndex !== -1) {
        const x = horizontalPadding + (optimalIndex / (dateRange.length - 1)) * graphWidth;
        ctx.save();
        ctx.strokeStyle = "#0106ff";
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.restore();
      }
    }

    if (!priceAnalysis) return;

    const { highestPrice, lowestPrice, priceHistory } = priceAnalysis;
    const priceRange = highestPrice - lowestPrice;

    // 상하단 여백 없이 전체 높이 사용
    const topPadding = 0;
    const bottomPadding = 0;
    const graphHeight = height - topPadding - bottomPadding;

    // 가격을 Y 좌표로 변환하는 함수
    const priceToY = (price: number): number => {
      if (priceRange === 0) return topPadding + graphHeight / 2;
      const ratio = (price - lowestPrice) / priceRange;
      // ratio가 0이면 lowestPrice (하단), 1이면 highestPrice (상단)
      return bottomPadding + graphHeight - ratio * graphHeight;
    };

    // 점선 함수
    const drawDashedLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: string,
      dashPattern: number[] = [4, 4]
    ) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash(dashPattern);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    };

    // 역대최고가 점선 (녹색) - 피그마 패턴: [4, 4] - 패딩 안쪽에만 그리기
    const highestY = priceToY(highestPrice);
    drawDashedLine(horizontalPadding, highestY, width - horizontalPadding, highestY, "#00d694", [4, 4]);

    // 역대최저가 점선 (빨간색) - 피그마 패턴: [4, 4] - 패딩 안쪽에만 그리기
    const lowestY = priceToY(lowestPrice);
    drawDashedLine(horizontalPadding, lowestY, width - horizontalPadding, lowestY, "#f85057", [4, 4]);

    // 가격 변동 라인 그리기 (시계열 라인그래프)
    if (priceHistory.length > 0 && dateRange.length > 0) {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.setLineDash([]);

      // 그리드 간격 계산
      const gridInterval = graphWidth / (dateRange.length - 1);
      const offsetRatio = 1 / 10; // 그리드 간격의 1/10

      // 날짜별로 그룹화
      const priceByDate = new Map<string, number>();
      priceHistory.forEach((item) => {
        priceByDate.set(item.date, item.price);
      });

      // dateRange 순서대로 그리기 (price가 -1인 경우 스킵)
      const points: { x: number; y: number; price: number }[] = [];
      dateRange.forEach((date, index) => {
        const price = priceByDate.get(date);
        if (price !== undefined && price !== -1) {
          // 각 날짜의 그리드 위치에서 간격의 1/10 오른쪽
          const baseX = (index / (dateRange.length - 1)) * graphWidth;
          const x = horizontalPadding + baseX + gridInterval * offsetRatio;
          const y = priceToY(price);
          points.push({ x, y, price });
        }
      });

      // 시작점을 x=0 (horizontalPadding)으로 추가
      if (points.length > 0) {
        const firstPoint = points[0];
        points.unshift({
          x: horizontalPadding,
          y: firstPoint.y,
          price: firstPoint.price,
        });
      }

      // 연결선 그리기
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];

        // 가격 상승 구간은 녹색, 하락/평평 구간은 빨간색
        if (next.price > current.price) {
          ctx.strokeStyle = "#00d694";
        } else {
          ctx.strokeStyle = "#f85057";
        }

        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }

      ctx.restore();
    }
  }, [width, height, priceAnalysis, dateRange, showOptimalBuyLine, optimalBuyDate, horizontalPadding]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0"
      style={{ backgroundColor: 'transparent' }}
    />
  );
};

export default PriceGraph;
