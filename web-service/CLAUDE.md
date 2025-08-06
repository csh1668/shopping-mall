# ShopMall - 쇼핑몰 프로젝트

## 프로젝트 개요

현대적인 e-commerce 쇼핑몰 웹 애플리케이션입니다. Next.js 15와 React 19를 기반으로 구축되었으며, Supabase를 백엔드로 사용하고 Prisma ORM을 통해 PostgreSQL 데이터베이스를 관리합니다.

## 기술 스택

### 프론트엔드
- **프레임워크**: Next.js 15.3.5 (App Router)
- **라이브러리**: React 19.1.0, React DOM 19.1.0
- **언어**: TypeScript 5
- **스타일링**: TailwindCSS 3.4.17, Tailwind CSS Animate
- **UI 컴포넌트**: Radix UI 컴포넌트 (Shadcn/ui 기반)
- **애니메이션**: Framer Motion 12.23.6

### 백엔드 & 데이터베이스
- **백엔드 서비스**: Supabase (인증, 데이터베이스, 실시간 기능)
- **API**: tRPC 11.4.3 (타입 안전한 API)
  - React Query 통합 및 Vanilla 클라이언트 지원
  - 인증 및 관리자 권한 미들웨어
  - Zod 스키마 기반 유효성 검사
- **ORM**: Prisma (PostgreSQL)
- **상태 관리**: Zustand, Tanstack React Query 5.81.5

### 개발 도구
- **린터**: Biome 2.1.0
- **Git Hook**: Lefthook 1.12.1
- **패키지 매니저**: pnpm

## 프로젝트 구조

```
├── app/                    # Next.js App Router 페이지
│   ├── api/               # API 라우트
│   ├── auth/              # 인증 관련 페이지
│   ├── cart/              # 장바구니 페이지
│   ├── c/[category]/      # 카테고리별 상품 목록
│   ├── p/[slug]/          # 상품 상세 페이지
│   ├── profile/           # 사용자 프로필
│   └── components/        # 페이지별 컴포넌트
├── components/            # 재사용 가능한 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── providers/        # 컨텍스트 제공자
│   ├── search/           # 검색 관련 컴포넌트
│   └── ui/               # Shadcn/ui 기반 UI 컴포넌트
├── hooks/                # 커스텀 훅
├── lib/                  # 유틸리티 함수 및 설정
├── prisma/               # 데이터베이스 스키마 및 마이그레이션
├── server/               # tRPC 서버 설정 및 라우터
│   ├── client.ts         # tRPC 클라이언트 (React & Vanilla)
│   ├── context.ts        # tRPC 컨텍스트 생성 및 인증 처리
│   ├── index.ts          # tRPC 초기화 및 미들웨어
│   ├── router.ts         # 메인 라우터 설정
│   ├── server.ts         # 서버사이드 헬퍼
│   ├── routers/          # 도메인별 라우터
│   │   ├── category.ts   # 카테고리 관련 API
│   │   ├── example.ts    # 예제 API
│   │   ├── order.ts      # 주문 관련 API
│   │   ├── payment.ts    # 결제 관련 API
│   │   ├── product.ts    # 상품 관련 API
│   │   └── user.ts       # 사용자 관련 API
│   └── schemas/          # Zod 스키마 정의
│       ├── index.ts      # 공통 스키마
│       ├── order.ts      # 주문 스키마
│       ├── payment.ts    # 결제 스키마
│       ├── product.ts    # 상품 스키마
│       └── user.ts       # 사용자 스키마
├── stores/               # Zustand 상태 관리
└── public/               # 정적 파일
```

## 핵심 기능

### 1. 인증 시스템
- **Supabase Auth** 기반 인증
- **소셜 로그인**: 카카오, 구글 지원
- **세션 관리**: 자동 로그인/로그아웃, 세션 유지
- **인증 가드**: 보호된 페이지 접근 제어

