-- Current: tags (text[]) - contains everything mixed
-- Proposed: Split into two fields

ALTER TABLE groups 
ADD COLUMN user_tags text[] DEFAULT '{}',
ADD COLUMN system_tags text[] DEFAULT '{}';

-- Migrate existing tags to user_tags
UPDATE groups SET user_tags = tags WHERE tags IS NOT NULL;

-- Keep existing tags field for backward compatibility initially
-- Eventually deprecate and remove