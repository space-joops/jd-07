# Astropet PWA - 작업 내역 (Work Log)

## 2026-07-19 (초기 세팅 및 메인 UI 퍼블리싱)

### 1. 프로젝트 초기화
- **기술 스택:** Next.js 15, Tailwind CSS, TypeScript
- **디렉토리:** `/astropet-app`
- **패키지 매니저:** npm

### 2. PWA (Progressive Web App) 환경 구축
- `@serwist/next` 라이브러리 설치 및 서비스 워커(`sw.ts`) 세팅
- `public/manifest.json` 생성 (PWA 설치 메타데이터, 앱 이름, 색상 등)
- 임시 앱 아이콘(`icon.svg`) 추가
- `src/app/layout.tsx` 내 PWA 메타 태그(`manifest`, `appleWebApp`) 및 `viewport`(`themeColor`) 추가
- Next 15 Turbopack 환경에서의 호환성을 위해 `next.config.ts` 개발 모드 설정 보완

### 3. 메인 관제소(Home) UI 개발
- `lucide-react` 아이콘 세트 설치
- `src/app/page.tsx`에 우주 테마(다크 모드) 기반 디자인 구현
  - **헤더:** 앱 타이틀 및 레벨/에너지 표시, 사용자 프로필
  - **메인 뷰:** 아스트로펫 캐릭터(임시), 행성 후광 효과 연출
  - **타이머 (Glassmorphism):** "Next Orbit In" (상공 통과 카운트다운) 카드 뷰
  - **상태 카드:** 체력(Health), 행복도(Happiness) 수치 및 현재 활동 진행률 바(shimmer 애니메이션 적용)
  - **하단 네비게이션:** 모바일 앱 사용성을 고려한 고정된 하단 탭 (Home, Orbit, Craft, Profile)
- `src/app/globals.css`에 커스텀 빛내림(`shimmer`) 애니메이션 추가

### 4. 기타 설정
- `package.json` 개발 서버 구동 스크립트를 `next dev -p 3007`로 변경하여 고정 포트 3007 할당
