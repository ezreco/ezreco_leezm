import { createSlice } from "@reduxjs/toolkit";
import { getAssetUrl } from "../../utils/getAssetUrl";

interface Product {
  id: string;
  title: string;
  image: string;
  differentiators?: string[];
  specs?: string[];
  highlightedDifferentiators?: { text: string; isHighlighted: boolean }[];
  highlightedSpecs?: { text: string; isHighlighted: boolean }[];
}

interface TournamentState {
  category: "TV" | "모바일";
  inputText: string;
  productList: Product[];
  currentRound: number;
  isLoading: boolean;
  currentMatchIndex: number; // 현재 매치 인덱스 (0: 4강 1차, 1: 4강 2차, 2: 결승, 3: 토너먼트 종료)
  allProducts: Product[]; // 초기 4개 제품 (토너먼트 전체용)
  semifinalWinners: Product[]; // 4강 승자 2명
  finalWinner: Product | null; // 최종 우승자
}

const initialState: TournamentState = {
  category: "TV",
  inputText: "",
  productList: [],
  currentRound: 1,
  isLoading: false,
  currentMatchIndex: 0,
  allProducts: [],
  semifinalWinners: [],
  finalWinner: null,
};

// Mock product database
const mockProducts: Record<string, Product> = {
  "삼성 2025 Neo QLED 65QNF80": {
    id: "1",
    title: "삼성 2025 Neo QLED\n65QNF80",
    image: getAssetUrl("src/assets/tvs/tv1.png"),
    highlightedDifferentiators: [
      { text: "Mini-LED 백라이트 기반의 Neo QLED", isHighlighted: false },
      { text: "직하형 로컬디밍 모델 중에 최상위 모델로", isHighlighted: false },
      { text: "명암비와 밝기 우수", isHighlighted: true },
    ],
    highlightedSpecs: [
      { text: "가격 : 3,200,000원", isHighlighted: false },
      { text: "NQ4 AI Gen3 프로세서, 4K AI 업스케일링 Pro", isHighlighted: false },
      { text: "Quantum Matrix", isHighlighted: true },
      { text: ", Glare Free 기술", isHighlighted: false },
      { text: "60W 4.2.2 채널 스피커, Object Tracking Sound+", isHighlighted: false },
    ],
  },
  "삼성 2025 QLED Q60F": {
    id: "2",
    title: "삼성 2025 QLED Q60F",
    image: getAssetUrl("src/assets/tvs/tv2.png"),
    highlightedDifferentiators: [
      { text: "Quntum Dot 기반 Dual LED 백라이트 적용", isHighlighted: false },
      { text: "100% 컬러볼륨 제공과", isHighlighted: false },
      { text: "QLED 모델 중에 ", isHighlighted: false },
      { text: "가격 경쟁력 우수", isHighlighted: true },
    ],
    highlightedSpecs: [
      { text: "가격 : 1,200,000원", isHighlighted: true },
      { text: "Quantum Processor Lite 4K, 4K 업스케일링", isHighlighted: false },
      { text: "Quantum HDR, Tizen OS", isHighlighted: false },
      { text: "HDMI x 3개, USB, Wi-Fi, Ethernet 지원", isHighlighted: false },
    ],
  },
  "삼성 2025 Neo QLED QNF90": {
    id: "3",
    title: "삼성 2025 Neo QLED\nQNF90",
    image: getAssetUrl("src/assets/tvs/tv3.png"),
    highlightedDifferentiators: [
      { text: "Mini-LED 기반 Neo QLED 기술로", isHighlighted: false },
      { text: "탁월한 명암비와 HDR 성능 제공", isHighlighted: true },
      { text: "게이밍에 최적화된 144Hz 주사율 지원", isHighlighted: false },
    ],
    highlightedSpecs: [
      { text: "가격 : 4,500,000원", isHighlighted: false },
      { text: "NQ4 AI Gen3 프로세서, 8K AI 업스케일링", isHighlighted: true },
      { text: "Infinity Air Design, Ultra Slim 디자인", isHighlighted: false },
      { text: "70W 6.2.4 채널 스피커, Dolby Atmos 지원", isHighlighted: false },
    ],
  },
  "LG OLED 65C4ENA": {
    id: "4",
    title: "LG OLED 65C4ENA",
    image: getAssetUrl("src/assets/tvs/tv4.png"),
    highlightedDifferentiators: [
      { text: "자체발광 OLED 패널로", isHighlighted: false },
      { text: "완벽한 블랙과 무한대 명암비", isHighlighted: true },
      { text: "넓은 시야각과 뛰어난 색재현력", isHighlighted: false },
    ],
    highlightedSpecs: [
      { text: "가격 : 2,800,000원", isHighlighted: false },
      { text: "α9 AI 프로세서 Gen7, AI Picture Pro", isHighlighted: false },
      { text: "120Hz 주사율, HDMI 2.1 x 4개", isHighlighted: true },
      { text: "40W 2.2 채널 스피커, Dolby Vision IQ & Atmos", isHighlighted: false },
    ],
  },
};

const tournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    setCategory: (state, action: { payload: "TV" | "모바일" }) => {
      state.category = action.payload;
    },
    setInputText: (state, action: { payload: string }) => {
      state.inputText = action.payload;
    },
    loadProducts: (state) => {
      state.isLoading = true;
      // Mock: 카테고리에 따라 제품 4개 로드
      const productsToLoad = Object.values(mockProducts).slice(0, 4);
      state.allProducts = productsToLoad;
      state.productList = productsToLoad;
      state.currentRound = 1;
      state.currentMatchIndex = 0;
      state.semifinalWinners = [];
      state.finalWinner = null;
      state.isLoading = false;
    },
    selectWinner: (state, action: { payload: Product }) => {
      const winner = action.payload;

      if (state.currentMatchIndex === 0) {
        // 4강 1차 매치 완료 (제품 1 vs 제품 2)
        state.semifinalWinners.push(winner);
        state.currentMatchIndex = 1;
      } else if (state.currentMatchIndex === 1) {
        // 4강 2차 매치 완료 (제품 3 vs 제품 4)
        state.semifinalWinners.push(winner);
        state.currentMatchIndex = 2;
      } else if (state.currentMatchIndex === 2) {
        // 결승 완료 - 최종 우승자 저장
        state.finalWinner = winner;
        state.currentMatchIndex = 3; // 토너먼트 종료 표시
      }
    },
    setCurrentRound: (state, action: { payload: number }) => {
      state.currentRound = action.payload;
    },
    resetTournament: (state) => {
      state.category = "TV";
      state.inputText = "";
      state.productList = [];
      state.currentRound = 1;
      state.isLoading = false;
      state.currentMatchIndex = 0;
      state.allProducts = [];
      state.semifinalWinners = [];
      state.finalWinner = null;
    },
  },
});

export const {
  setCategory,
  setInputText,
  loadProducts,
  selectWinner,
  setCurrentRound,
  resetTournament,
} = tournamentSlice.actions;

export default tournamentSlice.reducer;
