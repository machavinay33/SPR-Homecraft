# Supabase setup for SPR Homecraft

The `/admin` route is a protected Supabase Auth workspace. It manages products in `public.products`, enquiry submissions in `public.enquiries`, and uploaded media metadata in `public.media_assets`. Files are stored in the public `media` Storage bucket.

## 1. Create the Supabase project

Create a Supabase project, open the SQL Editor, and run `supabase/migrations/001_admin_dashboard.sql`. The migration enables Row Level Security, creates the tables and indexes, creates the public `media` bucket, and adds policies for public showroom reads, public enquiry inserts, and admin management.

## 2. Create the first admin

In Supabase Authentication, create an email/password user. Copy that user's UUID and run the final commented insert from the migration, replacing the placeholder values:

```sql
insert into public.admin_users (id, email)
values ('AUTH_USER_UUID', 'admin@example.com');
```

The dashboard treats users in `admin_users` with the `admin` or `editor` role as authorized administrators.

## 3. Configure local development and Netlify

Copy `.env.example` to `.env.local` for local development. In Netlify, add the same two variables under Site configuration → Environment variables. Use the Supabase project's browser URL and the public anon key. Never add the service-role key to the browser app or commit secrets.

```bash
pnpm install
pnpm dev
```

The public enquiry drawer writes directly to `public.enquiries`. Authenticated administrators can review and update enquiry statuses, create or archive products, and upload image/video files to the `media` bucket.

## 4. Important security boundary

The dashboard is protected in the UI and at the database layer by Supabase Auth and RLS. The public anon key is designed for browser use; the service-role key must remain server-side and is not included in this repository. For production, consider adding an Edge Function or separate server endpoint for email notifications and more advanced audit logging.
