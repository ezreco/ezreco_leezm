import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store";
import { setCategory } from "../../store/slices/tournamentSlice";
import SecondaryTabGroup from "../SecondaryTabGroup";
import ProductCard from "../ProductCard";
import tourImg from "@/assets/icons/tourmentIcon.png";

const Tournament: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { category, productList } = useSelector(
    (state: RootState) => state.tournament
  );

  const categoryTabs = [
    { id: "TV", label: "TV" },
    { id: "모바일", label: "모바일" },
  ];

  return (
    <div className="flex flex-col items-center w-full justify-center h-full ">
      <div className="flex items-center h-[72px] mb-[16px] ">
        <img src={tourImg} className="w-[112px] h-[72px]" />
      </div>

      <div className="flex items-center mb-[42px] h-[24px]">
        <div className="text-[18px] leading-[24px]">
          전자제품 이상형 월드컵으로 내가 진짜 원하는 제품을 골라보세요.
        </div>
      </div>
      {/* Category Tabs */}
      <div className="mb-[24px]">
        <SecondaryTabGroup
          tabs={categoryTabs}
          activeTabId={category}
          onTabChange={(tabId) =>
            dispatch(setCategory(tabId as "TV" | "모바일"))
          }
        />
      </div>

      {/* Product Cards */}
      <div className="flex flex-col items-center justify-center w-full pb-[250px] gap-[44px]">
        {productList.length === 0 ? (
          /* Empty Card */
          <ProductCard isEmpty={true} emptyText="제품 1" />
        ) : (
          <>
            {/* Product List - 4개의 카드를 한 행으로 표시 */}
            <div className="flex gap-[24px]">
              {productList.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  showRemoveButton={true}
                  image={product.image}
                />
              ))}
            </div>
          </>
        )}

        {/* 비교 시작 Button */}
        <div className="relative w-[180px] h-[48px] mt-[70px]">
          {productList.length >= 4 && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#7850ff] to-[#37d7ff] rounded-[24px]">
              <button
                className="absolute inset-[1px] bg-white box-border flex items-center justify-center rounded-[23px] hover:bg-[#f8f8fa] transition-colors"
                onClick={() => navigate("/tournament")}
              >
                <div className="text-black text-[16px] leading-[26px] font-semibold text-center">
                  비교 시작
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tournament;
