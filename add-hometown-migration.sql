-- ========================================
-- ADD HOMETOWN COLUMN TO USERS TABLE
-- ========================================
-- This script adds the hometown field to the users table
-- Safe to run on existing databases
-- ========================================

-- Add hometown column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS hometown TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.users.hometown IS 'User hometown location (optional)';
