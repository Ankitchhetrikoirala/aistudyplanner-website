---
name: Electric Obsidian
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#cec2d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#978da0'
  outline-variant: '#4c4355'
  surface-tint: '#d8b9ff'
  primary: '#d8b9ff'
  on-primary: '#450086'
  primary-container: '#ae72ff'
  on-primary-container: '#3c0076'
  inverse-primary: '#7e28df'
  secondary: '#ddb7ff'
  on-secondary: '#4a0080'
  secondary-container: '#622599'
  on-secondary-container: '#d1a1ff'
  tertiary: '#ffb868'
  on-tertiary: '#482900'
  tertiary-container: '#ca801d'
  on-tertiary-container: '#3f2300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eddcff'
  primary-fixed-dim: '#d8b9ff'
  on-primary-fixed: '#290055'
  on-primary-fixed-variant: '#6200bc'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0050'
  on-secondary-fixed-variant: '#622599'
  tertiary-fixed: '#ffddbb'
  tertiary-fixed-dim: '#ffb868'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system is built for high-performance environments that demand a futuristic, nocturnal aesthetic. The brand personality is energetic, precise, and premium, evoking the feeling of a cutting-edge digital cockpit. It targets tech-forward users who value depth and visual intensity.

The visual style is a fusion of **Glassmorphism** and **High-Contrast Bold**. By layering translucent surfaces over a deep charcoal foundation, the UI achieves a sense of immense physical depth. "Electric Violet" serves as the primary energy source, cutting through the darkness with neon-inspired glows and sharp accents, while "Deep Purple" provides a sophisticated, moody undertone for secondary actions.

## Colors

The palette is anchored by a deep charcoal base to maximize the luminance of the accent colors. 

- **Primary (Electric Violet):** Used for primary calls-to-action, active states, and critical paths. It should always feel like it is emitting light.
- **Secondary (Deep Purple):** Used for depth, subtle gradients, and secondary interactive elements.
- **Neutral (Deep Charcoal):** The foundation for all surfaces. It creates a "true dark" environment that eliminates eye strain while enhancing contrast.
- **Surface Treatment:** Glassmorphic containers utilize a low-opacity white fill with a subtle backdrop blur to create a layered "frosted" effect against the charcoal background.

## Typography

This design system relies exclusively on **Inter** to maintain a systematic, utilitarian, and modern appearance. The type hierarchy emphasizes extreme weight contrast—heavy bold headlines paired with clean, readable body text.

Headlines should utilize tight letter spacing and heavy weights to appear "industrial" and impactful. Labels and captions use increased letter spacing and uppercase styling to provide a technical, data-driven feel. For mobile, headline sizes are scaled down slightly to ensure high-impact text does not break across too many lines.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with a strict 8px spacing rhythm. 

- **Grid:** A 12-column system is used for desktop, collapsing to 4 columns for mobile. 
- **Margins:** Generous outer margins (64px on desktop) are used to isolate content and give the glassmorphic cards a floating appearance.
- **Density:** Space is used aggressively to create a "breathable" premium feel. Content should never feel cramped; instead, use spacing to clearly define groups of information without the need for heavy lines.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Accent Shadows**. Instead of traditional gray shadows, this design system uses tinted ambient glows to suggest light sources within the UI.

1.  **Level 0 (Background):** Solid Deep Charcoal (#0A0A0C).
2.  **Level 1 (Cards/Containers):** Glassmorphic surfaces with a 12px backdrop blur, a 1px border at 10% white opacity, and a subtle inner glow.
3.  **Level 2 (Popovers/Modals):** High-opacity glass surfaces with a 40px backdrop blur and a diffused "Electric Violet" shadow (0px 20px 40px rgba(157, 80, 255, 0.2)).
4.  **Interactive States:** Hovering over elements should increase the intensity of the "Electric Violet" shadow, making the component appear to "charge" with energy.

## Shapes

The shape language is "Soft" yet precise. Elements use a 4px (0.25rem) base radius to maintain a sleek, technical appearance that isn't overly organic or "bubbly."

- **Standard Elements (Buttons, Inputs):** 4px radius.
- **Large Elements (Cards, Modals):** 8px (rounded-lg) to 12px (rounded-xl) radius.
- **Visual Rhythm:** The consistency of these sharp-but-soft corners reinforces the high-tech, precision-engineered aesthetic of the system.

## Components

### Buttons
Primary buttons use a solid **Electric Violet** fill with white text. They should have a subtle outer glow of the same color. Secondary buttons use a transparent background with a 1px **Electric Violet** border.

### Input Fields
Inputs are deep charcoal with a 1px white border at 10% opacity. Upon focus, the border transitions to **Electric Violet** and gains a soft neon glow.

### Glass Cards
The signature component of this design system. Cards must have a `backdrop-filter: blur(12px)` and a subtle linear gradient border (top-left to bottom-right) from 20% white to 5% white.

### Chips & Badges
Small, high-contrast pills. Use **Deep Purple** for background and **Electric Violet** for text to create a monochromatic but distinct hierarchy.

### Checkboxes & Radios
Custom-styled boxes with an **Electric Violet** fill when checked. The "off" state should be a simple 1px outline to minimize visual noise.

### Status Indicators
Incorporate "Neon Glow" dots for status (e.g., Online = Electric Green, Busy = Electric Violet, Offline = Charcoal Gray) to maintain the luminescent theme.