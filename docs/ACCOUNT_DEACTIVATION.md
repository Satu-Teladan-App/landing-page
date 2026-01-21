# Account Deactivation Feature

## Overview

A complete account deactivation system that allows authenticated users to temporarily deactivate and reactivate their accounts. This is different from account deletion - deactivation is reversible and preserves all user data.

## Files Created

### 1. API Route: `/app/api/account-deactivate/route.ts`

**Endpoints:**

- `GET /api/account-deactivate` - Check current deactivation status
- `POST /api/account-deactivate` - Update deactivation status (deactivate/reactivate)

**Features:**

- JWT token validation
- Supabase service role for secure database updates
- Updates `users.deactivated` column in database
- Returns updated status and success message

### 2. API Client Library: `/src/lib/api/account-deactivation.ts`

**Functions:**

- `getDeactivationStatus()` - Fetches current user's deactivation status
- `updateDeactivationStatus(deactivate: boolean)` - Updates account status

**Features:**

- Automatic session management
- Authorization header handling
- Error handling with descriptive messages

### 3. UI Page: `/app/deactivate-account/page.tsx`

**Components:**

- Authentication check with loading state
- Login required screen for unauthenticated users
- Dynamic form (deactivate OR reactivate based on current status)
- Success confirmation screen
- Status badge showing current account state

**User Flow:**

1. Check if user is logged in
2. Fetch current deactivation status
3. Show appropriate form (deactivate/reactivate)
4. User confirms action by typing confirmation text
5. Submit request to API
6. Show success message with option to change status again

## Database Schema

Uses existing `users` table with `deactivated` boolean column:

```typescript
users: {
  id: string;
  user_id: string | null;
  email: string | null;
  deactivated: boolean | null; // ← This field is used
  created_at: string;
}
```

## Features

### Security

✅ Requires authentication (JWT token validation)  
✅ Service role key for secure database operations  
✅ Confirmation text required before action  
✅ Session validation on every request

### User Experience

✅ Real-time status display  
✅ Smooth animations with Framer Motion  
✅ Clear visual feedback (colors, icons)  
✅ Reversible action (can reactivate anytime)  
✅ Loading states and error handling  
✅ Responsive design

### Differences from Account Deletion

| Feature            | Deactivation | Deletion                        |
| ------------------ | ------------ | ------------------------------- |
| Reversible         | ✅ Yes       | ❌ No                           |
| Data preserved     | ✅ Yes       | ❌ No                           |
| Immediate          | ✅ Yes       | ❌ No (requires admin approval) |
| Access restriction | ✅ Limited   | ❌ Complete                     |

## Usage

### As a User

1. Navigate to `/deactivate-account`
2. Login if not already authenticated
3. See current account status (Active/Deactivated)
4. Type confirmation text: `NONAKTIFKAN AKUN` or `AKTIFKAN AKUN`
5. Submit to toggle status

### As a Developer

```typescript
// Check deactivation status
const isDeactivated = await getDeactivationStatus();

// Deactivate account
await updateDeactivationStatus(true);

// Reactivate account
await updateDeactivationStatus(false);
```

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Integration Points

### Middleware (Recommended)

You may want to add middleware to check `deactivated` status and restrict access to certain routes:

```typescript
// middleware.ts
const { data: user } = await supabase
  .from("users")
  .select("deactivated")
  .eq("user_id", session.user.id)
  .single();

if (user?.deactivated) {
  // Redirect to limited access page or show deactivation notice
}
```

### Navigation Links

Add links to deactivation page in your settings/profile menu:

```tsx
<Link href="/deactivate-account">Kelola Status Akun</Link>
```

## Testing Checklist

- [ ] Can access page when logged in
- [ ] Redirects to login when not authenticated
- [ ] Shows correct current status (Active/Deactivated)
- [ ] Can deactivate an active account
- [ ] Can reactivate a deactivated account
- [ ] Confirmation text validation works
- [ ] Success message displays correctly
- [ ] Error handling works for network issues
- [ ] Loading states display properly

## Future Enhancements

- [ ] Add email notification on status change
- [ ] Add activity log for deactivation/reactivation events
- [ ] Add cooldown period between status changes
- [ ] Add reason field for deactivation
- [ ] Show deactivation date in user profile
- [ ] Admin dashboard to view deactivated accounts stats
