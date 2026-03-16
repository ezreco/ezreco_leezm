// AI 추천 결과 데이터 관리 store
import { resolveAssetUrls } from "../utils/getAssetUrl";

export interface ProductScore {
  label: string;
  score: number;
  maxScore: number;
}

export interface ProductReview {
  expertMentions?: number; // 전문가 리뷰 언급 수
  consumerMentions?: number; // 소비자 리뷰 언급 수
}

export interface ProductSpec {
  title: string; // 타이틀 (일반 텍스트): "화질", "사이즈", "주요 기능", "플랫폼", "AS 보증"
  content: string; // HTML 문자열 (색상 정보 포함)
}

export interface RecommendReason {
  title: string;
  description: string;
  shift?: number;
}

export interface ShoppingMallPrice {
  mallName: string;
  mallLogo: string; // 쇼핑몰 로고 경로
  price: number;
  url: string;
  info: string;
}

export interface PriceRange {
  min: number; // 최소 가격
  max: number; // 최대 가격
  current: number; // 현재 제품 가격
}

// 가격 히스토리 데이터 포인트
export interface PriceHistoryPoint {
  date: string; // "08/10", "08/20" 등
  price: number; // 가격
}

// 가격 분석 데이터
export interface PriceAnalysis {
  dateRange: string[]; // ["08/10", "08/20", ..., "10/30"]
  highestPrice: number; // 역대최고가
  lowestPrice: number; // 역대최저가
  averagePrice: number; // 평균가
  optimalBuyDate: string; // 최적의 구매 시점 날짜
  highestPriceDate: string; // 역대최고가 발생 날짜
  lowestPriceDate: string; // 역대최저가 발생 날짜
  priceHistory: PriceHistoryPoint[]; // 가격 변동 히스토리
}

export interface RecommendedProduct {
  rank: number; // 추천 순위
  productId: string;
  brand: string;
  modelName: string;
  modelCode?: string;
  imageUrl: string;
  price: number;
  shoppingMallPrices: ShoppingMallPrice[]; // 쇼핑몰별 가격 정보
  priceRange: PriceRange; // 가격 범위
  priceAnalysis?: PriceAnalysis; // 가격 분석 데이터
  aiScore: number; // AI 점수 (0-100)
  review?: ProductReview;
  specs: ProductSpec[];
  scores: ProductScore[]; // 각 항목별 점수
  recommendReasons?: RecommendReason[];
  pros?: string[];
  cons?: string[];
  tags?: string[];
  isFavorite?: boolean;
  tips?: RecommendReason[];
}

export interface VideoRecommendation {
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  description?: string;
}
// 리뷰 카드 아이템
export interface ReviewCard {
  imageUrl: string;
  logoUrl: string;
  badge: string; // "Editor's Choice", "Best Choice Review" 등
}

// 사용자 리뷰 아이템
export interface UserReview {
  platform: "amazon" | "reddit";
  platformLogo: string;
  author: string;
  authorAvatar?: string;
  rating?: number; // 별점 (1-5)
  date?: string;
  metadata?: {
    size?: string;
    style?: string;
    verified?: boolean;
  };
  title?: string;
  content: string;
}

export interface Reviews {
  title: string; // "전문가 및 사용자의 제품 추천 주요 리뷰입니다"
  expertReview: {
    icon: string;
    title: string; // "전문가 리뷰"
    description: string;
    cards: ReviewCard[];
  };
  userReview: {
    icon: string;
    title: string; // "사용자 리뷰"
    description: string;
    cards: ReviewCard[]; // 사용자 리뷰 카드 (YouTube, Reddit 등)
    reviews: UserReview[];
  };
}

export interface OldReviews {
  title: string;
  reviewLinks?: ReviewLinks[];
  reviewText?: ReviewText[];
}

export interface ReviewLinks {
  type: number; // 0: 전문가 리뷰, 1: 사용자 리뷰
  desc: string;
  links: {
    source: string;
    sourceImg: string;
    coverUrl: string;
    link: string;
  }[];
}
export interface ReviewText {
  source: string;
  sourceImg: string;
  contents?: string;
  imgUrls?: string;
}

