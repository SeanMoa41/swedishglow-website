# The Swedish Glow — Design System & Visual Handoff

> **Voor:** Claude Code (volgende ontwikkelaar)
> **Project:** The Swedish Glow website — frontend visual refinement
> **Doel:** Visuals naar premium niveau brengen, consistent met merkidentiteit
> **Stack assumptie:** Modern (Next.js / React) — backend reeds gebouwd
> **Laatste update:** Mei 2026

---

## 0. Quick start — lees dit eerst

Als je dit document leest als Claude Code, begin met deze fundamentele principes voordat je code aanraakt:

1. **Sjiek en ingetogen, niet opzichtig.** Denk Aesop, Susanne Kaufmann, Augustinus Bader — niet drogisterij-keten.
2. **Geen bouncy animaties.** Geen `translateY(-6px)` bij hover, geen `scale(1.15)` op cijfers. Subtiele kleur- en schaduwwissels — niets dat springt.
3. **Italic + goud = de geheime saus.** Sleutelwoorden krijgen italic in `--gold-soft` of `--moss` — *"Het maandritueel"*, *"Welk ritueel past bij jou?"*. Dit is wat de site sjiek maakt.
4. **Witruimte is luxe.** Niet propvol zetten. Padding 60-120px verticaal op desktop, 40-60px op mobiel.
5. **Cormorant Garamond voor display, Inter Tight voor body.** Geen andere fonts.
6. **Romeinse cijfers voor product-volgorde.** I = Marine Collageen (ochtendritueel), II = Nordsilk (haarritueel), III = FREJA (basisritueel), IV = HÉRMADE (maandritueel).

---

## 1. Brand identity

### Merk
- **Naam:** The Swedish Glow
- **Type:** Nederlands familiemerk met Zweedse roots
- **Sinds:** 2022
- **Oprichtster:** Elin Hellqvist-Moayedi (psycholoog, ex-HR ASML/IKEA/Shimano)
- **Product:** Premium Nordic beauty supplementen
- **Markten:** Nederland + internationaal (23 landen, 100.000+ klanten)

### Doelgroep
Vrouwen 35-65, gemiddeld inkomen+, sjieke esthetische voorkeur, geïnteresseerd in longevity/wellness/inner beauty. **Niet:** trendy 20-jarige TikTok beauty consumer. **Wel:** vrouw die weloverwogen kiest, premium ingrediënten waardeert, leest, denkt.

### Tone of voice
- **Sjiek, ingetogen, gelaagd** — niet schreeuwerig
- **Literair, niet bombastisch** — *"voor de vrouw die schoonheid van binnenuit verstaat"*, niet *"voel je weer 20!"*
- **Filosofisch waar het kan** — *"Het is geen sprint. Het is een seizoen."*
- **Zacht autoritair** — vertelt niet, nodigt uit
- **Scandinavisch luxe** — bewust afgemeten, ruimte voor stilte

### Vermijden
- Buzzwords ("game-changer", "revolutionair")
- Quick fix claims
- Overmatige emoji's
- Spammy CTAs ("KOOP NU!")
- Te veel uitroepingstekens

---

## 2. Color system

```css
:root {
  /* Backgrounds — warm, natural */
  --bone:        #f6f1e8;  /* Main background — warm crème */
  --bone-warm:   #ede5d3;  /* Subtle section divider */
  --cream:       #f0e9da;  /* Accent background */

  /* Ink — text colors */
  --ink:         #1c1c1a;  /* Main text — warm dark */
  --ink-soft:    #5a5a55;  /* Secondary text */

  /* Moss — main brand green */
  --moss:        #2d3e2f;  /* Main green — dark, organic */
  --moss-deep:   #1a2820;  /* Deep green — backgrounds */

  /* Gold — accent (sparingly!) */
  --gold:        #b8924a;  /* Main gold */
  --gold-soft:   #d4b478;  /* Lighter gold for dark backgrounds */
  --gold-deep:   #a07a3b;  /* Deeper gold for emphasis */

  /* Stone — neutrals */
  --stone:       #8a8478;
  --stone-light: #c8bfae;
  --line:        #e0d8c5;  /* Borders, dividers */
}
```

