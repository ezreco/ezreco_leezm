import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import {
  setProduct1Input,
  addProductToList,
  replaceProduct1WithKeyword,
} from "../store/slices/smartCompareSlice";
import {
  setTopicInput,
  autoAddProducts,
} from "../store/slices/personaDiscussionSlice";
import { setInputText, loadProducts } from "../store/slices/tournamentSlice";
import { setAccessToken, fetchUserData } from "../store/slices/loginSlice";
import { resetUI } from "../store/slices/uiSlice";
import { resetSmartCompare } from "../store/slices/smartCompareSlice";
import { resetPersonaDiscussion } from "../store/slices/personaDiscussionSlice";
import { resetTournament } from "../store/slices/tournamentSlice";
import TabGroup from "../components/TabGroup";
import SecondaryTabGroup from "../components/SecondaryTabGroup";
import InputSection from "../components/InputSection";
import AuxKeyword from "../components/AuxKeyword";

// Tab Components
import SmartRecommend from "../components/tabs/SmartRecommend";
import Tournament from "../components/tabs/Tournament";
import PersonaDiscussion from "../components/tabs/PersonaDiscussion";
import SmartCompare from "../components/tabs/SmartCompare";
import SpecTool from "../components/tabs/SpecTool";

// Image assets
import graBg from "@/assets/icons/gra_bg.png";

