import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  RecommendedProduct,
  Reviews,
  OttTips,
} from "../store/aiRecommendResultStore";
import RadarChart from "./RadarChart";
import ButtonTextIcon from "./ButtonTextIcon";
import ProductReviews from "./ProductReviews";
import PriceComparisonDialog from "./PriceComparisonDialog";
import ProductComparisonDialog from "./ProductComparisonDialog";
import HallucinationDialog from "./HallucinationDialog";
import alarmIcon from "../assets/result/ic_alarm.png";
import medalGoldIcon from "../assets/result/medal-gold.png";
import expertIcon from "../assets/icons/ic_expert_advice.png";
import analysisIcon from "../assets/icons/ic_energy.png";
import infoIcon from "../assets/result/logo-info.png";
import priceIcon from "../assets/icons/ic_price.png";
import reportIcon from "../assets/icons/cd788059918b2d1934344dd0c58299fd0c768fb7.svg";
import compareIcon from "../assets/icons/d9e5ce227390001f3e280f57cfa63038e60fe961.svg";
import ic_btn_more from "../assets/icons/ic_btn_more.svg";
import tooltipBg from "../assets/icons/tooltipBg.svg";

interface RecommendResultBubbleProps {
  products: RecommendedProduct[];
  reviews?: Reviews;
  ottTips?: OttTips;
}