### Color use rules

**Background hierarchy:**
1. **`--bone`** = 80% of all backgrounds. The default.
2. **`--bone-warm`** = section dividers, subtle differentiation
3. **`--moss` / `--moss-deep`** = dramatic CTA sections, footer, contrast moments
4. **`--ink`** = footer, dramatic statements

**Text:**
- Body text always `--ink` on light bg, `--bone` on dark bg
- Secondary text `--ink-soft`
- **Italic accents in `--moss` on light bg, `--gold-soft` on dark bg**

**Gold = scarcity rule:**
Gold is a *luxury punctuation*. Use it for:
- Italic emphasis in headings (`em` tags)
- Eyebrow labels (uppercase tiny text)
- Underline accents under links
- Roman numerals on product cards
- Stars in ratings
- Subtle borders on CTA cards

**Never use gold for:**
- Large background fills
- Body text
- Multiple competing elements on one screen

---

## 3. Typography system

### Fonts (Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500&family=Inter+Tight:wght@300;400;500;600&display=swap" rel="stylesheet">
```

```css
--font-display: 'Cormorant Garamond', serif;  /* All headings, italic accents */
--font-body:    'Inter Tight', sans-serif;    /* All body, UI, buttons */
```

### Hierarchy

**H1 (page hero):**
```css
font-family: var(--font-display);
font-size: clamp(2.6rem, 5vw, 4.5rem);
font-weight: 400;
line-height: 1.05;
letter-spacing: -0.01em;
```

**H2 (section heading):**
```css
font-family: var(--font-display);
font-size: clamp(2rem, 3.5vw, 3rem);
font-weight: 400;
line-height: 1.1;
```

**H3 (card heading):**
```css
font-family: var(--font-display);
font-size: clamp(1.4rem, 2.5vw, 1.9rem);
font-weight: 400;
line-height: 1.15;
```

**H4 (small heading):**
```css
font-family: var(--font-display);
font-size: 1.2rem;
font-weight: 400;
```

**Eyebrow (the secret-sauce label):**
```css
font-size: 0.72rem;
letter-spacing: 0.28em;
text-transform: uppercase;
color: var(--gold-deep);
font-weight: 500;
margin-bottom: 16px;
```

**Body:**
```css
font-family: var(--font-body);
font-size: 1rem;
font-weight: 400;
line-height: 1.7;
color: var(--ink);  /* or --ink-soft for secondary */
```

**Italic accent (THE signature move):**
```html
<h2>Welk ritueel past bij <em>jou</em>?</h2>
```
```css
h1 em, h2 em, h3 em, h4 em {
  font-style: italic;
  color: var(--moss);  /* on light bg */
  /* OR --gold-soft on dark bg */
}
```

### Font weight rules
- Headings: **always 400** (regular). Never bold a serif heading.
- Body: 400 default, 300 for tertiary text
- Eyebrows, buttons, labels: 500
- Never use 600+ on display font

### Letter-spacing rules
- Eyebrows / labels: `0.2em` to `0.28em` (very wide)
- Headings: `-0.01em` (slightly tight)
- Body: default
- Uppercase buttons: `0.18em` to `0.2em`

---

## 4. Spacing & layout

### Section paddings
```css
/* Desktop */
section { padding: 100px 40px; }
.feature-section { padding: 120px 40px; }
.hero { padding: 140px 40px; }

/* Tablet */
@media (max-width: 1024px) {
  section { padding: 80px 32px; }
}

/* Mobile */
@media (max-width: 768px) {
  section { padding: 60px 20px; }
}

