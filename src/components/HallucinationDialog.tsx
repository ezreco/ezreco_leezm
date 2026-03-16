import React from "react";
import { createPortal } from "react-dom";
import hallucinationImg from "@/assets/icons/img_hallucination.png";
import isCancel from "@/assets/icons/ic_cancel.svg";

interface HallucinationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const HallucinationDialog: React.FC<HallucinationDialogProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const dialogContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", zIndex: 10000 }}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1428px] h-[820px] bg-white rounded-[20px] flex flex-col"
        style={{ zIndex: 10001 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-[36px] top-[36px] w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity z-10"
        >
          <img src={isCancel} />
        </button>

        {/* Title */}
        <div className="pt-[36px] ">
          <div className="text-[24px] font-semibold leading-[32px]  text-center">
            EZReco는 어떻게 할루시네이션이 최소인가요?
          </div>
        </div>

        {/* Image Section */}
        <div className="absolute left-0 top-0 flex-1 flex items-center justify-center  ">
          <img
            src={hallucinationImg}
            alt="할루시네이션 설명"
            className="w-[1428px] h-[820px] "
          />
        </div>

        <div className="absolute left-[859px] top-[362px] text-[#FFf] text-[18px] font-semibold ">
          Low 할루시네이션
        </div>

        {/* Bottom Section - 3 Columns */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[92px] flex justify-center gap-[72px]">
          {/* Column 1 */}
          <div className="flex flex-col gap-[12px] w-[278px] items-center">
            <div className="flex gap-[8px] items-center">
              <div className="w-[16px] h-[16px] rounded-full bg-[#000] flex items-center justify-center">
                <span className="text-[10px] font-semibold leading-[16px] text-white">
                  1
                </span>
              </div>
              <span className="text-[16px] font-semibold leading-[26px] text-black whitespace-nowrap">
                비명시적 요구사항 반영
              </span>
            </div>
            <div className="text-[14px] leading-[20px] text-[#252525] text-center">
              <div className="mb-[4px]">체계화된 사용자의 제품 특징에 대한</div>
              <div className="mb-[4px]">
                단편적 요구 사항과 제품 사용 환경, 구매 목적 등의
              </div>
              <div className="mb-0">숨은 뜻까지 고려하여 제품 후보군 설정</div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-[12px] w-[278px] items-center">
            <div className="flex gap-[8px] items-center">
              <div className="w-[16px] h-[16px] rounded-full bg-[#000] flex items-center justify-center">
                <span className="text-[10px] font-semibold leading-[16px] text-white">
                  2
                </span>
              </div>
              <div className="text-[16px] leading-[26px] whitespace-nowrap">
                <span className="font-semibold text-black">
                  전문가 및 실사용자 데이터 기반{" "}
                </span>
                <span className="font-normal text-[#989ba2]">*Ad-Free</span>
              </div>
            </div>
            <div className="text-[14px] leading-[20px] text-[#252525] text-center">
              <div className="mb-[4px]">
                전문가와 실사용자 구매 후기 DB를 활용하여
              </div>
              <div className="mb-[4px]">
                기존 생성형 AI의 주관적 해석 및 잘못된 추론 발생
              </div>
              <div className="mb-0">가능성을 최소화</div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-[12px] w-[278px] items-center">
            <div className="flex gap-[8px] items-center">
              <div className="w-[16px] h-[16px] rounded-full bg-[#000] flex items-center justify-center">
                <span className="text-[10px] font-semibold leading-[16px] text-white">
                  3
                </span>
              </div>
              <span className="text-[16px] font-semibold leading-[26px] text-black whitespace-nowrap">
                주요 제품 특징 및 중요도 추론
              </span>
            </div>
            <div className="text-[14px] leading-[20px] text-[#252525] text-center">
              <div className="mb-[4px]">
                사용자의 질문의 숨겨진 니즈까지 반영하는
              </div>
              <div className="mb-[4px]">
                제품의 특징 요소와 그 요소 별 가중치를 추론하여
              </div>
              <div className="mb-0">추천 제품 선별에 활용</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(dialogContent, document.body);
};

export default HallucinationDialog;
