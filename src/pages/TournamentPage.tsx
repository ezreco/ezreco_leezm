import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { useNavigate } from "react-router-dom";
import tLines from "@/assets/icons/tLines.png";
import TournamentComparisonCard from "../components/TournamentComparisonCard";
import { selectWinner } from "../store/slices/tournamentSlice";

interface Product {
  id: string;
  title: string;
  image: string;
  highlightedDifferentiators?: { text: string; isHighlighted: boolean }[];
  highlightedSpecs?: { text: string; isHighlighted: boolean }[];
}

const TournamentPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { allProducts, semifinalWinners, currentMatchIndex, finalWinner } = useSelector(
    (state: RootState) => state.tournament
  );

  // Get 2 products for current match based on currentMatchIndex
  let product1: Product | undefined;
  let product2: Product | undefined;

  if (currentMatchIndex === 0) {
    product1 = allProducts[0];
    product2 = allProducts[1];
  } else if (currentMatchIndex === 1) {
    product1 = allProducts[2];
    product2 = allProducts[3];
  } else if (currentMatchIndex === 2) {
    product1 = semifinalWinners[0];
    product2 = semifinalWinners[1];
  }

  const handleProductSelect = (productId: string) => {
    const selectedProduct =
      currentMatchIndex === 0 || currentMatchIndex === 1
        ? allProducts.find((p) => p.id === productId)
        : semifinalWinners.find((p) => p.id === productId);

    if (!selectedProduct) return;

    // Dispatch selectWinner action
    dispatch(selectWinner(selectedProduct));
  };

  // 토너먼트 완료 시 2초 후 결과 페이지로 이동
  useEffect(() => {
    if (currentMatchIndex === 3 && finalWinner) {
      const timer = setTimeout(() => {
        navigate("/tournament-result");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentMatchIndex, finalWinner, navigate]);

  return (
    <div className="w-full h-screen relative bg-[#f8f8fa]">
      {/* Main Content Area */}
      <div className="relative w-full h-full flex flex-col items-center">
        {/* Title */}
        <div className="mt-[60px] mb-[24px]">
          <h1 className="text-[18px] leading-[24px] font-semibold text-center text-black">
            EZ 토너먼트
          </h1>
        </div>

        {/* Tournament Bracket Visualization */}
        <div className="mb-[52px]">
          <div className="flex flex-col items-center gap-[11px]">
            <img src={tLines} className="absolute top-[186px]" />
            {/* Top - winner */}
            <div
              className={`w-[102px] h-[52px] border border-[#d5d8dc] rounded-[4px] flex items-center justify-center overflow-hidden transition-all duration-500 ${
                currentMatchIndex === 3 ? "bg-white" : "bg-[#eef0f3]"
              }`}
            >
              {finalWinner && (
                <img
                  src={finalWinner.image}
                  alt=""
                  className="w-[72px] h-[48px] object-contain"
                />
              )}
            </div>

            {/* Middle row - 2 semifinal winners */}
            <div className="flex gap-[90px] relative">
              {/* 4강 승자 1 */}
              <div
                className={`w-[52px] h-[30px] border border-[#d5d8dc] rounded-[4px] flex items-center justify-center overflow-hidden transition-all duration-500 ${
                  currentMatchIndex >= 1 ? "bg-white" : "bg-[#eef0f3]"
                }`}
              >
                {semifinalWinners[0] && (
                  <img
                    src={semifinalWinners[0].image}
                    alt=""
                    className="w-[36px] h-[24px] object-contain"
                  />
                )}
              </div>
              {/* 4강 승자 2 */}
              <div
                className={`w-[52px] h-[30px] border border-[#d5d8dc] rounded-[4px] flex items-center justify-center overflow-hidden transition-all duration-500 ${
                  currentMatchIndex >= 2 ? "bg-white" : "bg-[#eef0f3]"
                }`}
              >
                {semifinalWinners[1] && (
                  <img
                    src={semifinalWinners[1].image}
                    alt=""
                    className="w-[36px] h-[24px] object-contain"
                  />
                )}
              </div>
            </div>

            {/* Bottom row - 4 products */}
            <div className="flex gap-[30px]">
              {/* 4강 1차 매치 */}
              <div className="flex gap-[8px]">
                <div
                  className={`w-[52px] h-[30px] border border-[#d5d8dc] rounded-[5px] flex items-center justify-center overflow-hidden transition-all duration-500 ${
                    currentMatchIndex === 0 ? "bg-white" : "bg-[#eef0f3]"
                  }`}
                >
                  {allProducts[0] && (
                    <img
                      src={allProducts[0].image}
                      alt=""
                      className="w-[36px] h-[24px] object-contain"
                    />
                  )}
                </div>
                <div
                  className={`w-[52px] h-[30px] border border-[#d5d8dc] rounded-[5px] flex items-center justify-center overflow-hidden transition-all duration-500 ${
                    currentMatchIndex === 0 ? "bg-white" : "bg-[#eef0f3]"
                  }`}
                >
                  {allProducts[1] && (
                    <img
                      src={allProducts[1].image}
                      alt=""
                      className="w-[36px] h-[29px] object-contain"
                    />
                  )}
                </div>
              </div>
              {/* 4강 2차 매치 */}
              <div className="flex gap-[8px]">
                <div
                  className={`w-[52px] h-[30px] border border-[#d5d8dc] rounded-[4px] flex items-center justify-center overflow-hidden transition-all duration-500 ${
                    currentMatchIndex === 1 ? "bg-white" : "bg-[#eef0f3]"
                  }`}
                >
                  {allProducts[2] && (
                    <img
                      src={allProducts[2].image}
                      alt=""
                      className="w-[36px] h-[24px] object-contain"
                    />
                  )}
                </div>
                <div
                  className={`w-[52px] h-[30px] border border-[#d5d8dc] rounded-[4px] flex items-center justify-center overflow-hidden transition-all duration-500 ${
                    currentMatchIndex === 1 ? "bg-white" : "bg-[#eef0f3]"
                  }`}
                >
                  {allProducts[3] && (
                    <img
                      src={allProducts[3].image}
                      alt=""
                      className="w-[36px] h-[24px] object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Comparison Cards */}
        <div className="flex gap-[32px] w-full justify-center px-[24px]">
          {/* Product Card 1 */}
          {product1 && (
            <TournamentComparisonCard
              title={product1.title}
              image={product1.image}
              differentiators={product1.highlightedDifferentiators}
              specs={product1.highlightedSpecs}
              onSelect={() => handleProductSelect(product1.id)}
            />
          )}

          {/* Product Card 2 */}
          {product2 && (
            <TournamentComparisonCard
              title={product2.title}
              image={product2.image}
              differentiators={product2.highlightedDifferentiators}
              specs={product2.highlightedSpecs}
              onSelect={() => handleProductSelect(product2.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentPage;
