-- ============================================================
-- Fix: Bootstrap all existing auth.users into tkw_user_permissions
-- Run this in Supabase SQL Editor (with service_role privileges)
-- ============================================================

-- Step 1: Insert all existing auth users who haven't been registered yet
INSERT INTO public.tkw_user_permissions (
  user_id, email, role,
  can_read_token_wallet, can_edit_token_wallet,
  can_read_payments, can_edit_payments,
  can_read_app_wallet, can_edit_app_wallet
)
SELECT
  u.id,
  u.email,
  CASE WHEN u.email = 'hoang.hoa@gmail.com' THEN 'admin' ELSE 'user' END,
  CASE WHEN u.email = 'hoang.hoa@gmail.com' THEN true ELSE false END,
  CASE WHEN u.email = 'hoang.hoa@gmail.com' THEN true ELSE false END,
  CASE WHEN u.email = 'hoang.hoa@gmail.com' THEN true ELSE false END,
  CASE WHEN u.email = 'hoang.hoa@gmail.com' THEN true ELSE false END,
  true,  -- can_read_app_wallet = true for everyone
  CASE WHEN u.email = 'hoang.hoa@gmail.com' THEN true ELSE false END
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.tkw_user_permissions p WHERE p.user_id = u.id
);

-- Step 2: Verify result
SELECT user_id, email, role, can_read_token_wallet, can_read_app_wallet, created_at
FROM public.tkw_user_permissions
ORDER BY created_at;
