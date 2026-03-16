// 추론 단계 관리 store

export interface InferenceStep {
  step: number;
  delay: number; // 이전 단계로부터의 딜레이 (ms)
}

export interface InferenceData {
  // Step 1 data
  step1?: {
    progress1: string;
    progress2: string;
    progress3: string;
    progress4: string;
    progress5: string;
    progress5Title2: string;
    progress6: string;
  };

  // Step 2 data
  step2?: {
    usagePattern: Array<{ percentage: number; label: string }>;
    specs: string[];
    techSpecs: Array<{ label: string; percentage: number }>;
    pieChart: Array<{ label: string; percentage: number; color: string }>;
    customizationImportance: Array<{
      label: string;
      percentage: number;
      color: string;
    }>;
    userPreferences: string[];
    environmentTags: string[];
    contextTags: string[];
    weightAnalysis: {
      bubbles: Array<{
        label: string;
        percentage: number;
        x: number;
        y: number;
        size: number;
      }>;
      disclaimer: string;
    };
    weightList: Array<{
      percentage: number;
      labels: string[];
    }>;
  };
}

class InferenceStore {
  private data: InferenceData = {};

  // 추론 단계 시퀀스 정의
  private stepSequence: InferenceStep[] = [
    { step: 1, delay: 1000 }, // 초기 로딩 상태
    { step: 2, delay: 2000 }, // 상세 분석 카드 표시
    { step: 3, delay: 3000 }, // 파이 차트 업데이트
    { step: 4, delay: 2000 }, // 최종 완료
  ];

  // Mock data generator
  generateMockData(): InferenceData {
    return {
      step1: {
        progress1: "전문가 추론 DB와 매칭 중입니다",
        progress2: "질문 분석 중입니다",
        progress3: "사용 환경을 분석하고 있어요",
        progress4: "말 속에 담긴 상황 표현도 인식하고 있어요",
        progress5: "사용자 환경 기반 검색 결과들이 도출되고 있어요",
        progress5Title2:
          "사용자의 TV 사용 환경에 따라 중요도를 고려하여 가중치를 산정하였어요",
        progress6: "사용자 환경에 따른 중요도가 반영되었어요.",
      },
      step2: {
        usagePattern: [
          { percentage: 70, label: "HDR Movies" },
          { percentage: 30, label: "Sports" },
        ],
        specs: ["삼성", "엘지", "65인치"],
        techSpecs: [
          { label: "Viewing Angle", percentage: 15 },
          { label: "Apps and Features", percentage: 1 },
          { label: "Black Frame Insertion", percentage: 1 },
          { label: "Color Gamut", percentage: 1 },
          { label: "Contrast", percentage: 3 },
          { label: "Reflections", percentage: 3 },
          { label: "Supported Resolutions", percentage: 1 },
        ],
        pieChart: [
          { label: "Bright Room", percentage: 5, color: "#BDD0FC" },
          { label: "Home Theater", percentage: 10, color: "#6B8EF5" },
          { label: "Game Clairity", percentage: 30, color: "#3B82F6" },
          { label: "Motion Handling", percentage: 55, color: "#1E3A8A" },
        ],
        customizationImportance: [
          { label: "가격 민감도", percentage: 55, color: "#0106FF" },
          { label: "브랜드 신뢰도", percentage: 10, color: "#0106FF" },
          { label: "소비자 선호도", percentage: 35, color: "#0106FF" },
        ],
        userPreferences: [
          "삼성",
          "엘지",
          "영화용",
          "65인치",
          "거실에서",
          "영화",
          "를 주로",
          "가끔",
          "스포츠",
          "관람",
        ],
        environmentTags: ["영화용", "스포츠 관람", "거실"],
        contextTags: ["영화를 주로", "가끔 스포츠"],
        weightAnalysis: {
          bubbles: [
            {
              label: "Viewing Angle",
              percentage: 15,
              x: 28.25,
              y: 42,
              size: 48,
            },
            { label: "Reflections", percentage: 3, x: 45.12, y: 55, size: 36 },
            { label: "Contrast", percentage: 3, x: 80.28, y: 18, size: 36 },
            {
              label: "Apps and Features",
              percentage: 1,
              x: 68.9,
              y: 30,
              size: 28,
            },
            { label: "BFI", percentage: 1, x: 52.24, y: 36, size: 28 },
            { label: "Color Gamut", percentage: 1, x: 24.8, y: 14, size: 28 },
            {
              label: "Supported Resolutions",
              percentage: 1,
              x: 68.5,
              y: 70,
              size: 28,
            },
          ],
          disclaimer:
            "* 이 가중치는 사용자의 특정 환경과 선호도에 따라 조정될 수 있습니다.",
        },
        weightList: [
          {
            percentage: 15,
            labels: ["Viewing Angle"],
          },
          {
            percentage: 1,
            labels: [
              "Apps and Features",
              "Contrast",
              "Black Frame Insertion",
              "Reflections",
              "Color Gamut",
              "Supported Resolutions",
            ],
          },
        ],
      },
    };
  }

  getData(): InferenceData {
    if (Object.keys(this.data).length === 0) {
      this.data = this.generateMockData();
    }
    return this.data;
  }

  getStepSequence(): InferenceStep[] {
    return this.stepSequence;
  }

  // Update pie chart data for step 3 (min version with Motion Handling at 70%)
  updatePieChartForStep3(): void {
    if (this.data.step2) {
      this.data.step2.pieChart = [
        { label: "Motion Handling", percentage: 70, color: "#1E3A8A" },
        { label: "Home Theater", percentage: 20, color: "#6B8EF5" },
        { label: "Mixed Usage", percentage: 10, color: "#BDD0FC" },
      ];
      this.data.step2.customizationImportance = [
        { label: "가격 민감도", percentage: 55, color: "#0106FF" },
        { label: "브랜드 신뢰도", percentage: 10, color: "#0106FF" },
        { label: "소비자 선호도", percentage: 35, color: "#0106FF" },
      ];
    }
  }
}

export const inferenceStore = new InferenceStore();
