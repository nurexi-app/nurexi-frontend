# Nursing CBT Platform - Database Schema

## 📋 Overview

This document outlines the database structure for a multi-exam nursing CBT platform with support for:

- Multiple exam types (NMCN, NCLEX, UK CBT)
- Subject-based learning (Anatomy, Med-Surg, etc.)
- Year-based exam simulation
- Bundle monetization (free/paid content)
- User access control via RLS

## 🗂️ Tables

### 1. `profiles`

**Purpose:** Extends Supabase auth.users with app-specific user data

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  roles TEXT[] DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. `subjects`

**Purpose:** Learning topics/categories (Anatomy, Medical Surgical Nursing, etc.)
**RLS:** Anyone can view, only admins can modify

### 3. `exams`

**Purpose:** Exam types (NMCN, NCLEX, UK CBT)
**RLS:** Anyone can view, only admins can modify

### 4. `years`

**Purpose:** Years available per exam (2024, 2023, etc.)
**RLS:** Anyone can view, only admins can modify

### 5. `questions`

**Purpose:** The actual question content
**RLS:** Users can only view questions they have access to (via user_access)

### 6. `bundles`

**Purpose:** What users purchase (e.g., "NMCN 2024 Complete")
**RLS:** Anyone can view, only admins can modify

### 7. `bundle_questions`

**Purpose:** Links bundles to questions (many-to-many)
**RLS:** Anyone can view, only admins can modify

### 8. `purchases`

**Purpose:** Tracks what users have bought
**RLS:** Users see own purchases, admins see all

### 9. `user_access`

**Purpose:** Cache table for fast access checking
**RLS:** Users see own access, system manages via triggers

## 🔗 Relationships

exams ──┬── years ──┐
│ │
└── bundles ─┼── bundle_questions ── questions
│ ↑
subjects ───────────┴───────────────────────┘

purchases ── bundles
↑
user_access ── questions

## 🔐 Row Level Security (RLS)

### Admin Check Function

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND 'admin' = ANY(roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Key RLS Policies

**Questions Table:**

```sql
CREATE POLICY "Users can view questions they have access to" ON questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_access ua
      WHERE ua.user_id = auth.uid()
      AND ua.question_id = questions.id
    )
  );
```

**Purchases Table:**

```sql
CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);
```

## ⚡ Automatic Access Triggers

### Grant Access on Purchase

```sql
CREATE TRIGGER after_purchase_insert
  AFTER INSERT ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION grant_purchase_access();
```

### Grant Access on Free Bundle

```sql
CREATE TRIGGER after_bundle_update
  AFTER UPDATE OF is_free ON bundles
  FOR EACH ROW
  WHEN (NEW.is_free = true)
  EXECUTE FUNCTION grant_free_bundle_access();
```

## 📊 Indexing Strategy

```sql
-- For fast lookups
CREATE INDEX idx_questions_subject ON questions(subject_id);
CREATE INDEX idx_questions_year ON questions(year_id);
CREATE INDEX idx_questions_topics ON questions USING GIN(topics);
CREATE INDEX idx_bundle_questions_bundle ON bundle_questions(bundle_id);
CREATE INDEX idx_bundle_questions_question ON bundle_questions(question_id);
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_user_access_user ON user_access(user_id, question_id);
```

## 🎯 How Users Get Access

| Scenario                | How Access is Granted                            |
| ----------------------- | ------------------------------------------------ |
| User purchases bundle   | Trigger adds all bundle questions to user_access |
| Admin makes bundle free | Trigger adds all bundle questions to ALL users   |
| Free bundle exists      | Everyone automatically has access                |

## 🔄 Sample Queries

### Get all questions for a subject (learning mode)

```sql
SELECT q.* FROM questions q
WHERE q.subject_id = 1
AND EXISTS (
  SELECT 1 FROM user_access ua
  WHERE ua.user_id = auth.uid()
  AND ua.question_id = q.id
);
```

### Get all questions for an exam year (exam mode)

```sql
SELECT q.* FROM questions q
JOIN years y ON q.year_id = y.id
WHERE y.exam_id = 1 AND y.year_value = 2024
AND EXISTS (
  SELECT 1 FROM user_access ua
  WHERE ua.user_id = auth.uid()
  AND ua.question_id = q.id
);
```

### Check if user has access to a specific question

```sql
SELECT EXISTS (
  SELECT 1 FROM user_access
  WHERE user_id = auth.uid()
  AND question_id = 123
) as has_access;
```

## 🚀 Future Improvements

- Add `payment_provider` and `payment_reference` to purchases
- Add `expires_at` for time-limited access
- Add `question_version` for question updates
- Create materialized views for analytics
- Add audit logs for admin actions

---

## 📝 Maintenance Notes

- **Never delete from user_access** - Let triggers manage it
- **When adding questions to a bundle**, existing users won't auto-get access (they'd need to repurchase)
- **When marking bundle as free**, all users get access automatically
- **When removing questions from bundle**, users keep access (they already "paid")

## 👥 User Roles

| Role         | Capabilities                                                |
| ------------ | ----------------------------------------------------------- |
| **Learner**  | View accessible questions, take exams, purchase bundles     |
| **Educator** | Create courses (future), view their content stats           |
| **Admin**    | Full CRUD on all tables, manage bundles, view all purchases |

## 🔧 Setup Order

1. Create tables in order (profiles → subjects → exams → years → questions → bundles → bundle_questions → purchases → user_access)
2. Create admin function
3. Create RLS policies
4. Create triggers
5. Add indexes
6. Insert sample data
7. Test with different user roles

```

```
