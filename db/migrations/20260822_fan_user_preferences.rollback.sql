-- Manual rollback for the optional account preference table.
-- Destructive by design: running this deletes synchronized preference rows.
-- Never run automatically from application deploys.

drop table if exists fan_user_preferences;
