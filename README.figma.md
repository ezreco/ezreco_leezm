# Figma Integration Setup

EZReco 프로젝트에 Figma가 성공적으로 연결되었습니다.

## 🎨 설치된 패키지

- `@figma/code-connect` - Figma와 React 컴포넌트 연결
- `figma-api` - Figma API 통합  
- `style-dictionary` - 디자인 토큰 변환

## 🔧 설정 단계

### 1. Figma Access Token 발급
1. Figma → Account Settings → Personal Access Tokens
2. 새 토큰 생성 후 `.env` 파일에 추가

### 2. 환경 변수 설정
```bash
# .env 파일 생성 (.env.example 참고)
FIGMA_ACCESS_TOKEN=your_token_here
FIGMA_FILE_KEY=your_file_key_here
```

### 3. Figma 파일 연결
`figma.config.js`에서 Figma 파일 URL 설정:
```javascript
documents: [
  'https://www.figma.com/file/YOUR_FILE_KEY/YOUR_FILE_NAME'
]
```

## 📁 생성된 구조

```
src/
├── tokens/              # 디자인 토큰
│   └── colors.json      # 색상 토큰
├── styles/              # 생성된 스타일
├── figma-components/    # Figma 연결 컴포넌트
└── utils/
    └── figma.ts         # Figma API 유틸리티
```

## 🚀 사용 가능한 명령어

```bash
# 디자인 토큰 빌드
npm run tokens:build

# Figma Code Connect 설정
npm run figma:connect

# Figma와 동기화
npm run figma:sync
```

## 💡 다음 단계

1. Figma Personal Access Token 발급
2. 프로젝트 Figma 파일 키 설정
3. 컴포넌트별 Figma 매핑 구성
4. 디자인 토큰 추출 및 적용

## 📖 참고 자료

- [Figma Code Connect 문서](https://www.figma.com/developers/api)
- [Style Dictionary 가이드](https://amzn.github.io/style-dictionary/)