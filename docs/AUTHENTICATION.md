# Authentication System Documentation

## 🔐 Complete Authentication System

### ✅ What's Included

1. **Login Page** (`/auth/login`) - Email/password and Google OAuth
2. **Register Page** (`/auth/register`) - Sign up with email verification
3. **API Endpoints** - Login, register, logout, auth check
4. **OAuth Callback** - Handle Google/OAuth redirects
5. **Session Management** - Automatic token handling

---

## 📁 Files Created

### **Pages**

1. **`app/auth/login/page.tsx`** - Login page with email/password and Google OAuth
2. **`app/auth/register/page.tsx`** - Registration page with email verification
3. **`app/auth/callback/route.ts`** - OAuth callback handler

### **API Routes**

4. **`app/api/auth/login/route.ts`** - Email/password login endpoint
5. **`app/api/auth/register/route.ts`** - User registration endpoint
6. **`app/api/auth/logout/route.ts`** - Logout endpoint
7. **`app/api/auth/check/route.ts`** - Authentication status check (already exists)

---

## 🚀 Setup Instructions

### 1. Enable Email Authentication in Supabase

1. Go to **Supabase Dashboard → Authentication → Providers**
2. Enable **Email** provider
3. Configure email settings:
   - Enable "Confirm email"
   - Set "Site URL" to your domain (e.g., `http://localhost:3000`)
   - Set "Redirect URLs" to `http://localhost:3000/auth/callback`

### 2. Enable Google OAuth (Optional)

1. Go to **Authentication → Providers**
2. Enable **Google** provider
3. Add OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
4. Paste Client ID and Client Secret in Supabase

### 3. Configure Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Test the System

Start the dev server:

```bash
pnpm dev
```

**Test Flow:**

1. Visit `http://localhost:3000/auth/register`
2. Create an account
3. Check email for verification link
4. Click verification link
5. Visit `http://localhost:3000/auth/login`
6. Login with your credentials
7. Try visiting `http://localhost:3000/hapusakun` (should work now!)

---

## 🔌 API Endpoints

### 1. Register (POST `/api/auth/register`)

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Registrasi berhasil. Silakan cek email untuk verifikasi.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "needsEmailVerification": true
  }
}
```

**Error Response (400):**

```json
{
  "error": "Email sudah terdaftar"
}
```

---

### 2. Login (POST `/api/auth/login`)

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "session": {
      "access_token": "eyJhbG...",
      "refresh_token": "...",
      "expires_at": 1234567890
    }
  }
}
```

**Error Response (401):**

```json
{
  "error": "Email atau password salah"
}
```

---

### 3. Logout (POST `/api/auth/logout`)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

### 4. Check Auth (GET `/api/auth/check`)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "authenticated": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Unauthenticated Response (401):**

```json
{
  "authenticated": false,
  "user": null
}
```

---

## 💻 Frontend Usage

### Login Form

```typescript
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const supabase = getSupabaseBrowserClient();

// Email/Password login
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});

if (error) {
  console.error("Login error:", error.message);
} else {
  console.log("Logged in:", data.user);
  router.push("/dashboard");
}
```

### Google OAuth Login

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
  },
});
```

### Register User

```typescript
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password123",
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### Logout

```typescript
const { error } = await supabase.auth.signOut();
```

### Check Auth Status

```typescript
const {
  data: { session },
} = await supabase.auth.getSession();

if (session) {
  console.log("User is logged in:", session.user);
} else {
  console.log("User is not logged in");
}
```

---

## 🎨 Features

### Login Page (`/auth/login`)

- ✅ Email/password authentication
- ✅ Google OAuth button
- ✅ Password visibility toggle
- ✅ Form validation
- ✅ Error handling with user-friendly messages
- ✅ Success state with redirect
- ✅ Loading states
- ✅ Link to registration
- ✅ Forgot password link
- ✅ Redirect to original page after login

### Register Page (`/auth/register`)

- ✅ Email/password sign up
- ✅ Password confirmation
- ✅ Password visibility toggles
- ✅ Form validation
- ✅ Email verification flow
- ✅ Success state with instructions
- ✅ Error handling
- ✅ Link to login
- ✅ Terms & Privacy links

---

## 🔒 Security Features

1. **Password Requirements**

   - Minimum 6 characters
   - Validated on both frontend and backend

2. **Email Verification**

   - Required for new accounts
   - Prevents fake registrations
   - Email sent automatically

3. **JWT Tokens**

   - Secure session management
   - Automatic refresh
   - Stored in httpOnly cookies (Supabase default)

4. **OAuth Security**

   - Secure Google authentication
   - State parameter for CSRF protection
   - Proper redirect handling

5. **Error Messages**
   - User-friendly, not revealing sensitive info
   - No indication whether email exists
   - Generic error messages for security

---

## 🔄 Authentication Flow

### Registration Flow

