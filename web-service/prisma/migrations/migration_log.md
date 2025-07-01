# Migration Log

이 파일은 데이터베이스 마이그레이션의 실행 이력을 추적합니다.

## 2025-07-01

### 20250701_194108_create_user_metadata_trigger.sql
- **목적**: Supabase auth.users와 연동하는 UserMetadata 자동 생성 시스템 구축
- **변경사항**:
  - `handle_new_user()` 함수 생성: 새 사용자 생성 시 user_metadata 자동 생성
  - `on_auth_user_created` 트리거 생성: auth.users INSERT 시 함수 실행
  - Row Level Security (RLS) 정책 설정
  - 적절한 권한 부여
- **영향**: 
  - 새 사용자 가입 시 user_metadata 테이블에 자동으로 레코드 생성
  - 보안 정책으로 사용자는 자신의 데이터만 접근 가능
- **실행 방법**: Supabase Dashboard SQL Editor에서 실행
- **상태**: 완료

---

## 마이그레이션 실행 가이드

### 실행 전 체크리스트
- [ ] 데이터베이스 백업 완료
- [ ] Prisma 스키마 변경사항 확인
- [ ] 환경변수 설정 확인

### 실행 순서
1. `npx prisma db push` - 스키마 변경사항 적용
2. Supabase Dashboard에서 SQL 마이그레이션 실행
3. 테스트 사용자로 기능 검증

### 롤백 방법
필요시 다음 SQL로 롤백 가능:
```sql
-- 트리거 삭제
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 함수 삭제
DROP FUNCTION IF EXISTS public.handle_new_user();

-- RLS 정책 삭제
DROP POLICY IF EXISTS "Users can view own metadata" ON public.user_metadata;
DROP POLICY IF EXISTS "Users can update own metadata" ON public.user_metadata;
DROP POLICY IF EXISTS "Enable insert for service role only" ON public.user_metadata;
``` 