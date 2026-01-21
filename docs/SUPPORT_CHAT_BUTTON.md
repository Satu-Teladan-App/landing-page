# Support Chat Button Component

## Overview

A floating chat button component that provides quick access to contact support via email. The component features a modern design with smooth animations and an expandable popup interface.

## Component Location

`/src/components/SupportChatButton.tsx`

## Features

### Design

- ✅ **Floating Button**: Fixed position in bottom-right corner
- ✅ **Animated**: Smooth entrance, toggle, and expansion animations
- ✅ **Expandable Popup**: Click to reveal support information
- ✅ **Backdrop**: Semi-transparent overlay when popup is open
- ✅ **Responsive**: Works on mobile and desktop

### Functionality

- ✅ **One-click Email**: Direct mailto link to support@satuteladan.id
- ✅ **Pre-filled Subject**: Email subject automatically filled
- ✅ **Toggle Open/Close**: Click button to show/hide popup
- ✅ **Click Outside to Close**: Backdrop click closes the popup
- ✅ **Icon Animation**: Smooth transition between chat and close icons

## Usage

### Basic Implementation

```tsx
import SupportChatButton from "@/components/SupportChatButton";

export default function MyPage() {
  return (
    <div>
      {/* Your page content */}

      {/* Add at the end of your component */}
      <SupportChatButton />
    </div>
  );
}
```

### Current Implementation

The component is currently integrated on:

- ✅ Home page (`/app/page.tsx`)
- ✅ Deactivate Account page (`/app/deactivate-account/page.tsx`)
- ✅ Delete Account page (`/app/hapusakun/page.tsx`)

## Component Structure

```tsx
<>
  {/* Floating Chat Button */}
  <motion.button>{/* Chat or Close icon based on state */}</motion.button>

  {/* Chat Popup */}
  <AnimatePresence>
    {isOpen && (
      <motion.div>
        {/* Header with branding */}
        <div>
          <h3>Butuh Bantuan?</h3>
          <p>Tim support siap membantu</p>
        </div>

        {/* Content */}
        <div>
          <p>Message content</p>

          {/* Email Display */}
          <div>
            <a href="mailto:support@satuteladan.id">support@satuteladan.id</a>
          </div>

          {/* Action Button */}
          <button onClick={handleEmailClick}>Kirim Email ke Support</button>

          {/* Response Time Info */}
          <p>Kami biasanya merespon dalam 1-2 hari kerja</p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Backdrop */}
  <AnimatePresence>
    {isOpen && <motion.div onClick={closePopup} />}
  </AnimatePresence>
</>
```

## Customization

### Email Configuration

```tsx
const supportEmail = "support@satuteladan.id";
const subject = "Bantuan & Dukungan - Satu Teladan App";
```

### Styling

The component uses Tailwind CSS classes for styling:

- **Button**: `bg-gray-900`, `rounded-full`, `shadow-lg`
- **Popup**: `bg-white`, `rounded-2xl`, `shadow-2xl`
- **Header**: `bg-linear-to-r from-gray-900 to-gray-800`
- **Backdrop**: `bg-black/20 backdrop-blur-sm`

### Position

To change the button position, modify the fixed positioning classes:

```tsx
className = "fixed bottom-6 right-6 z-50";
// Change to:
// bottom-6 → distance from bottom
// right-6 → distance from right
// z-50 → z-index layer
```

## Animation Details

### Button Entrance

```tsx
initial={{ scale: 0, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ delay: 0.5, type: "spring" }}
```

### Icon Toggle

```tsx
// Close icon
initial={{ rotate: -90, opacity: 0 }}
animate={{ rotate: 0, opacity: 1 }}

// Chat icon
initial={{ rotate: 90, opacity: 0 }}
animate={{ rotate: 0, opacity: 1 }}
```

### Popup Expansion

```tsx
initial={{ opacity: 0, y: 20, scale: 0.95 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ type: "spring", stiffness: 300, damping: 30 }}
```

## Icons Used

- `MessageCircle` - Chat button icon
- `X` - Close button icon
- `Mail` - Email display icon
- `Send` - Email action button icon

All icons from `lucide-react`.

## Best Practices

### Do's

✅ Place at the end of your component (before closing div)
✅ Use on pages where users might need help
✅ Keep the support email updated
✅ Maintain consistent styling with your app

### Don'ts

❌ Don't add multiple instances on the same page
❌ Don't place inside scrollable containers
❌ Don't modify z-index below 50 (might hide behind content)
❌ Don't remove the backdrop (needed for UX)

## Accessibility

- ✅ `aria-label="Hubungi Support"` on button
- ✅ Keyboard accessible (can tab to button)
- ✅ Semantic HTML structure
- ✅ Clear visual feedback on hover/click

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ⚠️ Requires JavaScript enabled
- ⚠️ Requires CSS support for backdrop-blur

## Dependencies

```json
{
  "framer-motion": "^10.x.x",
  "lucide-react": "^0.x.x"
}
```

## Future Enhancements

- [ ] Add live chat integration (e.g., Intercom, Zendesk)
- [ ] Add predefined message templates
- [ ] Add file attachment support
- [ ] Add chat history for logged-in users
- [ ] Add typing indicator
- [ ] Add unread message badge
- [ ] Add customizable position prop
- [ ] Add customizable colors/theme prop
- [ ] Add analytics tracking
- [ ] Add multi-language support

## Troubleshooting

### Button not showing

- Check z-index conflicts
- Verify component is imported correctly
- Check if parent has overflow:hidden

### Email not opening

- Verify mailto link format
- Check email client is configured on device
- Test on different browsers/devices

### Animations not smooth

- Check if framer-motion is installed
- Verify no CSS transitions conflicting
- Test on different devices/browsers

## Related Components

- `Footer.tsx` - Also contains support email link
- Contact form (if implemented in future)
- Help center/FAQ page (if implemented)

## License

Part of Satu Teladan App project.
