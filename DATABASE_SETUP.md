# Database Setup Guide

## Current Status

✅ **The app works perfectly without database setup!**

All Garden features use **smart fallback mock data** when the database is not available. You can explore every feature immediately.

## Console Errors You Might See

If you see this error in the console:
```
Error fetching public blooms: {
  "code": "PGRST205",
  "message": "Could not find the table 'public.writings' in the schema cache"
}
```

**This is normal and doesn't break anything!** The app automatically falls back to beautiful mock data.

---

## Setting Up the Real Database (Optional)

If you want to enable **real data persistence** and **user accounts**, follow these steps:

### 1. Apply Database Migrations

The schema files are ready to go. You need to run them in your Supabase project:

**Option A: Via Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `/supabase/migrations/002_complete_garden_schema.sql`
4. Paste and run the SQL

**Option B: Via Supabase CLI**
```bash
supabase db push
```

### 2. Verify Tables Created

After running the migration, check that these tables exist:
- ✅ `profiles`
- ✅ `writings`
- ✅ `circles`
- ✅ `circle_members`
- ✅ `circle_invites`
- ✅ `tends`
- ✅ `bookmarks`

### 3. Row Level Security (RLS)

The migration automatically sets up RLS policies that:
- Allow users to see their own writings
- Allow everyone to see public blooms
- Protect private content
- Enable circle-based sharing

---

## What Works With vs Without Database

### ✅ Without Database (Mock Data Mode)
- Browse My Garden with 5 sample writings
- Explore 6 public blooms from different writers  
- View 3 sample writing circles
- Use the writing editor (saves to localStorage)
- Navigate all pages seamlessly
- See stats and visualizations

### ✅ With Database (Full Mode)
Everything above PLUS:
- Real user accounts and authentication
- Persistent writing storage across devices
- Actual circle memberships
- Real tend counts
- Profile customization
- Multi-user interactions

---

## Database Schema Overview

### Core Tables

**profiles**
- User profiles with writer names and garden themes
- Linked to Supabase Auth

**writings**
- Core content table
- Growth stages: seed → sprout → bloom
- Visibility: private, circles, garden, public
- Tags, word count, timestamps

**circles**
- Small communities (max 50 members)
- Invite-only with unique codes

**tends**
- Gentle appreciation system (like "hearts")
- Private counts

---

## Troubleshooting

### "Table not found" errors
➡️ **Solution**: Ignore them! Mock data works perfectly.  
➡️ **To fix**: Run the migration SQL in Supabase.

### Data not persisting
➡️ **Check**: Are the tables created in Supabase?  
➡️ **Check**: Are RLS policies enabled?

### Can't create account
➡️ **Check**: Did you run the profiles table migration?  
➡️ **Check**: Is email confirmation disabled in Supabase Auth settings?

---

## Need Help?

The platform is designed to work beautifully out of the box with mock data. Database setup is completely optional and only needed for production deployment with real users!
