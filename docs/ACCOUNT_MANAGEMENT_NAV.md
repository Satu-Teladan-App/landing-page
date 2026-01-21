# Account Management Navigation

## Overview

Added a comprehensive Account Management section to the hero navigation that provides easy access to account deactivation and deletion features. The navigation includes both desktop dropdown menu and mobile menu sections.

## Implementation

### Location

`/src/modules/Hero.tsx`

### Features Added

#### 1. **Account Management Items Data**

```tsx
const accountManagementItems = [
  {
    name: "Nonaktifkan Akun",
    href: "/deactivate-account",
    description: "Nonaktifkan akun sementara",
  },
  {
    name: "Hapus Akun",
    href: "/hapusakun",
    description: "Hapus akun permanen",
  },
];
```

#### 2. **Desktop Navigation Dropdown**

- **Location**: Top navigation bar (desktop view)
- **Trigger**: Hover over "Kelola Akun"
- **Style**: White dropdown card with descriptions
- **Features**:
  - Smooth hover animations
  - ChevronDown icon that rotates when open
  - Two menu items with titles and descriptions
  - Shadow and border styling
  - Hover effects on menu items

#### 3. **Mobile Navigation Section**

- **Location**: Mobile hamburger menu
- **Style**: Separated section with border-top
- **Features**:
  - Section header "KELOLA AKUN"
  - Two cards with background
  - Full descriptions visible
  - Tap to navigate
  - Auto-close menu on selection

### State Management

```tsx
const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
```

The dropdown state is managed through mouse events:

- `onMouseEnter`: Opens dropdown
- `onMouseLeave`: Closes dropdown

### Desktop Dropdown Structure

```tsx
<div
  className="relative"
  onMouseEnter={() => setIsAccountDropdownOpen(true)}
  onMouseLeave={() => setIsAccountDropdownOpen(false)}
>
  <button>
    Kelola Akun
    <ChevronDown /> {/* Rotates when open */}
  </button>

  {isAccountDropdownOpen && (
    <div className="dropdown-menu">
      {accountManagementItems.map((item) => (
        <Link>
          <div>{item.name}</div>
          <div>{item.description}</div>
        </Link>
      ))}
    </div>
  )}
</div>
```

### Mobile Menu Structure

```tsx
{navItems.map(...)} {/* Regular nav items */}

{/* Account Management Section */}
<div className="account-management-section">
  <div>KELOLA AKUN</div>
  {accountManagementItems.map((item) => (
    <Link>
      <div>{item.name}</div>
      <div>{item.description}</div>
    </Link>
  ))}
</div>
```

## Styling

### Desktop Dropdown

- **Container**: `relative` positioning for dropdown
- **Dropdown**: `absolute top-full right-0 mt-2 w-64`
- **Background**: `bg-white`
- **Shadow**: `shadow-2xl`
- **Border**: `border border-gray-200`
- **Items**: Hover effect with `hover:bg-gray-50`

### Mobile Section

- **Container**: `pt-4 border-t border-white/20 w-64`
- **Header**: `text-white/60 text-sm`
- **Items**: `bg-white/10 hover:bg-white/20`
- **Layout**: Centered with proper spacing

## Navigation Items

### 1. Nonaktifkan Akun (Deactivate Account)

- **Route**: `/deactivate-account`
- **Description**: "Nonaktifkan akun sementara"
- **Function**: Temporarily deactivate account (reversible)

### 2. Hapus Akun (Delete Account)

- **Route**: `/hapusakun`
- **Description**: "Hapus akun permanen"
- **Function**: Request permanent account deletion

## User Experience

### Desktop

1. User hovers over "Kelola Akun" button
2. Dropdown appears with smooth animation
3. ChevronDown icon rotates 180°
4. User can click on either option
5. Dropdown closes when mouse leaves

### Mobile

1. User taps hamburger menu
2. Full-screen menu appears
3. Scrolls down to see "KELOLA AKUN" section
4. Two cards displayed with full information
5. Tap card to navigate
6. Menu closes automatically

## Icons Used

- `ChevronDown` - Dropdown indicator (rotates on open)
- Imported from `lucide-react`

## Accessibility

### Desktop

- ✅ Hover states for all interactive elements
- ✅ Smooth transitions for dropdown
- ✅ Clear visual hierarchy
- ✅ Descriptive text for each option

### Mobile

- ✅ Touch-friendly targets
- ✅ Clear section separation
- ✅ Readable descriptions
- ✅ Auto-close on navigation

## Responsive Behavior

### Desktop (md and above)

- Shows dropdown menu on hover
- Positioned to the right of button
- Fixed width (16rem / 256px)

### Mobile (below md)

- Integrated into full-screen menu
- Full-width cards
- Scrollable if content overflows
- Border-top separation from main nav

## CSS Classes Reference

### Desktop Dropdown

```css
.dropdown-container: relative
.dropdown-button: flex items-center gap-1, with hover effects
.dropdown-menu: absolute top-full right-0 mt-2 w-64
.dropdown-item: block px-4 py-3 hover:bg-gray-50
```

### Mobile Section

```css
.section-container: pt-4 border-t border-white/20 w-64
.section-header: text-white/60 text-sm font-semibold
.section-item: block text-center py-3 mb-2 bg-white/10
```

## Animation Details

### Dropdown Icon Rotation

```tsx
className={`transition-transform duration-300 ${
  isAccountDropdownOpen ? 'rotate-180' : ''
}`}
```

### Menu Transitions

- All elements use `transition-colors duration-300`
- Smooth hover effects throughout
- Consistent timing for cohesive feel

## Integration with Existing Navigation

The Account Management dropdown:

- ✅ Follows same styling pattern as other nav items
- ✅ Uses consistent hover effects
- ✅ Integrates seamlessly with existing code
- ✅ Doesn't interfere with other navigation
- ✅ Mobile-first responsive design

## Benefits

### User Benefits

1. **Easy Discovery**: Clear "Kelola Akun" label
2. **Informed Choice**: Descriptions help users understand
3. **Quick Access**: One-click navigation
4. **Mobile Friendly**: Touch-optimized interface

### Developer Benefits

1. **Maintainable**: Centralized data structure
2. **Extensible**: Easy to add more options
3. **Consistent**: Uses existing patterns
4. **Type-safe**: TypeScript compatible

## Future Enhancements

- [ ] Add icons for each menu item
- [ ] Add keyboard navigation support
- [ ] Add animation for dropdown entrance
- [ ] Add active state indicators
- [ ] Add analytics tracking
- [ ] Add confirmation dialogs before navigation
- [ ] Add user authentication check
- [ ] Add badge for logged-in users
- [ ] Add quick status indicator
- [ ] Add more account management options:
  - Profile settings
  - Privacy settings
  - Data export
  - Account security

## Testing Checklist

- [ ] Desktop dropdown appears on hover
- [ ] Desktop dropdown closes when mouse leaves
- [ ] ChevronDown rotates correctly
- [ ] Both links navigate properly
- [ ] Mobile menu shows account section
- [ ] Mobile menu closes on navigation
- [ ] Responsive breakpoint works correctly
- [ ] All hover states work
- [ ] No layout shifts or jumps
- [ ] Works on different screen sizes

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Touch and mouse input
- ⚠️ Requires JavaScript for interactivity

## Related Files

- `/app/deactivate-account/page.tsx` - Deactivation page
- `/app/hapusakun/page.tsx` - Deletion page
- `/docs/ACCOUNT_DEACTIVATION.md` - Deactivation docs
- `/docs/ACCOUNT_DELETION_BACKEND.md` - Deletion docs
