export type AuxInputType = "choose" | "range" | "text" | "none" | "both";

export interface AuxInputContent {
  type: AuxInputType;
  label?: string;
  options?: Array<{
    id: string;
    label: string;
    subLabel?: string;
  }>;
  range?: {
    values: Array<{ label: string; value: number }>;
    defaultRange?: [number, number];
  };
  textPlaceholder?: string;
  // both 타입을 위한 추가 속성
  chooseOptions?: Array<{
    id: string;
    label: string;
    subLabel?: string;
  }>;
  rangeConfig?: {
    values: Array<{ id?: string; label: string; value: number }>;
    defaultRange?: [number, number];
  };
}

interface AIResponse {
  options?: string[];
  message?: string;
  auxInput?: AuxInputContent;
  showInference?: boolean; // 추론 화면 표시 여부
}

// Usage Purpose Profile - 사용 목적별 TV 추천 프로필
export interface UsagePurposeProfile {
  uiType: string;
  purpose: string;
  viewingArea?: string; // 관람인 (평수)
  width?: string; // 넓이
  viewingDistance?: string; // 시청 거리 (M)
  spaceBrightness?: string; // 공간 밝기 (평)
  userAge?: string; // 사용 연령
  lifestyle?: string; // 라이프 스타일
  otherSensitivity?: string; // 기타 민감도
  generalSensitivity?: string; // 보편은 민감도
  consumerSensitivity?: string; // 소비자 민감도
  category?: string;
  white?: string;
  colorTemp?: string; // 색온도/픽셀
  recommendedPanelType?: string; // 추천 패널타입
  recommendedResolution?: string; // 추천 해상도
  finish?: string; // seen finish
  dolbyVision?: string;
  panelH2?: string;
}

// User information storage
export interface UserPreferences {
  purpose?: string[]; // 사용 목적 (Mixed Usage, Home Theater, Bright Room, Sports, Gaming 등)
  screenSize?: string; // 사이즈 (80인치, 90인치, 100인치 등)
  budget?: string; // 가격대 (100만원 이상, 200만원 이상, 300만원 이상 등)
  users?: string[]; // 실사용자 (나(본인), 부부, 가족, 모든 가족, 기타 등)
  installationSpace?: string; // 사용공간 (거실, 안방, 서재, 아직 안정함, 기타 등)
  brand?: string; // 선호브랜드 (모든 브랜드, 삼성, LG, 소니, 기타 등)
  panelType?: string; // 패널타입 (레인지 슬라이드, OLED, QLED, LED, LCD 등)
  resolution?: string; // 해상도 (8K, 4K, FHD 등)
  releaseYear?: string; // 출시연도 (2025년 출시, 2024년, 2023년 이전 등)
  frequency?: string; // 사용 빈도 (매일 사용, 주말에만 등)
  contentTypes?: string[]; // 시청 콘텐츠 유형 (영화/드라마, 뉴스, 게임 등)
  conversationHistory?: string[]; // 대화 기록
  // 테이블 기반 추가 속성들
  viewingDistance?: string; // 시청 거리
  spaceBrightness?: string; // 공간 밝기
  viewingArea?: string; // 관람인 (평수)
  // 입력 순서 추적
  inputOrder?: string[]; // 사용자가 입력한 순서대로 카테고리 이름 저장
}

// Store instance to hold user data
class UserDataStore {
  private userPreferences: UserPreferences = {};

  // Get current user preferences
  getUserPreferences(): UserPreferences {
    return { ...this.userPreferences };
  }

  // Update user preference for a specific category
  updatePreference(
    category: keyof UserPreferences,
    value: string | string[]
  ): void {
    if (category === "conversationHistory") {
      if (typeof value === "string") {
        this.userPreferences.conversationHistory = [
          ...(this.userPreferences.conversationHistory || []),
          value,
        ];
      }
    } else if (Array.isArray(value)) {
      this.userPreferences[category] = value as string[] & string;
    } else {
      this.userPreferences[category] = value as string[] & string;
    }

    // Track input order (except for conversationHistory and inputOrder itself)
    if (category !== "conversationHistory" && category !== "inputOrder") {
      const currentOrder = this.userPreferences.inputOrder || [];
      // Only add if this category isn't already in the order list
      if (!currentOrder.includes(category)) {
        this.userPreferences.inputOrder = [...currentOrder, category];
      }
    }
  }

