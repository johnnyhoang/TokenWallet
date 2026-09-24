-- ============================================================
-- FULL FIX SCRIPT - Run via direct DB connection
-- Date: 2026-09-24
-- Fixes schema mismatch and RLS for TokenWallet Payment Schedules
-- ============================================================

-- STEP 1: Add missing columns to tkw_payment_schedules if they don't exist
ALTER TABLE public.tkw_payment_schedules ADD COLUMN IF NOT EXISTS due_date_string TEXT;
ALTER TABLE public.tkw_payment_schedules ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.tkw_payment_schedules ADD COLUMN IF NOT EXISTS is_paused BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.tkw_payment_schedules ADD COLUMN IF NOT EXISTS raw_input TEXT;

-- STEP 2: Create tkw_user_permissions table with user_id UUID
CREATE TABLE IF NOT EXISTS public.tkw_user_permissions (
  user_id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  can_read_token_wallet BOOLEAN NOT NULL DEFAULT false,
  can_edit_token_wallet BOOLEAN NOT NULL DEFAULT false,
  can_read_payments BOOLEAN NOT NULL DEFAULT false,
  can_edit_payments BOOLEAN NOT NULL DEFAULT false,
  can_read_app_wallet BOOLEAN NOT NULL DEFAULT true,
  can_edit_app_wallet BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 3: Create or replace tkw_perm() helper function
CREATE OR REPLACE FUNCTION public.tkw_perm(flag text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $fn$
  SELECT COALESCE((
    SELECT CASE flag
      WHEN 'can_read_token_wallet' THEN p.can_read_token_wallet
      WHEN 'can_edit_token_wallet' THEN p.can_edit_token_wallet
      WHEN 'can_read_payments'     THEN p.can_read_payments
      WHEN 'can_edit_payments'     THEN p.can_edit_payments
      WHEN 'can_read_app_wallet'   THEN p.can_read_app_wallet
      WHEN 'can_edit_app_wallet'   THEN p.can_edit_app_wallet
      WHEN 'is_admin'              THEN (p.role = 'admin')
      ELSE false
    END
    FROM public.tkw_user_permissions p
    WHERE p.user_id = auth.uid()
  ), false);
$fn$;

-- STEP 4: RLS Policies for tkw_user_permissions
ALTER TABLE public.tkw_user_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read own or admin" ON public.tkw_user_permissions;
CREATE POLICY "read own or admin" ON public.tkw_user_permissions
  FOR SELECT USING (user_id = auth.uid() OR public.tkw_perm('is_admin'));

DROP POLICY IF EXISTS "self register unprivileged" ON public.tkw_user_permissions;
CREATE POLICY "self register unprivileged" ON public.tkw_user_permissions
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND role = 'user'
    AND can_read_token_wallet = false AND can_edit_token_wallet = false
    AND can_read_payments     = false AND can_edit_payments     = false
    AND can_edit_app_wallet   = false
  );

DROP POLICY IF EXISTS "admin manages permissions" ON public.tkw_user_permissions;
CREATE POLICY "admin manages permissions" ON public.tkw_user_permissions
  FOR UPDATE USING (public.tkw_perm('is_admin'))
             WITH CHECK (public.tkw_perm('is_admin'));

-- STEP 5: Bootstrap hoang.hoa@gmail.com into permissions table if user exists
INSERT INTO public.tkw_user_permissions (
  user_id, email, role,
  can_read_token_wallet, can_edit_token_wallet,
  can_read_payments, can_edit_payments,
  can_read_app_wallet, can_edit_app_wallet
)
SELECT
  u.id,
  u.email,
  'admin',
  true, true, true, true, true, true
FROM auth.users u
WHERE u.email = 'hoang.hoa@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  can_read_token_wallet = true,
  can_edit_token_wallet = true,
  can_read_payments = true,
  can_edit_payments = true,
  can_read_app_wallet = true,
  can_edit_app_wallet = true,
  updated_at = NOW();

-- STEP 6: Fix RLS policies on tkw_payment_schedules
DROP POLICY IF EXISTS "read payments" ON public.tkw_payment_schedules;
DROP POLICY IF EXISTS "write payments" ON public.tkw_payment_schedules;
DROP POLICY IF EXISTS "Allow all for anon on tkw_payment_schedules" ON public.tkw_payment_schedules;

ALTER TABLE public.tkw_payment_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read payments" ON public.tkw_payment_schedules
  FOR SELECT USING (public.tkw_perm('can_read_payments'));

CREATE POLICY "write payments" ON public.tkw_payment_schedules
  FOR ALL USING (public.tkw_perm('can_edit_payments'))
           WITH CHECK (public.tkw_perm('can_edit_payments'));

-- STEP 7: Insert Azure Reminders
INSERT INTO public.tkw_payment_schedules (
  id, title, account_email,
  due_date, due_date_string,
  recurrence, repeat_count,
  amount, currency,
  payment_method, is_auto_debit,
  is_paid, is_paused,
  raw_input, created_at, updated_at
) VALUES
(
  'pay-azure-check-23',
  'Azure Free (Kiểm tra trước hạn ngày 24)',
  'hoang.hoa@gmail.com',
  1792731600000,
  '2026-10-23',
  'monthly', NULL,
  NULL, 'VND',
  'VPBank (Thuy Nga)', false,
  false, false,
  'Đăng ký tài khoản Azure free cho hoang.hoa@gmail.com bằng thẻ VPBank của Thuy Nga. Nhắc hàng tháng trước ngày 24 1 ngày (ngày 23).',
  (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint,
  (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint
),
(
  'pay-azure-check-24',
  'Azure Free (Check phí ngày 24)',
  'hoang.hoa@gmail.com',
  1792818000000,
  '2026-10-24',
  'monthly', NULL,
  NULL, 'VND',
  'VPBank (Thuy Nga)', false,
  false, false,
  'Đăng ký tài khoản Azure free cho hoang.hoa@gmail.com bằng thẻ VPBank của Thuy Nga. Nhắc hàng tháng ngày 24 check xem Azure có charge gì không.',
  (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint,
  (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  account_email = EXCLUDED.account_email,
  due_date = EXCLUDED.due_date,
  due_date_string = EXCLUDED.due_date_string,
  payment_method = EXCLUDED.payment_method,
  raw_input = EXCLUDED.raw_input,
  updated_at = (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint;