/* Small mobile */
@media (max-width: 380px) {
  section { padding: 60px 16px; }
}
```

### Container max widths
```css
.container { max-width: 1240px; margin: 0 auto; }
.container-narrow { max-width: 880px; margin: 0 auto; }
.container-text { max-width: 720px; margin: 0 auto; }
```

### Grid gaps
- Cards in a row: `24px`
- Sections internal: `48px` to `80px`
- Mobile: never more than `20-24px` gap

### Spacing scale (use sparingly — don't be too rigid)
```
4px  - tight (icon+text)
8px  - cluster (related items)
12px - intra-component (inside a card)
16px - between elements (inside a card)
24px - between cards
32px - section internal blocks
48px - section breaks
80px - between major sections
120px+ - dramatic breathing room
```

---

## 5. Component library

### 5.1 Buttons

**Primary (dark/moss):**
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 28px;
  background: var(--moss);
  color: var(--bone);
  font-family: var(--font-body);
  font-size: 0.78rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 500;
  border: 1px solid var(--moss);
  min-height: 48px;
  transition: background 0.4s ease, border-color 0.4s ease;
  cursor: pointer;
}
.btn-primary:hover {
  background: var(--moss-deep);
  border-color: var(--gold);
}
```

**Secondary (outline):**
```css
.btn-secondary {
  /* same as primary but: */
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--ink);
}
.btn-secondary:hover {
  background: var(--ink);
  color: var(--bone);
}
```

**Gold accent (rare — for special moments):**
```css
.btn-gold {
  background: var(--gold);
  color: var(--moss-deep);
  border: 1px solid var(--gold);
}
.btn-gold:hover { background: var(--gold-soft); }
```

**Rules:**
- Min tap-target: **48px height** (Apple/WCAG standard)
- All text: uppercase, 0.2em letter-spacing
- Arrow `→` at the end is encouraged (separated by gap, not margin)
- **NO transform on hover** (no translateY, no scale)
- Only color/background transitions

### 5.2 Eyebrow labels

Use as small uppercase intro above headings:

```html
<div class="eyebrow">Veelgestelde vragen</div>
<h2>Alles wat je wilt <em>weten</em>.</h2>
```

```css
.eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--gold-deep);
  font-weight: 500;
  margin-bottom: 16px;
  display: inline-block;
}
```

**Variant — centered with lines:**
```css
.eyebrow-centered::before,
.eyebrow-centered::after {
  content: '';
  display: inline-block;
  width: 24px;
  height: 1px;
  background: var(--gold);
  margin: 0 14px;
  vertical-align: middle;
}
```

### 5.3 Ritual cards (product cards)

The signature card — used for products on homepage and shop.

```html
<a href="..." class="ritual-card">
  <div class="ritual-card-num">I</div>
  <h3>Het <em>ochtendritueel</em></h3>
  <p class="ritual-product">Marine Collageen 13.000</p>
  <p class="ritual-desc">Eén shot. Eén moment...</p>
  <span class="ritual-card-arrow">Ontdek het ritueel →</span>
</a>
```

```css
.ritual-card {
  background: var(--bone);
  padding: 38px 32px 36px;
  border: 1px solid rgba(184, 146, 74, 0.15);
  position: relative;
  overflow: hidden;
  cursor: default;
  transition:
    border-color 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
    background 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Top gold line on hover — subtle */
.ritual-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--gold) 30%, var(--gold) 70%, transparent);
  transform: translateX(-50%);
  transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ritual-card:hover::after { width: 100%; }

.ritual-card:hover {
  border-color: var(--gold);
  box-shadow:
    0 20px 45px -22px rgba(28, 28, 26, 0.18),
    0 8px 20px -8px rgba(184, 146, 74, 0.12);
  background: linear-gradient(180deg, var(--bone) 0%, #f9f3e8 100%);
}

.ritual-card-num {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 2.1rem;
  font-weight: 300;
  color: var(--gold);
  line-height: 1;
  margin-bottom: 18px;
  display: inline-block;
}
.ritual-card:hover .ritual-card-num {
  color: var(--gold-deep);
}

.ritual-card h3 {
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: 10px;
}
.ritual-card h3 em {
  font-style: italic;
  color: var(--moss);
  transition: color 0.5s ease;
}
.ritual-card:hover h3 em { color: var(--gold-deep); }

.ritual-product {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 500;
  margin-bottom: 14px;
  display: inline-block;
}

.ritual-desc {
  font-size: 0.92rem;
  color: var(--ink-soft);
  line-height: 1.6;
  margin-bottom: 0;
  font-weight: 300;
}

.ritual-card-arrow {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold-deep);
  font-weight: 500;
  opacity: 0.65;
  margin-top: 18px;
  display: block;
  transition: opacity 0.4s ease, color 0.4s ease;
}
.ritual-card:hover .ritual-card-arrow {
  opacity: 1;
  color: var(--gold);
}
```