// OTT Tips 관련 인터페이스
export interface EnergyTableColumn {
  header: string; // "구분", "삼성 2025 Neo QLED 65QNF90" 등
  width: string; // "124px", "219px", "220px" 등
}

export interface EnergyTableRow {
  category: string;
  cells?: string[]; // 각 셀의 내용 (텍스트)
  imgs?: string[]; // 각 셀의 이미지 경로 (이미지)
}

export interface OttSection {
  title: string;
  content: string; // HTML 문자열
  shift?: number;
}

export interface ComparisonTableColumn {
  header: string;
  content: string;
}

export interface ComparisonTable {
  columns: ComparisonTableColumn[];
}

export interface EnergyAnalysisTable {
  columns: EnergyTableColumn[]; // 헤더 정보와 폭
  rows: EnergyTableRow[]; // 데이터 행
}

export interface OttTips {
  title: string; // "OTT 서비스 이용을 위해 TV 선택 시 중요한 요소"
  sections: OttSection[]; // "1. 화질", "2. 호환성" 등 (HTML 지원)
  tipItems: (RecommendReason & { table?: ComparisonTable })[]; // "① OTT 서비스 용으로...", "② QLED, Neo QLED..."
  expertAdvice?: RecommendReason;
  energyAnalysis?: {
    title: string;
    table: EnergyAnalysisTable;
  };
}

export interface AIRecommendResult {
  query: string; // 사용자 질문
  summary?: string; // 추천 요약
  products: RecommendedProduct[];
  videoRecommendations?: VideoRecommendation[];
  reviews?: Reviews; // 전문가 및 사용자 리뷰
  ottTips?: OttTips; // OTT 서비스 선택 팁
  timestamp: Date;
}

class AIRecommendResultStore {
  private result: AIRecommendResult | null = null;