  // Clear all preferences (reset session)
  clearPreferences(): void {
    this.userPreferences = {};
  }

  // Get recommendations based on stored preferences
  getStoredInfo(): string {
    const prefs = this.userPreferences;
    const parts: string[] = [];

    if (prefs.purpose?.length) {
      parts.push(`목적: ${prefs.purpose.join(", ")}`);
    }
    if (prefs.screenSize) {
      parts.push(`사이즈: ${prefs.screenSize}`);
    }
    if (prefs.budget) {
      parts.push(`가격대: ${prefs.budget}`);
    }
    if (prefs.users?.length) {
      parts.push(`실사용자: ${prefs.users.join(", ")}`);
    }
    if (prefs.installationSpace) {
      parts.push(`사용공간: ${prefs.installationSpace}`);
    }
    if (prefs.brand) {
      parts.push(`선호브랜드: ${prefs.brand}`);
    }
    if (prefs.panelType) {
      parts.push(`패널타입: ${prefs.panelType}`);
    }
    if (prefs.resolution) {
      parts.push(`해상도: ${prefs.resolution}`);
    }
    if (prefs.releaseYear) {
      parts.push(`출시연도: ${prefs.releaseYear}`);
    }
    if (prefs.frequency) {
      parts.push(`사용빈도: ${prefs.frequency}`);
    }
    if (prefs.contentTypes?.length) {
      parts.push(`콘텐츠: ${prefs.contentTypes.join(", ")}`);
    }
    // 테이블 기반 추가 속성들
    if (prefs.viewingDistance) {
      parts.push(`시청거리: ${prefs.viewingDistance}`);
    }
    if (prefs.spaceBrightness) {
      parts.push(`공간밝기: ${prefs.spaceBrightness}`);
    }
    if (prefs.viewingArea) {
      parts.push(`관람공간: ${prefs.viewingArea}`);
    }

    return parts.length > 0 ? `저장된 정보: ${parts.join(", ")}` : "";
  }
}

// Global instance
const userDataStore = new UserDataStore();

// 사용 목적별 프로필 데이터 (테이블 기반)
const usagePurposeProfiles: Record<string, UsagePurposeProfile> = {
  "Mixed Usage": {
    uiType: "Default",
    purpose: "Mixed Usage",
    viewingArea: "60평 이상",
    viewingDistance: "6M 이상",
    spaceBrightness: "1평",
    userAge: "저평",
    recommendedPanelType: "QLED",
    recommendedResolution: "8K",
    category: "300만원 이상",
    white: "화이트",
    colorTemp: "2025년 출시",
    finish: "무광",
    dolbyVision: "지원",
  },
  "Home Theater": {
    uiType: "Default",
    purpose: "Home Theater",
    viewingArea: "40평",
    viewingDistance: "4M",
    spaceBrightness: "2평",
    userAge: "자녀",
    recommendedPanelType: "QLED",
    recommendedResolution: "4K",
    category: "200만원 이상",
    finish: "유광",
  },
  "Bright Room": {
    uiType: "Default",
    purpose: "Bright Room",
    viewingArea: "30평",
    viewingDistance: "4M 이상",
    spaceBrightness: "3평",
    userAge: "하이",
    recommendedPanelType: "QLED",
    recommendedResolution: "4K",
    category: "100만원 이상",
    generalSensitivity: "적은 볼륨",
  },
  Sports: {
    uiType: "Default",
    purpose: "Sports",
    viewingArea: "20평",
    viewingDistance: "4M 이상",
    spaceBrightness: "4평",
    lifestyle: "자주 직접 비교",
    recommendedPanelType: "QLED",
    recommendedResolution: "FHD",
    category: "80만원 이상",
    consumerSensitivity: "삼성",
  },
  Gaming: {
    uiType: "Default",
    purpose: "Gaming",
    viewingArea: "10평",
    viewingDistance: "2M 이상",
    spaceBrightness: "5평 이상",
    lifestyle: "여행용 자주건",
    recommendedPanelType: "QLED",
    recommendedResolution: "4K",
    consumerSensitivity: "여행",
    panelH2: "IPS",
  },
  일반: {
    uiType: "Default",
    purpose: "일반",
    viewingArea: "옥상",
    recommendedPanelType: "LCD",
    recommendedResolution: "FHD",
    consumerSensitivity: "현대",
    panelH2: "LCD",
  },
};

