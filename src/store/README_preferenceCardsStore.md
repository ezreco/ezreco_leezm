# Preference Cards Store

InfoPanel에서 사용되는 사용자 선호도 카드 정보를 저장하는 Zustand store입니다.

## 개요

이 store는 사용자의 TV 선호도 정보를 카드 형태로 처리하고 저장합니다. InfoPanel에서 표시되는 카드들의 데이터와 위치 정보를 중앙 집중식으로 관리하여, 다른 뷰나 컴포넌트에서도 동일한 카드 정보를 재사용할 수 있습니다.

## 주요 기능

- **자동 카드 생성**: UserPreferences에서 값이 있는 필드만 카드로 생성
- **입력 순서 정렬**: 사용자가 입력한 순서대로 카드 정렬
- **위치 정보 저장**: 각 카드의 화면상 위치(x, y) 정보 저장
- **타입 안전성**: TypeScript로 완전한 타입 지원

## 데이터 구조

### PreferenceCard

```typescript
interface PreferenceCard {
  title: string;    // 카드 제목 (예: "사용목적", "가격대")
  value: string;    // 카드 값 (예: "영화 시청", "300만원 ~ 500만원")
  key: string;      // preference key (예: "purpose", "budget")
}
```

### CardPosition

```typescript
interface CardPosition {
  x: number;        // X 좌표
  y: number;        // Y 좌표
  width: number;    // 카드 너비
  height: number;   // 카드 높이
}
```

## 사용 방법

### 1. InfoPanel에서의 사용 (자동)

InfoPanel 컴포넌트는 이미 이 store를 사용하도록 설정되어 있습니다. `userPreferences`가 업데이트되면 자동으로 store가 업데이트됩니다.

```typescript
// InfoPanel.tsx에서 자동으로 처리됨
useEffect(() => {
  preferenceCardsStore.getState().updateFromPreferences(userPreferences);
}, [userPreferences]);
```

### 2. 다른 컴포넌트에서 카드 데이터 읽기

```typescript
import { usePreferenceCards } from "../store/preferenceCardsStore";

function MyComponent() {
  const cards = usePreferenceCards();

  return (
    <div>
      {cards.map((card) => (
        <div key={card.key}>
          <h3>{card.title}</h3>
          <p>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. 카드 위치 정보 읽기

```typescript
import { useCardPositions } from "../store/preferenceCardsStore";

function MyComponent() {
  const positions = useCardPositions();

  return (
    <div>
      {positions.map((pos, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: pos.width,
            height: pos.height,
          }}
        >
          {/* 카드 내용 */}
        </div>
      ))}
    </div>
  );
}
```

### 4. Store 직접 접근

Hook을 사용하지 않고 직접 store에 접근:

```typescript
import { preferenceCardsStore } from "../store/preferenceCardsStore";

// 현재 카드 목록 가져오기
const cards = preferenceCardsStore.getState().cards;

// 카드 업데이트
preferenceCardsStore.getState().updateFromPreferences(newPreferences);

// 카드 초기화
preferenceCardsStore.getState().clearCards();
```

## Store API

### State

- `userPreferences: UserPreferences` - 원본 사용자 선호도 데이터
- `cards: PreferenceCard[]` - 처리된 카드 목록 (값이 있는 것만)
- `positions: CardPosition[]` - 각 카드의 위치 정보
- `inputOrder: string[]` - 사용자 입력 순서

### Actions

#### `updateFromPreferences(preferences: UserPreferences): void`

UserPreferences를 받아서 카드 목록을 생성하고 정렬합니다.

```typescript
preferenceCardsStore.getState().updateFromPreferences({
  purpose: ["영화 시청", "게임"],
  budget: "300만원 ~ 500만원",
  brand: "삼성",
  // ...
});
```

#### `setPositions(positions: CardPosition[]): void`

카드들의 위치 정보를 업데이트합니다.

```typescript
preferenceCardsStore.getState().setPositions([
  { x: 30, y: 20, width: 190, height: 65 },
  { x: 30, y: 190, width: 190, height: 65 },
  // ...
]);
```

#### `clearCards(): void`

모든 카드 정보를 초기화합니다.

```typescript
preferenceCardsStore.getState().clearCards();
```

## 카드 매핑

다음 preference 필드들이 카드로 변환됩니다:

| Preference Key | 카드 제목 | 타입 |
|----------------|----------|------|
| purpose | 사용목적 | Array |
| screenSize | 크기 | String |
| budget | 가격대 | String |
| viewingDistance | 시청거리 | String |
| spaceBrightness | 공간밝기 | String |
| viewingArea | 관람공간 | String |
| users | 실사용자 | Array |
| installationSpace | 사용공간 | String |
| brand | 선호브랜드 | String |
| panelType | 패널타입 | String |
| resolution | 해상도 | String |
| releaseYear | 출시연도 | String |

## 예시: 추천 결과 페이지에서 카드 재사용

```typescript
import { usePreferenceCards, useCardPositions } from "../store/preferenceCardsStore";
import PreferenceCard from "../components/PreferenceCard";

function RecommendResultPage() {
  const cards = usePreferenceCards();

  return (
    <div className="result-page">
      <h2>선택하신 조건</h2>
      <div className="cards-grid">
        {cards.map((card) => (
          <PreferenceCard
            key={card.key}
            label={card.title}
            value={card.value}
          />
        ))}
      </div>
    </div>
  );
}
```

## 주의사항

1. **자동 업데이트**: InfoPanel이 렌더링되면 자동으로 store가 업데이트됩니다.
2. **반응성**: zustand hooks를 사용하면 store가 업데이트될 때 컴포넌트가 자동으로 리렌더링됩니다.
3. **메모리**: 필요없어진 경우 `clearCards()`로 메모리를 정리할 수 있습니다.
4. **순서**: `inputOrder` 배열에 있는 순서대로 카드가 정렬됩니다.
