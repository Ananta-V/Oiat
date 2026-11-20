---
name: OiAI ("Oops! I Ate It.")
description: "Homemade chocolates. Happy little accidents. Handcrafted artisanal confectionery from Hyderabad."
colors:
  primary: "#4b1e0d"
  primary-deep: "#2d1008"
  primary-hover: "#6b2d17"
  cocoa-soft: "#8e4b2a"
  caramel: "#bd7e4a"
  honey: "#ddb778"
  paper: "#f4e7cc"
  paper-light: "#fbf3e2"
  paper-deep: "#e9d6b3"
  line: "rgba(75, 30, 13, 0.24)"
typography:
  display:
    fontFamily: "'Cormorant Garamond', Georgia, serif"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Cormorant Garamond', Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Cormorant Garamond', Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "'Manrope', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.6
  label:
    fontFamily: "'Manrope', sans-serif"
    fontSize: "0.5rem"
    fontWeight: 800
    lineHeight: 1.4
    letterSpacing: "0.15em"
rounded:
  sm: "2px"
  md: "6px"
  lg: "17px"
  card: "2px 2px 18px 2px"
  pill: "9999px"
  organic-button: "2px 17px 2px 17px"
  organic-input: "2px 10px 2px 10px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "36px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper-light}"
    rounded: "{rounded.organic-button}"
    padding: "14px 19px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.organic-button}"
    padding: "14px 19px"
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    rounded: "{rounded.organic-button}"
    padding: "14px 19px"
  card-product:
    backgroundColor: "rgba(255, 247, 230, 0.5)"
    textColor: "{colors.primary}"
    rounded: "{rounded.card}"
    padding: "10px 10px 14px"
  input-field:
    backgroundColor: "{colors.paper-light}"
    textColor: "{colors.primary}"
    rounded: "{rounded.organic-input}"
    padding: "12px 13px"
---

# Design System: OiAI ("Oops! I Ate It.")

## Overview

**Creative North Star: "The Artisanal Kitchen Notebook"**

OiAI ("Oops! I Ate It.") is an artisanal chocolate house from Hyderabad, India, born from small-batch experiments and the joy of spontaneous indulgence ("Happy little accidents", "Tiny kitchen · Big feelings"). The visual identity avoids cold, clinical ecommerce grids and aloof luxury minimalism. Instead, it feels like an intimate, heirloom recipe notebook kept on a flour-dusted confectioner's worktable.

Every viewport balances tactile paper warmth with rich roasted cocoa ink. Elements do not sit on a sterile digital plane; they behave like organic, hand-folded confectionery wrappers, wax-stamped tasting parcels, and handwritten notes tucked into gift parcels. The atmosphere is warm, whimsical, authentic, and unapologetically personal.

**Key Characteristics:**
- **Warm Paper Canvas:** Atmospheric parchment background textures (`#f4e7cc`), subtle tactile grain overlays, and zero sterile pure whites.
- **Liquid Chocolate Motion:** Organic liquid chocolate waves, slow-breathing melted cocoa hero elements, and glossy hover drips.
- **Asymmetric Handcrafted Geometry:** Deliberate asymmetric corner radii (`2px 17px 2px 17px`) and slight organic rotations (`-0.55deg` to `+0.7deg`) mimicking hand-cut confectioner wrappers.
- **Three-Voice Typographic Harmony:** Majestic literary serif headlines (`Cormorant Garamond`), intimate cursive margin notes (`Caveat`), and clean, legible functional labels (`Manrope`).

## Colors

The OiAI color palette is drawn directly from the confectioner’s pantry: roasted cocoa beans, whipped creams, raw paper rolls, and amber caramels.

### Primary
- **Roasted Cocoa Ink** (`#4b1e0d`): The foundational brand ink. Used for body text, primary button backgrounds, strong headlines, and deep line illustrations.
- **Deep Bittersweet Ganache** (`#2d1008`): Deepest cocoa tone. Used for melted chocolate edge shadows, footer backgrounds, and intense high-contrast accents.

### Secondary
- **Melted Cocoa Brown** (`#6b2d17`): Mid-tone molten chocolate. Used for button hover states, category badges, and fluid wave gradients.
- **Warm Terracotta** (`#8e4b2a`): Soft roasted cacao. Used for decorative borders, handwritten doodle sketches, and subtle subheadings.

### Tertiary
- **Salted Caramel** (`#bd7e4a`): Warm golden caramel. Used for modal borders, card highlight lines, and badge accents.
- **Wildflower Honey** (`#ddb778`): Luminous golden highlight. Reserved strictly for star ratings, celebration sparkles, and joyful moments.

