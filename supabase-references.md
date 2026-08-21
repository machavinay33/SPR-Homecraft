# Supabase Implementation References

The dashboard implementation follows the official Supabase JavaScript documentation:

- Password auth: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
- Password-based auth guide: https://supabase.com/docs/guides/auth/passwords
- Storage public downloads and getPublicUrl: https://supabase.com/docs/guides/storage/serving/downloads
- PostgreSQL Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security

Implementation decisions: use `supabase.auth.signInWithPassword` for admin login; use `supabase.from(...).select/insert/update` for products and enquiries; use `supabase.storage.from('media').upload` plus `getPublicUrl` for public media; protect admin tables with authenticated-user RLS policies and an `admin_users` table keyed to `auth.users.id`.
