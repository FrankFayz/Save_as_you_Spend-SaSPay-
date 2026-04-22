# 🎨 SaSPay Design System - Design Tokens Reference

## Color Tokens

### **Primary Green (Action, Buttons, Accents)**
```
#22c55e          (Primary green - use for buttons, highlights, primary text)
#16a34a          (Darker green - hover states, active states)
#10b981          (Emerald - success states, confirmations)
```

### **Green Text Variants**
```
#f0fdf4          (Almost white - primary text on dark backgrounds)
#d1fae5          (Light green - text accents, secondary labels)
#a7f3d0          (Medium green - tertiary text, hints)
#6ee7b7          (Mint green - labels, small text, disabled state)
```

### **Dark Background**
```
#0f172a          (Primary background - main container)
#020617          (Page background - body)
```

---

## Gradient Combinations (Most Used)

### **Primary Button Gradient**
```css
background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
```
**Use**: Main action buttons, "Pay Now", primary CTAs

### **Card/Form Background**
```css
background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
```
**Use**: Form containers, modal backgrounds, card backgrounds

### **Hover/Focus Gradient**
```css
background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.08));
```
**Use**: Button hover states, form focus states, interactive elements

### **Secondary Button Gradient**
```css
background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.06));
```
**Use**: Secondary actions, cancel buttons, info buttons

---

## Border Styles

### **Primary Border (Strong)**
```css
border: 1px solid rgba(34, 197, 94, 0.3);
```
**Use**: Card borders, form inputs, main containers

### **Accent Border (Medium)**
```css
border: 2px solid rgba(34, 197, 94, 0.3);
```
**Use**: Highlight cards, primary cards, emphasized elements

### **Subtle Border (Light)**
```css
border: 1px solid rgba(34, 197, 94, 0.15);
```
**Use**: Dividers, subtle separations, disabled states

### **Focus Border**
```css
border: 2px solid rgba(34, 197, 94, 0.5);
```
**Use**: Input focus states, active elements

---

## Shadow System

### **Subtle Shadow (Level 1)**
```css
box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
```
**Use**: Buttons, small cards, subtle elevation

### **Medium Shadow (Level 2)**
```css
box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
```
**Use**: Cards, containers, main elements

### **Heavy Shadow (Level 3)**
```css
box-shadow: 0 12px 48px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
```
**Use**: Modal backgrounds, elevated containers

### **Maximum Shadow (Level 4)**
```css
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
```
**Use**: Modals, overlays, top-level containers

### **Inset Highlight (Glass Effect)**
```css
box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
```
**Use**: All glassmorphic elements for subtle light highlight

---

## Typography Tokens

### **Heading 1 (Large Headers)**
```css
font-size: 2.2rem;
font-weight: 900;
letter-spacing: -1px;
color: #22c55e;
```

### **Heading 2 (Page Headers)**
```css
font-size: 1.6rem;
font-weight: 900;
letter-spacing: -0.5px;
color: #22c55e;
```

### **Heading 3 (Section Headers)**
```css
font-size: 1.3rem;
font-weight: 900;
letter-spacing: -0.5px;
color: #22c55e;
```

### **Body Text (Regular)**
```css
font-size: 15px;
font-weight: 600;
color: #f0fdf4;
```

### **Small Text (Labels, Hints)**
```css
font-size: 12-13px;
font-weight: 700;
color: #a7f3d0;
text-transform: uppercase;
letter-spacing: 0.1em;
```

### **Card Amount (Large Numbers)**
```css
font-size: 2.4-2.8rem;
font-weight: 950;
letter-spacing: -1px;
color: #22c55e;
```

---

## Spacing System

### **Padding Scale**
```
8px   - Small buttons, minimal padding
12px  - Form elements, card internal spacing
16px  - Standard element spacing
18-20px - Card padding (small cards)
24-28px - Header padding, main containers
32px  - Large card padding, modal padding
```