```
1. User visits /auth/register
   ↓
2. User fills form (email, password, confirm)
   ↓
3. Form submits to Supabase Auth
   ↓
4. Supabase sends verification email
   ↓
5. Success screen with instructions
   ↓
6. User clicks link in email
   ↓
7. Redirect to /auth/callback
   ↓
8. Session created
   ↓
9. User logged in automatically
```

### Login Flow

```
1. User visits /auth/login
   ↓
2. User enters email & password
   ↓
3. Form submits to Supabase Auth
   ↓
4. Supabase validates credentials
   ↓
5. Session created
   ↓
6. Success state shown
   ↓
7. Redirect to original page or home
```

### OAuth Flow

```
1. User clicks "Login with Google"
   ↓
2. Redirect to Google OAuth
   ↓
3. User grants permission
   ↓
4. Google redirects to Supabase
   ↓
5. Supabase creates session
   ↓
6. Redirect to /auth/callback
   ↓
7. Callback exchanges code for session
   ↓
8. Final redirect to app
```

---

## 🧪 Testing

### Test Registration

1. Visit `http://localhost:3000/auth/register`
2. Enter: `test@example.com` / `password123`
3. Click "Daftar"
4. Check Supabase logs for verification email

### Test Login

1. Visit `http://localhost:3000/auth/login`
2. Enter credentials
3. Should redirect to home or specified page

### Test Protected Route

1. Logout (if logged in)
2. Visit `http://localhost:3000/hapusakun`
3. Should see "Login Required" screen
4. Login
5. Should see deletion form

---

## 🎯 Integration with Account Deletion

The `/hapusakun` page now works seamlessly:

```typescript
// In app/hapusakun/page.tsx
import { checkAuthStatus } from "@/lib/api/account-deletion";

// Check auth on page load
const authStatus = await checkAuthStatus();

if (!authStatus.authenticated) {
  // Show login required screen
  // Login button redirects to: /auth/login?redirect=/hapusakun
}
```

After login, user is redirected back to `/hapusakun` automatically!

---

## 📝 Customization

### Update Email Templates

1. Go to **Supabase Dashboard → Authentication → Email Templates**
2. Customize:
   - **Confirm signup** - Verification email
   - **Magic link** - Passwordless login
   - **Change email address** - Email change confirmation
   - **Reset password** - Password reset email

### Add More OAuth Providers

Supabase supports:

- Google ✅ (implemented)
- GitHub
- Facebook
- Twitter
- Discord
- And more...

Just enable in Authentication → Providers!

### Customize Redirect URLs

Update the redirect logic in:

- `app/auth/login/page.tsx` (line 8)
- `app/auth/callback/route.ts` (line 6)

---

## 🐛 Common Issues

### Issue: Email not received

**Solution:**

1. Check Supabase email settings
2. Look in spam folder
3. Check email provider logs in Supabase
4. For development, check Supabase logs for email content

### Issue: OAuth redirect error

**Solution:**

1. Verify redirect URLs in Supabase settings
2. Check OAuth credentials are correct
3. Ensure URLs match exactly (http vs https)

### Issue: Session not persisting

**Solution:**

1. Check browser cookies are enabled
2. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
3. Clear browser cookies and try again

---

## 📊 User Flow Diagram

```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ├─────────────┐
       │             │
       v             v
┌──────────┐  ┌──────────┐
│  Login   │  │ Register │
│  /auth/  │  │  /auth/  │
│  login   │  │ register │
└────┬─────┘  └────┬─────┘
     │             │
     │             v
     │      ┌──────────────┐
     │      │ Verify Email │
     │      │ (Check inbox)│
     │      └──────┬───────┘
     │             │
     v             v
┌────────────────────────┐
│    Auth Callback       │
│  /auth/callback        │
└───────────┬────────────┘
            │
            v
┌────────────────────────┐
│   Protected Routes     │
│   - /hapusakun         │
│   - /dashboard         │
│   - etc.               │
└────────────────────────┘
```

---

## ✅ Complete Feature List

- ✅ Email/password registration
- ✅ Email verification
- ✅ Email/password login
- ✅ Google OAuth login
- ✅ Session management
- ✅ Automatic token refresh
- ✅ Logout functionality
- ✅ Auth status checking
- ✅ Protected routes
- ✅ Redirect after login
- ✅ Beautiful UI with animations
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Success states
- ✅ Mobile responsive

---

## 🎉 You're Ready!

The complete authentication system is now in place! Users can:

1. ✅ Register with email
2. ✅ Verify their email
3. ✅ Login with email/password or Google
4. ✅ Access protected routes like `/hapusakun`
5. ✅ Submit account deletion requests
6. ✅ Logout when done

**All integrated and working together!** 🚀

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js App Router Auth](https://nextjs.org/docs/app/building-your-application/authentication)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

**Built with ❤️ for Satu Teladan App**
