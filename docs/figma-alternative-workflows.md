# Figma Dev Mode 대안 워크플로우

Figma Dev Mode가 사용할 수 없을 때 디자인을 React 컴포넌트로 구현하는 방법들입니다.

## 🎯 대안 방법들

### 1. 📸 스크린샷 기반 워크플로우

```bash
# 스크린샷 분석 도구 설치
npm install -D image-to-css html2canvas
```

**장점:** 즉시 사용 가능, 정확한 시각적 재현
**단점:** 반응형 대응 어려움

### 2. 🎨 수동 디자인 토큰 추출

```typescript
// src/design-system/tokens.ts
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a'
  },
  gray: {
    50: '#f9fafb',
    500: '#6b7280',
    900: '#111827'
  }
} as const

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
} as const

export const typography = {
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem', 
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500', 
    semibold: '600',
    bold: '700',
  }
} as const
```

### 3. 🖼 정적 에셋 워크플로우

Figma에서 직접 이미지 내보내기:

```bash
# 에셋 관리 구조
src/assets/
├── images/
│   ├── icons/
│   ├── illustrations/
│   └── backgrounds/
├── fonts/
└── videos/
```

### 4. 📐 컴포넌트 명세서 기반 개발

```typescript
// src/components/specs/ButtonSpec.ts
export interface ButtonSpec {
  variants: {
    primary: {
      backgroundColor: '#3b82f6'
      color: '#ffffff'
      border: 'none'
      borderRadius: '0.5rem'
    }
    secondary: {
      backgroundColor: 'transparent'
      color: '#3b82f6'
      border: '1px solid #3b82f6'
      borderRadius: '0.5rem'
    }
  }
  sizes: {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' }
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' }
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' }
  }
}
```

## 🛠 실용적 구현 도구

### 1. Tailwind CSS 기반 구현

```bash
npm install -D @tailwindcss/typography @tailwindcss/forms
```

### 2. Storybook으로 컴포넌트 문서화

```bash
npm install -D @storybook/react @storybook/addon-docs
```

### 3. 디자인 시스템 검증 도구

```bash
npm install -D chromatic @storybook/test-runner
```

## 📋 워크플로우 단계

### Phase 1: 기본 토큰 설정
1. 색상, 타이포그래피, 간격 토큰 정의
2. Tailwind Config에 토큰 통합
3. 기본 컴포넌트 구조 생성

### Phase 2: 컴포넌트 구현
1. Figma 디자인 분석 후 컴포넌트별 명세 작성
2. React 컴포넌트 구현
3. Storybook에서 검증

### Phase 3: 반복 개선
1. 디자이너와 시각적 QA
2. 반응형 대응
3. 접근성 개선

## 🎨 디자인 QA 프로세스

```typescript
// src/tools/visual-comparison.ts
export const createVisualDiff = async (componentName: string, figmaUrl: string) => {
  // Figma 스크린샷과 실제 컴포넌트 비교
  // Percy, Chromatic 등 도구 활용
}
```

## 💡 권장사항

1. **시작은 간단하게**: 기본 버튼, 인풋부터
2. **토큰 먼저**: 색상, 간격 등 디자인 토큰 우선 정의  
3. **점진적 개선**: MVP 버전 후 지속적 개선
4. **문서화 필수**: 컴포넌트 사용법과 변형 문서화

이 방식으로도 고품질의 디자인 시스템을 구축할 수 있습니다!