// 프로필 기반 속성 자동 업데이트
const applyProfileToPreferences = (purposeKey: string): void => {
  const profile = usagePurposeProfiles[purposeKey];
  if (!profile) return;

  // 프로필의 추천 값들을 사용자 선호도에 반영
  if (profile.viewingDistance) {
    userDataStore.updatePreference("viewingDistance", profile.viewingDistance);
  }
  if (profile.viewingArea) {
    userDataStore.updatePreference("viewingArea", profile.viewingArea);
  }
  if (profile.spaceBrightness) {
    userDataStore.updatePreference("spaceBrightness", profile.spaceBrightness);
  }
  if (profile.recommendedPanelType) {
    userDataStore.updatePreference("panelType", profile.recommendedPanelType);
  }
  if (profile.recommendedResolution) {
    userDataStore.updatePreference("resolution", profile.recommendedResolution);
  }
};

interface AIResponseStore {
  getResponse: (userMessage: string) => AIResponse;
  updateUserPreference: (
    category: keyof UserPreferences,
    value: string | string[]
  ) => void;
  getUserPreferences: () => UserPreferences;
  clearUserPreferences: () => void;
  getStoredUserInfo: () => string;
  getUsagePurposeProfile: (purposeKey: string) => UsagePurposeProfile | null;
}

