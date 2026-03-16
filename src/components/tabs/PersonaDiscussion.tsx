import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store";
import ProductCard from "../ProductCard";

const PersonaDiscussion: React.FC = () => {
  const navigate = useNavigate();
  const { topicInput, productList } = useSelector(
    (state: RootState) => state.personaDiscussion
  );

  const handleQuickStart = () => {
    navigate("/persona-discussion-result");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative ">
      {/* Main Content Container */}
      <div className="flex flex-col items-center gap-[20px] w-full -translate-y-1/4 ">
        {/* */}
        <div>
          {/* Title - 토론 매칭 리스트 */}
          <div className="flex flex-col justify-center leading-[0] text-black text-[18px] text-center font-semibold mb-[8px]">
            <div className="leading-[24px]">토론 매칭 리스트</div>
          </div>

          {/* Topic Display */}
          {productList.length === 0 ? (
            <div className="flex gap-[6px] items-center justify-center leading-[0] text-[24px]">
              <div
                className="flex flex-col justify-center font-semibold bg-clip-text"
                style={{
                  WebkitTextFillColor: "transparent",
                  backgroundImage:
                    "linear-gradient(to right, #7850ff, #37d7ff)",
                }}
              >
                <div className="leading-[32px] whitespace-pre">주제 : </div>
              </div>
              <div className="flex flex-col font-normal justify-center text-[#989ba2] text-center">
                <div className="leading-[32px] whitespace-pre">
                  주제를 알려주세요
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-[6px] items-center justify-center leading-[0] text-[24px]">
              <div
                className="flex flex-col justify-center font-semibold text-black bg-clip-text"
                style={{
                  WebkitTextFillColor: "transparent",
                  backgroundImage:
                    "linear-gradient(to right, #7850ff, #37d7ff)",
                }}
              >
                <div className="leading-[32px] whitespace-pre">주제 : </div>
              </div>
              <div
                className="flex flex-col font-normal justify-center text-black text-center bg-clip-text"
                style={{
                  WebkitTextFillColor: "transparent",
                  backgroundImage:
                    "linear-gradient(to right, #7850ff, #37d7ff)",
                }}
              >
                <div className="leading-[32px]">{topicInput}</div>
              </div>
            </div>
          )}
        </div>
        {/* Product Cards */}
        <div className="flex gap-[24px] flex-wrap justify-center mt-[24px]">
          {productList.length === 0 ? (
            // Empty Card
            <div className="relative w-[206px] h-[228px]">
              <div className="absolute inset-0 bg-white border border-[#d5d8dc] rounded-[20px] p-[4px]">
                <div className="w-[198px] h-[138px] bg-[#f8f8fa] rounded-[16px]" />
              </div>
              <div className="absolute left-1/2 top-[184px] transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-[#989ba2] text-[16px] leading-[26px] font-normal text-center w-[178px]">
                  제품 1
                </p>
              </div>
            </div>
          ) : (
            productList.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                image={product.image}
              />
            ))
          )}
        </div>

        <div className="flex items-center justify-center h-[26px] mt-[10px]">
          <span
            className="text-[16px] leading-[26px] font-normal text-center"
            style={{
              color: "#252525",
            }}
          >
            최대 3개까지 토론이 가능해요
          </span>
        </div>

        {/* Quick Start Button */}
        <div className="flex flex-col items-center justify-center mt-[54px]">
          {productList.length >= 2 && (
            <div className="relative w-[180px] h-[48px]">
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#7850ff] to-[#37d7ff] rounded-[24px]" />
              {/* White Background Button */}
              <button
                onClick={handleQuickStart}
                className="absolute inset-[1px] bg-white box-border flex items-center justify-center rounded-[23px] hover:bg-[#f8f8fa] transition-colors"
              >
                <p className="text-black text-[16px] leading-[26px] font-semibold text-center">
                  토론 시작
                </p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonaDiscussion;
