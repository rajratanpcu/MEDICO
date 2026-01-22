# 🎨 Design System Showcase - Quick Start

## View the Design System Live

### Option 1: Via Development Server (Recommended)

1. **Start the frontend development server** (from `frontend` directory):
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

2. **Navigate to the design system showcase**:
   ```
   http://localhost:3000/design-system
   ```

3. **You'll see**:
   - ✅ Complete color palette with hex codes
   - ✅ Typography examples (display, headings, body)
   - ✅ Button variations (primary, secondary, danger, disabled)
   - ✅ Alert components (critical, warning, success, info)
   - ✅ Form inputs and labels
   - ✅ Card layouts with metrics
   - ✅ Responsive grid demonstration
   - ✅ Mobile navigation menu

---

## 🎯 Interactive Features

### Color Palette Section
- **6 main colors** with hex codes
- **Neutral palette** (6 shades from light to dark)
- **Click colors** to see usage guidelines
- Visual contrast examples

### Typography Section
- **Display sizes** (56px, 40px, 32px)
- **Heading hierarchy** (H1-H5)
- **Body text variants** (Large, Medium, Small, XS)
- Real-world examples of each

### Components Section
- **Primary Button** - Main actions (Medical Blue)
- **Secondary Button** - Alternative actions
- **Danger Button** - Destructive actions (Red)
- **Disabled States** - Disabled interactions
- **Alert Boxes** - 4 severity levels
- **Form Inputs** - Text, email, disabled states
- **Card Layouts** - Different card patterns

### Responsive Demo
- Demonstrates grid layout
- Shows how layout changes at breakpoints:
  - **Mobile** (320px): 1 column
  - **Tablet** (768px): 2 columns
  - **Desktop** (1024px+): 3 columns

### Mobile Navigation
- Hamburger menu on mobile
- Smooth navigation
- Touch-friendly interactions

---

## 📋 What to Look For