**CRITICAL — what NOT to do on hover:**
- ❌ NO `transform: translateY()` (no bouncing)
- ❌ NO `transform: scale()` on the roman numeral
- ❌ NO growing/expanding tekst (max-height tricks that resize cards)
- ✅ ONLY color, opacity, border, shadow, background changes

### 5.4 Magazine-split (dual image block)

Two large images side-by-side, used for category teasers on homepage.

```html
<section class="magazine-split">
  <div class="split-pane">
    <img src="..." alt="">
    <div class="label-overlay">
      <h3>Het <em>maandritueel</em></h3>
      <a href="...">Ontdek nu →</a>
    </div>
  </div>
  <div class="split-pane">
    <!-- second image -->
  </div>
</section>
```

```css
.magazine-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
  background: var(--bone);
  min-height: 270px;  /* compact — don't make this too tall */
}
.split-pane {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.split-pane img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;  /* image focal point */
  transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.split-pane:hover img { transform: scale(1.04); }

.label-overlay {
  position: absolute;
  bottom: 32px;
  left: 32px;
  color: var(--bone);
  text-shadow: 0 2px 16px rgba(0,0,0,0.4);
}
.label-overlay h3 {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 2.8vw, 2.6rem);
  font-weight: 400;
  line-height: 1.1;
}
.label-overlay h3 em {
  font-style: italic;
  color: var(--gold-soft);
}
.label-overlay a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bone);
  text-decoration: none;
  border-bottom: 1px solid var(--gold-soft);
  padding-bottom: 4px;
}

/* Mobile */
@media (max-width: 768px) {
  .magazine-split {
    min-height: auto;
    padding: 16px;
    gap: 12px;
  }
  .split-pane { min-height: 180px; }
  .label-overlay { bottom: 16px; left: 16px; }
  .label-overlay h3 { font-size: 1.4rem; }
}
```

### 5.5 Navigation (header)

**Desktop nav:**
```html
<header>
  <nav class="nav-wrap">
    <div class="nav-left">
      <a href="/shop">Shop</a>
      <div class="nav-dropdown">
        <a href="/supplementen" class="nav-dropdown-trigger">
          Supplementen <span class="nav-arrow">▾</span>
        </a>
        <!-- dropdown menu -->
      </div>
      <a href="/stories">Stories</a>
      <a href="/over-ons">Ons verhaal</a>
      <a href="/faq">FAQ</a>
      <a href="/reseller">Reseller</a>
    </div>
    <a href="/" class="logo">
      <img src="logo.png" class="logo-mark">
      <span class="logo-text">The Swedish <em>Glow</em></span>
    </a>
    <div class="nav-right">
      <div class="lang-switch">
        <a href="/" class="active">NL</a>
        <a href="/en">EN</a>
      </div>
      <a href="/account">Account</a>
      <a href="/cart">Cart (0)</a>
    </div>
  </nav>
</header>
```

```css
header {
  position: sticky;
  top: 0;
  background: var(--bone);
  z-index: 100;
  border-bottom: 1px solid var(--line);
}
.nav-wrap {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 22px 40px;
  gap: 40px;
}
.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 32px;
  font-size: 0.85rem;
}
.nav-right { justify-content: flex-end; }
.nav-left a, .nav-right a {
  color: var(--ink);
  text-decoration: none;
  position: relative;
  padding-bottom: 3px;
}
.nav-left a::after, .nav-right a::after {
  content: '';
  position: absolute;
  left: 0; bottom: 0;
  width: 0;
  height: 1px;
  background: var(--ink);
  transition: width 0.3s ease;
}
.nav-left a:hover::after { width: 100%; }
.logo-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
}
.logo-text em {
  font-style: italic;
  color: var(--gold);
}
```

**Mobile menu (hamburger → slide-in drawer from right):**

The hamburger transforms to an X on open. Drawer slides in from right.

