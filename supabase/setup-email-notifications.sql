-- ============================================================
-- STEP 1: Create the notifications table (skip if already done)
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  nomination_id uuid,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- STEP 2: Enable the pg_net extension (for calling Edge Functions)
-- Run this in the SQL Editor
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================
-- STEP 3: Create the trigger function
-- Replace YOUR_SUPABASE_URL and YOUR_ANON_KEY with your actual values
-- ============================================================
CREATE OR REPLACE FUNCTION notify_email_on_insert()
RETURNS trigger AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'notifications',
    'record', jsonb_build_object(
      'id', NEW.id,
      'user_id', NEW.user_id,
      'recipient_email', NEW.recipient_email,
      'message', NEW.message,
      'type', NEW.type,
      'nomination_id', NEW.nomination_id,
      'created_at', NEW.created_at
    )
  );

  -- Call the Edge Function via pg_net
  PERFORM net.http_post(
    url := 'https://kupbhcglnwjldybfpgop.supabase.co/functions/v1/send-notification-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cGJoY2dsbndqbGR5YmZwZ29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNTc5MTUsImV4cCI6MjA4OTgzMzkxNX0.egvEnyWYNvcPA9jUNpOcoKK9RT5bRutM8sCcXnUI1io'
    ),
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- STEP 4: Attach the trigger to the notifications table
-- ============================================================
DROP TRIGGER IF EXISTS on_notification_insert ON notifications;
CREATE TRIGGER on_notification_insert
  AFTER INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION notify_email_on_insert();