### Colors
- **Medical Blue** (#0ea5e9): Primary, trustworthy
- **Calm Green** (#22c55e): Success, wellness
- **Alert Red** (#ef4444): Critical, urgent
- **Warning Amber** (#f59e0b): Caution, attention
- **Info Blue** (#3b82f6): Information
- **Neutral grays**: Backgrounds, borders, text

### Typography
- **Clear hierarchy** from display to body
- **Inter font** across all text
- **Accessible sizing** (minimum 16px on mobile)
- **Good line heights** for readability

### Accessibility
- **High contrast** text (easy to read)
- **Focus rings** on interactive elements
- **Readable on mobile** (all text visible)
- **Touch-friendly** buttons and inputs

### Responsiveness
- **Mobile first** design
- **Adapts at breakpoints**
- **No horizontal scrolling**
- **Readable on all sizes**

---

## 🚀 Next Steps: Use in Your Components

### 1. Copy Color Usage
```jsx
// Primary action button
<button className="bg-medical-500 text-white hover:bg-medical-600">
  Action
</button>

// Success alert
<div className="bg-calm-50 border border-calm-200 text-calm-900">
  Success!
</div>

// Warning alert
<div className="bg-amber-50 border border-amber-200 text-amber-900">
  Warning!
</div>

// Error alert
<div className="bg-red-50 border border-red-200 text-red-900">
  Error!
</div>
```

### 2. Copy Typography Usage
```jsx
// Main heading
<h1 className="text-h1 font-bold text-neutral-900">
  Patient Dashboard
</h1>

// Section heading
<h2 className="text-h2 font-semibold text-neutral-800">
  Recent Reports
</h2>

// Body text
<p className="text-body-md text-neutral-700">
  Patient information and medical history
</p>

// Small label
<label className="text-label font-medium text-neutral-700">
  Email Address
</label>
```

### 3. Copy Component Patterns
```jsx
// Card component
<div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
  <h3 className="text-h4 font-semibold text-neutral-900">Card Title</h3>
  <p className="text-body-sm text-neutral-600 mt-2">Card content</p>
</div>

// Button
<button className="
  bg-medical-500 text-white
  px-6 py-3 rounded-lg font-semibold
  hover:bg-medical-600 active:bg-medical-700
  focus:ring-4 focus:ring-medical-200
  transition-colors duration-200
">
  Action
</button>

// Form input
<input
  type="email"
  className="
    w-full px-4 py-3 rounded-lg
    border border-neutral-300
    focus:border-medical-500 focus:ring-4 focus:ring-medical-100
    placeholder-neutral-400
  "
  placeholder="your@email.com"
/>
```

### 4. Copy Responsive Layout
```jsx
// Responsive grid - 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card />
  <Card />
  <Card />
</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>

// Responsive padding
<div className="px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">
  Content
</div>
```

---

## 📚 Reference Files

### Documentation
- **[DESIGN_SYSTEM.md](../src/styles/DESIGN_SYSTEM.md)**
  - Complete specification
  - Detailed color breakdown
  - Typography system
  - Accessibility features

- **[MEDICAL_DESIGN_GUIDE.md](MEDICAL_DESIGN_GUIDE.md)**
  - Implementation guide
  - Best practices
  - Testing checklist
  - Quick reference

### Code
- **[DesignSystemShowcase.jsx](src/components/DesignSystemShowcase.jsx)**
  - Live component examples
  - Copy-paste ready code
  - Responsive demonstrations

- **[tailwind.config.js](../tailwind.config.js)**
  - All custom design tokens
  - Color scale definitions
  - Typography configuration
  - Responsive breakpoints

---

## ✅ Checklist Before Using

- [ ] Design system is running at `http://localhost:3000/design-system`
- [ ] All colors are displaying correctly
- [ ] Typography looks good on your monitor
- [ ] Buttons are interactive
- [ ] Forms are responsive
- [ ] Mobile menu works (if testing on mobile)
- [ ] No console errors

---

## 🎓 Key Takeaways

### Colors You'll Use Most
- `medical-500` - Primary buttons, links, highlights
- `medical-100/200` - Light backgrounds, hover states
- `neutral-900` - Body text, headings
- `neutral-700` - Secondary text
- `calm-500` - Success messages
- `red-500` - Errors, critical alerts
- `amber-500` - Warnings, cautions
- `neutral-50` - Page background

### Typography You'll Use Most
- `text-h1` / `text-h2` - Headings
- `text-body-md` - Standard body text
- `text-body-sm` - Secondary text
- `text-label` - Form labels
- `font-bold` - Important headings
- `font-semibold` - Section headings
- `font-medium` - Labels
- `font-normal` - Body text

### Classes You'll Use Most
- `px-4 py-3` - Standard padding
- `rounded-lg` - Standard border radius
- `border border-neutral-200` - Standard borders
- `shadow-sm` - Light shadow
- `hover:bg-medical-600` - Hover effects
- `transition-colors` - Smooth transitions
- `focus:ring-4` - Focus states
- `grid grid-cols-1 md:grid-cols-2` - Responsive grids

---

## 🔍 Troubleshooting

### Design system doesn't load
- Check URL: `http://localhost:3000/design-system`
- Verify `npm start` is running
- Check browser console for errors
- Clear browser cache (Ctrl+Shift+Delete)

### Colors don't match
- Verify `tailwind.config.js` was updated
- Check that you're using correct color names (e.g., `medical-500`, not `primary-500`)
- Rebuild: `npm start` again

### Text too small on mobile
- This shouldn't happen - design system is mobile-first
- Check device width (should be 320px+)
- Verify browser zoom is at 100%

### Components not interactive
- Verify you have `lucide-react` installed
- Check console for missing dependency errors
- Reinstall: `npm install lucide-react`

---

## 📞 Support

For questions about the design system:
1. Check [DESIGN_SYSTEM.md](../src/styles/DESIGN_SYSTEM.md)
2. Review [MEDICAL_DESIGN_GUIDE.md](MEDICAL_DESIGN_GUIDE.md)
3. Look at [DesignSystemShowcase.jsx](src/components/DesignSystemShowcase.jsx) for examples

---

**Status**: ✅ Ready to use  
**Last Updated**: January 23, 2026