```css
.nav-hamburger {
  display: none;
  /* ... see full code in existing index.html */
}
@media (max-width: 1024px) {
  .nav-hamburger { display: block; }
  .nav-left, .nav-right { display: none !important; }
  .nav-wrap {
    grid-template-columns: auto 1fr auto !important;
  }
  .nav-wrap .logo { justify-self: center; }
}

.mobile-menu {
  position: fixed;
  top: 0; right: 0;
  width: 100%;
  max-width: 420px;
  height: 100vh;
  background: var(--bone);
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  /* ... */
}
.mobile-menu.open { transform: translateX(0); }
```

Important navigation conventions:
- Order: `Shop · Supplementen ▾ · Stories · Ons verhaal · FAQ · Reseller`
- "Supplementen" has a dropdown with the 4 products + Romeinse cijfers
- Mobile menu has product sublist with `—` prefix
- FAQ recently added — placed after "Ons verhaal"

### 5.6 Cards summary

**Card types in use:**

1. **Ritual cards** — product cards, see 5.3
2. **Story cards** — for blog/stories listing, similar but with feature image
3. **Review cards** — quote + author + meta, on bone-warm bg
4. **FAQ items** — accordion-style with + → × toggle
5. **CTA cards** — moss-deep bg, used for "Welk ritueel past bij jou?" and similar
6. **Cross-sell cards** — small product previews, horizontal layout

All cards:
- Border: `1px solid rgba(184, 146, 74, 0.15)` (subtle gold)
- Border-radius: rarely used — keep it square/rectangular
- Background: `--bone` or `--bone-warm`
- Subtle hover: border-color → `--gold`, soft shadow
- **NEVER add bouncy translateY hover**

### 5.7 Forms

```css
input[type="email"],
input[type="text"],
textarea {
  width: 100%;
  padding: 14px 18px;
  background: var(--bone);
  border: 1px solid var(--line);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 0.95rem;
}
input:focus, textarea:focus {
  outline: none;
  border-color: var(--gold);
}

label {
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-soft);
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
}
```

---

## 6. Animation principles

### Fundamental rules

1. **NO BOUNCY HOVERS.** Never `translateY(-6px)`, `scale(1.15)`, or anything that physically moves an element on hover.
2. **Subtle is luxury.** Premium = restrained motion. Aim for color, opacity, border, shadow transitions only.
3. **Slower is more luxurious.** Use `0.5s` to `1.2s` durations, not `0.2s`.
4. **Use the same easing throughout:** `cubic-bezier(0.2, 0.8, 0.2, 1)` — smooth deceleration.

### Acceptable hover effects

✅ Border color change
✅ Background gradient appearing
✅ Shadow softening / appearing
✅ Color shifts (text color)
✅ Image gentle zoom (`scale(1.04)` over 1.2s — but **only on images**, not whole cards)
✅ Underline expansion (width 0 → 100%)
✅ Opacity fades

### Forbidden hover effects

❌ `transform: translateY(-6px)` or similar on cards
❌ `transform: scale()` on text/numerals
❌ `transform: rotate()` for emphasis
❌ Growing elements that resize the card
❌ Anything that makes content move >2px

### Page-load animations

Subtle fadeUp for hero text — only on initial load:

```css
.hero h1 {
  opacity: 0;
  transform: translateY(8px);
  animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
}
```

Don't do scroll-triggered animations unless the user has explicitly requested it. They feel cheap.

---

## 7. Photography & imagery

### Style
- **Natural light** — soft, side-lit, no harsh shadows
- **Muted tones** — beige, cream, sage, soft skin
- **Negative space** — let the subject breathe
- **Vrouwen 35-60** — natuurlijke huid, niet over-gefotoshopt
- **Producten met intentie** — handen die het product vasthouden, niet alleen flat lay
- **Sferen:** ochtend bij het raam, badkamer-rituelen, natuur (Zweedse landschappen)

### Image rules in CSS
```css
img {
  max-width: 100%;
  display: block;
}

/* For hero images and feature blocks */
.hero-image img,
.split-pane img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;  /* faces / focal points in top third */
}

/* Image with overlay gradient */
.image-overlay {
  position: relative;
}
.image-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    transparent 50%,
    rgba(0,0,0,0.3) 80%,
    rgba(0,0,0,0.6) 100%);
}
```

