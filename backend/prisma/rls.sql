-- Row Level Security Policies for ANDIKA
-- These policies ensure users can only access their own data

-- Enable RLS on all tables
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TypingSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Streak" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TypingSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "KeyMetric" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LessonProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PracticeSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAchievement" ENABLE ROW LEVEL SECURITY;

-- Profile RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON "Profile"
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON "Profile"
  FOR UPDATE USING (user_id = auth.uid());

-- TypingSettings RLS Policies
-- Users can view their own typing settings
CREATE POLICY "Users can view own typing settings" ON "TypingSettings"
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM "Profile" WHERE user_id = auth.uid()
    )
  );

-- Users can update their own typing settings
CREATE POLICY "Users can update own typing settings" ON "TypingSettings"
  FOR UPDATE USING (
    profile_id IN (
      SELECT id FROM "Profile" WHERE user_id = auth.uid()
    )
  );

-- Streak RLS Policies
-- Users can view their own streak
CREATE POLICY "Users can view own streak" ON "Streak"
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM "Profile" WHERE user_id = auth.uid()
    )
  );

-- TypingSession RLS Policies
-- Users can view their own typing sessions
CREATE POLICY "Users can view own typing sessions" ON "TypingSession"
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM "Profile" WHERE user_id = auth.uid()
    )
  );

-- Users can insert their own typing sessions
CREATE POLICY "Users can insert own typing sessions" ON "TypingSession"
  FOR INSERT WITH CHECK (
    profile_id IN (
      SELECT id FROM "Profile" WHERE user_id = auth.uid()
    )
  );

-- KeyMetric RLS Policies
-- Users can view key metrics for their own sessions
CREATE POLICY "Users can view own key metrics" ON "KeyMetric"
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM "TypingSession" 
      WHERE profile_id IN (
        SELECT id FROM "Profile" WHERE user_id = auth.uid()
      )
    )
  );

-- LessonProgress RLS Policies
-- Users can view their own lesson progress
CREATE POLICY "Users can view own lesson progress" ON "LessonProgress"
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM "Profile" WHERE user_id = auth.uid()
    )
  );

-- Users can update their own lesson progress
CREATE POLICY "Users can update own lesson progress" ON "LessonProgress"
  FOR UPDATE USING (
    profile_id IN (
      SELECT id FROM "Profile" WHERE user_id = auth.uid()
    )
  );

-- Users can insert their own lesson progress
CREATE POLICY "Users can insert own lesson progress" ON "LessonProgress"
  FOR INSERT WITH CHECK (
    profile_id IN (
      SELECT id FROM "Profile" WHERE user_id = auth.uid()
    )
  );

-- PracticeSession RLS Policies
-- Users can view their own practice sessions
CREATE POLICY "Users can view own practice sessions" ON "PracticeSession"
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM "Profile" WHERE user_id = auth.uid()
    )
  );

-- Users can insert their own practice sessions
CREATE POLICY "Users can insert own practice sessions" ON "PracticeSession"
  FOR INSERT WITH CHECK (
    profile_id IN (
      SELECT id FROM "Profile" WHERE user_id = auth.uid()
    )
  );

-- UserAchievement RLS Policies
-- Users can view their own achievements
CREATE POLICY "Users can view own achievements" ON "UserAchievement"
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM "Profile" WHERE user_id = auth.uid()
    )
  );

-- Public tables (no RLS needed)
-- Course, Module, Lesson, Exercise, Achievement, TypingContent, ProgrammingContent
-- These are read-only content that all authenticated users can access