### 2. 상품 관리
- **카테고리별 상품 분류**: 계층 구조 지원
- **상품 변형**: 색상, 사이즈, 소재 등 옵션
- **재고 관리**: 재고 수량 및 최소 재고 알림
- **상품 검색**: 실시간 검색, 필터링 기능

### 3. 장바구니 시스템
- **Zustand** 기반 상태 관리
- **로컬 스토리지** 연동으로 데이터 지속성
- **실시간 가격 계산**: 할인가, 총 금액 자동 계산
- **사이드바 UI**: 편리한 장바구니 관리

### 4. 주문 관리
- **주문 상태 추적**: 대기 → 확인 → 처리 → 배송 → 완료
- **주문 이력**: 상태 변경 기록 관리
- **주소 관리**: 배송지 등록 및 관리

### 5. 리뷰 시스템
- **평점 및 리뷰 작성**: 1-5점 평점, 이미지 첨부
- **도움됨 기능**: 리뷰 유용성 평가

### 6. 결제 시스템
- **토스페이먼츠 연동**: 다양한 결제 수단 지원
- **결제 상태 관리**: 대기 → 완료 → 실패/취소/환불
- **거래 추적**: paymentKey, transactionId 관리

### 7. 위시리스트 시스템
- **상품 찜하기**: 사용자별 위시리스트 관리
- **중복 방지**: 사용자당 상품 하나씩만 등록

### 8. 쿠폰 시스템
- **할인 관리**: 고정 금액 또는 퍼센트 할인
- **사용 제한**: 최소 주문 금액, 최대 할인, 사용 횟수 제한
- **유효 기간**: 쿠폰 활성화 기간 관리

## 데이터베이스 스키마

### 주요 테이블
- **UserMetadata**: 사용자 메타데이터 (Supabase auth.users 연동)
- **Address**: 배송지 정보
- **Category**: 상품 카테고리 (계층 구조)
- **Product**: 상품 정보 (브랜드, SKU, 재고 관리)
- **ProductVariant**: 상품 변형 (색상, 사이즈, 소재 등)
- **CartItem**: 장바구니 아이템 (선택 옵션 포함)
- **WishlistItem**: 위시리스트 아이템
- **Order**: 주문 정보 (할인, 배송비, 송장번호)
- **OrderStatusHistory**: 주문 상태 변경 이력
- **OrderItem**: 주문 상품 아이템 (선택 옵션 포함)
- **Review**: 상품 리뷰 (평점, 이미지, 도움됨 기능)
- **Payment**: 결제 정보 (토스페이먼츠 연동)
- **Coupon**: 쿠폰 및 할인 관리

### 주요 Enum
- **UserRole**: CUSTOMER, SELLER, ADMIN, SUPER_ADMIN
- **VariantType**: COLOR, SIZE, MATERIAL, OTHER
- **OrderStatus**: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
- **PaymentStatus**: PENDING, PAID, FAILED, CANCELLED, REFUNDED, PARTIALLY_REFUNDED
- **PaymentMethod**: CARD, TRANSFER, VIRTUAL_ACCOUNT, MOBILE, KAKAOPAY, NAVERPAY, TOSSPAY
- **CouponType**: FIXED_AMOUNT, PERCENTAGE

## 개발 스크립트

```bash
# 개발 서버 실행 (Turbo 모드)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 코드 린팅 및 포매팅
pnpm lint

# 데이터베이스 시드 실행
pnpm db:seed

# 패키지 설치 후 자동 실행 (Prisma 생성 + Lefthook 설치)
pnpm postinstall
```

## 환경 설정 파일

### 필수 환경 변수
```env
# Client-side
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY="test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"


# Server-side
NODE_ENV=development
SUPABASE_SERVICE_ROLE_KEY=""
DATABASE_URL="postgresql://[USERNAME]:[PASSWORD]@[URL]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://[USERNAME]:[PASSWORD]@[URL]:5432/postgres"
TOSS_PAYMENTS_SECRET_KEY="test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6"
```

## 개발 워크플로우

