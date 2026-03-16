import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { semantic } from "../styles/color";

// Icon assets
import productImage from "@/assets/tvs/tv2.png";
import icUp from "@/assets/icons/ic_up.png";
import icUndo from "@/assets/icons/ic_undo.svg";
import icRedo from "@/assets/icons/ic_redo.svg";
import icChevronDown from "@/assets/icons/ic_chevron_down.svg";
import icTextUnderline from "@/assets/icons/ic_text_underline.svg";
import icLink from "@/assets/icons/ic_link.svg";
import icQuotes from "@/assets/icons/ic_quotes.svg";
import icListBulleted from "@/assets/icons/ic_list_bulleted.svg";
import icListNumbered from "@/assets/icons/ic_list_numbered.svg";

// interface SpecRow {
//   category: string;
//   label: string;
//   value: string;
// }

const EZWikiDetailPage: React.FC = () => {
  // const { modelId } = useParams<{ modelId: string }>();
  // const navigate = useNavigate();
  const [isSpecExpanded, setIsSpecExpanded] = useState(true);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock data - 실제로는 API에서 가져올 데이터
  const productData = {
    title: "삼성 2025 Neo QLED 65QNF80",
    lastModified: "2025-08-11 / 20:48:12",
    breadcrumbs: ["TV", "2025", "삼성"],
    specs: [
      {
        category: "디스플레이",
        rows: [
          { label: "화면크기", sub1: "해상도", sub2: "주사율", sub3: "-" },
          {
            label: "189cm",
            sub1: "4K (3,840 X 2,160)",
            sub2: "120Hz (Up to 144Hz)",
            sub3: "-",
          },
        ],
      },
      {
        category: "영상",
        rows: [
          {
            label: "화질엔진",
            sub1: "HDR (High Dynamic Range)",
            sub2: "주사율",
            sub3: "-",
          },
          {
            label: "2세대 AI 4K 프로세서",
            sub1: "Neo Quantum HDR",
            sub2: "HDR 10+",
            sub3: "오토 HDR 리마스터링",
          },
          {
            label: "화질엔진",
            sub1: "HDR (High Dynamic Range)",
            sub2: "HDR 10+",
            sub3: "오토 HDR 리마스터링",
          },
          {
            label: "명암비",
            sub1: "시야각",
            sub2: "디밍 기술",
            sub3: "명암비 강화 기술 (Contrast Enhancer)",
          },
          {
            label: "Quantum Matrix Technology Core",
            sub1: "Wide viewing",
            sub2: "Supreme UHD Dimming",
            sub3: "명암비 강화",
          },
          {
            label: "모션 성능",
            sub1: "스마트 캘리브레이션",
            sub2: "AI 화질 최적화",
            sub3: "AI 화질 업스케일링",
          },
          {
            label: "모션 터보 144Hz",
            sub1: "있음",
            sub2: "최적 화면 / AI 맞춤 화면",
            sub3: "4K AI 화질 업스케일링",
          },
          {
            label: "AI 모션 강화",
            sub1: "HDR 밝기 최적화",
            sub2: "컬러 부스터",
            sub3: "필름메이커 모드 (FMM)",
          },
          {
            label: "없음",
            sub1: "있음",
            sub2: "컬러 부스터 Pro",
            sub3: "있음",
          },
        ],
      },
    ],
    features: [
      "디스플레이가 밝아서 좋아요",
      "주사율이 100HZ로 낮아요 타 제품 대비 120HZ라 높아요",
    ],
  };

  return (
    <div
      className="flex h-screen w-full"
      style={{ backgroundColor: semantic.background }}
    >
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-[60px]">
        {/* Header */}
        <div className="text-center  relative">
          <div className="text-[18px] font-semibold text-[#000000]">EZWiki</div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pt-[26px]">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-[4px] mb-[8px]">
            {productData.breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <div
                  className="bg-white border border-[#d5d8dc] rounded-full px-[14px] py-[2px] text-[14px] font-semibold  bg-gradient-to-r from-[#7850ff] to-[#37d7ff] bg-clip-text"
                  style={{ WebkitTextFillColor: "transparent" }}
                >
                  {crumb}
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Product Title and Info */}
          <div className="mb-[40px] w-full">
            <div className="flex flex-col items-start w-full">
              <div className="flex justify-between items-center w-full">
                <div className="text-[18px] font-semibold text-[#000000] mb-[0px]">
                  {productData.title}
                </div>
                <div className="flex items-right">
                  {/* Edit Mode Controls */}
                  {isEditMode && (
                    <div className="flex items-center gap-[8px]   rounded-[8px] mr-[24px]">
                      {/* Undo/Redo */}
                      <div className="flex gap-[2px]">
                        <button className="flex items-center justify-center h-[28px] px-[4px] rounded-[4px] hover:bg-[#eef0f3]">
                          <img
                            src={icUndo}
                            alt="실행 취소"
                            className="w-[20px] h-[20px]"
                          />
                        </button>
                        <button className="flex items-center justify-center h-[28px] px-[4px] rounded-[4px] hover:bg-[#eef0f3]">
                          <img
                            src={icRedo}
                            alt="다시 실행"
                            className="w-[20px] h-[20px]"
                          />
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="w-[1px] h-[16px] bg-[#d5d8dc] mx-[4px]" />

                      {/* 문단 */}
                      <button className="flex items-center justify-between h-[28px] pl-[8px] pr-[4px] rounded-[4px] hover:bg-[#eef0f3] min-w-[100px]">
                        <span className="text-[14px] font-semibold text-[#252525]">
                          문단
                        </span>
                        <img
                          src={icChevronDown}
                          alt=""
                          className="w-[16px] h-[16px]"
                        />
                      </button>

                      {/* Divider */}
                      <div className="w-[1px] h-[16px] bg-[#d5d8dc] mx-[4px]" />

                      {/* Text Underline */}
                      <button className="flex items-center gap-[2px] h-[28px] pl-[8px] pr-[4px] rounded-[4px] hover:bg-[#eef0f3]">
                        <img
                          src={icTextUnderline}
                          alt="밑줄"
                          className="w-[20px] h-[20px]"
                        />
                        <img
                          src={icChevronDown}
                          alt=""
                          className="w-[16px] h-[16px]"
                        />
                      </button>

                      {/* Link */}
                      <button className="flex items-center justify-center h-[28px] px-[4px] rounded-[4px] hover:bg-[#eef0f3]">
                        <img
                          src={icLink}
                          alt="링크"
                          className="w-[20px] h-[20px]"
                        />
                      </button>

                      {/* 인용 */}
                      <button className="flex items-center gap-[2px] h-[28px] pl-[8px] pr-[4px] rounded-[4px] hover:bg-[#eef0f3]">
                        <img
                          src={icQuotes}
                          alt="인용"
                          className="w-[20px] h-[20px]"
                        />
                        <span className="text-[14px] font-semibold text-[#252525]">
                          인용
                        </span>
                      </button>

                      {/* List Bulleted */}
                      <button className="flex items-center gap-[2px] h-[28px] pl-[8px] pr-[4px] rounded-[4px] hover:bg-[#eef0f3]">
                        <img
                          src={icListBulleted}
                          alt="목록"
                          className="w-[20px] h-[20px]"
                        />
                        <img
                          src={icChevronDown}
                          alt=""
                          className="w-[16px] h-[16px]"
                        />
                      </button>

                      {/* 넣기 */}
                      <button className="flex items-center gap-[2px] h-[28px] pl-[8px] pr-[4px] rounded-[4px] hover:bg-[#eef0f3]">
                        <span className="text-[14px] font-semibold text-[#252525]">
                          넣기
                        </span>
                        <img
                          src={icChevronDown}
                          alt=""
                          className="w-[16px] h-[16px]"
                        />
                      </button>

                      {/* List Numbered */}
                      <button className="flex items-center justify-center h-[28px] px-[4px] rounded-[4px] hover:bg-[#eef0f3]">
                        <img
                          src={icListNumbered}
                          alt="번호 매기기"
                          className="w-[20px] h-[20px]"
                        />
                      </button>

                      {/* Divider */}
                      <div className="w-[1px] h-[16px] bg-[#d5d8dc] mx-[4px]" />

                      {/* 분류 */}
                      <button className="flex items-center gap-[2px] h-[28px] px-[4px] rounded-[4px] hover:bg-[#eef0f3]">
                        <span className="text-[14px] font-semibold text-[#252525]">
                          분류
                        </span>
                      </button>
                    </div>
                  )}

                  {/* 편집하기/변경 게시 버튼 */}
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="bg-[#eef0f3] h-[36px] rounded-full px-[20px] py-[2px] text-[14px] font-semibold text-[#000000] hover:bg-[#d5d8dc] transition-colors"
                  >
                    {isEditMode ? "변경 게시" : "편집하기"}
                  </button>
                </div>
              </div>

              <div className="h-[1px] bg-[#989BA2] mb-[8px] w-full mt-[12px]" />
              <div className="text-[12px] text-[#989ba2]">
                최근 수정 시각 : {productData.lastModified}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start">
            {/* 1. Spec Section */}
            <div className="mb-[40px] w-full">
              <button
                onClick={() => setIsSpecExpanded(!isSpecExpanded)}
                className="flex items-center gap-[4px] mb-[20px]"
              >
                <span className="text-[16px] font-semibold text-[#000000]">
                  1. Spec
                </span>
                <img
                  src={icUp}
                  alt=""
                  className={`w-[20px] h-[20px] transition-transform ${
                    isSpecExpanded ? "" : "rotate-180"
                  }`}
                />
              </button>
              <div className="h-[1px] bg-[#d5d8dc] mb-[20px]" />

              {isSpecExpanded && (
                <div className="flex  items-start w-full gap-[40px]">
                  <div className="">
                    {/* Spec Table */}
                    <table className="border-collapse">
                      <tbody>
                        {/* 디스플레이 섹션 */}
                        <tr>
                          <td
                            rowSpan={2}
                            className="border border-[#989ba2] bg-white px-[16px] py-[36px] text-[16px] font-semibold text-[#252525] w-[101px] align-center"
                          >
                            디스플레이
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] w-[276px] text-center">
                            화면크기
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] w-[236px] text-center">
                            해상도
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] w-[220px] text-center">
                            주사율
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] w-[291px] text-center">
                            -
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            189cm
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            4K (3,840 X 2,160)
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            120Hz (Up to 144Hz)
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            -
                          </td>
                        </tr>

                        {/* 영상 섹션 */}
                        <tr>
                          <td
                            rowSpan={8}
                            className="border border-[#989ba2] bg-white px-[16px] py-[36px] text-[16px] font-semibold text-[#252525] w-[101px] align-center"
                          >
                            영상
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            화질엔진
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            HDR (High Dynamic Range)
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            HDR 10+
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            오토 HDR 리마스터링
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            2세대 AI 4K 프로세서
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            Neo Quantum HDR
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            지원 (ADAPTIVE/GAMING)
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            Auto HDR Remastering
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            명암비
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            시야각
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            디밍 기술
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            명암비 강화 기술 (Contrast Enhancer)
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            Quantum Matrix Technology Core
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            Wide viewing
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            Supreme UHD Dimming
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            명암비 강화
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            모션 성능
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            스마트 캘리브레이션
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            AI 화질 최적화
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            AI 화질 업스케일링
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            모션 터보 144Hz
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            있음
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            최적 화면 / AI 맞춤 화면
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            4K AI 화질 업스케일링
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            AI 모션 강화
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            HDR 밝기 최적화
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            컬러 부스터
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] font-semibold text-[#252525] text-center">
                            필름메이커 모드 (FMM)
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            없음
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            있음
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            컬러 부스터 Pro
                          </td>
                          <td className="border border-[#989ba2] bg-white px-[16px] py-[12px] text-[16px] text-[#252525]">
                            있음
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Product Image (right side) */}
                  <div className="relative w-[400px] h-[284px] border border-[#d5d8dc] bg-[#eef0f3]">
                    <img
                      src={productImage}
                      alt={productData.title}
                      className="w-full h-full object-contain p-[0px]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. 추가 정보 Section */}
          <div className="mb-[60px]">
            <button
              onClick={() => setIsInfoExpanded(!isInfoExpanded)}
              className="flex items-center gap-[4px] mb-[20px]"
            >
              <span className="text-[16px] font-semibold text-[#000000]">
                2. 추가 정보 (장점 및 단점)
              </span>
              <img
                src={icUp}
                alt=""
                className={`w-[20px] h-[20px] transition-transform ${
                  isInfoExpanded ? "" : "rotate-180"
                }`}
              />
            </button>
            <div className="h-[1px] bg-[#d5d8dc] mb-[20px]" />

            {isInfoExpanded && (
              <ul className="list-disc pl-[24px] space-y-[4px]">
                {productData.features.map((feature, index) => (
                  <li
                    key={index}
                    className="text-[16px] text-[#252525] leading-[24px]"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EZWikiDetailPage;