  // Mock data generator
  generateMockData(): AIRecommendResult {
    const mockData = {
      query: "거실에서 영화 보기 좋은 65인치 TV 추천해줘",
      summary: "거실에서 영화 감상에 최적화된 65인치 TV를 추천드립니다.",
      timestamp: new Date(),
      products: [
        {
          rank: 1,
          productId: "tv-001",
          brand: "삼성",
          modelName: "2025 Neo QLED 65QNF80",
          modelCode: "QN65QN900D",
          imageUrl: "src/assets/result/l_tv_1.png",
          price: 2315700,
          shoppingMallPrices: [
            {
              mallName: "쿠팡",
              mallLogo: "src/assets/result/logo-coupang.png",
              price: 2515700,
              url: "https://www.coupang.com/",
              info: "쿠팡에서 최저가로 검색됩니다.",
            },
            {
              mallName: "SSG",
              mallLogo: "src/assets/result/logo-ssg.png",
              price: 2625100,
              url: "https://item.gmarket.co.kr/",
              info: "삼성카드 할인가 적용",
            },
          ],
          priceRange: {
            min: 2000000,
            max: 3000000,
            current: 2515700,
          },
          priceAnalysis: {
            dateRange: [
              "08/10",
              "08/20",
              "08/30",
              "09/10",
              "09/20",
              "09/30",
              "10/10",
              "10/20",
              "10/30",
            ],
            highestPrice: 4467200,
            lowestPrice: 4337900,
            averagePrice: 4406715,
            optimalBuyDate: "10/20",
            highestPriceDate: "09/03",
            lowestPriceDate: "09/10",
            priceHistory: [
              { date: "08/10", price: 4390000 },
              { date: "08/15", price: 4390000 },
              { date: "08/20", price: 4390000 },
              { date: "08/25", price: 4390000 },
              { date: "08/30", price: 4390000 },
              { date: "09/01", price: 4370000 },
              { date: "09/03", price: 4467200 }, // 역대최고가
              { date: "09/05", price: 4467200 },
              { date: "09/07", price: 4420000 },
              { date: "09/10", price: 4337900 }, // 역대최저가
              { date: "09/15", price: 4350000 },
              { date: "09/20", price: 4360000 }, // 최적의 구매 시점
              { date: "09/25", price: 4380000 },
              { date: "09/30", price: 4400000 },
              { date: "10/05", price: 4420000 },
              { date: "10/10", price: 4430000 },
              { date: "10/15", price: 4440000 },
              { date: "10/20", price: 4450000 },
              { date: "10/25", price: 4455000 },
              { date: "10/30", price: -1 },
            ],
          },
          aiScore: 95,
          review: {
            expertMentions: 1000,
            consumerMentions: 876,
          },
          specs: [
            {
              title: "화질",
              content: `<span style="color: #f85057; font-weight: 600;">Quantum Matrix Technology Core</span> <span style="background-color: #eef0f3; border-radius: 999px; padding: 2px 4px; font-size: 10px; color: #252525; font-weight: 600;">1</span><br>4K 화질 업스케일링, 컬러 부스터 Pro`,
            },
            {
              title: "사이즈",
              content: "65인치",
            },
            {
              title: "주요 기능",
              content: `<span style="color: #f85057; font-weight: 600;">HDR10+</span>, 최적 화면 / AI 맞춤 화면, Symphony,<br>SmartThings Hub 지원, 4K144Hz <span style="background-color: #eef0f3; border-radius: 999px; padding: 2px 4px; font-size: 10px; color: #252525; font-weight: 600;">2</span>`,
            },
            {
              title: "플랫폼",
              content: `<span style="color: #f85057; font-weight: 600;">2세대 AI 4K 프로세서</span> / Tizen Smart TV`,
            },
            {
              title: "AS 보증",
              content: "TV 본체 1년 무상보증, 패널 2년 무상보증",
            },
          ],
          scores: [
            { label: "화질", score: 95, maxScore: 100 },
            { label: "가성비", score: 95, maxScore: 100 },
            { label: "사용성", score: 92, maxScore: 100 },
            { label: "기능성", score: 80, maxScore: 100 },
            { label: "음질", score: 75, maxScore: 100 },
          ],
          recommendReasons: [
            {
              title: "이 제품의 가격 경쟁력은?",
              description:
                "65QNF80은 Mini LED 기반의 뛰어난 화질을 유지하면서, 상위 모델의 무반사 스크린, 최상급 AI 프로세서 등을 제외하여 가격 경쟁력을 확보한 가성비 높은 Neo QLED 모델입니다",
            },
          ],
          pros: [
            "Mini LED 기반, 뛰어난 최대 밝기와 색감 표현력이 우수",
            "2세대 AI 4K 프로세서 탑재로 AI 화질 최적화 우수",
            "Neo QLED 라인업 중 가성비가 가장 좋은 4K 주력 모델",
          ],
          cons: [
            "Dolby Vision(돌비 비전) 미지원",
            "상위 모델의 무반사 스크린 기능이 제외되어 있음",
          ],
          isFavorite: false,
          tips: [
            {
              title: "① Quantum Matrix Technology 기술이란?",
              description:
                "퀸텀닷 TV는 넓은 색 재현력과 높은 명암비로 화질이 뛰어나고 풍부한 색감을 제공하며, 번인 현상에 강합니다.",
              shift: 17,
            },
            {
              title: "② HDR10+란?",
              description:
                "HDR10+는 넷플릭스에서 제공하는 기능으로, 장면별로 밝기와 명암비를 최적화하여 밝고 어두운 부분의 디테일이 더욱 뚜렷하게 표현됩니다. 이는 사용자의 더욱 몰입감 있는 시청 경험을 제공할 수 있습니다.",
              shift: 17,
            },
            {
              title: "③ 2세대 AI 4K 프로세서란?",
              description:
                "2세대 AI 4K 프로세서는 저해상도 콘텐츠를 4K 수준으로 업스케일링하고 다양한 OTT 화질을 최적화해 선명하고 깨끗한 화질을 제공합니다.",
              shift: 17,
            },
            {
              title: "구 모델과는 어떤 차이가 있을까?",
              description:
                "2024년 구모델 (QN85D)와 비교해서 ‘AI TV’로의 전환되었습니다.\n QNF80 모델은 NQ4 AI Gen2 프로세서 탑재되어 탑재되어, 시청 중인 콘텐츠의 장르(스포츠, 영화, 게임 등)를 AI가 자동으로 인식하고 화면과 사운드를 최적화하는 기능이 강화되었습니다.",
            },
            {
              title: "신모델 출시 계획",
              description:
                "Neo QLED 4K 라인업은 QNF95, QNF90, QNF85, QNF80, QNF70의 총 5개 시리즈로 구성되었으며, 이미 2025년 4월부터 순차적으로 출시되고 있습니다.",
            },
          ],
        },
        {
          rank: 2,
          productId: "tv-003",
          brand: "삼성",
          modelName: "QLED Q60F",
          modelCode: "KU65CU8000",
          imageUrl: "src/assets/result/l_tv_2.png",
          price: 21002321300000,
          shoppingMallPrices: [
            {
              mallName: "다나와",
              mallLogo: "src/assets/result/logo-danawa.png",
              price: 2321300,
              url: "https://prod.danawa.com",
              info: "다나와에서 최저가로 검색됩니다.",
            },
            {
              mallName: "G마켓",
              mallLogo: "src/assets/result/logo-gmarket.png",
              price: 2423010,
              url: "https://item.gmarket.co.kr",
              info: "삼성카드 할인가 적용",
            },
          ],
          priceRange: {
            min: 2000000,
            max: 3000000,
            current: 2321300,
          },
          aiScore: 89,
          review: {
            expertMentions: 863,
            consumerMentions: 320,
          },
          specs: [
            {
              title: "화질",
              content: `<span style="color: #f85057; font-weight: 600;">NeoQLED</span><br>4K 화질, 컬러 부스터 Pro <span style="background-color: #eef0f3; border-radius: 999px; padding: 2px 4px; font-size: 10px; color: #252525; font-weight: 600;">1</span>`,
            },
            {
              title: "사이즈",
              content: "65인치",
            },
            {
              title: "주요 기능",
              content: `<span style="color: #f85057; font-weight: 600;">HDR10+</span>, 최적화면 / AI 맞춤 화면, Symphony,<br>SmartThings Hub 지원, FreeSync Premium <span style="background-color: #eef0f3; border-radius: 999px; padding: 2px 4px; font-size: 10px; color: #252525; font-weight: 600;">2</span>`,
            },
            {
              title: "플랫폼",
              content: `2세대 AI 4K 프로세서/ Tizen Smart TV`,
            },
            {
              title: "AS 보증",
              content: "TV 본체 1년 무상보증, 패널 2년 무상보증",
            },
          ],
          scores: [
            { label: "화질", score: 85, maxScore: 100 },
            { label: "가성비", score: 91, maxScore: 100 },
            { label: "사용성", score: 84, maxScore: 100 },
            { label: "기능성", score: 88, maxScore: 100 },
            { label: "음질", score: 82, maxScore: 100 },
          ],
          isFavorite: false,
          tips: [
            {
              title: "① NeoQLED란?",
              description:
                "NeoQLED는 Mini LED 백라이트와 퀀텀닷 기술을 결합한 삼성의 프리미엄 TV 기술입니다.",
              shift: 17,
            },
            {
              title: "② FreeSync Premium이란?",
              description:
                "FreeSync Premium은 AMD의 가변 주사율 기술로, 게임 시 화면 찢어짐을 방지하여 부드러운 게임 경험을 제공합니다.",
            },
          ],
        },

        {
          rank: 3,
          productId: "tv-002",
          brand: "LG",
          modelName: "OLED 65C4KNA",
          modelCode: "OLED65C4KNA",
          imageUrl: "src/assets/result/l_tv_3.png",
          price: 3290000,
          shoppingMallPrices: [
            {
              mallName: "G마켓",
              mallLogo: "src/assets/result/logo-gmarket.png",
              price: 2712300,
              url: "https://item.gmarket.co.kr/",
              info: "G마켓에서 최저가로 검색됩니다.",
            },
            {
              mallName: "11번가",
              mallLogo: "src/assets/result/logo-11st.png",
              price: 3350000,
              url: "https://prod.danawa.com/",
              info: "삼성카드 할인가 적용",
            },
          ],
          priceRange: {
            min: 2000000,
            max: 3000000,
            current: 2712300,
          },
          aiScore: 85,
          review: {
            expertMentions: 850,
            consumerMentions: 720,
          },
          specs: [
            {
              title: "화질",
              content: `<span style="color: #f85057; font-weight: 600;">올레드 다이나믹 톤 매핑 프로</span><br>4K 화질 업스케일링, 올레드 컬러 <span style="background-color: #eef0f3; border-radius: 999px; padding: 2px 4px; font-size: 10px; color: #252525; font-weight: 600;">1</span>`,
            },
            {
              title: "사이즈",
              content: "65인치",
            },
            {
              title: "주요 기능",
              content: `<span style="color: #f85057; font-weight: 600;">HDR10+</span>, 최적화면 / AI 맞춤 화면, Symphony,<br>FreeSync Premium <span style="background-color: #eef0f3; border-radius: 999px; padding: 2px 4px; font-size: 10px; color: #252525; font-weight: 600;">2</span>`,
            },
            {
              title: "플랫폼",
              content: `webOS 23 / ThinQ AI`,
            },
            {
              title: "AS 보증",
              content: "TV 본체 2년 무상보증, 패널 2년 무상보증",
            },
          ],
          scores: [
            { label: "화질", score: 93, maxScore: 100 },
            { label: "가성비", score: 64, maxScore: 100 },
            { label: "사용성", score: 76, maxScore: 100 },
            { label: "기능성", score: 83, maxScore: 100 },
            { label: "음질", score: 65, maxScore: 100 },
          ],
          isFavorite: false,
          tips: [
            {
              title: "① 올레드 다이나믹 톤 매핑 프로란?",
              description:
                "장면별로 밝기와 색상을 최적화하여 더욱 생생하고 정확한 화질을 제공하는 LG만의 HDR 기술입니다.",
              shift: 17,
            },
            {
              title: "② OLED TV 번인 현상 예방 방법",
              description:
                "화면 보호기 사용, 밝기 자동 조절, 로고 휘도 감소 등의 기능을 활용하면 번인 현상을 최소화할 수 있습니다.",
              shift: 17,
            },
            {
              title: "③ webOS 23이란?",
              description:
                "LG의 최신 스마트 TV 운영체제로, 직관적인 UI와 빠른 반응속도, 다양한 OTT 서비스를 제공합니다.",
              shift: 17,
            },
          ],
        },
      ],
      reviews: {
        title: "전문가 및 사용자의 제품 추천 주요 리뷰입니다",
        expertReview: {
          icon: "src/assets/icons/ic_expert_review.png",
          title: "전문가 리뷰",
          description:
            "글로벌 전문 평가 미디어에서 삼성 QNF80모델을 평가한 결과,\n실내가 어둡거나 밝은 곳 모두 영화 감상에 최적화된 컬러와 밝기 성능이 우수한 TV로 평가 받았습니다.\n특히 주요 전문 평가 미디어인 Rtings.com, Reviewed.com 등에서 Editor's Choice 등을 수상하였습니다.",
          cards: [
            {
              imageUrl: "src/assets/result/expert-review-rtings-card.png",
              logoUrl: "src/assets/result/logo-rtings.png",
              badge: "Editor's Choice",
            },
            {
              imageUrl: "src/assets/result/expert-review-reviewed-card.png",
              logoUrl: "src/assets/result/logo-reviewed.png",
              badge: "Editor's Choice",
            },
            {
              imageUrl: "src/assets/result/expert-review-youtube-card.png",
              logoUrl: "src/assets/result/logo-youtube.png",
              badge: "Editor's Choice",
            },
          ],
        },
        userReview: {
          icon: "src/assets/icons/ic_user_review.png",
          title: "사용자 리뷰",
          description:
            "삼성 QLED TV 사용자들의 넷플릭스 시청 경험에 대해 긍정적인 의견이 많습니다.\n퀸텀닷 기술이 제공하는 선명하고 다채로운 색상 표현이 OTT 콘텐츠 감상의 즐거움을 더한다는 평가입니다.\n특히 넷플릭스 시청 시 몰입감 있는 오디오와 비디오 품질에 대한 만족감을 구체적으로 언급하고 있습니다.",
          cards: [
            {
              imageUrl: "src/assets/result/user-review-youtube-card.png",
              logoUrl: "src/assets/result/logo-youtube-badge.png",
              badge: "Best Choice Review",
            },
            {
              imageUrl: "src/assets/result/user-review-reddit-card.png",
              logoUrl: "src/assets/result/logo-reddit-badge.png",
              badge: "Classy Tech Calibrations",
            },
            {
              imageUrl: "src/assets/result/user-review-digitaltrends-card.png",
              logoUrl: "src/assets/result/logo-digitaltrends-badge.png",
              badge: "Digital Trends",
            },
          ],
          reviews: [
            {
              platform: "amazon" as const,
              platformLogo: "src/assets/result/logo-amazon.png",
              author: "Jason Brown",
              authorAvatar: "src/assets/result/ic_amazon_user.png",
              rating: 5,
              title: "Very bright and clear",
              date: "2025년 9월 6일에 미국에서 리뷰됨",
              metadata: {
                size: "85인치",
                style: "TV 전용",
                verified: true,
              },
              content:
                "Excellent TV! Looks better than the Q90F due to the semi glossy screen it's much less expensive.\nIt's bright enough for any room",
            },
            {
              platform: "reddit" as const,
              platformLogo: "src/assets/result/logo-reddit.png",
              author: "rydan",
              authorAvatar: "src/assets/result/ic_amazon_user.png",
              date: "6mo ago",
              content:
                "I spent two years waiting for a good price on the series on higher than this.\nFinally bought it on clearance open box at BestBuy two years ago. Best TV ever.",
            },
          ],
        },
      },
      ottTips: {
        title: "OTT 서비스 이용을 위해 TV 선택 시 중요한 요소",
        sections: [
          {
            title: "1. 화질",
            content: `QLED<br/>OTT는 고화질을 제공하고 밝은 환경에서도 선명한 화면을 제공하는 QLED TV를 추천합니다. <span style="background-color: #eef0f3; border-radius: 999px; padding: 2px 4px; font-size: 10px; color: #252525; font-weight: 600;">1</span> <span style="background-color: #eef0f3; border-radius: 999px; padding: 2px 4px; font-size: 10px; color: #252525; font-weight: 600;">2</span>`,
          },
          {
            title: "2. 호환성",
            content:
              "넷플릭스는 Dolby Vision과 HDR10 등 다양한 HDR 포맷을 지원, 제작자가<br/>의도한 풍부한 색감과 명암비를 경험할 수 있습니다.<br/>AV1은 고효율 비디오 코덱으로, 동일한 화질의 영상을 더 낮은 대역폭으로 제공해 호환성이 좋습니다.",
          },
        ],
        tipItems: [
          {
            title: "① OTT 서비스 용으로 사용하는 TV는 왜 고화질이 중요할까요?",
            description:
              "시청 경험 향상 : 세밀한 디테일과 선명한 색상을 제공, 몰입감 향상 및 더 현실적인 경험을 선사합니다.\n콘텐츠 가치 증대 : 제작자의 의도를 정확히 전달, 콘텐츠의 품질을 극대화하여 시청자의 만족도를 향상합니다.",
            shift: 17,
          },
          {
            title: "② QLED, Neo QLED, QLED는 어떤 차이점이 있나요?",
            description: "",
            shift: 17,
            table: {
              columns: [
                {
                  header: "QLED",
                  content:
                    "QD LED 백라이트를 사용하여 밝기와<br/>색재현율, 명암비가 우수, 번인 측면에서<br/>자유롭습니다.",
                },
                {
                  header: "Neo QLED",
                  content:
                    "QLED 대비 고정밀 Mini QD LED를<br/>백라이트로 사용, 명암비와 밝기 및 Motion<br/>특성이 향상되었습니다.",
                },
                {
                  header: "OLED",
                  content:
                    "자체 발광 픽실로 명암비/색재현율이<br/>뛰어나며, 빠른 응답 속도를 자랑합니다.<br/>밝기가 QLED 대비 상대적으로 낮고 번인<br/>가능성이 있습니다.",
                },
              ],
            },
          },
        ],
        expertAdvice: {
          title: "전문가 Advice",
          description:
            "QNF80의 신규 AI 기능을 활용하여 시청 중인 콘텐츠(영화/스포츠/게임)에 따라 화질과 사운드를 자동 최적화하세요. 특히 AI 오토 게임 모드로 콘솔 연결 시 별도 설정 없이 144Hz를 즐길 수 있습니다. 유용한 연관 제품으로는 QNF80의 AI 사운드와 완벽하게 연동되는 삼성 Q-심포니 사운드바를 추천하며, 기존 스마트 기기는 SmartThings 앱으로 간편하게 연결, 호환됩니다.",
        },
        energyAnalysis: {
          title: "에너지 분석",
          table: {
            columns: [
              { header: "구분", width: "124px" },
              { header: "삼성 2025 Neo QLED 65QNF90", width: "219px" },
              { header: "삼성 2025 Neo QLED 65QNF80", width: "219px" },
              { header: "삼성 2025 QLED Q60F", width: "220px" },
            ],
            rows: [
              {
                category: "에너지\n소비 효율 등급",
                imgs: [
                  "src/assets/icons/img_energy_1.png",
                  "src/assets/icons/img_energy_2.png",
                  "src/assets/icons/img_energy_3.png",
                ],
              },
              {
                category: "에너지 효율 분석",
                cells: [
                  "셋 중 가장 밝고 많은 로컬디밍 존을 사용하므로, 최대 소비 전력은 가장\n높습니다. (밝기/성능에 비례)",
                  "Q60F보다 높지만, 최상위 모델인 QNF90보다는 낮은, 균형 잡힌 소비\n전력을 가집니다.",
                  "셋 중 소비 전력이 가장 낮습니다.\n(백라이트 단순화, 60Hz 주사율)",
                ],
              },
              {
                category: "장기적 유지 비용",
                cells: [
                  "초기 구매 비용이 가장 높습니다.\n전기 요금은 높을 수 있지만, AI 기술로 에너지 효율을 높이려 노력했습니다.",
                  "초기 구매 비용은 중간, 성능 대비 전력 효율이 좋습니다. 총 소유 비용(TCO)\n측면에서 합리적일 수 있습니다.",
                  "초기 구매 비용이 가장 저렴하여, 장기 운영 비용은 세 모델 중 가장 낮을 수\n있습니다. (단, 화질 성능 감수)",
                ],
              },
            ],
          },
        },
      },
    };

    // Resolve all asset URLs in the mock data
    return resolveAssetUrls(mockData);
  }

  // Set recommendation result
  setResult(result: AIRecommendResult): void {
    this.result = result;
  }

  // Get current result
  getResult(): AIRecommendResult | null {
    if (!this.result) {
      this.result = this.generateMockData();
    }
    return this.result;
  }

  // Get products only
  getProducts(): RecommendedProduct[] {
    const result = this.getResult();
    return result?.products || [];
  }

  // Get product by rank
  getProductByRank(rank: number): RecommendedProduct | null {
    const result = this.getResult();
    return result?.products.find((p) => p.rank === rank) || null;
  }

  // Toggle favorite
  toggleFavorite(productId: string): void {
    if (!this.result) return;
    const product = this.result.products.find((p) => p.productId === productId);
    if (product) {
      product.isFavorite = !product.isFavorite;
    }
  }

  // Clear result
  clear(): void {
    this.result = null;
  }
}

export const aiRecommendResultStore = new AIRecommendResultStore();