### Neutral
- **Raw Parchment** (`#f4e7cc`): The primary global surface canvas. Warm, tactile, and non-fatiguing.
- **Whipped Parchment** (`#fbf3e2`): Light cream layer. Used for input fields, feedback modal surfaces, and crisp text contrast on dark cocoa.
- **Toasted Biscuit** (`#e9d6b3`): Deep paper tone. Used for process strips, alternating card tiers, and textured containers.
- **Faint Cocoa Rule** (`rgba(75, 30, 13, 0.24)`): Subtle dividing lines, borders, and tactile page frames.

### Named Rules
**The No-Pure-White Rule.** Pure `#ffffff` and pure `#000000` are strictly forbidden on the canvas. Surfaces must retain creamy parchment warmth (`#f4e7cc` / `#fbf3e2`), and text must remain warm roasted cocoa (`#4b1e0d` / `#2d1008`).

**The Golden Honey Reserve Rule.** The honey gold tone (`#ddb778`) is never used for general body text or large background fills. Its exclusivity denotes delight, ratings, and spontaneous celebration.

## Typography

OiAI uses a strict three-tier typographic hierarchy that gives the brand its distinctive balance between literary nostalgia, human warmth, and legible clarity.

**Display Font:** 'Cormorant Garamond', Georgia, serif  
**Handwritten Font:** 'Caveat', cursive  
**Body Font:** 'Manrope', sans-serif  

**Character:** Cormorant provides classical editorial weight and romantic indulgence; Caveat supplies intimate, warm handwritten margin commentary; Manrope ensures effortless UI scanability and accessibility.

### Hierarchy
- **Display** (Weight: 600, Size: clamp(3rem, 6vw, 5rem), Line-height: 0.92, Letter-spacing: -0.03em): Used for the hero brand statement, category anchors, and main section headers.
- **Headline** (Weight: 600, Size: clamp(2rem, 3.5vw, 2.75rem), Line-height: 0.98): Used for modal titles, product names, and showcase features.
- **Title** (Weight: 700, Size: 1.25rem–1.5rem, Line-height: 1.15): Used for card headings and section sub-features.
- **Handwritten / Marginalia** (Weight: 600, Size: 1.125rem–1.625rem, Line-height: 1.1): Used for sweet signatures, doodle captions, asterisks, and personal baker notes.
- **Body** (Weight: 500, Size: 0.875rem (14px), Line-height: 1.6): Used for descriptive copy, tasting notes, and explanations.
- **Label / Eyebrow** (Weight: 800, Size: 0.5rem–0.625rem (8px–10px), Letter-spacing: 0.15em, Uppercase): Used for metadata tags, category indicators, and form field labels.

### Named Rules
**The Three-Voice Rule.** Every major section must establish clear roles: Cormorant speaks for the brand, Caveat speaks for the human creator, and Manrope speaks for the user's practical actions. Never use Caveat for form labels or long reading paragraphs.

## Layout

OiAI pairs a desktop sticky brand sidebar (`244px` width) with an expansive, flowing main content canvas.

- **Sidebar Anchor:** Sticky left navigation on desktop (`min-width: 244px`), anchoring the hand-drawn brand lockup, ribbon links, and artisan seals. Collapses cleanly on tablets and mobile screens (`≤ 850px`).
- **Organic Product Grid:** 3-column desktop grid (`repeat(3, minmax(0, 1fr))`) collapsing to 2 columns on tablet (`≤ 850px`) and mobile (`≤ 600px`).
- **Memory Card Grid:** 4-column desktop grid (`repeat(4, minmax(0, 1fr))`) collapsing to 2 columns on tablets and mobile.
- **Spatial Rhythm:** Generous vertical section padding (`50px` to `80px`) punctuated by continuous paper grain and a fixed 1px inset frame (`.page-frame`).

## Elevation & Depth

OiAI uses a tactile, print-inspired depth model: **Physical Stamped Surfaces & Liquid Float**. The interface avoids modern generic soft drop-shadows, using solid ink offsets at rest and diffuse warm cocoa glows upon interaction.

### Shadow Vocabulary
- **Stamped Paper Rest** (`box-shadow: 0 5px 0 rgba(67, 25, 11, 0.06)`): The default resting state for cards and blocks, simulating cut paper resting on a table.
- **Ink Stamp Button Hover** (`box-shadow: 4px 6px 0 rgba(75, 30, 13, 0.12)`): Crisp, solid offset shadow mimicking an artisan ink stamp pressed onto paper.
- **Lifted Card Float** (`box-shadow: 0 13px 0 rgba(77, 34, 13, 0.06), 0 26px 40px rgba(77, 34, 13, 0.14)`): Applied on card hover as the element lifts (`translateY(-7px)`).
- **Modal Depth** (`box-shadow: 0 22px 90px rgba(20, 6, 2, 0.4)`): Applied to dialogs over a blurred backdrop (`rgba(36, 13, 5, 0.72)` with `backdrop-filter: blur(5px)`).