### Alt text
Always meaningful. Format: `"[Product/subject] — [context]"`. E.g.:
- `"HÉRMADE — Het maandritueel van The Swedish Glow"`
- `"Elin Hellqvist-Moayedi, oprichtster van The Swedish Glow"`

---

## 8. Voice & copy guidelines

### Voorbeelden uit huidige site

**Headings (notice italic accent):**
- "Zweedse beauty rituelen uit het *hoge noorden*"
- "Welk ritueel past bij *jou*?"
- "Het echte. *Daar* gaat het over."
- "Alles wat je wilt *weten*."

**Taglines:**
- "Premium essences voor élke vrouw."
- "Een ode aan de zee."

**Product names + romeinse cijfers:**
- I — Het ochtendritueel — Marine Collageen 13.000
- II — Het haarritueel — Nordsilk
- III — Het basisritueel — FREJA
- IV — Het maandritueel — HÉRMADE

**Filosofie-lijnen (long-form):**
- "Het is geen sprint. Het is een seizoen."
- "Glow is geen prestatie."
- "Stilte is gif en medicijn."

### Engels (when translating)
- Slogan: "Nordic beauty rituals, born in Sweden"
- Tagline: "Premium essences for every woman"
- Cards: "The morning ritual" / "The hair ritual" / "The foundation ritual" / "The monthly ritual"
- **Behoud altijd de italic + accent kleur structuur in vertalingen**

---

## 9. Mobile principles

We learned this the hard way. **Mobile is not desktop scaled down.**

### Section paddings on mobile
```css
@media (max-width: 768px) {
  section {
    padding-left: 20px !important;
    padding-right: 20px !important;
    padding-top: 60px !important;
    padding-bottom: 60px !important;
  }
}

@media (max-width: 380px) {
  section {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
}
```

### Typography on mobile
```css
@media (max-width: 768px) {
  html { font-size: 15px; }
  h1 { font-size: clamp(1.9rem, 8vw, 2.4rem) !important; line-height: 1.1 !important; }
  h2 { font-size: clamp(1.6rem, 6vw, 2rem) !important; line-height: 1.15 !important; }
  h3 { font-size: clamp(1.25rem, 4.5vw, 1.5rem) !important; }
  p { font-size: 0.95rem; line-height: 1.65; }
}
@media (max-width: 380px) {
  html { font-size: 14px; }
}
```

### Tap targets
**Minimum 48px tap height** for all interactive elements (WCAG/Apple HIG).

```css
@media (max-width: 768px) {
  a.btn, button, .nav-btn {
    min-height: 48px;
    padding: 14px 24px !important;
  }
  .faq-question {
    min-height: 56px;
    padding: 20px 0;
  }
}
```

### Layout collapses
- `grid-template-columns: 1fr 1fr` → `1fr` on mobile (vertical stack)
- `gap: 80px` → `gap: 20-24px` on mobile
- Hero hoogtes: max 380px on mobile, not 500-700px

### Body overflow
ALWAYS prevent horizontal scroll:
```css
body, html {
  overflow-x: hidden;
  max-width: 100%;
}
img, svg, video {
  max-width: 100%;
  height: auto;
}
```

### What NOT to do on mobile
- Horizontal-scroll card grids (looks cramped, breaks scrolling)
- Tiny tap targets (<44px)
- Fonts smaller than 14px for body
- Padding under 16px on section sides

---

## 10. Page-specific guidelines

### Homepage structure (top → bottom)

1. **Trust band** — slim moss-deep bar: "Morgen in huis · Familiemerk uit Zweden"
2. **Header** — sticky nav
3. **Hero** — split layout: text left, image right (desktop) → image top, text below (mobile). Editorial style.
4. **Trust signals** — "Premium ingrediënten · Made in Sweden · GMO & glutenvrij..."
5. **Featured imagery split** — magazine-split with 2 panes ("Het maandritueel" / "Het ochtendritueel")
6. **Ritual grid** — 4 ritual cards (I, II, III, IV) + "Welk ritueel past bij jou?" CTA
7. **100-dagen kuur section** — signature ritual explanation with timeline
8. **Editorial sections** — magazine layouts, brand story moments
9. **FAQ teaser** — small block with one CTA to /faq
10. **Trust band 2** — "As featured in..."
11. **Footer**

