# YummyFit — Homepage (Pre-Launch)

High-conversion, single-page homepage built from the YummyFit wireframe.
Static HTML/CSS/JS — no build step required.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```bash
python -m http.server 4173
# then visit http://localhost:4173
```

## Files

| File          | Purpose                                        |
| ------------- | ---------------------------------------------- |
| `index.html`  | All 10 sections + inline SVG icon sprite        |
| `styles.css`  | Design system, layout, animations, responsive   |
| `script.js`   | Scroll reveals, nav, count-ups, waitlist form   |
| `assets/`     | Drop `hero.mp4` here (gradient fallback if absent) |

## Sections

1. **Hero** — headline, subheadline, 2 CTAs, animated hub + 4 pillars, micro-trust line
2. **The Problem** — 3 frustration cards with quotes
3. **The Solution** — hub → four pillars animation (Fitness / Nutrition / Shopping / Coaching)
4. **Product Glimpses** — 6 animated mock-UI tiles
5. **Differentiator** — comparison table with highlighted YummyFit column
6. **Who It's For** — 4 persona cards
7. **Social Proof** — count-up stats, tester quotes, press/partner logo placeholders
8. **Monetization Teaser** — Free / Premium / Founding Member plan cards (no prices)
9. **Waitlist CTA** — name + email + willingness-to-pay form with success state
10. **Footer** — About / Privacy / Terms / Contact, socials, © 2026 YummyFit

## Notes

- The waitlist form validates client-side and stores submissions in
  `localStorage` (`yummyfit_waitlist`) as a pre-launch placeholder — wire it to
  your real endpoint (Formspree, ConvertKit, your API) in `script.js`.
- Fully responsive (mobile nav included) and honors `prefers-reduced-motion`.
- Fonts: Plus Jakarta Sans + Inter via Google Fonts.