### Named Rules
**The Stamped-at-Rest Rule.** Surfaces remain grounded at rest with subtle 0px-blur directional offsets. Soft ambient blur appears only when an interactive element is lifted into the air during hover or modal activation.

## Shapes

The form language is organic, asymmetric, and tactile—evoking hand-folded artisanal wrappers and custom chocolate molds.

- **Asymmetric Organic Radii:** Buttons use `border-radius: 2px 17px 2px 17px` or `6px 20px 6px 20px`; input fields use `2px 10px 2px 10px`; product cards use `2px 2px 18px 2px`.
- **The Deliberate Tilt:** Repeating grid items carry slight alternating rotations (`nth-child(3n+1): rotate(-0.42deg)`, `nth-child(3n+2): translateY(8px) rotate(0.3deg)`, `nth-child(3n): rotate(-0.15deg)`). This breaks digital sterility and feels like individual handmade boxes laid on a table.
- **Seals and Ribbons:** Circular wax stamps with dashed concentric outlines (`transform: rotate(-13deg)`), stitched ribbon tags, and organic pill chips.

## Components

### Buttons
- **Shape:** Asymmetric organic radius (`2px 17px 2px 17px`), height `48px–51px`.
- **Primary Ink Button:** Background `#4b1e0d`, text `#fff3d8`. Features an internal liquid chocolate wave (`.button-liquid-wave`) that rises smoothly on interaction.
- **Outline Button:** Border `1px solid #865033`, background `transparent`, text `#4b1e0d`. Hovers to `#e7d2ad`.
- **Paper Button:** Background `#f4e7cc`, text `#4b1e0d`. Hovers to `#ffefd2`.

### Product & Memory Cards
- **Product Card:** Background `rgba(255, 247, 230, 0.5)`, border `1px solid rgba(75, 30, 13, 0.18)`, radius `2px 2px 18px 2px`. Imagery is filtered with warm sepia (`filter: sepia(0.18)`), expanding smoothly on hover.
- **Memory Story Card:** Alternating biscuit and parchment background tiers (`#f8edd5`, `#e6c7a4`, `#f1e0c2`, `#dcb995`), border `1px solid rgba(67, 25, 11, 0.24)`, min-height `325px`. Lift animation on hover (`translateY(-7px)`).

### Inputs & Fields
- **Style:** Background `rgba(255, 252, 242, 0.82)`, border `1px solid rgba(67, 25, 11, 0.24)`, radius `2px 10px 2px 10px`, padding `12px 13px`.
- **Focus:** Outline `2px solid #a75a2d` with `outline-offset: 2px`.
- **Placeholders:** Warm caramel `#b18a6b`.

### Feedback & Memory Dialog
- **Modal Container:** Background `#fbf1db`, border `1px solid #bd8b5d`, split two-column layout on desktop (art panel + form panel), stacking gracefully on mobile.
- **Modal Art Panel:** Deep cocoa radial gradient (`#3a170b`), warm gold border trim, animated pulsing cocoa heart, and rotating star spark.

## Do's and Don'ts

### Do:
- **Do** preserve the warm parchment background palette (`#f4e7cc`) and roasted cocoa typography (`#4b1e0d`).
- **Do** use asymmetric corner radii (`2px 17px 2px 17px` or `2px 10px 2px 10px`) on interactive elements to maintain handmade artisanal charm.
- **Do** apply subtle alternating paper tilts (`rotate(-0.4deg)` to `rotate(0.5deg)`) to cards in multi-item lists.
- **Do** restrict Caveat handwriting font strictly to annotations, margin notes, signatures, and personal baker doodles.
- **Do** use liquid chocolate animations and easing curves (`cubic-bezier(0.2, 0.8, 0.2, 1)`) for meaningful interactive states.

### Don't:
- **Don't** use pure `#ffffff` backgrounds or `#000000` text anywhere in the storefront.
- **Don't** use generic symmetrical 4px or 8px pill buttons that look like standard SaaS component libraries.
- **Don't** use Caveat for form labels, navigation links, or primary body copy.
- **Don't** use cold blue, purple, or neon accent colors that clash with warm chocolate and roasted cocoa tones.
- **Don't** remove the paper grain overlay or fixed page frame.
