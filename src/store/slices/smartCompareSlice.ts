import { createSlice } from "@reduxjs/toolkit";
import { getAssetUrl } from "../../utils/getAssetUrl";

interface ProductDetail {
  label: string;
  value: string;
  highlight?: boolean; // true면 빨간색으로 표시
}

interface Product {
  id: string;
  title: string;
  image: string;
  details?: ProductDetail[]; // 상세 정보 리스트
}

interface SmartCompareState {
  product1Input: string;
  product1Title: string; // Card title - only changes when "리스트에 추가" is clicked
  product2Input: string;
  showProduct1Options: boolean;
  showProduct2Options: boolean;
  product1Keywords: string[];
  productList: Product[]; // List of products added
  showResult: boolean; // 비교 결과 화면 표시 여부
}

const initialState: SmartCompareState = {
  product1Input: "",
  product1Title: "제품 1",
  product2Input: "",
  showProduct1Options: false,
  showProduct2Options: false,
  product1Keywords: [],
  productList: [],
  showResult: false,
};

// Mock product database
const mockProducts: Record<string, Product> = {
  "삼성 2025 Neo QLED 65QNF80": {
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
  "삼성 2023 Neo QLED 65QNF80": {
    id: "6",
    title: "삼성 2023 Neo QLED\n65QNF80",
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
  "삼성 2023 QLED Q60F": {
    id: "7",
    title: "삼성 2023 QLED Q60F",
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
};

const smartCompareSlice = createSlice({
  name: "smartCompare",
  initialState,
  reducers: {
    setProduct1Input: (state, action: { payload: string }) => {
      state.product1Input = action.payload;
      // Show keywords immediately when text is entered
      if (action.payload.trim().length > 0) {
        state.showProduct1Options = true;
        state.product1Keywords = [
          "삼성 2025 Neo QLED 65QNF80",
          "삼성 2025 QLED Q60F",
          "삼성 2025 Neo QLED QNF90",
          "LG OLED 65C4ENA",
          "2025 Micro RGB",
        ];
      } else {
        state.showProduct1Options = false;
        state.product1Keywords = [];
      }
    },
    addProductToList: (state) => {
      // Called when "리스트에 추가" button is clicked
      const keyword = state.product1Input.trim();
      if (keyword.length > 0) {
        // Query mock product database
        const product = mockProducts[keyword];
        if (product) {
          // Add to product list if not already added
          const exists = state.productList.some((p) => p.id === product.id);
          if (!exists) {
            state.productList.push(product);
          }
        } else {
          // Add All Product related - mockProducts의 모든 제품을 productList에 추가
          const allProducts = Object.values(mockProducts);
          allProducts.forEach((product) => {
            const exists = state.productList.some((p) => p.id === product.id);
            if (!exists) {
              state.productList.push(product);
            }
          });
        }
        // Clear input and hide options
        state.product1Input = "";
        state.showProduct1Options = false;
        state.product1Keywords = [];
      }
    },
    replaceProduct1WithKeyword: (state, action: { payload: string }) => {
      // Replace entire input with keyword
      state.product1Input = action.payload;
    },
    setProduct2Input: (state, action: { payload: string }) => {
      state.product2Input = action.payload;
      state.showProduct2Options = action.payload.trim().length > 0;
    },
    removeProductFromList: (state, action: { payload: string }) => {
      // Remove product by id
      state.productList = state.productList.filter(
        (product) => product.id !== action.payload
      );
    },
    clearProduct1: (state) => {
      state.product1Input = "";
      state.product1Title = "제품 1";
      state.showProduct1Options = false;
      state.product1Keywords = [];
    },
    clearProduct2: (state) => {
      state.product2Input = "";
      state.showProduct2Options = false;
    },
    setShowResult: (state, action: { payload: boolean }) => {
      state.showResult = action.payload;
    },
    resetSmartCompare: (state) => {
      state.product1Input = "";
      state.product1Title = "제품 1";
      state.product2Input = "";
      state.showProduct1Options = false;
      state.showProduct2Options = false;
      state.product1Keywords = [];
      state.showResult = false;
    },
  },
});

export const {
  setProduct1Input,
  addProductToList,
  replaceProduct1WithKeyword,
  removeProductFromList,
  setProduct2Input,
  clearProduct1,
  clearProduct2,
  setShowResult,
  resetSmartCompare,
} = smartCompareSlice.actions;

export default smartCompareSlice.reducer;