### Product detail page

1. Header + breadcrumb
2. **Product hero** — Image left, info right (desktop). Title, eyebrow, price, variants, CTA
3. **USPs band** — 4-column with icons (moss bg)
4. **Description block** — image left, longform copy right
5. **Ingredients section** — clean list, bone-warm bg
6. **Usage section** — dosering / wanneer / duur in 3 columns
7. **Timeline** — 4 stages of the ritual (Day 1-7, 8-14, etc.) on moss bg
8. **Reviews** — 3 review cards
9. **FAQ** — product-specific questions
10. **Cross-sell** — 2 related products
11. **Footer**

### FAQ page
- Hero with centered eyebrow ornament
- Questions grouped in **categories** (e.g., "Over onze supplementen", "Resultaat & ritueel", "Productie & herkomst")
- Each question: clickable to expand, + → × toggle
- Bottom: contact CTA in moss-deep with "Staat je vraag er niet bij?"

### Founder/About page
- Personal hero with founder photo
- Editorial text in chapters (I, II, III) with roman numerals
- Philosophy grid (6 belief blocks)
- Closing quote on moss-deep bg

---

## 11. Don'ts (anti-patterns we've learned to avoid)

❌ **Bouncy card hovers** — no `translateY` on cards
❌ **Scaled numerals on hover** — let them sit still
❌ **Growing arrows** that resize the card (use opacity instead)
❌ **Too many golds** — gold is punctuation, not a fill
❌ **Centered alignment for long copy** — left-align body text
❌ **Bold serif headings** — never bold Cormorant Garamond
❌ **Emoji as design** — text labels and SVG icons only
❌ **Drop shadows on text** — except over images
❌ **Drogist-style "% OFF" or urgency labels** — anti-luxury
❌ **Hero copy >12 words** — keep it short and lyrical
❌ **Generic stock photos** — only the curated brand photography

---

## 12. Recommended next visual improvements

If you (Claude Code) are looking for what to polish:

1. **Hero mobile composition** — ensure the editorial image+text balance works at every screen size
2. **Magazine-split image cropping** — check that focal points are visible in all aspect ratios
3. **Loading states** — subtle skeleton loaders in bone-warm
4. **Page transitions** — gentle fade between routes (not slide, not scale)
5. **Empty states** — empty cart, empty wishlist — use Cormorant italic copy
6. **Toasts/notifications** — bone bg, gold accent, never red/green alert colors
7. **404 page** — opportunity for a beautiful "Het verhaal gaat verder elders" moment
8. **Form validation** — inline errors in moss color (not red)
9. **Cookie banner** — minimal, in bone bg, sjieke language ("Wij gebruiken cookies — sober en functioneel")

---

## 13. Quick reference cheat sheet

```css
/* The 5 colors you'll use 90% of the time */
--bone:        #f6f1e8;
--ink:         #1c1c1a;
--ink-soft:    #5a5a55;
--moss:        #2d3e2f;
--gold:        #b8924a;

/* The 2 fonts */
--font-display: 'Cormorant Garamond', serif;  /* headings */
--font-body:    'Inter Tight', sans-serif;    /* everything else */

/* The 1 easing */
cubic-bezier(0.2, 0.8, 0.2, 1)

/* The 1 duration baseline */
0.5s for most transitions
1.2s for image zooms
0.8s for fade-ups

/* The italic move */
<h2>Welk ritueel past bij <em>jou</em>?</h2>
/* with: em { font-style: italic; color: var(--moss); } */
```

---

## 14. Final word

This is a **premium beauty brand**. Every pixel decision should pass the test:

> *"Would Susanne Kaufmann's design team approve of this?"*

If the answer is "probably not, this feels like a drugstore", reconsider. Less is more. Slower is more luxurious. Italic in gold is the signature. Romeinse cijfers tell a story. Witruimte is een waarde.

Build with restraint. Reward attention.

---

*— End of design system handoff*
