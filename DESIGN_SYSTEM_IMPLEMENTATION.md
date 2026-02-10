# Design System Implementation Guide

## ✅ What's Complete

1. **Design System Core** (`/src/styles/design-system.css`)
   - Color tokens with emotional roles
   - Typography system (2 families)
   - Spacing & timing variables
   - Micro-interactions (6 signature moves)
   - Accessibility features

2. **Theme Integration** (`/src/styles/theme.css`)
   - Updated to use new color system
   - Simplified font family stack
   - Semantic color mappings

3. **Component Library** (`/src/styles/components.css`)
   - Buttons (primary, secondary, bloom, seed)
   - Cards (breathing, interactive)
   - Inputs (welcoming fields)
   - Badges & tags
   - Headings (hero → card)
   - Links (growing underlines)
   - Containers & surfaces

4. **Demo Page** (`/admin/design-system-demo`)
   - Live examples of all components
   - Interactive demonstrations
   - Visual proof of concept

## 🎯 Site-Wide Application Strategy

### Quick Wins (Immediate Visual Impact)

Replace inline styles with classes:

```tsx
// OLD
<button className="px-8 py-4 bg-[#8A9A7B] text-white hover:bg-[#6F7D62] rounded-lg">

// NEW  
<button className="btn-primary">

// OLD
<h1 className="font-['Cardo'] text-7xl text-[#2C1810] italic">

// NEW
<h1 className="heading-hero">

// OLD
<p className="font-['Libre_Baskerville'] text-xl text-[#8B7355]">

// NEW
<p className="text-large">
```

### Component Updates Needed

#### 1. **Buttons** (Site-wide)
Find: `className="...bg-[#8A9A7B]..."`
Replace with: `className="btn-primary"`

Find: `className="...bg-[#E11D48]..."`
Replace with: `className="btn-bloom"`

#### 2. **Cards** (Rooms, Gallery, Garden)
Find: `className="...bg-white border-2 border-[#E0D8D0]..."`
Replace with: `className="card"`

#### 3. **Headings**
- `text-7xl font-['Cardo'] italic` → `heading-hero`
- `text-5xl font-['Cardo'] italic` → `heading-page`
- `text-3xl font-['Cardo'] italic` → `heading-section`
- `text-2xl font-['Cardo'] italic` → `heading-card`

#### 4. **Body Text**
- `font-['Libre_Baskerville'] text-base` → `text-body`
- `font-['Libre_Baskerville'] text-xl` → `text-large`
- `font-['Courier_New'] text-xs uppercase` → `text-meta`

#### 5. **Links**
Add: `className="link-grow"` to all `<a>` tags

#### 6. **Interactive Elements**
Add: `className="hover-lift"` to cards
Add: `className="icon-sprout"` to icons in buttons

### Files to Update (Priority Order)

1. **Studio Hub** (`/src/app/studio/StudioHub.tsx`) - ✅ Already uses design system
2. **Freewrite Page** (`/src/app/studio/FreewritePage.tsx`) - Partially updated
3. **My Garden** (`/src/app/studio/MyGarden.tsx`) - Partially updated
4. **Gallery Landing** (`/src/app/pages/GalleryLandingPage.tsx`) - Needs update
5. **Rooms Page** (`/src/app/pages/RoomsPage.tsx`) - Needs update
6. **About Page** (`/src/app/pages/AboutPage.tsx`) - Needs update
7. **Pricing Page** (`/src/app/pages/PricingPage.tsx`) - Needs update

### Micro-Interactions to Apply

Add these classes where appropriate:

- `.fade-grow-in` - Page load animations
- `.link-grow` - All text links
- `.hover-lift` - Cards and interactive elements
- `.icon-sprout` - Icons that should grow on hover
- `.pulse-glow` - Active/selected states

### Color Variable Updates

Replace hardcoded colors:

```css
/* OLD */
#2C1810 → var(--color-earth-dark)
#8B7355 → var(--color-earth-medium)
#E0D8D0 → var(--color-earth-light)
#8A9A7B → var(--color-sprout)
#E11D48 → var(--state-bloom)
#C4A265 → var(--state-seed)
#F5F0EB → var(--surface-gallery)
#FAF7F2 → var(--surface-studio)
#FFFFFF → var(--surface-canvas)
```

## 🎨 Design Principles to Maintain

1. **Organic Growth** - Animations feel like plants growing, not machines moving
2. **Contemplative Pace** - Timing is patient (200-500ms), not instant
3. **Depth Over Speed** - Interactions have weight and meaning
4. **Seasonal Thinking** - Long-term patterns over instant gratification
5. **Literary Quality** - Everything feels like turning pages in a book

## 📝 Implementation Checklist

- [x] Create design system CSS
- [x] Create component library CSS
- [x] Update theme.css
- [x] Create demo page
- [ ] Update all button components
- [ ] Update all card components
- [ ] Update all heading styles
- [ ] Update all link styles
- [ ] Add micro-interactions
- [ ] Test responsive behavior
- [ ] Test accessibility
- [ ] Verify color contrast
- [ ] Test reduced motion

## 🚀 Next Steps

1. Apply `.btn-primary`, `.btn-secondary`, `.btn-bloom` to all buttons
2. Replace heading inline styles with semantic classes
3. Add `.link-grow` to all text links
4. Add `.hover-lift` to all cards
5. Add `.icon-sprout` to button icons
6. Replace color hex codes with CSS variables
7. Test on all major pages
8. Verify animations work smoothly
9. Check mobile responsiveness
10. Validate accessibility

## 💡 Usage Examples

### Button
```tsx
<button className="btn-primary">
  <Sprout className="w-5 h-5 icon-sprout" />
  <span>Primary Action</span>
</button>
```

### Card
```tsx
<div className="card hover-lift">
  <h3 className="heading-card">Card Title</h3>
  <p className="text-body">Body content goes here.</p>
</div>
```

### Link
```tsx
<a href="/studio" className="link-grow">
  Return to Garden
</a>
```

### Section
```tsx
<section className="space-section surface-gradient-warm">
  <div className="container-page">
    <h2 className="heading-section fade-grow-in">Section Title</h2>
    <p className="text-large fade-grow-in">Description text.</p>
  </div>
</section>
```

---

**Design Philosophy:**
"Every interaction must have weight, every color must know its emotional purpose, every animation must suggest organic growth rather than mechanical efficiency."