// Main HomePage Component
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {
    product1Input,
    showProduct1Options,
    product1Keywords,
    productList,
    showResult,
  } = useSelector((state: RootState) => state.smartCompare);
  const { topicInput, showResult: showPersonaResult } = useSelector(
    (state: RootState) => state.personaDiscussion
  );
  const { inputText: tournamentInput } = useSelector(
    (state: RootState) => state.tournament
  );
  const [primaryTab, setPrimaryTab] = useState("recommend");
  const [secondaryTab, setSecondaryTab] = useState("smart");

  // Reset all slices except login when HomePage is mounted
  useEffect(() => {
    dispatch(resetUI());
    dispatch(resetSmartCompare());
    dispatch(resetPersonaDiscussion());
    dispatch(resetTournament());
  }, [dispatch]);

  // Handle navigation state for tab selection
  useEffect(() => {
    const state = location.state as { selectedTab?: string } | null;
    if (state?.selectedTab) {
      setPrimaryTab("recommend");
      setSecondaryTab(state.selectedTab);
      // Clear the state after using it
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [location]);

  // Check for accessToken in query params
  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    if (accessToken) {
      dispatch(setAccessToken(accessToken));
      // Fetch user data after setting the token
      dispatch(fetchUserData());
      // Remove the accessToken from URL to keep it clean
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams, dispatch]);

  // Handle keyword click - replace entire input with keyword
  const handleKeywordClick = (keyword: string) => {
    dispatch(replaceProduct1WithKeyword(keyword));
  };

  const primaryTabs = [
    { id: "recommend", label: "추천하기" },
    { id: "compare", label: "비교하기" },
  ];

  // Secondary tabs change based on primary tab selection
  const getSecondaryTabs = () => {
    if (primaryTab === "recommend") {
      return [
        { id: "smart", label: "스마트 추천" },
        { id: "tournament", label: "EZ 토너먼트" },
        { id: "persona", label: "페르소나 토론" },
      ];
    } else if (primaryTab === "compare") {
      return [
        { id: "smartCompare", label: "스마트 비교" },
        { id: "specTool", label: "스펙비교 툴" },
      ];
    }
    return [];
  };

  const handlePrimaryTabChange = (tabId: string) => {
    setPrimaryTab(tabId);
    // Reset secondary tab to first option when primary tab changes
    const newSecondaryTabs =
      tabId === "recommend"
        ? [
            { id: "smart", label: "스마트 추천" },
            { id: "tournament", label: "토너먼트" },
            { id: "persona", label: "페르소나 토론" },
          ]
        : [
            { id: "smartCompare", label: "스마트 비교" },
            { id: "specTool", label: "스펙비교 툴" },
          ];
    setSecondaryTab(newSecondaryTabs[0]?.id || "");
  };

  // Handle input submission
  const handleInputSubmit = (message: string) => {
    if (message.trim()) {
      // If on Smart Compare tab, add product to list
      if (primaryTab === "compare" && secondaryTab === "smartCompare") {
        dispatch(addProductToList());
      } else if (primaryTab === "recommend" && secondaryTab === "persona") {
        // If on Persona Discussion tab, auto add products
        dispatch(autoAddProducts());
      } else if (primaryTab === "recommend" && secondaryTab === "tournament") {
        // If on Tournament tab, load products
        dispatch(loadProducts());
      } else {
        // Otherwise navigate to smart recommend
        navigate("/smart-recommend", { state: { message } });
      }
    }
  };

  // Handle voice chat button click
  const handleVoiceChatClick = () => {
    navigate("/voice-chat");
  };

  // Render content based on selected tabs
  const renderTabContent = () => {
    if (primaryTab === "recommend") {
      switch (secondaryTab) {
        case "smart":
          return <SmartRecommend />;
        case "tournament":
          return <Tournament />;
        case "persona":
          return <PersonaDiscussion />;
        default:
          return <SmartRecommend />;
      }
    } else if (primaryTab === "compare") {
      switch (secondaryTab) {
        case "smartCompare":
          return <SmartCompare />;
        case "specTool":
          return <SpecTool />;
        default:
          return <SmartCompare />;
      }
    }
    return null;
  };

  return (
    <div className="w-full h-screen relative">
      {/*  Background Layer - gra_bg.png - 스마트 추천 탭에서만 표시 */}
      {primaryTab === "recommend" && secondaryTab === "smart" && (
        <div className="absolute inset-0">
          <img
            alt=""
            className="block w-full h-full object-cover"
            src={graBg}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full">
        {/* Top Tab Navigation */}
        <div className="absolute top-[48px] left-1/2 transform -translate-x-1/2 w-[397px] flex flex-col gap-[24px] items-center z-20">
          {/* Primary Tabs */}
          <TabGroup
            tabs={primaryTabs}
            activeTabId={primaryTab}
            onTabChange={handlePrimaryTabChange}
            tabWidth={113}
          />

          {/* Secondary Tabs */}
          <SecondaryTabGroup
            tabs={getSecondaryTabs()}
            activeTabId={secondaryTab}
            onTabChange={setSecondaryTab}
          />
        </div>

        {/* Dynamic Tab Content */}
        {renderTabContent()}

        {/* Input Section - 비교 결과 화면, SpecTool, 페르소나 결과 화면일 때는 숨김 */}
        {!(
          primaryTab === "compare" &&
          secondaryTab === "smartCompare" &&
          showResult
        ) &&
          !(primaryTab === "compare" && secondaryTab === "specTool") &&
          !(
            primaryTab === "recommend" &&
            secondaryTab === "persona" &&
            showPersonaResult
          ) && (
            <InputSection
              onSubmit={handleInputSubmit}
              onVoiceChatClick={handleVoiceChatClick}
              variant={
                (primaryTab === "compare" && secondaryTab === "smartCompare") ||
                (primaryTab === "recommend" && secondaryTab === "persona")
                  ? "compare"
                  : primaryTab === "recommend" && secondaryTab === "tournament"
                  ? "tournament"
                  : "default"
              }
              compareTitle={
                primaryTab === "compare" && secondaryTab === "smartCompare"
                  ? `제품 ${productList.length + 1}`
                  : primaryTab === "recommend" && secondaryTab === "persona"
                  ? "토론 주제"
                  : "제품 1"
              }
              value={
                primaryTab === "compare" && secondaryTab === "smartCompare"
                  ? product1Input
                  : primaryTab === "recommend" && secondaryTab === "persona"
                  ? topicInput
                  : primaryTab === "recommend" && secondaryTab === "tournament"
                  ? tournamentInput
                  : undefined
              }
              onChange={(value) => {
                if (
                  primaryTab === "compare" &&
                  secondaryTab === "smartCompare"
                ) {
                  dispatch(setProduct1Input(value));
                } else if (
                  primaryTab === "recommend" &&
                  secondaryTab === "persona"
                ) {
                  dispatch(setTopicInput(value));
                } else if (
                  primaryTab === "recommend" &&
                  secondaryTab === "tournament"
                ) {
                  dispatch(setInputText(value));
                }
              }}
              placeholder={
                primaryTab === "compare" && secondaryTab === "smartCompare"
                  ? `제품 ${
                      productList.length + 1
                    }에 넣을 모델명 또는 원하는 타입을 입력해주세요`
                  : primaryTab === "recommend" && secondaryTab === "persona"
                  ? "어떤 것을 토론하고 싶으세요?"
                  : primaryTab === "recommend" && secondaryTab === "tournament"
                  ? "비교하고 싶은 제품명 또는 스펙을 자연어로 입력해주세요."
                  : "EZRoco에게 찾고 싶은 제품을 알려주세요."
              }
              maxWidthClass="min-w-[822px]"
              minWidthClass="min-w-[822px]"
              auxiliaryInputs={
                primaryTab === "compare" &&
                secondaryTab === "smartCompare" &&
                showProduct1Options &&
                product1Keywords.length > 0 ? (
                  <AuxKeyword
                    keywords={product1Keywords.map((keyword, index) => ({
                      id: `keyword-${index}`,
                      label: keyword,
                    }))}
                    onKeywordClick={handleKeywordClick}
                  />
                ) : undefined
              }
              hideVoiceButton={
                primaryTab === "recommend" && secondaryTab === "tournament"
              }
            />
          )}
      </div>
    </div>
  );
};

export default HomePage;