// Analyze and store user information from message
const analyzeAndStoreUserInfo = (message: string): void => {
  const lowerMessage = message.toLowerCase();

  // Store conversation history
  userDataStore.updatePreference("conversationHistory", message);

  // Detect purpose keywords based on table structure
  const purposeKeywords = {
    "Mixed Usage": ["혼합", "mixed", "다양한 용도", "다양한", "여러가지"],
    "Home Theater": ["홈시어터", "home theater", "영화관", "시네마"],
    "Bright Room": ["밝은방", "bright room", "밝은 공간", "밝은"],
    Sports: ["스포츠", "sports", "스포츠 관람", "운동"],
    Gaming: ["게임", "gaming", "게이밍", "플스", "ps5", "xbox"],
    "영화 시청": ["영화", "movie", "cinema", "드라마"],
    "뉴스 시청": ["뉴스", "news"],
    "일반 시청": ["일반", "일반 시청", "tv", "티비"],
  };

  for (const [purpose, keywords] of Object.entries(purposeKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      const currentPurpose = userDataStore.getUserPreferences().purpose || [];
      if (!currentPurpose.includes(purpose)) {
        userDataStore.updatePreference("purpose", [...currentPurpose, purpose]);
        // 프로필 기반 속성 자동 적용
        applyProfileToPreferences(purpose);
      }
    }
  }

  // Detect viewing area (관람 인원)
  const viewingAreaKeywords = {
    "1명": ["1명"],
    "2명": ["2명"],
    "3-4명": ["3-4명", "3명", "4명"],
    "5-6명": ["5-6명", "5명", "6명"],
    "7명 이상": ["7명 이상", "7명", "7+"],
  };
  for (const [area, keywords] of Object.entries(viewingAreaKeywords)) {
    if (keywords.some((keyword) => message.includes(keyword))) {
      userDataStore.updatePreference("viewingArea", area);
      break;
    }
  }

  // Detect viewing distance (시청 거리)
  const distancePattern = /([\d.]+M)\s*~\s*([\d.]+M\+?)/;
  const distanceMatch = message.match(distancePattern);
  if (distanceMatch) {
    userDataStore.updatePreference("viewingDistance", message.trim());
  } else if (message.includes("M")) {
    // Single distance value
    const singleDistance = message.match(/([\d.]+M\+?)/);
    if (singleDistance) {
      userDataStore.updatePreference("viewingDistance", singleDistance[0]);
    }
  }

  // Detect space brightness (공간 밝기)
  const brightnessKeywords = {
    "어두운 편": ["어두운 편"],
    보통: ["보통"],
    "밝은 편": ["밝은 편"],
    "매우 밝음": ["매우 밝음"],
  };
  for (const [brightness, keywords] of Object.entries(brightnessKeywords)) {
    if (keywords.some((keyword) => message.includes(keyword))) {
      userDataStore.updatePreference("spaceBrightness", brightness);
      break;
    }
  }

  // Detect age (나이)
  const ageKeywords = {
    "10-20대": ["10대", "20대", "청소년", "청년", "젊은"],
    "30-40대": ["30대", "40대", "중년", "장년"],
    "50-60대": ["50대", "60대", "중장년", "어르신"],
    "70대 이상": ["70대", "80대", "90대", "노년", "고령"],
  };
  for (const [age, keywords] of Object.entries(ageKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      const currentUsers = userDataStore.getUserPreferences().users || [];
      if (!currentUsers.includes(age)) {
        userDataStore.updatePreference("users", [...currentUsers, age]);
      }
      break;
    }
  }

  // Detect lifestyle
  const lifestyleKeywords = {
    영화애호가: ["영화", "movie", "cinema", "드라마"],
    게이머: ["게임", "gaming", "플스", "ps5", "xbox", "게이머"],
    스포츠팬: ["스포츠", "sports", "축구", "야구"],
    "음악/공연팬": ["음악", "music", "콘서트", "공연"],
    요리사: ["요리", "cooking", "레시피"],
    재택근무자: ["재택", "remote", "재택근무", "집에서"],
    "일반 가정": ["일반", "가정", "가족"],
  };
  for (const [lifestyle, keywords] of Object.entries(lifestyleKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      const currentUsers = userDataStore.getUserPreferences().users || [];
      if (!currentUsers.includes(lifestyle)) {
        userDataStore.updatePreference("users", [...currentUsers, lifestyle]);
      }
    }
  }

  // Detect budget (가격대)
  // Check if it's a range format first (e.g., "300만원 ~ 500만원")
  const budgetRangePattern = /(\d+만원)\s*~\s*(\d+만원\+?)/;
  const budgetRangeMatch = message.match(budgetRangePattern);

  if (budgetRangeMatch) {
    // Store the full range text
    userDataStore.updatePreference("budget", message.trim());
  } else {
    // Check for single budget keywords
    const budgetKeywords = {
      "100만원대": ["100만원", "백만원"],
      "200만원대": ["200만원", "이백만원"],
      "300만원대": ["300만원", "삼백만원"],
      "400만원대": ["400만원", "사백만원"],
      "500만원대": ["500만원", "오백만원"],
      "600만원 이상": ["600만원", "육백만원", "그 이상", "이상"],
    };
    for (const [budget, keywords] of Object.entries(budgetKeywords)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        userDataStore.updatePreference("budget", budget);
        break;
      }
    }
  }

  // Detect screen size
  const sizePattern = /(\d+)\s*인치/;
  const sizeMatch = message.match(sizePattern);
  if (sizeMatch) {
    userDataStore.updatePreference("screenSize", `${sizeMatch[1]}인치`);
  }

  // Detect brand
  const brandKeywords = {
    "모든 브랜드": ["모든 브랜드", "상관없음", "all"],
    삼성: ["삼성", "samsung", "갤럭시"],
    LG: ["lg", "엘지"],
    소니: ["소니", "sony"],
    기타: ["기타", "other", "tcl", "하이센스", "hisense"],
  };
  for (const [brand, keywords] of Object.entries(brandKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      userDataStore.updatePreference("brand", brand);
      break;
    }
  }

  // Detect panel type
  const panelKeywords = {
    상관없음: ["상관없음", "추천", "any"],
    OLED: ["oled"],
    QLED: ["qled"],
    "Mini LED": ["mini led", "miniled"],
    "LED/LCD": ["led/lcd", "led", "lcd"],
  };
  for (const [panel, keywords] of Object.entries(panelKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      userDataStore.updatePreference("panelType", panel);
      break;
    }
  }

  // Detect resolution
  const resolutionKeywords = {
    "4K": ["4k", "uhd", "ultra hd"],
    "8K": ["8k"],
    FHD: ["fhd", "full hd", "1080p"],
  };
  for (const [resolution, keywords] of Object.entries(resolutionKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      userDataStore.updatePreference("resolution", resolution);
      break;
    }
  }

  // Detect release year
  const yearPattern = /20(\d{2})년/;
  const yearMatch = message.match(yearPattern);
  if (yearMatch) {
    userDataStore.updatePreference("releaseYear", `20${yearMatch[1]}년`);
  }

  // Detect installation space
  const spaceKeywords = {
    거실: ["거실", "living room"],
    안방: ["안방", "master bedroom", "침실"],
    서재: ["서재", "study", "공부방"],
    "미디어룸/홈시어터": ["미디어룸", "media room", "홈시어터", "home theater"],
    "게임/취미방": ["게임방", "game room", "취미방"],
  };
  for (const [space, keywords] of Object.entries(spaceKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      userDataStore.updatePreference("installationSpace", space);
      break;
    }
  }

  // Detect content types
  const contentKeywords = {
    "4K 블루레이": ["4k", "블루레이", "blu-ray", "uhd"],
    "스트리밍 (넷플릭스, 디즈니+)": [
      "넷플릭스",
      "netflix",
      "디즈니",
      "disney",
      "스트리밍",
      "streaming",
    ],
    "게임 콘솔 (PS5, Xbox)": ["ps5", "플스", "xbox", "게임", "gaming", "콘솔"],
    "지상파/케이블": ["지상파", "케이블", "tv", "방송"],
    "유튜브/소셜 미디어": ["유튜브", "youtube", "소셜", "social"],
  };
  for (const [contentType, keywords] of Object.entries(contentKeywords)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      const currentContent =
        userDataStore.getUserPreferences().contentTypes || [];
      if (!currentContent.includes(contentType)) {
        userDataStore.updatePreference("contentTypes", [
          ...currentContent,
          contentType,
        ]);
      }
    }
  }
};

