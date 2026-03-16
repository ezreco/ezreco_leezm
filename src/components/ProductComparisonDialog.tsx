import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import closeIcon from "../assets/icons/close-icon.svg";
import { getAssetUrl } from "@/utils/getAssetUrl";

interface ProductComparisonDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductComparisonDialog: React.FC<ProductComparisonDialogProps> = ({
  isOpen,
  onClose,
}) => {
  // Get products from Redux store (top 3 only)
  const { productList } = useSelector((state: RootState) => state.smartCompare);

  // If productList is empty, use default mock products
  const defaultProducts = [
    {
      id: "1",
      title: "삼성 2025 Neo QLED\n65QNF80",
      image: getAssetUrl("src/assets/tvs/tv1.png"),
      details: [
        { label: "가격", value: "2,687,700원" },
        {
          label: "패널/백라이트",
          value: "Mini-LED 백라이트 기반의\nNEO QLED",
          highlight: true,
        },
        { label: "HDR∙최대 밝기 측정값", value: "1,100–1,160 nits" },
        {
          label: "AI 주요 기능",
          value: "Vision AI로 콘텐츠 업스케일 및\n장면 음향 자동 최적화",
        },
        { label: "내장 오디오", value: "Dolby Atmos 일부 지원" },
      ],
    },
    {
      id: "2",
      title: "삼성 2025 QLED Q60F",
      image: getAssetUrl("src/assets/tvs/tv2.png"),
      details: [
        { label: "가격", value: "2,687,700원" },
        { label: "패널/백라이트", value: "Mini-LED 백라이트 기반의\nNEO QLED" },
        { label: "HDR∙최대 밝기 측정값", value: "1,100–1,160 nits" },
        {
          label: "AI 주요 기능",
          value: "Vision AI로 콘텐츠 업스케일 및\n장면 음향 자동 최적화",
          highlight: true,
        },
        { label: "내장 오디오", value: "Dolby Atmos 일부 지원" },
      ],
    },
    {
      id: "3",
      title: "삼성 2025 Neo QLED\nQNF90",
      image: getAssetUrl("src/assets/tvs/tv3.png"),
      details: [
        { label: "가격", value: "2,687,700원" },
        {
          label: "패널/백라이트",
          value: "Mini-LED 백라이트 기반의\nNEO QLED",
          highlight: true,
        },
        { label: "HDR∙최대 밝기 측정값", value: "1,100–1,160 nits" },
        {
          label: "AI 주요 기능",
          value: "Vision AI로 콘텐츠 업스케일 및\n장면 음향 자동 최적화",
        },
        { label: "내장 오디오", value: "Dolby Atmos 일부 지원" },
      ],
    },
  ];

  const top3Products =
    productList.length > 0 ? productList.slice(0, 3) : defaultProducts;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "black", opacity: 0.4 }}
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-[20px]  h-[748px] p-[36px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[36px] top-[36px] w-[32px] h-[32px] flex items-center justify-center"
        >
          <img src={closeIcon} alt="close" className="w-[18px] h-[18px]" />
        </button>

        {/* Title */}
        <div className="text-[24px] font-semibold leading-[32px] text-black text-center mb-[36px]">
          추천 제품 비교 분석
        </div>

        {/* Comparison Cards */}
        <div className="flex gap-[24px]  justify-center h-[680px]">
          {top3Products.map((product, productIndex) => {
            // Get corresponding Redux product data for details (top 3 only)
            const reduxProduct = top3Products[productIndex];

            return (
              <div
                key={product.id}
                className="w-[280px] bg-white border border-[#d5d8dc] rounded-[20px]  pb-[36px] flex flex-col"
              >
                {/* Product Image */}
                <div className=" h-[138px] bg-[#f8f8fa] rounded-[16px] m-[4px] flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-[180px] h-[120px] object-contain"
                  />
                </div>

                {/* Product Name */}
                <div className="text-[16px] font-semibold leading-[26px] text-black text-center whitespace-pre-line flex-shrink-0 h-[84px] flex items-center justify-center">
                  {product.title}
                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-[#d5d8dc] mb-[21px]" />

                {/* Specs - Scrollable */}
                <div className="px-[24px] overflow-y-auto flex-grow relative">
                  {reduxProduct?.details
                    ? // Use Redux product details if available (SmartCompareResult style)
                      reduxProduct.details.map((detail, index) => (
                        <div
                          key={index}
                          className={index > 0 ? "mt-[20px]" : ""}
                        >
                          <div className="text-[14px] font-semibold leading-[20px] text-black">
                            {detail.label}
                          </div>
                          <div
                            className={`text-[14px] leading-[20px] whitespace-pre-wrap ${
                              detail.highlight
                                ? "text-[#f85057]"
                                : "text-[#252525]"
                            }`}
                          >
                            {detail.value}
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductComparisonDialog;
