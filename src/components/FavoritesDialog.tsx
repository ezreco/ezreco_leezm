import React, { useState } from "react";
import { createPortal } from "react-dom";
import icClose from "@/assets/icons/ic_cancel.svg";
import icFavoriteFull from "@/assets/icons/ic_fav_full.svg";
import icFavorite from "@/assets/icons/ic_favorite.svg";
import icOrder from "@/assets/icons/ic_order.svg";

interface FavoriteItem {
  id: string;
  text: string;
  isFavorited: boolean;
}

interface FavoritesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Initial favorites data
const initialFavorites: FavoriteItem[] = [
  { id: "1", text: "TV 가성비 분석", isFavorited: true },
  { id: "2", text: "TV 추천 비교 80인치", isFavorited: true },
  { id: "3", text: "TV 구매 상담", isFavorited: true },
  { id: "4", text: "거실 TV 추천 : OLED vs Neo QLED", isFavorited: true },
  { id: "5", text: "밝은 거실 TV 추천", isFavorited: true },
  { id: "6", text: "거실 TV 추천 : Mini-LED vs OLED", isFavorited: true },
  { id: "7", text: "TV 가성비 분석", isFavorited: true },
  { id: "8", text: "TV 추천 비교 80인치", isFavorited: true },
  { id: "9", text: "TV 구매 상담", isFavorited: true },
  { id: "10", text: "거실 TV 추천 : OLED vs Neo QLED", isFavorited: true },
  { id: "11", text: "삼성 QLED 추천", isFavorited: true },
  { id: "12", text: "LG OLED 추천", isFavorited: true },
  { id: "13", text: "65인치 TV 비교", isFavorited: true },
  { id: "14", text: "75인치 TV 추천", isFavorited: true },
  { id: "15", text: "4K TV 가성비", isFavorited: true },
  { id: "16", text: "8K TV 구매 가이드", isFavorited: true },
  { id: "17", text: "게이밍 TV 추천", isFavorited: true },
  { id: "18", text: "영화 감상용 TV", isFavorited: true },
  { id: "19", text: "스마트 TV 기능 비교", isFavorited: true },
  { id: "20", text: "TV 사운드바 추천", isFavorited: true },
];

const FavoritesDialog: React.FC<FavoritesDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(initialFavorites);
  const [originalFavorites, setOriginalFavorites] =
    useState<FavoriteItem[]>(initialFavorites);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isModified, setIsModified] = useState(false);

  if (!isOpen) return null;

  // Handle drag start
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newFavorites = [...favorites];
    const draggedItem = newFavorites[draggedIndex];
    newFavorites.splice(draggedIndex, 1);
    newFavorites.splice(index, 0, draggedItem);

    setFavorites(newFavorites);
    setDraggedIndex(index);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Toggle favorite status
  const toggleFavorite = (index: number) => {
    const newFavorites = [...favorites];
    newFavorites[index].isFavorited = !newFavorites[index].isFavorited;
    setFavorites(newFavorites);
    setIsModified(true);
  };

  // Save changes
  const handleSave = () => {
    setOriginalFavorites([...favorites]);
    setIsModified(false);
  };

  // Cancel changes
  const handleCancel = () => {
    setFavorites([...originalFavorites]);
    setIsModified(false);
  };

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
        {/* Header - Title and Buttons */}
        <div className="absolute left-[36px] right-[36px] top-[16px] flex items-center justify-between">
          {/* Title */}
          <p className="text-black text-[24px] leading-[32px] font-semibold">
            즐겨찾기
          </p>

          {/* Action Buttons */}
          {isModified ? (
            <div className="flex items-center gap-[38px]">
              {/* 저장 Button */}
              <button
                onClick={handleSave}
                className="text-[#000] text-[18px] leading-[26px]  hover:opacity-70 transition-opacity"
              >
                저장
              </button>
              {/* 취소 Button */}
              <button
                onClick={handleCancel}
                className="text-[#000] text-[18px] leading-[26px]  hover:opacity-70 transition-opacity"
              >
                취소
              </button>
            </div>
          ) : (
            /* Close Button */
            <button
              onClick={onClose}
              className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <div className="w-full h-full">
                <img src={icClose} alt="Close" className="w-full h-full" />
              </div>
            </button>
          )}
        </div>

        {/* Favorites List */}
        <div className="absolute left-[36px] top-[104px] w-[820px] h-[540px] overflow-y-auto favorites-scrollbar pr-[16px]">
          <style>{`
            .favorites-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .favorites-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .favorites-scrollbar::-webkit-scrollbar-thumb {
              background: #d5d8dc;
              border-radius: 999px;
            }
            .favorites-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #989ba2;
            }
            /* Firefox */
            .favorites-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #d5d8dc transparent;
            }
          `}</style>
          <div className="flex flex-col">
            {favorites.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white h-[54px] w-full flex items-center justify-between hover:bg-[#f8f8fa] transition-colors group ${
                  draggedIndex === index ? "opacity-50" : ""
                }`}
                style={{ cursor: "default" }}
              >
                <div className="flex items-center gap-[8px] flex-1">
                  {/* Favorite Icon - Clickable */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(index);
                    }}
                    className="w-[20px] h-[20px] shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute left-[2.59px] top-[2.75px] w-[14.815px] h-[14.163px]">
                        <img
                          src={!item.isFavorited ? icFavorite : icFavoriteFull}
                          alt=""
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </button>
                  {/* Text */}
                  <div className="w-[680px]">
                    <p className="text-[#252525] text-[16px] leading-[26px] font-normal">
                      {item.text}
                    </p>
                  </div>
                </div>
                {/* Drag Handle - Only visible on hover */}
                <div className="w-[20px] h-[20px] flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mr-[8px]">
                  <img src={icOrder} alt="" className="w-full h-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(dialogContent, document.body);
};

export default FavoritesDialog;