### 코드 품질 관리
- **Biome**: 코드 포매팅 및 린팅
- **Lefthook**: Git hook을 통한 자동 코드 검사
- **TypeScript**: 타입 안전성 보장

### 배포 최적화
- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **번들 최적화**: 프로덕션 빌드 시 console.log 제거
- **서버 외부 패키지**: Prisma Client 최적화

## 주요 라이브러리 및 도구

### UI/UX
- **Radix UI**: 접근성을 고려한 헤드리스 컴포넌트
- **Lucide React**: 아이콘 라이브러리
- **Class Variance Authority**: 조건부 스타일링
- **CLSX & Tailwind Merge**: 클래스 병합 유틸리티

### 폼 및 유효성 검사
- **React Hook Form**: 폼 상태 관리
- **Zod**: 스키마 유효성 검사
- **Hookform Resolvers**: React Hook Form과 Zod 연동

### 날짜 및 시간
- **Date-fns**: 날짜 조작 라이브러리
- **React Day Picker**: 날짜 선택 컴포넌트

## 보안 및 성능

### 보안
- **Supabase RLS**: Row Level Security 정책 적용
- **tRPC 미들웨어**: 인증 및 권한 검사
- **환경 변수 분리**: 클라이언트/서버 환경 변수 구분

### 성능
- **Server Components**: Next.js App Router의 서버 컴포넌트 활용
- **React Query**: 데이터 캐싱 및 동기화
- **Lazy Loading**: 컴포넌트 지연 로딩
- **이미지 최적화**: Next.js Image 컴포넌트

## tRPC 서버 아키텍처

### 1. 컨텍스트 (Context)
- **Supabase 인증**: 서버 클라이언트를 통한 사용자 인증 상태 관리
- **세션 관리**: access_token 기반 인증 헤더 자동 처리
- **타입 안전성**: TypeScript 타입 추론으로 컴파일 타임 검사

### 2. 미들웨어 시스템
- **enforceUserIsAuthed**: 로그인 필수 프로시저용 미들웨어
- **enforceUserIsAdmin**: 관리자 권한 필수 프로시저용 미들웨어
- **에러 포매팅**: Zod 유효성 검사 오류 자동 처리

### 3. 프로시저 타입
- **publicProcedure**: 인증 불필요한 공개 API
- **protectedProcedure**: 로그인 필요한 보호된 API  
- **adminProcedure**: 관리자 권한 필요한 API

### 4. 클라이언트 지원
- **React Hooks (trpc)**: 컴포넌트에서 사용하는 React Query 기반 훅
- **Vanilla Client (vTrpc)**: 서버 액션 등에서 사용하는 일반 클라이언트
- **Server Helpers (sTrpc)**: 서버사이드 렌더링용 헬퍼

### 5. 도메인별 라우터
- **user**: 사용자 관리 (프로필, 권한)
- **product**: 상품 관리 (목록, 상세, 검색)
- **category**: 카테고리 관리 (계층 구조)
- **order**: 주문 관리 (생성, 상태 변경, 이력)
- **payment**: 결제 처리 (토스페이먼츠 연동)

### 6. 스키마 검증
- **공통 스키마**: ID, UUID, 페이지네이션, 검색
- **도메인별 스키마**: 각 라우터에 대응하는 입력/출력 스키마
- **Zod 통합**: 런타임 타입 검사 및 에러 메시지

## 추가 개발 예정 기능

- 실시간 알림 기능
- 관리자 대시보드
- 다국어 지원
- 상품 추천 시스템
- 재고 부족 알림

## Golden Rules

- 프로젝트와 관련해서 확신이 서지 않는 경우, 변경하기 전에 개발자에게 설명을 요청하세요.
- 요청 사항에 대한 구체적인 설명이 필요할 경우 개발자에게 추가 설명을 요청하세요.
- 영리함보단 유지보수 가능성을 더 우선하세요.

## 코딩 컨벤션 및 지침

