# React Community Project

> **Supabase**와 **React**를 활용한 현대적인 커뮤니티 애플리케이션입니다.
>
> 기기별 최적화된 **반응형 UI**와 로딩/처리와 같은 **상태 기반 UX 피드백**을 통해 끊김 없는 사용자 경험을 제공합니다.
>
> 클라이언트 측 **이미지 최적화 파이프라인**을 구축하여 효율적인 서비스 환경을 구현했습니다.

### [🔗 배포 사이트 바로가기](https://react-community-app.vercel.app/)

---

## Tech Stack

| Category         | Tech Stack                             |
|:-----------------|:---------------------------------------|
| **Frontend**     | React 18, Tailwind CSS, Lucide React   |
| **Backend**      | Supabase (Auth, Database, Storage)     |
| **State/Data**   | TanStack Query v5, Context API         |
| **Optimization** | browser-image-compression, heic2any    |
| **Code Quality** | ESLint, Prettier, Tailwind Merge, clsx |
| **Deployment**   | Vercel                                 |

---

## Features

### 1. 반응형 UI & UX

- **반응형 레이아웃**: `Tailwind CSS`를 활용하여 모바일, 태블릿, 데스크톱 기기별 최적화된 레이아웃을 구현했습니다.
- **상태 기반 사용자 피드백**: 초기 데이터 로딩 부터 생성·수정·삭제 처리 상태를 세밀하게 관리하여, 데이터 처리 중 사용자에게 즉각적인 시각적
  피드백을 제공하고 중복 요청을 방지했습니다.

### 2. 스마트 이미지 업로드

- **HEIC 지원**: `heic2any`를 통해 아이폰 사용자들의 HEIC 이미지 파일을 자동으로 변환합니다.
- **클라이언트 측 이미지 압축**: 서버 부하를 줄이고 전송 속도를 높이기 위해 최대 파일 크기 제한 및 이미지 압축 프로세스를 자동화했습니다.

### 3. 안정적인 데이터 및 상태 관리

- **TanStack Query v5**: 비동기 데이터 패칭, 캐싱, 서버 상태 동기화를 효율적으로 관리합니다.
- **무한 스크롤 구현**: `Intersection Observer API`를 활용하여 매끄러운 무한 스크롤 기능을 구현했습니다.
- **관심사 분리 및 최적화**: 컴포넌트 생명주기를 고려한 분리와 `key` props 활용으로 불필요한 리렌더링을 방지하고 상태 불일치를 해결했습니다.
- **Custom Hooks 활용**: `useAuth`, `usePost` 등 커스텀 훅을 통해 로직을 캡슐화하고 재사용성을 높였습니다.

### 4. 일관된 스타일링 아키텍처

- **유연한 스타일 관리**: `tailwind-merge`와 `clsx`를 결합한 `cn` 유틸리티를 사용하여 조건부 스타일링 시 클래스 충돌을
  방지했습니다.
- **코드 포맷팅 자동화**: `prettier-plugin-tailwindcss`를 적용하여 팀 협업 시 일관된 클래스 정렬 순서를 보장합니다.
