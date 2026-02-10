# GitHub OAuth Setup for PAGE

The sign-in page now includes a "Sign in with GitHub" button for editors and managing editors.

## Setup Instructions

### 1. Create a GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: PAGE Literary Platform
   - **Homepage URL**: Your app URL (e.g., `https://yourapp.com`)
   - **Authorization callback URL**: `https://yourprojectid.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Copy the **Client ID**
6. Generate a new **Client Secret** and copy it

### 2. Configure Supabase

1. Go to your Supabase Dashboard
2. Navigate to Authentication → Providers
3. Find **GitHub** in the list
4. Enable GitHub authentication
5. Paste your **Client ID** and **Client Secret**
6. Save changes

### 3. How It Works

- When an editor clicks "Sign in with GitHub", they're redirected to GitHub
- After authorizing, GitHub redirects back to your app
- Supabase creates or updates their user account
- The app checks their role in the `profiles` table
- If they have role `editor`, `eic`, or `admin`, they're sent to `/editor-dashboard`
- Otherwise, they're sent to `/studio`

### 4. Testing

1. Click "Sign in with GitHub" on `/signin`
2. Authorize the application on GitHub
3. You'll be redirected back to the app
4. Check the browser console for debug logs

### 5. Common Issues

**"Provider not enabled" error:**
- Make sure you've enabled GitHub in Supabase Authentication settings
- Double-check your Client ID and Secret are correct

**Redirect not working:**
- Verify the callback URL in GitHub matches your Supabase project
- Format: `https://[PROJECT_ID].supabase.co/auth/v1/callback`

**User doesn't have editor access:**
- Make sure the user exists in the `profiles` table
- Set their `role` to `editor`, `eic`, or `admin`

## Documentation

Full Supabase docs: https://supabase.com/docs/guides/auth/social-login/auth-github
