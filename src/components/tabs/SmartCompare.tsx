import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  removeProductFromList,
  setShowResult,
} from "../../store/slices/smartCompareSlice";
import SmartCompareResult from "./SmartCompareResult";
import ProductCard from "../ProductCard";

import icRight from "@/assets/icons/ic_right.png";

const SmartCompare: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { productList, showResult } = useSelector(
    (state: RootState) => state.smartCompare
  );

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [showError, setShowError] = useState(false);
  const itemsPerPage = 5;

  // 제품 개수가 변경되면 페이지를 조정
  useEffect(() => {
    const totalPages = Math.ceil(productList.length / itemsPerPage);
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [productList.length, currentPage]);

  // 제품 개수가 5개 이하로 변경되면 에러 메시지 숨김
  useEffect(() => {
    if (productList.length <= 5) {
      setShowError(false);
    }
  }, [productList.length]);

  const handleRemoveProduct = (productId: string) => {
    dispatch(removeProductFromList(productId));
  };

  const handleCompareStart = () => {
    if (productList.length > 5) {
      setShowError(true);
      return;
    }
    dispatch(setShowResult(true));
  };

  // 결과 화면 표시
  if (showResult) {
    return <SmartCompareResult />;
  }

  // 페이지네이션 계산
  const totalPages = Math.ceil(productList.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = productList.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-[20px]">
      <div className="flex flex-col items-center justify-center w-full  -translate-y-1/12 h-[700px]">
        {/* Product Cards */}
        {productList.length === 0 ? (
          <>
            {/* Empty Card */}
            <div className="relative w-[206px] h-[228px]">
              <div className="absolute inset-0 bg-white border border-[#d5d8dc] rounded-[20px] p-[4px]">
                <div className="w-[198px] h-[138px] bg-[#f8f8fa] rounded-[16px]" />
              </div>
              <div className="absolute left-1/2 top-[184px] transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-[#989ba2] text-[16px] leading-[26px] font-['One_UI_Sans_GUI:400_Regular',_sans-serif] text-center w-[178px]">
                  제품 1
                </p>
              </div>
            </div>
          </>
        ) : productList.length === 1 ? (
          <>
            {/* Product List with Empty Card */}
            <div className="flex gap-[24px] flex-wrap justify-center">
              {/* First Product */}
              {productList.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  image={product.image}
                  showRemoveButton={true}
                  onRemove={() => handleRemoveProduct(product.id)}
                />
              ))}

              {/* Empty Card */}
              <ProductCard isEmpty={true} emptyText="제품 2" />
            </div>
          </>
        ) : productList.length < 6 ? (
          <>
            {/* Product List - 6개 미만 */}
            <div className="flex gap-[24px] flex-wrap justify-center">
              {productList.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  image={product.image}
                  showRemoveButton={true}
                  onRemove={() => handleRemoveProduct(product.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Product List - 6개 이상 (페이징) */}
            <div className="relative flex items-center justify-center gap-[24px]">
              {/* Left Arrow Button - 1페이지 이상일 때 표시 */}
              {currentPage > 0 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="hover:opacity-70 transition-opacity mr-[30px]"
                >
                  <img
                    src={icRight}
                    alt="이전"
                    className="w-[24px] h-[24px] transform rotate-180"
                  />
                </button>
              )}

              <div
                className={`flex gap-[24px] flex-wrap justify-center transition-transform ${
                  currentPage > 0 && currentPage < totalPages - 1
                    ? ""
                    : currentPage > 0
                    ? "-translate-x-[40px]"
                    : currentPage < totalPages - 1
                    ? "translate-x-[40px]"
                    : ""
                }`}
              >
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.title}
                    image={product.image}
                    showRemoveButton={true}
                    onRemove={() => handleRemoveProduct(product.id)}
                  />
                ))}
              </div>

              {/* Right Arrow Button - 마지막 페이지가 아닐 때 표시 */}
              {currentPage < totalPages - 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="hover:opacity-70 transition-opacity ml-[30px]"
                >
                  <img src={icRight} alt="다음" className="w-[24px] h-[24px]" />
                </button>
              )}
            </div>
          </>
        )}

        {/* Page Indicator, Info Text & Compare Button - Always maintain height */}
        <div className="flex flex-col items-center ">
          {/* Page Dots - 항상 높이 유지 */}
          <div className="flex gap-[8px] items-center h-[8px] mt-[20px]">
            {productList.length >= 6 &&
              Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-[8px] h-[8px] rounded-full transition-colors ${
                    index === currentPage ? "bg-[#989ba2]" : "bg-[#d5d8dc]"
                  }`}
                />
              ))}
          </div>

          {/* Info Text - 항상 높이 유지 */}
          {productList.length < 2 && (
            <div className="flex items-center justify-center h-[26px]">
              <span
                className="text-[#252525] text-[16px] leading-[26px] font-normal text-center"
                style={{
                  visibility: productList.length >= 2 ? "hidden" : "visible",
                }}
              >
                최대 5개까지 비교 가능해요
              </span>
            </div>
          )}

          {/* Compare Button - 항상 높이 유지 */}
          <div className="flex flex-col items-center justify-center h-[48px] mt-[72px]">
            <div
              className="relative w-[180px] h-[48px]"
              style={{
                visibility: productList.length >= 2 ? "visible" : "hidden",
              }}
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#7850ff] to-[#37d7ff] rounded-[24px]" />
              {/* White Background Button */}
              <button
                onClick={handleCompareStart}
                className="absolute inset-[1px] bg-white box-border flex items-center justify-center rounded-[23px] hover:bg-[#f8f8fa] transition-colors"
                disabled={productList.length < 2}
              >
                <p className="text-black text-[16px] leading-[26px] font-semibold text-center">
                  비교 시작
                </p>
              </button>
            </div>
          </div>

          {/* Info Text2 - 항상 높이 유지 */}
          <div className="flex items-center justify-center h-[26px] mt-[16px]">
            <span
              className="text-[16px] leading-[26px] font-normal text-center"
              style={{
                visibility: productList.length >= 2 ? "visible" : "hidden",
                color: showError ? "#F85057" : "#252525",
              }}
            >
              {showError
                ? "최대 5개까지 비교 가능해요"
                : "스펙 비교를 시작하세요"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartCompare;
