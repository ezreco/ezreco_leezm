import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Icon assets
import icSearch from "@/assets/icons/ic_search.svg";

interface ProductModel {
  id: string;
  name: string;
}

interface BrandSection {
  brand: string;
  models: ProductModel[];
}

const EZWikiPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<"TV" | "모바일">("TV");
  const [activeYear, setActiveYear] = useState("2025");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - 실제로는 API에서 가져올 데이터
  const brandSections: BrandSection[] = [
    {
      brand: "삼성",
      models: [
        { id: "1", name: "모델 넘버 AAA 1" },
        { id: "2", name: "모델 넘버 AAA 2" },
        { id: "3", name: "모델 넘버 AAA 3" },
      ],
    },
    {
      brand: "LG",
      models: [
        { id: "4", name: "모델 넘버 BBB 1" },
        { id: "5", name: "모델 넘버 BBB 2" },
        { id: "6", name: "모델 넘버 BBB 3" },
      ],
    },
  ];

  const years = ["2025", "2024", "2023"];

  return (
    <div className="flex h-screen  p-[60px]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center">
          <div className="text-[18px] font-semibold text-[#000000]">EZWiki</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Primary Tabs and Search Box Row */}
          <div className="flex items-center justify-between pt-[42px] pb-[8px]">
            {/* Primary Tabs (TV / 모바일) */}
            <div className="flex gap-0">
              <button
                onClick={() => setActiveCategory("TV")}
                className={`w-[104px] h-[24px] text-[18px] text-center ${
                  activeCategory === "TV"
                    ? "text-[#0106ff] font-semibold"
                    : "text-[#989ba2] font-normal"
                }`}
              >
                TV
              </button>
              <button
                onClick={() => setActiveCategory("모바일")}
                className={`w-[104px] h-[24px] text-[18px] text-center ${
                  activeCategory === "모바일"
                    ? "text-[#0106ff] font-semibold"
                    : "text-[#989ba2] font-normal"
                }`}
              >
                모바일
              </button>
            </div>

            {/* Search Box */}
            <div className="w-[398px] h-[44px] bg-white border border-[#D5D8DC] border-[1px] rounded-[24px] flex items-center  p-[1px]">
              <input
                type="text"
                placeholder="공통정보 내 모델 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full px-[16px] text-[14px] text-[#252525] border-[0px]  rounded-[24px] placeholder:text-[#989ba2]"
              />
              <div className="w-[20px] h-[20px] pointer-events-none mr-[16px]">
                <img
                  alt=""
                  className="block w-full h-full"
                  src={icSearch}
                  style={{
                    filter:
                      "invert(67%) sepia(6%) saturate(343%) hue-rotate(182deg) brightness(92%) contrast(85%)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Horizontal Lines for Tabs */}
          <div className="relative mb-[25px]">
            {activeCategory === "TV" && (
              <div className="absolute left-0 top-0 w-[104px] h-[1px] bg-[#0106ff]" />
            )}
            {activeCategory === "모바일" && (
              <div className="absolute left-[104px] top-0 w-[104px] h-[1px] bg-[#0106ff]" />
            )}
            <div className="w-full h-[1px] bg-[#d5d8dc]" />
          </div>

          {/* Secondary Tabs (Years) */}
          <div className="flex items-center gap-[20px] mb-[24px]">
            {years.map((year, index) => (
              <React.Fragment key={year}>
                <button
                  onClick={() => setActiveYear(year)}
                  className={`w-[104px] h-[24px] text-[14px] text-center ${
                    activeYear === year
                      ? "text-[#252525] font-semibold"
                      : "text-[#989ba2] font-normal"
                  }`}
                >
                  {year}
                </button>
                {index < years.length - 1 && (
                  <div className="w-[1px] h-[16px] bg-[#d5d8dc]" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Brand Sections */}
          <div className="flex flex-col gap-[16px] pb-[60px]">
            {brandSections.map((section) => (
              <div
                key={section.brand}
                className="bg-[#eef0f3] rounded-[20px]  flex items-start px-[36px] py-[36px]"
              >
                {/* Brand Name */}
                <div className="text-[16px] font-semibold text-[#000000] w-[28px] mr-[24px] leading-[26px]">
                  {section.brand}
                </div>

                {/* Models List */}
                <div className="flex flex-col gap-[22px] flex-1">
                  {section.models.map((model) => (
                    <div
                      key={model.id}
                      className="text-[16px] text-[#252525] font-normal leading-[26px] cursor-pointer hover:text-[#0106ff] transition-colors"
                      onClick={() => navigate(`/ezwiki/${model.id}`)}
                    >
                      {model.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EZWikiPage;