export const aiResponseStore: AIResponseStore = {
  getResponse: (userMessage: string): AIResponse => {
    // Analyze and store user information from the message
    analyzeAndStoreUserInfo(userMessage);

    // Get current user preferences
    const prefs = userDataStore.getUserPreferences();

    console.log("[getResponse] Current preferences:", prefs);
    console.log("[getResponse] User message:", userMessage);

    // Sequential preference checking - ask for missing information

    // 1. Check for purpose
    if (!prefs.purpose || prefs.purpose.length === 0) {
      return {
        message:
          "TV 추천을 도와드리겠습니다. 먼저 TV의 주요 사용 목적을 알려주세요.",
        auxInput: {
          type: "choose",
          label: "사용 목적 선택",
          options: [
            {
              id: "mixed",
              label: "다양한 용도",
              subLabel: "영화/게임/일반시청",
            },
            { id: "theater", label: "홈시어터", subLabel: "영화 감상 중심" },
            {
              id: "sports",
              label: "스포츠 관람",
              subLabel: "스포츠 시청 중심",
            },
            { id: "gaming", label: "게이밍", subLabel: "게임 플레이 중심" },
          ],
        },
      };
    }

    // 2. Check for viewing area (관람 인원)
    if (!prefs.viewingArea) {
      return {
        message: `${prefs.purpose[0]} 용도시군요! 주로 몇 명이 함께 시청하시나요?`,
        auxInput: {
          type: "choose",
          label: "관람 인원 선택",
          options: [
            { id: "1", label: "1명", subLabel: "혼자" },
            { id: "2", label: "2명", subLabel: "부부" },
            { id: "3-4", label: "3-4명", subLabel: "소규모 가족" },
            { id: "5+", label: "5명 이상", subLabel: "대가족" },
          ],
        },
      };
    }

    // 3. Check for viewing distance (시청 거리)
    if (!prefs.viewingDistance) {
      // Distance options vary based on viewing area
      let distanceOptions;
      if (prefs.viewingArea === "1명") {
        distanceOptions = [
          { id: "2", label: "1M ~ 1.5M", subLabel: "가까움" },
          { id: "3", label: "1.5M ~ 2M", subLabel: "적당함" },
          { id: "4", label: "2M ~ 2.5M", subLabel: "여유있음" },
          { id: "5", label: "2.5M 이상", subLabel: "멀리" },
        ];
      } else if (prefs.viewingArea === "7명 이상") {
        distanceOptions = [
          { id: "1", label: "2M ~ 2.5M", subLabel: "가까움" },
          { id: "2", label: "2.5M ~ 3M", subLabel: "적당함" },
          { id: "4", label: "3M ~ 4M", subLabel: "넓은 공간" },
          { id: "5", label: "4M 이상", subLabel: "매우 넓음" },
        ];
      } else {
        // 2명, 3-4명, 5-6명
        distanceOptions = [
          { id: "1", label: "1.5M 이하", subLabel: "가까움" },
          { id: "2", label: "1.5M ~ 2M", subLabel: "적당함" },
          { id: "4", label: "2M ~ 3M", subLabel: "넓은 공간" },
          { id: "5", label: "3M 이상", subLabel: "매우 넓음" },
        ];
      }

      return {
        message: "TV와의 시청 거리는 어느 정도인가요?",
        auxInput: {
          type: "choose",
          label: "시청 거리 선택",
          options: distanceOptions,
        },
      };
    }

    // 4. Check for space brightness (공간 밝기)
    if (!prefs.spaceBrightness) {
      return {
        message: "시청하시는 공간의 밝기는 어떤가요?",
        auxInput: {
          type: "choose",
          label: "공간 밝기 선택",
          options: [
            { id: "1", label: "매우 어두움", subLabel: "암막 커튼/홈시어터" },
            { id: "2", label: "어두운 편", subLabel: "조명 최소" },
            { id: "3", label: "보통", subLabel: "일반적인 밝기" },
            { id: "4", label: "밝은 편", subLabel: "창문이 큼" },
          ],
        },
      };
    }

    // 5. Check for lifestyle/usage pattern and budget together (both type - 더 일찍 표시)
    const hasLifestyleInfo =
      prefs.users &&
      prefs.users.some((u) =>
        [
          "영화애호가",
          "게이머",
          "스포츠팬",
          "음악/공연팬",
          "재택근무자",
          "일반 가정",
        ].includes(u)
      );

    // Both 타입: 라이프스타일과 예산을 동시에 물어봄
    if (!hasLifestyleInfo && !prefs.budget) {
      return {
        message: "TV 사용 용도와 예산 범위를 선택해주세요.",
        auxInput: {
          type: "both",
          label: "라이프스타일 및 예산 선택",
          chooseOptions: [
            { id: "1", label: "영화애호가", subLabel: "영화 감상" },
            { id: "2", label: "게이머", subLabel: "게임 플레이" },
            { id: "3", label: "스포츠팬", subLabel: "스포츠 시청" },
            { id: "5", label: "일반 가정", subLabel: "일상 시청" },
          ],
          rangeConfig: {
            values: [
              { id: "200", label: "200만원", value: 0 },
              { id: "300", label: "300만원", value: 25 },
              { id: "400", label: "400만원", value: 50 },
              { id: "500", label: "500만원", value: 75 },
              { id: "600", label: "600만원+", value: 100 },
            ],
            defaultRange: [1, 3],
          },
        },
      };
    }

    // 라이프스타일만 없는 경우
    if (!hasLifestyleInfo) {
      return {
        message: "TV를 주로 어떤 용도로 사용하시나요?",
        auxInput: {
          type: "choose",
          label: "라이프스타일 선택",
          options: [
            { id: "1", label: "영화애호가", subLabel: "영화 감상" },
            { id: "2", label: "게이머", subLabel: "게임 플레이" },
            { id: "3", label: "스포츠팬", subLabel: "스포츠 시청" },
            { id: "5", label: "일반 가정", subLabel: "일상 시청" },
          ],
        },
      };
    }

    // 6. Check for age of users
    const hasAgeInfo =
      prefs.users &&
      prefs.users.some((u) =>
        ["10-20대", "30-40대", "50-60대", "70대 이상"].includes(u)
      );
    if (!hasAgeInfo) {
      return {
        message: "주요 시청자의 연령대를 알려주세요.",
        auxInput: {
          type: "choose",
          label: "연령대 선택",
          options: [
            { id: "1", label: "10대 이하", subLabel: "어린이/청소년" },
            { id: "2", label: "20-30대", subLabel: "청년" },
            { id: "3", label: "40-60대", subLabel: "중년" },
            { id: "5", label: "60대 이상", subLabel: "노년" },
          ],
        },
      };
    }

    // 7. Check for brand (선호 브랜드)
    if (!prefs.brand) {
      return {
        message: "선호하시는 브랜드가 있으신가요?",
        auxInput: {
          type: "choose",
          label: "브랜드 선택",
          options: [
            { id: "all", label: "모든 브랜드", subLabel: "상관없음" },
            { id: "samsung", label: "삼성", subLabel: "Samsung" },
            { id: "lg", label: "LG", subLabel: "LG전자" },
            { id: "sony", label: "소니", subLabel: "Sony" },
          ],
        },
      };
    }

    // 8. Check for panel type (패널 타입)
    if (!prefs.panelType) {
      return {
        message: "선호하시는 패널 타입이 있으신가요?",
        auxInput: {
          type: "choose",
          label: "패널 타입 선택",
          options: [
            { id: "oled", label: "OLED", subLabel: "완벽한 블랙" },
            { id: "qled", label: "QLED", subLabel: "밝고 선명" },
            { id: "miniled", label: "Mini LED", subLabel: "고대비" },
            { id: "led", label: "LED/LCD", subLabel: "가성비" },
          ],
        },
      };
    }

    // 9. Check for budget (가격대)
    if (!prefs.budget) {
      return {
        message: "예산 범위를 선택해주세요.",
        auxInput: {
          type: "range",
          label: "예산 범위 선택",
          range: {
            values: [
              { label: "200만원", value: 0 },
              { label: "300만원", value: 25 },
              { label: "400만원", value: 50 },
              { label: "500만원", value: 75 },
              { label: "600만원+", value: 100 },
            ],
            defaultRange: [1, 3],
          },
        },
      };
    }

    // All required preferences collected - show inference without message
    return {
      showInference: true,
    };
  },

  // User preference management methods
  updateUserPreference: (
    category: keyof UserPreferences,
    value: string | string[]
  ) => {
    userDataStore.updatePreference(category, value);
  },

  getUserPreferences: () => {
    return userDataStore.getUserPreferences();
  },

  clearUserPreferences: () => {
    userDataStore.clearPreferences();
  },

  getStoredUserInfo: () => {
    return userDataStore.getStoredInfo();
  },

  getUsagePurposeProfile: (purposeKey: string) => {
    return usagePurposeProfiles[purposeKey] || null;
  },
};

export default aiResponseStore;
