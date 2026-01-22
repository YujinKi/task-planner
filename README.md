# Task Planner

추상적인 목표를 구체적이고 실행 가능한 작업으로 분해해주는 AI 기반 태스크 플래너입니다.

## 주요 기능

- **목표 입력**: 이루고 싶은 목표를 자유롭게 입력
- **시간 설정**: 투자할 수 있는 시간 지정 (최소 30분)
- **AI 기반 계획 생성**: Claude AI가 목표를 시간 내에 달성 가능한 구체적인 단계로 분해
- **시각적 플랜 표시**: 각 단계별 소요 시간과 상세 설명 제공

## 기술 스택

### Frontend
- React 19
- TailwindCSS
- Lucide React (아이콘)

### Backend
- Vercel Serverless Functions
- Anthropic Claude API (claude-sonnet-4)

## 프로젝트 구조

```
task-planner/
├── src/
│   ├── App.js
│   ├── components/
│   │   └── TaskBreakdown.jsx    # 메인 컴포넌트
│   ├── index.js
│   └── index.css
├── api/
│   └── generate-plan.js         # Vercel API 핸들러
├── public/
├── package.json
├── tailwind.config.js
└── vercel.json
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Anthropic API 키를 설정합니다.

```
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

## 배포

Vercel을 통해 배포됩니다.

```bash
vercel
```

## 사용 예시

1. 목표 입력: "면접 준비하기"
2. 시간 설정: 1시간 30분
3. "계획 생성하기" 버튼 클릭
4. AI가 생성한 단계별 계획 확인

## 라이선스

MIT