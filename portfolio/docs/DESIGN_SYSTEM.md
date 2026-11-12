# Design system

Source: `src/app/globals.css` (tokens, themes, primitives, motion). Section styles: `chrome.css`, `home.css`, `pages.css`, `ai.css`.

## Identity
- **Palette:** deep midnight navy, warm editorial off-white, intelligent teal, muted slate, soft cyan; restrained violet for creative work.
- **Type:** Bricolage Grotesque (display), Geist Sans (body and interface), Geist Mono (status, metadata, citations). All self-hosted — no third-party font requests.
- **Rhythm:** dark opening → light editorial narrative → immersive dark project moment → light reading areas → high-contrast close.

## Tokens
- **Colour roles:** `--bg`, `--bg-alt`, `--surface`, `--surface-raised`, `--text`, `--text-2`, `--text-muted`, `--border`, `--border-strong`, `--accent`, `--a-learning`, `--a-product`, `--a-creative`, `--a-ai`, `--success`, `--warning`, `--error`, `--focus`
- **Spacing:** 4-point scale `--s-1`…`--s-32`; modes `--space-compact`, `--space-standard`, `--space-comfortable`, `--space-editorial`
- **Type scale (fluid):** `--t-display`, `--t-h1`, `--t-h2`, `--t-h3`, `--t-sub`, `--t-body`, `--t-small`, `--t-label`, `--t-caption`
- **Radius:** `--r-sm`, `--r-md`, `--r-lg`, `--r-full`
- **Depth:** `--depth-flat`, `--depth-raised`, `--depth-floating`, `--depth-immersive`
- **Motion durations:** `--d-instant`, `--d-fast`, `--d-standard`, `--d-deliberate`, `--d-cinematic`
- **Easing:** `--e-interface`, `--e-entrance`, `--e-exit`, `--e-emphasis`, `--e-spring`
- **Breakpoints:** 360, 480, 768, 1024, 1280, 1600

## Themes and modes
`data-theme="light|dark"` on `<html>` (resolved before first paint from the visitor's choice or system setting). `.tone-ink` forces the deep dark surface for a section in either theme; `.tone-alt` gives the alternate surface. `prefers-contrast: more` strengthens text and borders. `forced-colors` is supported. `data-motion="reduced"` or the OS setting removes animation.

## Primitives
Button (`.btn` + `--primary|--ghost|--quiet|--sm`), text link (`.link`), status badge (`.badge[data-status]`), capability chip (`.chip`), evidence label (`.evidence[data-e]`), placeholder (`.placeholder`), card (`.card`), metric block (`.metric__*`), section heading (`.section-head`, `.eyebrow`), form field (`.field`, `.input`), segmented control for filters, theme control and role-view selector (`.segmented`), modal and drawer (`dialog.modal`, `dialog.drawer`), command palette, toast, skeleton, empty/error state (`.state`), switch, timeline item, AI response card, source citation and chat message (`ai.css`).

## Motion principles
Motion shows hierarchy, connection and progression. One WebGL moment (the homepage systems visualization); everything else is CSS or the Web Animations API. No scroll hijacking, no autoplaying loops without a pause control, no motion on mobile cursors. Every animated element is fully visible with motion off, JavaScript off, or WebGL unavailable.