### **Gap System**
```
6px   - Small icons/text grouping
8px   - Element grouping
12px  - Moderate spacing
14px  - Standard spacing between elements
16px  - Comfortable spacing
24px  - Large section spacing
28px  - Extra large section spacing
```

### **Margin Scale**
```
12px  - Between related elements
20px  - Between sections
24px  - Between major sections
30-36px - Between major components
```

---

## Border Radius Scale

```
8px   - Small elements (not used in new design, upgraded to 12px)
12px  - Standard rounded (buttons, inputs)
14px  - Modern rounded (cards, small containers)
16px  - Medium rounded (larger cards, popups)
20px  - Large rounded (primary cards, modals)
24px  - Extra large rounded (hero sections)
50%   - Fully rounded (circles, avatars)
```

---

## Transition & Animation Tokens

### **Standard Transition**
```css
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```
**Use**: All interactive elements, smooth state changes

### **Button Hover Animation**
```css
:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
```

### **Subtle Hover Animation**
```css
:hover {
  transform: translateY(-1px);
  border-color: rgba(34, 197, 94, 0.5);
}
```

### **Modal Slide Down**
```css
animation: slideDownPopup 0.3s cubic-bezier(0.4, 0, 0.2, 1);

@keyframes slideDownPopup {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### **Page Fade In**
```css
animation: fadeIn 0.3s ease-in;

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### **Loading Spinner**
```css
animation: spin 0.8s linear infinite;

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## Glassmorphism Recipe

### **Standard Glassmorphic Element**
```css
background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
border: 1px solid rgba(34, 197, 94, 0.2);
border-radius: 14px;
backdrop-filter: blur(10px);
box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

### **Enhanced Glassmorphic (Focus/Hover)**
```css
background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.08));
border: 2px solid rgba(34, 197, 94, 0.35);
backdrop-filter: blur(15px);
box-shadow: 0 12px 48px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15);
```

---

## Component Patterns

### **Button Pattern**
```css
.button {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: 1px solid rgba(34, 197, 94, 0.5);
  color: white;
  padding: 12-14px 24-32px;
  border-radius: 12-16px;
  font-weight: 800;
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
```

### **Card Pattern**
```css
.card {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.04));
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 14-20px;
  padding: 24-32px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(34, 197, 94, 0.35);
  box-shadow: 0 12px 48px rgba(34, 197, 94, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
```

### **Input Pattern**
```css
input {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  color: #f0fdf4;
  padding: 12px 16px;
  font-weight: 700;
  transition: all 0.2s ease;
}

input:focus {
  border-color: rgba(34, 197, 94, 0.5);
  outline: none;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
}
```

---

## Implementation Guidelines

### **DO's** ✓
- Use green (#22c55e) for all primary actions
- Apply gradients at 135° angle
- Add backdrop-filter blur(10-20px) for glassmorphism
- Use proper inset highlights for depth
- Maintain consistent spacing (14/16/20/24/28/32px)
- Apply smooth cubic-bezier transitions
- Keep font weights bold (600-950)
- Use proper color hierarchy for text

### **DON'Ts** ✗
- Don't mix blue colors with green theme
- Don't use flat designs without shadows
- Don't use small border-radius (< 12px for modern elements)
- Don't apply harsh borders without gradients
- Don't use default browser styling
- Don't mix different transition timings
- Don't use light text colors (< #a7f3d0) for primary content
- Don't forget inset shadows for glassmorphism

---

## Maintenance Notes

When adding new components:
1. Always start with a card or button pattern from above
2. Apply green color tokens consistently
3. Add glassmorphism with blur + inset highlight
4. Use cubic-bezier(0.4, 0, 0.2, 1) for smooth animations
5. Test hover states with proper shadow elevation
6. Ensure text contrast meets accessibility standards
7. Maintain responsive padding and margins
8. Apply proper border-radius (14-24px range)

---

**Last Updated**: Current Session  
**Design System Version**: 1.0 (Production Ready)  
**Compatibility**: All modern browsers  
**Status**: ✅ Active & Maintained
