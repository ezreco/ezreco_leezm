import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

// Image assets
import logoCircle from "@/assets/icons/ic_logo_round.png";
import logoText from "@/assets/images/logo-text.svg";

function ResourceIcLogoRound() {
  return (
    <div className="relative w-[62px] h-[62px]">
      <div className="absolute inset-0">
        <img
          alt=""
          className="block max-w-none w-full h-full"
          src={logoCircle}
        />
      </div>
      <div className="absolute inset-[23.15%_15.89%_23.14%_15.89%]">
        <img alt="" className="block max-w-none w-full h-full" src={logoText} />
      </div>
    </div>
  );
}

interface KeywordCardProps {
  tag: string;
  tagColor: string;
  tagBg: string;
  text: string;
}

function KeywordCard({
  tag,
  tagColor,
  tagBg,
  text,
  onClick,
}: KeywordCardProps & { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[33px] p-[20px] h-[33px] flex items-center gap-[10px] shadow-sm hover:shadow-md transition-shadow cursor-pointer w-[320px] flex-shrink-0"
    >
      <div
        className={`px-[14px] py-[4px] w-[26px] rounded-[13px] text-[14px] font-semibold whitespace-nowrap flex-shrink-0`}
        style={{ backgroundColor: tagBg, color: tagColor }}
      >
        {tag}
      </div>
      <span className="text-[17px] text-[#252525] truncate">{text}</span>
    </div>
  );
}

const SmartRecommend: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.login
  );

  const handleKeywordClick = (text: string) => {
    navigate("/smart-recommend", { state: { message: text } });
  };

  // Get user's display name
  const getUserName = () => {
    if (!isAuthenticated || !user) {
      return "고객";
    }
    return user.name || user.email?.split("@")[0] || "고객";
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4 flex flex-col items-center gap-8 z-20 pb-[50px]">
      <ResourceIcLogoRound />

      <div className="text-center">
        <p className="text-[#989BA2] text-[28px] font-semibold mb-[13px]">
          {getUserName()}님, 반가워요 👋
        </p>
        <p className="text-black text-[42px] font-semibold leading-[51px] max-w-3xl">
          저는 가전제품 추천 특화 AI EZReco 입니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-[26px] mt-[36px] items-center justify-center">
        <KeywordCard
          tag="흥미"
          tagColor="#f85057"
          tagBg="#fee3e4"
          text="영화보기 좋은 삼성 TV 추천해줘"
          onClick={() => handleKeywordClick("영화보기 좋은 삼성 TV 추천해줘")}
        />
        <KeywordCard
          tag="특화"
          tagColor="#ff9500"
          tagBg="#ffeed6"
          text="콘솔 Gaming 하기 좋은 TV 알려줘"
          onClick={() => handleKeywordClick("콘솔 Gaming 하기 좋은 TV 알려줘")}
        />
        <KeywordCard
          tag="정보"
          tagColor="#00d694"
          tagBg="#d6f8ee"
          text="로컬디밍 TV중에 가성비 좋은게 뭐야?"
          onClick={() =>
            handleKeywordClick("로컬디밍 TV중에 가성비 좋은게 뭐야?")
          }
        />
      </div>
    </div>
  );
};

export default SmartRecommend;
