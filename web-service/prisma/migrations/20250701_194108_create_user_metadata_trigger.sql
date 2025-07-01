-- UserMetadata 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_metadata (id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- auth.users 테이블에 트리거 생성
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- UserMetadata 업데이트 함수 (선택사항)
-- CREATE OR REPLACE FUNCTION public.handle_user_update()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   UPDATE public.user_metadata
--   SET 
--     full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
--     updated_at = NOW()
--   WHERE id = NEW.id;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- -- auth.users 업데이트 트리거 (선택사항)
-- CREATE OR REPLACE TRIGGER on_auth_user_updated
--   AFTER UPDATE ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- RLS (Row Level Security) 정책 설정
ALTER TABLE public.user_metadata ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 메타데이터만 조회/수정 가능
CREATE POLICY "Users can view own metadata" ON public.user_metadata
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own metadata" ON public.user_metadata
  FOR UPDATE USING (auth.uid() = id);

-- 시스템에서만 삽입 가능 (트리거를 통해)
CREATE POLICY "Enable insert for service role only" ON public.user_metadata
  FOR INSERT WITH CHECK (auth.role() = 'service_role'); 