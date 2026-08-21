# SPR Homecraft Design Direction

## Three stylistic approaches considered

### Theme Name: Forest Atelier
Very Brief Intro: A warm editorial showroom rooted in deep forest green, champagne metal, and tactile fabric photography. It feels crafted, confident, and quietly luxurious rather than glossy or overly commercial.
Probability: 0.04

### Theme Name: Monsoon Modern
Very Brief Intro: A moody architectural direction with wet-stone neutrals, restrained teal, and cinematic movement inspired by Hyderabad evenings. It leans contemporary, atmospheric, and spatial.
Probability: 0.07

### Theme Name: Ivory Archive
Very Brief Intro: A light art-book aesthetic with generous ivory space, dark ink typography, and gallery-like image sequencing. It feels collected, refined, and calm.
Probability: 0.02

## Chosen approach: Forest Atelier

### Design Movement
Contemporary editorial luxury with the restraint of a modern furniture catalogue and the warmth of an Indian craft atelier.

### Core Principles
1. Let the supplied furniture photography lead; interface chrome stays quiet so the work feels tangible.
2. Use asymmetry, long pauses, and oversized serif typography to create an art-directed rhythm instead of a template-like grid.
3. Reserve champagne gold for navigation cues, micro-labels, rules, and meaningful calls to action.
4. Make every interaction feel like handling a material sample: soft, deliberate, and responsive.

### Color Philosophy
Deep forest green is the signature atmosphere: grounded, natural, and distinctly premium. Warm ivory gives the photography room to breathe and keeps the page from feeling like a dark-mode dashboard. Champagne gold appears sparingly as the glint of a brass detail—never as decoration everywhere.

### Layout Paradigm
A vertical editorial journey: full-bleed hero, offset copy blocks, a numbered craft process, alternating image-to-text compositions, and an asymmetrical gallery with a visible media reel. Desktop layouts use intentional left/right imbalance; mobile layouts preserve the sequence and contrast rather than shrinking everything into centered cards.

### Signature Elements
- A thin champagne-gold atelier rule that appears beside section labels and expands on hover.
- Oversized serif headlines broken into short stacked phrases, often paired with a small monospaced index.
- Dark forest panels that frame warm ivory photography like pages in a physical lookbook.

### Interaction Philosophy
Interactions are invitations, not interruptions. Buttons slide a few pixels, image cards reveal a warm tint, and the enquiry drawer arrives as a calm sheet rather than a loud modal. The user should always understand where they are and how to return.

### Animation
Use reveal-on-scroll transitions with opacity and translateY only, staggered by 60ms for grouped elements. Hero imagery receives a very slow scale drift, while the gold rule draws from 0 to 100%. Hover states use 180–260ms ease-out transitions. Video tiles stay muted and loop silently, with a clear play affordance and controls available. Respect prefers-reduced-motion and disable parallax and non-essential transforms there.

### Typography System
Display: Cormorant Garamond, with 500–600 weights for headlines and italic used only for emphasis. Body: Manrope, with 400–600 weights for readable UI and copy. Micro labels: Manrope 11–12px uppercase with 0.16em tracking. Headline hierarchy: hero 72–132px fluid, section titles 48–80px fluid, card titles 20–28px.

### Brand Essence
Premium customised furniture for Hyderabad homes and commercial spaces, designed around real dimensions, real comfort, and real life. Personality: grounded, discerning, attentive.

### Brand Voice
Headlines are short, assured, and sensory. CTAs are direct but never pushy. Microcopy sounds like an experienced design partner.

Example lines:
- “Not just made to fit. Made to belong.”
- “Bring us the room. We’ll shape what comes next.”

### Wordmark & Logo
Use a custom typographic wordmark treatment with SPR set in wide-tracked capitals and HOMECRAFT below in a compact line. The graphic mark is a simple three-panel monogram inspired by a sofa profile and a floor-plan corner, rendered in champagne gold on transparent ground.

### Signature Brand Color
Atelier Forest — #12352A.

## Style Decisions
The uploaded sofa photography and vertical videos are the ground-truth content. The interface will use Forest Atelier styling, with no fabricated reviews, ratings, or testimonials. The primary conversion is Request a Quote / Book a Consultation, not checkout.

## Style Decisions

The official supplied SPR Homecraft logo remains the source of truth. It is paired with a wider tracked SPR wordmark and compact HOMECRAFT line so the identity reads clearly at navigation scale. Champagne gold is restricted to headline inflections, primary calls to action, atelier rules, and key wayfinding. Major section headlines use distinct cadences, and the media reel is treated as a tactile lookbook sequence rather than a generic card grid.