const RecommendResultBubble: React.FC<RecommendResultBubbleProps> = ({
  products,
  reviews,
  ottTips,
}) => {
  const navigate = useNavigate();
  const [expandedTips, setExpandedTips] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [ottTipsExpanded, setOttTipsExpanded] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<RecommendedProduct | null>(null);
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  const [hallucinationDialogOpen, setHallucinationDialogOpen] = useState(false);
  const [showAlarmTooltip, setShowAlarmTooltip] = useState<{
    [key: string]: boolean;
  }>({});

  if (!products || products.length === 0) return null;

  const toggleTips = (productId: string) => {
    setExpandedTips((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className="mb-[100px]">
      {/* Header Section */}
      <div className="relative mt-[30px] mb-[12px] w-[822px]">
        {/* Main Description Text */}
        <div className="text-[14px] font-semibold leading-[20px] text-black mb-[12px]">
          <div className="mb-0">
            말씀하신 정보를 토대로 TV 구매에 꼭 필요한 5가지
          </div>
          <div>핵심 정보 기준 아래 모델을 추천드립니다.</div>
        </div>

        {/* Category Tags */}
        <div className="flex gap-[8px] items-center mb-[12px]">
          {/* 1. 제품스펙 */}
          <div className="flex gap-[2px] items-center">
            <div className="w-[13px] h-[13px] rounded-full border-[#0106ff] border-[1px] flex items-center justify-center">
              <div className="text-[10px] font-semibold leading-[13px] text-[#0106ff]">
                1
              </div>
            </div>
            <div className="text-[14px] leading-[20px] text-[#0106ff]">
              제품스펙
            </div>
          </div>

          {/* 2. 가격옵션 */}
          <div className="flex gap-[2px] items-center">
            <div className="w-[13px] h-[13px] rounded-full border-[#00d694] border-[1px] flex items-center justify-center">
              <div className="text-[10px] font-semibold leading-[13px] text-[#00d694]">
                2
              </div>
            </div>
            <span className="text-[14px] leading-[20px] text-[#00d694]">
              가격옵션
            </span>
          </div>

          {/* 3. 대안제품 */}
          <div className="flex gap-[2px] items-center">
            <div className="w-[13px] h-[13px] rounded-full border-[#ff9500] border-[1px] flex items-center justify-center">
              <div className="text-[10px] font-semibold leading-[13px] text-[#ff9500]">
                3
              </div>
            </div>
            <span className="text-[14px] leading-[20px] text-[#ff9500]">
              대안제품
            </span>
          </div>

          {/* 4. 평가정보 */}
          <div className="flex gap-[2px] items-center">
            <div className="w-[13px] h-[13px] rounded-full border-[#f85057] border-[1px] flex items-center justify-center">
              <div className="text-[10px] font-semibold leading-[13px] text-[#f85057]">
                4
              </div>
            </div>
            <span className="text-[14px] leading-[20px] text-[#f85057]">
              평가정보
            </span>
          </div>

          {/* 5. 사용후기 */}
          <div className="flex gap-[2px] items-center">
            <div className="w-[13px] h-[13px] rounded-full border-[#c153f4] border-[1px] flex items-center justify-center">
              <div className="text-[10px] font-semibold leading-[13px] text-[#c153f4]">
                5
              </div>
            </div>
            <div className="text-[14px] leading-[20px] text-[#c153f4]">
              사용후기
            </div>
          </div>

          {/* More Button */}
          <button
            onClick={() => setHallucinationDialogOpen(true)}
            className="ml-auto flex gap-[4px] items-center pr-[20px] hover:opacity-70 transition-opacity"
          >
            <div className="relative w-[20px] h-[20px]">
              <img src={ic_btn_more} alt="" />
            </div>
            <div className="text-[14px] leading-[20px] text-[#252525] whitespace-nowrap">
              Low 할루시네이션, No AD
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[20px] shadow-[10px_12px_26px_0px_#ebebed] p-[20px] w-[782px]">
        <div className="space-y-[34px]">
          {products.map((product) => (
            <div key={product.productId}>
              <div className="flex gap-[20px] items-end">
                {/* Left Section */}
                <div className="w-[428px] flex flex-col">
                  {/* Section 01: Rank, Title, and Buttons */}
                  <div className="mb-[22px]">
                    {/* Rank Badge */}
                    <div className="flex items-center gap-[4px] mb-[2px] mt-[20px]">
                      <div
                        className="text-[32px] font-semibold leading-[34px] bg-gradient-to-r from-[#7850ff] to-[#37d7ff] bg-clip-text"
                        style={{ WebkitTextFillColor: "transparent" }}
                      >
                        추천 No.{product.rank}
                      </div>
                      {product.rank === 1 && (
                        <img
                          src={medalGoldIcon}
                          alt="1위"
                          className="w-[22px] h-[30px] ml-[8px]"
                        />
                      )}
                    </div>

                    <div className="text-[12px] text-[#989ba2] leading-[16px] mb-[2px] mt-[16px]">
                      2025년 3월 출시
                    </div>

                    {/* Product Name and Info Button */}
                    <div className="flex items-center gap-[8px] h-[32px]">
                      <div className="text-[24px] font-semibold leading-[32px] text-black">
                        {product.brand} {product.modelName}
                      </div>
                      <button
                        onClick={() => navigate("/ezwiki/1")}
                        className="w-[32px] h-[32px] rounded-full border border-[#d5d8dc] bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={infoIcon}
                          alt="info"
                          className="w-[32px] h-[32px] "
                        />
                      </button>
                      <div
                        className="relative"
                        onMouseEnter={() =>
                          setShowAlarmTooltip((prev) => ({
                            ...prev,
                            [product.productId]: true,
                          }))
                        }
                        onMouseLeave={() =>
                          setShowAlarmTooltip((prev) => ({
                            ...prev,
                            [product.productId]: false,
                          }))
                        }
                      >
                        <button className="w-[32px] h-[32px] flex items-center justify-center hover:opacity-70 transition-opacity">
                          <img src={alarmIcon} className="w-[32px] h-[32px]" />
                        </button>
                        {showAlarmTooltip[product.productId] && (
                          <div className="absolute top-[calc(100%+5px)] right-[0px] translate-x-[72px] z-50">
                            <div className="relative w-[309px] h-[125px]">
                              <img
                                src={tooltipBg}
                                alt=""
                                className="absolute inset-0 w-full h-full"
                              />
                              <div className="absolute left-[14px] top-[20px] text-white">
                                <div className="text-[14px] font-semibold leading-[20px] mb-0">
                                  개발 진행 중
                                </div>
                                <div className="text-[14px] leading-[20px] mb-0">
                                  &nbsp;
                                </div>
                                <div className="text-[14px] font-semibold leading-[20px] mb-0">
                                  관심 제품 알람 설정
                                </div>
                                <div className="text-[12px] leading-[16px] mb-0">
                                  가격 변동, 세일 정보, 재고 입고, 새로운 리뷰,
                                  후속모델 소식,
                                </div>
                                <div className="text-[12px] leading-[16px]">
                                  신제품, 시장 평가 좋은 제품 트렌드 정보 등을
                                  제공합니다.
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price Buttons */}
                  <div className="flex gap-[8px] mb-[60px]">
                    {product.shoppingMallPrices
                      .slice(0, 2)
                      .map((mall, index) => (
                        <div
                          key={mall.mallName}
                          className="flex-1 flex flex-col gap-[8px]"
                        >
                          <button
                            className={`w-full h-[42px] rounded-full border ${
                              index === 0
                                ? "border-[#f85057]"
                                : "border-[#d5d8dc]"
                            } bg-white flex items-center gap-[8px] px-[8px]`}
                          >
                            <div className="w-[26px] h-[26px] bg-[#c73f2b] rounded-full overflow-hidden flex items-center justify-center">
                              <img
                                src={mall.mallLogo}
                                alt={mall.mallName}
                                className="w-[26px] h-[26px]"
                              />
                            </div>
                            <span className="flex-1 text-[14px] font-semibold leading-[20px] text-right">
                              {mall.price.toLocaleString()}
                            </span>
                          </button>
                          {mall.info && (
                            <div className="text-[12px] text-[#989ba2] leading-[16px] text-center">
                              {mall.info}
                            </div>
                          )}
                        </div>
                      ))}
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setPriceDialogOpen(true);
                      }}
                      className="w-[42px] h-[42px] rounded-full border border-[#d5d8dc] bg-white flex items-center justify-center"
                    >
                      <img
                        src={priceIcon}
                        alt="가격비교"
                        className="w-[19px] h-[18px]"
                      />
                    </button>
                  </div>

                  {/* Section 02: AI Score */}
                  <div className="mt-auto">
                    <p className="text-[14px] font-semibold leading-[20px] text-black mb-[8px]">
                      글로벌 전문가 평가 점수
                    </p>

                    {/* 2개 컬럼 */}
                    <div className="flex gap-[10px]">
                      {/* 왼쪽 컬럼 */}
                      <div className="flex-1 flex flex-col ]">
                        {/* AI Score - 상단 정렬 */}
                        <div
                          className={`text-[32px] font-semibold leading-[34px] mb-[16px] ${
                            product.rank === 1
                              ? "text-[#f85057]"
                              : product.rank === 2
                              ? "text-[#00d694]"
                              : "text-[#ff9500]"
                          }`}
                        >
                          {product.aiScore}
                        </div>

                        {/* 리뷰 언급 수 - 하단 정렬 */}
                        <div className="mt-auto">
                          <div className="text-[14px] leading-[20px]">
                            <span className="font-normal text-black">
                              전문가 리뷰 언급 수 :{" "}
                            </span>
                            <span
                              className={`font-semibold ${
                                product.rank === 1
                                  ? product.rank === 1
                                    ? "text-[#f85057]"
                                    : product.rank === 2
                                    ? "text-[#00d694]"
                                    : "text-[#ff9500]"
                                  : "text-black"
                              }`}
                            >
                              {product.review?.expertMentions
                                ? product.review.expertMentions >= 1000
                                  ? `${Math.floor(
                                      product.review.expertMentions / 1000
                                    )}000+`
                                  : product.review.expertMentions.toLocaleString()
                                : "0"}
                            </span>
                          </div>
                          <div className="text-[14px] leading-[20px] mt-[4px] mb-[20px]">
                            <span className="font-normal text-black">
                              소비자 리뷰 언급 수 :{" "}
                            </span>
                            <span
                              className={`font-semibold ${
                                product.rank === 1
                                  ? product.rank === 1
                                    ? "text-[#f85057]"
                                    : product.rank === 2
                                    ? "text-[#00d694]"
                                    : "text-[#ff9500]"
                                  : "text-black"
                              }`}
                            >
                              {product.review?.consumerMentions
                                ? product.review.consumerMentions >= 1000
                                  ? `${Math.floor(
                                      product.review.consumerMentions / 1000
                                    )}000+`
                                  : product.review.consumerMentions.toLocaleString()
                                : "0"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 오른쪽 컬럼 - Radar Chart (하단 정렬, 왼쪽 정렬) */}
                      <div className="flex-shrink-0 flex  justify-start mr-[70px] mb-[10px]">
                        <RadarChart
                          scores={product.scores}
                          size={156}
                          rank={product.rank}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Section 03: Specs */}
                <div className="w-[344px]">
                  {/* Product Image */}
                  <div className="w-full h-[144px] mt-[66px] rounded-[12px] flex items-center justify-center overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.modelName}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Price Range */}
                  <div className="mb-[20px] mt-[18px]">
                    <span className="text-[14px] font-semibold leading-[20px] text-black mb-[8px]">
                      가격
                    </span>
                    {(() => {
                      const { min, max, current } = product.priceRange;
                      const currentPercent =
                        ((current - min) / (max - min)) * 100;

                      return (
                        <>
                          {/* 1. 회색 막대바 */}
                          <div className="relative w-full h-[6px] bg-[#eef0f3] rounded-[999px] mt-[6px] ">
                            {/* 2. 양 끝점에 회색 점 */}
                            {/* 최소값 점 (왼쪽 끝) - left: 0% */}
                            <div
                              className="absolute w-[6px] h-[6px] bg-[#989ba2] opacity-60 rounded-[999px] top-0 z-10"
                              style={{ left: "0%" }}
                            />

                            {/* 최대값 점 (오른쪽 끝) - left: 100% */}
                            <div
                              className="absolute w-[6px] h-[6px] bg-[#989ba2] opacity-60 rounded-[999px] top-0 z-10"
                              style={{
                                left: "100%",
                                transform: "translateX(-100%)",
                              }}
                            />

                            {/* 3. 현재값 위치에 블루 점 */}
                            <div
                              className="absolute w-[6px] h-[6px] bg-[#0106ff] rounded-[999px] top-0 transform -translate-x-1/2 rotate-90 z-20"
                              style={{ left: `${currentPercent}%` }}
                            />
                          </div>

                          {/* 4. 라벨 (피그마와 동일하게) */}
                          <div className="relative w-full h-[20px]">
                            {/* 최소값 라벨 (왼쪽 정렬) */}
                            <span
                              className="absolute text-[10px] text-[#989ba2] leading-[16px] mt-[6px]"
                              style={{ left: "0%" }}
                            >
                              {min.toLocaleString()}
                            </span>

                            {/* 현재값 라벨 (현재 위치 중앙) */}
                            <span
                              className="absolute text-[14px] text-black leading-[20px] text-center transform -translate-x-1/2 mt-[8px]"
                              style={{ left: `${currentPercent}%` }}
                            >
                              {current.toLocaleString()}
                            </span>

                            {/* 최대값 라벨 (오른쪽 정렬) */}
                            <span
                              className="absolute text-[10px] text-[#989ba2] leading-[16px] text-right mt-[6px]"
                              style={{
                                left: "100%",
                                transform: "translateX(-100%)",
                              }}
                            >
                              {max.toLocaleString()}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Specs Table */}
                  <div className="space-y-[10px]">
                    {product.specs.map((spec, index) => (
                      <div key={index} className="flex gap-[12px] items-start">
                        {/* 타이틀 (왼쪽) - 첫 줄 정렬 */}
                        <div className="w-[52px] flex-shrink-0">
                          <span className="text-[14px] font-semibold leading-[20px] text-black">
                            {spec.title}
                          </span>
                        </div>
                        {/* 콘텐츠 (오른쪽) */}
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-[14px] leading-[20px] text-black [&>br]:block"
                            dangerouslySetInnerHTML={{ __html: spec.content }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pros and Cons Table */}
              {((product.pros && product.pros.length > 0) ||
                (product.cons && product.cons.length > 0)) && (
                <div className="mt-[20px] rounded-[10px] overflow-hidden border border-[#d5d8dc]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="w-1/2 h-[40px] border-b border-r border-[#d5d8dc] text-[12px] font-semibold leading-[16px] text-black text-center">
                          장점
                        </th>
                        <th className="w-1/2 h-[40px] border-b border-[#d5d8dc] text-[12px] font-semibold leading-[16px] text-black text-center">
                          단점
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="w-1/2 h-[73px] border-r border-[#d5d8dc] px-[20px] pt-[13px] align-top">
                          <div className="text-[12px] font-normal leading-[16px] text-black">
                            {product.pros?.map((pro, index) => (
                              <div
                                key={index}
                                className={`whitespace-pre-line ${
                                  index === (product.pros?.length ?? 0) - 1
                                    ? ""
                                    : "mb-0"
                                }`}
                              >
                                · {pro}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="w-1/2 h-[73px] px-[20px] pt-[13px] align-top">
                          <div className="text-[12px] font-normal leading-[16px] text-black">
                            {product.cons?.map((con, index) => (
                              <div
                                key={index}
                                className={`whitespace-pre-line ${
                                  index === (product.cons?.length ?? 0) - 1
                                    ? ""
                                    : "mb-0"
                                }`}
                              >
                                · {con}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Recommend Reasons Section */}
              {product.recommendReasons &&
                product.recommendReasons.length > 0 && (
                  <div className="mt-[20px] space-y-[14px]">
                    {product.recommendReasons.map((reason, index) => (
                      <div key={index}>
                        <div className="text-[14px] font-semibold leading-[20px] text-black mb-[4px]">
                          {reason.title}
                        </div>
                        <div className="text-[14px] font-normal leading-[20px] text-[#252525] whitespace-pre-line">
                          {reason.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Tips Section */}
              {product.tips && product.tips.length > 0 && (
                <div className="mt-[20px]">
                  <div className="w-full h-[1px] bg-[#d5d8dc] mb-[11px]" />
                  <div className="flex justify-center">
                    <ButtonTextIcon
                      text="Tips"
                      isExpanded={expandedTips[product.productId] || false}
                      onClick={() => toggleTips(product.productId)}
                    />
                  </div>
                </div>
              )}

              {/* Expanded Content */}
              {expandedTips[product.productId] &&
                product.tips &&
                product.tips.length > 0 && (
                  <div className="mt-[20px] space-y-[14px]">
                    {product.tips.map((tip, index) => (
                      <div key={index}>
                        <div className="text-[14px] font-semibold leading-[20px] text-black mb-[4px]">
                          {tip.title}
                        </div>
                        <div
                          className="text-[14px] leading-[20px] text-[#252525] whitespace-pre-line"
                          style={
                            tip.shift
                              ? { paddingLeft: `${tip.shift}px` }
                              : undefined
                          }
                        >
                          {tip.description}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}

          {/* Reviews Section - After all products */}
          {reviews && (
            <div className="mt-[40px]">
              <ProductReviews reviews={reviews} />
            </div>
          )}

          {/* OTT Tips Section - At the very bottom */}
          {ottTips && (
            <div className="mt-[60px]">
              <div className="text-[18px] font-semibold leading-[24px] text-black mb-[20px]">
                전문가 Advice & Tip 입니다
              </div>
              {/* Title */}
              <div className="flex items-center gap-[4px] mb-[20px]">
                <img
                  src={expertIcon}
                  alt="expert"
                  className="w-[20px] h-[20px]"
                />
                <div className="text-[14px] font-semibold leading-[24px] text-black ">
                  {ottTips.title}
                </div>
              </div>
              {/* Sections */}
              <div className="space-y-[20px]">
                {ottTips.sections.map((section, index) => (
                  <div key={index}>
                    <div className="text-[14px]  leading-[20px] text-black mb-[4px]">
                      {section.title}
                    </div>
                    <div
                      className="text-[14px] leading-[20px] text-black"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                ))}
              </div>
              {/* Tips Toggle Button */}
              <div className="mt-[20px]">
                <div className="w-full h-[1px] bg-[#d5d8dc] mb-[11px]" />
                <div className="flex justify-center">
                  <ButtonTextIcon
                    text="Tips"
                    isExpanded={ottTipsExpanded}
                    onClick={() => setOttTipsExpanded(!ottTipsExpanded)}
                  />
                </div>
              </div>
              {/* Expanded Tips Content */}
              {ottTipsExpanded && (
                <div className="mt-[40px]">
                  {/* Tip Items */}
                  {ottTips.tipItems.map((item, index) => (
                    <div key={index} className={index > 0 ? "mt-[20px]" : ""}>
                      <div className="text-[14px] font-semibold leading-[20px] text-black mb-[4px]">
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="text-[14px] leading-[20px] text-[#252525]">
                          {item.description.split("\n").map((line, lineIdx) => (
                            <div
                              key={lineIdx}
                              className={lineIdx > 0 ? "" : "mb-0"}
                              style={
                                item.shift
                                  ? { paddingLeft: `${item.shift}px` }
                                  : undefined
                              }
                            >
                              {line}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comparison Table */}
                      {item.table && (
                        <div className="mt-[10px] ml-[17px]">
                          <div className="border border-[#d5d8dc] rounded-[10px] overflow-hidden w-[760px]">
                            {/* Header Row */}
                            <div className="flex border-b border-[#d5d8dc] h-[40px]">
                              {item.table.columns.map((column, colIndex) => (
                                <div
                                  key={colIndex}
                                  className={`${
                                    colIndex === item.table!.columns.length - 1
                                      ? "w-[254px]"
                                      : "w-[253px] border-r border-[#d5d8dc]"
                                  } flex items-center justify-center`}
                                >
                                  <span className="text-[12px] font-semibold leading-[16px] text-black text-center">
                                    {column.header}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {/* Content Row */}
                            <div className="flex h-[90px]">
                              {item.table.columns.map((column, colIndex) => (
                                <div
                                  key={colIndex}
                                  className={`${
                                    colIndex === item.table!.columns.length - 1
                                      ? "w-[254px]"
                                      : "w-[253px] border-r border-[#d5d8dc]"
                                  } px-[20px] flex items-center`}
                                >
                                  <div
                                    className="text-[12px] leading-[16px] text-black"
                                    dangerouslySetInnerHTML={{
                                      __html: column.content,
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Expert Advice Section */}
                  {ottTips.expertAdvice && (
                    <div className="mt-[20px]">
                      <div className="flex items-center gap-[4px] mb-[4px]">
                        <img
                          src={expertIcon}
                          alt="expert"
                          className="w-[20px] h-[20px]"
                        />
                        <span className="text-[14px] font-semibold leading-[20px] text-black">
                          {ottTips.expertAdvice.title}
                        </span>
                      </div>
                      <div className="text-[14px] leading-[20px] text-black pr-[30px] whitespace-pre-line">
                        {ottTips.expertAdvice.description}
                      </div>
                    </div>
                  )}

                  {/* Energy Analysis Section */}
                  {ottTips.energyAnalysis && (
                    <div className="mt-[20px] mb-[15px]">
                      <div className="flex items-center gap-[4px] mb-[10px]">
                        <img
                          src={analysisIcon}
                          alt="analysis"
                          className="w-[20px] h-[20px]"
                        />
                        <span className="text-[14px] font-semibold leading-[20px] text-black">
                          {ottTips.energyAnalysis.title}
                        </span>
                      </div>

                      {/* Table */}
                      <div className="border border-[#d5d8dc] rounded-[10px] overflow-hidden w-[782px]">
                        <table className="w-full border-collapse">
                          {/* Header Row */}
                          <thead>
                            <tr className="h-[40px] border-b border-[#d5d8dc]">
                              {ottTips.energyAnalysis.table.columns.map(
                                (column, colIndex) => (
                                  <th
                                    key={colIndex}
                                    className={`text-[12px] font-semibold leading-[16px] text-black text-center ${
                                      colIndex <
                                      ottTips.energyAnalysis!.table.columns
                                        .length -
                                        1
                                        ? "border-r border-[#d5d8dc]"
                                        : ""
                                    } ${
                                      colIndex === 0 ? "px-[10px]" : "px-[10px]"
                                    }`}
                                    style={{ width: column.width }}
                                  >
                                    {column.header}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          {/* Data Rows */}
                          <tbody>
                            {ottTips.energyAnalysis.table.rows.map(
                              (row, rowIndex) => (
                                <tr
                                  key={rowIndex}
                                  className={`h-[73px] ${
                                    rowIndex <
                                    ottTips.energyAnalysis!.table.rows.length -
                                      1
                                      ? "border-b border-[#d5d8dc]"
                                      : ""
                                  }`}
                                >
                                  {/* Category Column */}
                                  <td
                                    className="text-[12px] leading-[16px] text-black text-center align-middle px-[10px] border-r border-[#d5d8dc]"
                                    style={{
                                      width:
                                        ottTips.energyAnalysis!.table.columns[0]
                                          .width,
                                    }}
                                  >
                                    {row.category}
                                  </td>
                                  {/* Data Columns - Images or Text */}
                                  {row.imgs
                                    ? // 이미지가 있는 경우
                                      row.imgs.map((img, cellIndex) => (
                                        <td
                                          key={cellIndex}
                                          className={`text-[12px] leading-[16px]  text-black align-middle px-[20px] ${
                                            cellIndex < row.imgs!.length - 1
                                              ? "border-r border-[#d5d8dc]"
                                              : ""
                                          }`}
                                          style={{
                                            width:
                                              ottTips.energyAnalysis!.table
                                                .columns[cellIndex + 1].width,
                                          }}
                                        >
                                          <div className="flex items-center justify-center py-[8px] px-[20px]">
                                            <img
                                              src={img}
                                              alt={`에너지 등급 ${
                                                cellIndex + 1
                                              }`}
                                              className="max-w-full h-auto"
                                            />
                                          </div>
                                        </td>
                                      ))
                                    : // 텍스트가 있는 경우
                                      row.cells?.map((cell, cellIndex) => (
                                        <td
                                          key={cellIndex}
                                          className={`text-[12px] leading-[16px] text-black align-middle px-[20px] ${
                                            cellIndex < row.cells!.length - 1
                                              ? "border-r border-[#d5d8dc]"
                                              : ""
                                          }`}
                                          style={{
                                            width:
                                              ottTips.energyAnalysis!.table
                                                .columns[cellIndex + 1].width,
                                          }}
                                        >
                                          {cell.split("\n").map((line, idx) => (
                                            <span key={idx}>
                                              {line}
                                              {idx <
                                                cell.split("\n").length - 1 && (
                                                <br />
                                              )}
                                            </span>
                                          ))}
                                        </td>
                                      ))}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Price Comparison Dialog - Portal을 사용하여 document.body에 렌더링 */}
        <PriceComparisonDialog
          isOpen={priceDialogOpen}
          onClose={() => setPriceDialogOpen(false)}
          productName={
            selectedProduct
              ? `${selectedProduct.brand} ${selectedProduct.modelName}`
              : undefined
          }
          priceAnalysis={selectedProduct?.priceAnalysis}
        />
      </div>

      {/* Footer Section - Outside the card */}
      <div className="mt-[20px] flex flex-col gap-[20px] w-[822px]">
        {/* Top buttons */}
        <div className="flex gap-[4px] items-center justify-end pr-[20px]">
          <button
            className="flex gap-[4px] items-center"
            onClick={() => setComparisonDialogOpen(true)}
          >
            <div className="relative w-[20px] h-[20px] overflow-hidden">
              <img
                src={compareIcon}
                alt="compare"
                className="absolute h-[16.707px] left-[2px] top-[1.65px] w-[16px]"
              />
            </div>
            <span className="text-[14px] leading-[20px] text-[#252525] whitespace-nowrap">
              추천 비교하기
            </span>
          </button>

          <button className="flex gap-[4px] items-center ml-[8px]">
            <div className="relative w-[20px] h-[20px] overflow-hidden">
              <img
                src={reportIcon}
                alt="report"
                className="absolute h-[16px] left-[4px] top-[2px] w-[12px]"
              />
            </div>
            <span className="text-[14px] leading-[20px] text-[#252525] whitespace-nowrap">
              요약본 보기
            </span>
          </button>
        </div>

        {/* Bottom white buttons */}
        <div className="flex gap-[12px] items-center justify-center w-full">
          <button
            onClick={() => navigate("/", { state: { selectedTab: "tournament" } })}
            className="h-[38px] w-[174px] bg-white rounded-[24px] flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-[14px] font-semibold leading-[20px] text-black text-center">
              EZ 토너먼트 연결
            </span>
          </button>
          <button
            onClick={() => navigate("/", { state: { selectedTab: "persona" } })}
            className="h-[38px] w-[174px] bg-white rounded-[24px] flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-[14px] font-semibold leading-[20px] text-black text-center">
              페르소나 토론 연결
            </span>
          </button>
        </div>
      </div>

      {/* Product Comparison Dialog */}
      <ProductComparisonDialog
        isOpen={comparisonDialogOpen}
        onClose={() => setComparisonDialogOpen(false)}
      />

      {/* Hallucination Dialog */}
      <HallucinationDialog
        isOpen={hallucinationDialogOpen}
        onClose={() => setHallucinationDialogOpen(false)}
      />
    </div>
  );
};

export default RecommendResultBubble;
