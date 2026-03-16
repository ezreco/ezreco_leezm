import { createSlice } from "@reduxjs/toolkit";
import { getAssetUrl } from "../../utils/getAssetUrl";

interface ProductDetail {
  label: string;
  value: string;
  highlight?: boolean;
}

interface Product {
  id: string;
  title: string;
  image: string;
  details?: ProductDetail[];
}

interface ChatMessage {
  id: string;
  personaName: string;
  personaRole: string;
  message: string;
  timestamp: number;
}

interface PersonaDiscussionState {
  topicInput: string; // 토론 주제 입력
  productList: Product[]; // 자동으로 추가된 제품 리스트
  chatMessages: ChatMessage[]; // 페르소나 토론 채팅 메시지
  showResult: boolean; // 토론 결과 화면 표시 여부
  isLoading: boolean; // 제품 자동 추가 로딩 상태
}

const initialState: PersonaDiscussionState = {
  topicInput: "",
  productList: [],
  chatMessages: [],
  showResult: false,
  isLoading: false,
};

// Mock product database (SmartCompare와 동일)
const mockProducts: Record<string, Product> = {
  "삼성 2025 Neo QLED 65QNF80": {
    id: "1",
    title: "삼성 2025 Neo QLED\n65QNF80",
    image: getAssetUrl("src/assets/tvs/tv1.png"),
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
  "삼성 2025 QLED Q60F": {
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
  "삼성 2025 Neo QLED QNF90": {
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
  "LG OLED 65C4ENA": {
    id: "4",
    title: "LG OLED 65C4ENA",
    image: getAssetUrl("src/assets/tvs/tv4.png"),
    details: [
      { label: "가격", value: "2,687,700원" },
      { label: "패널/백라이트", value: "Mini-LED 백라이트 기반의\nNEO QLED" },
      {
        label: "HDR∙최대 밝기 측정값",
        value: "1,100–1,160 nits",
        highlight: true,
      },
      {
        label: "AI 주요 기능",
        value: "Vision AI로 콘텐츠 업스케일 및\n장면 음향 자동 최적화",
      },
      { label: "내장 오디오", value: "Dolby Atmos 일부 지원" },
    ],
  },
  "2025 Micro RGB": {
    id: "5",
    title: "2025 Micro RGB",
    image: getAssetUrl("src/assets/tvs/tv5.png"),
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
};

// Mock chat messages
const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    personaName: "Steve",
    personaRole: "스펙비교 전문가",
    message: "Neo QLED로 우수한 컬러 표현력과 명암비를 제공합니다.",
    timestamp: Date.now() - 6000,
  },
  {
    id: "2",
    personaName: "Jeff",
    personaRole: "서비스 비교 전문가",
    message:
      "OLED의 명암비는 완벽한 블랙을 구현하여 더욱 생생한 화질을 제공합니다.",
    timestamp: Date.now() - 5000,
  },
  {
    id: "3",
    personaName: "Miranda",
    personaRole: "디자인 비교 전문가",
    message: "2025년에 출시된 최신 AI 업스케일링 기술이 적용되었습니다.",
    timestamp: Date.now() - 4000,
  },
  {
    id: "4",
    personaName: "Steve",
    personaRole: "스펙 비교 전문가",
    message: "Quantum Matrix Technology로 디테일한 대비감을 선사합니다.",
    timestamp: Date.now() - 3000,
  },
  {
    id: "5",
    personaName: "Jeff",
    personaRole: "서비스 비교 전문가",
    message: "돌비 비전과 필름메이커 모드로 홈 시네마 경험을 극대화합니다.",
    timestamp: Date.now() - 2000,
  },
];

const personaDiscussionSlice = createSlice({
  name: "personaDiscussion",
  initialState,
  reducers: {
    setTopicInput: (state, action: { payload: string }) => {
      state.topicInput = action.payload;
    },
    // 자동으로 제품 추가 (토론 주제 기반)
    autoAddProducts: (state) => {
      state.isLoading = true;
      // Mock: 토론 주제와 관련된 제품을 자동으로 추가
      // 실제로는 AI API를 통해 제품을 추천받을 것임
      const productsToAdd = Object.values(mockProducts).slice(0, 3);
      state.productList = productsToAdd;
      state.isLoading = false;
    },
    // 채팅 메시지 로드
    loadChatMessages: (state) => {
      state.chatMessages = mockChatMessages;
    },
    // 채팅 메시지 추가
    addChatMessage: (state, action: { payload: ChatMessage }) => {
      state.chatMessages.push(action.payload);
    },
    removeProductFromList: (state, action: { payload: string }) => {
      state.productList = state.productList.filter(
        (product) => product.id !== action.payload
      );
    },
    setShowResult: (state, action: { payload: boolean }) => {
      state.showResult = action.payload;
    },
    resetPersonaDiscussion: (state) => {
      state.topicInput = "";
      state.productList = [];
      state.chatMessages = [];
      state.showResult = false;
      state.isLoading = false;
    },
  },
});

export const {
  setTopicInput,
  autoAddProducts,
  loadChatMessages,
  addChatMessage,
  removeProductFromList,
  setShowResult,
  resetPersonaDiscussion,
} = personaDiscussionSlice.actions;

export default personaDiscussionSlice.reducer;
