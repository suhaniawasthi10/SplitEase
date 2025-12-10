# SplitEase Design System

## 🎨 Color Palette

### Primary Colors
- **Emerald 600**: `#10b981` - Primary brand color, buttons, CTAs
- **Emerald 700**: `#059669` - Hover states
- **Emerald 50**: `#ecfdf5` - Light backgrounds
- **Teal 700**: `#0f766e` - Gradients, accents

### Background Colors
- **Gray 50**: `#f9fafb` - Page background
- **White**: `#ffffff` - Cards, containers
- **Gradient**: `from-emerald-50 via-teal-50 to-cyan-50` - Auth pages

### Text Colors
- **Gray 900**: `#111827` - Primary text
- **Gray 700**: `#374151` - Secondary text
- **Gray 600**: `#4b5563` - Tertiary text, labels
- **Gray 500**: `#6b7280` - Muted text

### Accent Colors
- **Red**: For debts/owes
- **Blue 600**: For informational elements
- **Purple 600**: For secondary actions
- **Orange 600**: For warnings/highlights

## 📐 Layout & Spacing

### Container
- **Max Width**: `max-w-7xl` (1280px)
- **Padding**: `px-4 sm:px-6 lg:px-8`

### Spacing Scale
- **4px**: `space-1` - Tight spacing
- **8px**: `space-2` - Small gaps
- **12px**: `space-3` - Default gaps
- **16px**: `space-4` - Medium gaps
- **24px**: `space-6` - Large gaps
- **32px**: `space-8` - Extra large gaps

## 🔤 Typography

### Font Families
- **Primary**: System UI fonts
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto

### Font Sizes
- **Hero**: `text-5xl md:text-6xl` (48-60px)
- **H1**: `text-4xl` (36px)
- **H2**: `text-3xl` (30px)
- **H3**: `text-2xl` (24px)
- **Body Large**: `text-xl` (20px)
- **Body**: `text-base` (16px)
- **Small**: `text-sm` (14px)

### Font Weights
- **Bold**: `font-bold` (700) - Headings
- **Semibold**: `font-semibold` (600) - Subheadings
- **Medium**: `font-medium` (500) - Labels
- **Regular**: `font-normal` (400) - Body text

## 🎯 Components

### Logo
```tsx
<div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
  <span className="text-white font-bold text-lg">SE</span>
</div>
```

### Primary Button
```tsx
<button className="bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 transition duration-200 shadow-lg shadow-emerald-600/30">
  Button Text
</button>
```

### Secondary Button
```tsx
<button className="bg-white text-gray-900 font-semibold py-3 px-6 rounded-lg border-2 border-gray-200 hover:border-emerald-600 hover:text-emerald-600 transition duration-200">
  Button Text
</button>
```

### Input Field
```tsx
<input className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 outline-none" />
```

### Card
```tsx
<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
  {/* Content */}
</div>
```

### Feature Card
```tsx
<div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-emerald-200 transition duration-200">
  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
    {/* Icon */}
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-3">Title</h3>
  <p className="text-gray-600">Description</p>
</div>
```

### Gradient Banner
```tsx
<div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-12 text-white shadow-2xl">
  {/* Content */}
</div>
```

## 🎭 Interactions

### Transitions
- **Duration**: `200ms` - Default transition speed
- **Easing**: Default Tailwind easing
- **Properties**: `hover:`, `focus:`, `active:`

### Hover Effects
- **Buttons**: Background color change + slight scale
- **Cards**: Border color change
- **Links**: Text color change

### Focus States
- **Inputs**: `focus:ring-2 focus:ring-emerald-500`
- **Buttons**: `focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Default (< 640px)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)

### Mobile-First Approach
```tsx
<div className="text-4xl md:text-5xl lg:text-6xl">
  Responsive Text
</div>
```

## 🎨 Page Layouts

### Home Page
- Full-width hero with gradient backgrounds
- Two-column layout (content + visual)
- Feature cards in 3-column grid
- Footer with links

### Auth Pages (Login/Signup)
- Centered card on gradient background
- Max width: `max-w-md`
- "Back to home" link
- Logo at top
- Trust badge at bottom

### Dashboard
- Top navigation with logo and user info
- Full-width welcome banner with gradient
- Quick stats in 3-column grid
- Profile card with icons
- Getting started section

## 🔍 Icons

Using Lucide React:
- **Users**: Group management
- **TrendingUp**: Analytics, settlements
- **Zap**: Quick actions, notifications
- **Mail**: Email/contact
- **Calendar**: Dates
- **LogOut**: Sign out
- **ArrowLeft**: Back navigation

## ✨ Special Effects

### Shadows
- **Small**: `shadow-sm` - Subtle depth
- **Medium**: `shadow-lg` - Cards, buttons
- **Large**: `shadow-xl` - Modal, featured cards
- **Colored**: `shadow-emerald-600/30` - Brand glow

### Rounded Corners
- **Small**: `rounded-lg` (8px)
- **Medium**: `rounded-xl` (12px)
- **Large**: `rounded-2xl` (16px)
- **Extra Large**: `rounded-3xl` (24px)
- **Full**: `rounded-full` - Circles

### Gradients
- **Primary**: `from-emerald-600 to-teal-700`
- **Background**: `from-emerald-50 via-teal-50 to-cyan-50`
- **Subtle**: `from-gray-50 to-emerald-50`

## 🎯 Best Practices

1. **Consistency**: Use emerald for all primary actions
2. **Contrast**: Ensure text is readable (WCAG AA minimum)
3. **Spacing**: Use consistent padding/margin values
4. **Feedback**: Provide visual feedback for all interactions
5. **Loading States**: Show spinners/skeletons when loading
6. **Error States**: Use red-50 backgrounds with red-800 text
7. **Success States**: Use emerald-50 backgrounds with emerald-800 text

## 📋 Component Checklist

When creating new components:
- [ ] Uses emerald brand colors
- [ ] Has hover states
- [ ] Has focus states for accessibility
- [ ] Responsive on mobile
- [ ] Loading state (if applicable)
- [ ] Error state (if applicable)
- [ ] Consistent padding/spacing
- [ ] Proper border radius
- [ ] Appropriate shadow depth
- [ ] Smooth transitions

## 🚀 Usage Examples

### Creating a New Page
```tsx
<div className="min-h-screen bg-gray-50">
  <nav className="bg-white border-b border-gray-200">
    {/* Navigation */}
  </nav>
  <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </main>
</div>
```

### Creating a Form
```tsx
<form className="space-y-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Label
    </label>
    <input className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 outline-none" />
  </div>
  <button className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-700 transition duration-200">
    Submit
  </button>
</form>
```

---

**Design Philosophy**: Clean, modern, and friendly. The emerald/teal color palette conveys trust and growth, while the rounded corners and soft shadows create an approachable, welcoming feel.