import React, { useState } from "react";
import { createPortal } from "react-dom";
import icClose from "@/assets/icons/ic_cancel.svg";
import icSearch from "@/assets/icons/ic_search.svg";

interface SearchResult {
  id: string;
  category: string;
  title: string;
  date: string;
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock search results
const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    category: "스마트 추천",
    title: "TV 가성비 분석",
    date: "9월 9일",
  },
  {
    id: "2",
    category: "스마트 비교",
    title: "TV 추천 비교 80인치",
    date: "9월 6일",
  },
  {
    id: "3",
    category: "페르소나 토론",
    title: "거실 TV 추천 : OLED vs Neo QLED",
    date: "9월 4일",
  },
  {
    id: "4",
    category: "페르소나 토론",
    title: "밝은 거실 TV 추천",
    date: "8월 20일",
  },
  {
    id: "5",
    category: "스마트 추천",
    title: "TV 추천 비교 80인치",
    date: "8월 9일",
  },
  {
    id: "6",
    category: "스마트 비교",
    title: "거실 TV 추천 : Mini-LED vs OLED",
    date: "8월 1일",
  },
  {
    id: "7",
    category: "스마트 비교",
    title: "거실 TV 추천 : OLED vs Neo QLED",
    date: "7월 2일",
  },
  {
    id: "8",
    category: "페르소나 토론",
    title: "TV 추천 비교 80인치",
    date: "7월 14일",
  },
  {
    id: "9",
    category: "스마트 추천",
    title: "TV 가성비 분석",
    date: "6월 10일",
  },
];

const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
  const [searchText, setSearchText] = useState("");

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // Filter results based on search text
  const filteredResults =
    searchText.trim().length > 0
      ? mockSearchResults.filter(
          (result) =>
            result.title.toLowerCase().includes(searchText.toLowerCase()) ||
            result.category.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];

  if (!isOpen) return null;

  const dialogContent = (
    <>
      {/* Backdrop - Dim */}
      <div
        className="fixed inset-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", zIndex: 10000 }}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[876px] h-[680px] bg-white rounded-[20px]"
        style={{ zIndex: 10001 }}
      >
        {/* Header - Title and Close Button */}
        <div className="absolute left-[36px] right-[36px] top-[15px] flex items-center justify-between">
          {/* Title */}
          <p className="text-black text-[24px] leading-[32px] font-semibold">
            검색
          </p>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <div className="w-full h-full">
              <img src={icClose} alt="Close" className="w-full h-full" />
            </div>
          </button>
        </div>

        {/* Search Input */}
        <div className="absolute left-[36px] right-[36px] top-[88px]">
          <div className="relative w-full h-[56px] border-b border-[#eef0f3] flex items-center">
            {/* Input Field */}
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="TV"
              className="flex-1 bg-transparent border-none outline-none text-[16px] leading-[26px] text-black placeholder-[#eef0f3]"
            />
            {/* Search Icon */}
            <div className="w-[20px] h-[20px]">
              <img src={icSearch} alt="Search" className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Search Results List */}
        {searchText.trim().length > 0 && filteredResults.length > 0 && (
          <div className="absolute left-[36px] top-[164px] w-[820px] h-[480px] overflow-y-auto pr-[16px]">
            <div className="flex flex-col">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center py-[0px] px-[10px] hover:bg-[#f8f8fa] transition-colors cursor-pointer"
                >
                  {/* Category */}
                  <div className="w-[100px] shrink-0">
                    <p className="text-[#989ba2] text-[14px] leading-[22px] font-normal">
                      {result.category}
                    </p>
                  </div>
                  {/* Title */}
                  <div className="flex-1 px-[16px]">
                    <p className="text-[#252525] text-[16px] leading-[26px] font-normal">
                      {result.title}
                    </p>
                  </div>
                  {/* Date */}
                  <div className="w-[70px] shrink-0 text-right">
                    <p className="text-[#989ba2] text-[14px] leading-[22px] font-normal">
                      {result.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {searchText.trim().length > 0 && filteredResults.length === 0 && (
          <div className="absolute left-[36px] right-[36px] top-[164px] flex justify-center pt-[40px]">
            <p className="text-[#989ba2] text-[16px] leading-[26px]">
              검색 결과가 없습니다.
            </p>
          </div>
        )}
      </div>
    </>
  );

  return createPortal(dialogContent, document.body);
};

export default SearchDialog;