### 1. 네이밍 컨벤션
- **파일명**: kebab-case 사용 (`auth-provider.tsx`, `user-menu.tsx`)
- **컴포넌트**: PascalCase 사용 (`AuthProvider`, `UserMenu`)
- **함수/변수**: camelCase 사용 (`createLogger`, `getUserData`)
- **상수**: SCREAMING_SNAKE_CASE 사용 (`NEXT_PUBLIC_SUPABASE_URL`)

### 2. 환경 변수 관리
- **클라이언트 환경 변수**: `public-env.ts`에서 Zod 스키마로 유효성 검사
- **서버 환경 변수**: `server-env.ts`에서 클라이언트 임포트 방지 체크
- **타입 안전성**: 환경 변수 타입을 추론하여 컴파일 타임 검사

```typescript
// public-env.ts - 클라이언트에서 사용 가능
export const publicEnv = PublicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
});

// server-env.ts - 서버에서만 사용
if (typeof window !== "undefined") {
  throw new Error("server-env.ts should only be imported on the server.");
}
```

### 3. 유틸리티 함수 패턴
- **단일 책임**: 각 유틸리티는 하나의 명확한 목적을 가짐
- **타입 안전성**: TypeScript 타입 정의 필수
- **재사용성**: 프로젝트 전반에서 사용할 수 있도록 설계

```typescript
// utils.ts - Tailwind 클래스 병합
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 4. 로깅 규칙
- **구조화된 로깅**: Logger 클래스 사용으로 일관된 로그 포맷
- **타임스탬프**: 모든 로그에 정확한 시간 정보 포함
- **색상 구분**: 로그 레벨별 색상으로 가독성 향상
- **Biome ignore**: 필요시 정당한 사유와 함께 린트 규칙 무시

```typescript
// logger.ts - 구조화된 로깅
const logger = createLogger('ComponentName');
logger.info('User authenticated successfully', { userId: '123' });
logger.error('API call failed', error);
```

### 5. 데이터베이스 연결 패턴
- **싱글톤 패턴**: Prisma 클라이언트 전역 인스턴스 사용
- **개발 환경 최적화**: Hot reload 시 연결 재사용
- **타입 안전성**: Prisma 생성 타입 활용

```typescript
// prisma.ts - 글로벌 싱글톤
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
```

### 6. Supabase 클라이언트 패턴
- **클라이언트/서버 분리**: 브라우저용과 서버용 클라이언트 구분
- **쿠키 처리**: 서버 컴포넌트에서 안전한 쿠키 관리
- **에러 처리**: try-catch로 쿠키 설정 실패 무시

```typescript
// 클라이언트용
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// 서버용 (쿠키 지원)
export const getSupabaseServerClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { /* 쿠키 처리 로직 */ }
  });
};
```

### 7. 에러 처리 원칙
- **조용한 실패**: 비중요한 작업은 try-catch로 조용하게 처리
- **의미있는 에러 메시지**: 사용자가 이해할 수 있는 에러 메시지
- **로깅**: 모든 에러는 적절한 레벨로 로깅

### 8. 코드 스타일
- **Biome 설정**: 탭 인덴트, CRLF 줄바꿈, 더블 쿼트 사용
- **Import 정리**: 자동 import 정리 활성화
- **린트 무시**: 정당한 사유가 있을 때만 biome-ignore 사용

### 9. 함수형 프로그래밍 패턴
- **Factory 패턴**: `Logger.create()`, `createLogger()` 형태
- **순수 함수**: 사이드 이펙트 최소화
- **함수 컴포지션**: 작은 함수들의 조합

## 개발자 노트

이 프로젝트는 현대적인 React/Next.js 패턴을 따르며, 타입 안전성과 개발자 경험을 중시합니다. tRPC를 통해 엔드투엔드 타입 안전성을 확보하고, Supabase를 활용해 빠른 개발과 확장성을 동시에 추구합니다. 

모든 코드는 위의 컨벤션을 따라 작성하며, 특히 환경 변수 관리, 로깅, 에러 처리에서 일관성을 유지합니다.