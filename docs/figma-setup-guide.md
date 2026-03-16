# Figma 연결 설정 가이드

## 🔗 현재 설정 상태

- ✅ Figma URL: `https://www.figma.com/design/buaJMradiPb9SUAQytXQg8/EZReco-AI-Agent-UX---%EA%B0%9C%EB%B0%9C`
- ✅ File Key: `buaJMradiPb9SUAQytXQg8`  
- ⚠️  Access Token: 확인 필요

## 🚨 현재 문제

Figma API에서 404 오류가 발생하고 있습니다. 가능한 원인:

1. **Access Token 권한 부족**
2. **파일 접근 권한 없음**
3. **파일이 Private 상태**

## 🔧 해결 방법

### 1. Figma Access Token 재발급

1. [Figma Settings](https://www.figma.com/settings) 방문
2. **Personal Access Tokens** 섹션
3. 새 토큰 생성 (모든 권한 체크)
4. `.env` 파일에 새 토큰 업데이트

### 2. 파일 권한 확인

- Figma 파일이 **Public** 또는 **Can view** 권한인지 확인
- 개인 계정으로 파일에 접근할 수 있는지 확인

### 3. 대안: Figma 플러그인 사용

```bash
# Figma Dev Mode를 통한 직접 연결
npm run figma:connect "https://www.figma.com/design/buaJMradiPb9SUAQytXQg8?node-id=1-2"
```

### 4. 수동 컴포넌트 매핑

API 연결이 안 될 경우, 수동으로 컴포넌트를 매핑할 수 있습니다:

```typescript
// src/components/Button.figma.tsx
figma.connect(Button, 'https://www.figma.com/design/buaJMradiPb9SUAQytXQg8', {
  variant: 'Button Component',
  props: {
    variant: figma.enum('Style', {
      Primary: 'primary',
      Secondary: 'secondary'  
    })
  }
})
```

## 💡 다음 단계

1. **새 Access Token 발급** (권한 확인)
2. **파일 공개 설정 확인**
3. **특정 컴포넌트 Node ID 수집**
4. **수동 연결 후 자동화 적용**

## 🛠 사용 가능한 명령어

```bash
npm run figma:test          # 연결 테스트
npm run figma:connect       # 컴포넌트 연결 
npm run figma:sync         # 동기화
npm run tokens:build       # 디자인 토큰 빌드
```