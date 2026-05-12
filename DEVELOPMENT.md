# 🕹️ PacsArcade.com — Development Plan & Status

> **Last Updated:** 2026-05-12
> **Repo:** [PacsArcade/pacsarcade-com](https://github.com/PacsArcade/pacsarcade-com)
> **Domain:** pacsarcade.com
> **Hosting:** Netlify
> **Local Dev Path:** `c:\PacsArcade\random\website` (or wherever cloned)

---

## Project Overview

PacsArcade.com is the main link-in-bio / landing page for the Pac's Arcade brand. It serves as a hub linking to all social profiles, the crowdfunding platform (.org), Discord, and personal "About Pac" content. The design follows a dark-mode brutalist aesthetic with retro arcade typography.

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Static HTML/CSS** | No build step, no framework |
| Styling | **Vanilla CSS** | Single shared `styles.css` |
| Fonts | **Press Start 2P** + **Inter** | Google Fonts CDN |
| Hosting | **Netlify** | Deployed from this repo |
| Twitch | **Twitch Embed API** | Auto-shows player when live on `aboutpac.html` |

---

## Site Structure

```
website/
├── index.html              # Main landing page (link-in-bio hub)
├── aboutpac.html            # "About Pac" / AdminPacman personal links + bio + Twitch embed
├── pacs-arcade-links.html   # Pac's Arcade brand social links (Twitter, Instagram, YouTube)
├── styles.css               # Shared stylesheet (dark brutalist theme)
├── assets/
│   ├── pacsarcde-banner-og.png   # OG image for social sharing
│   └── retronoid/                # Retronoid game assets
├── .gitignore
└── DEVELOPMENT.md           # This file
```

### Pages

| Page | URL | Purpose |
|------|-----|---------|
| `index.html` | `/` | Main hub — links to .org, Discord, subpages |
| `aboutpac.html` | `/aboutpac` | AdminPacman bio, social links, Twitch embed (auto-show when live) |
| `pacs-arcade-links.html` | `/pacs-arcade-links` | Pac's Arcade brand social links |

---

## Design System

- **Background:** Dark mode (`#111` or similar)
- **Primary Font:** "Press Start 2P" — retro arcade pixel font
- **Body Font:** "Inter" — clean modern sans-serif
- **Theme:** Dark brutalist — bold colors, hard edges, emoji icons as button accents
- **Navigation:** Joystick-style 🕹️ back buttons
- **Twitch Integration:** Auto-collapsing Twitch player (shows only when AdminPacman is live)
- **Twitch Parent Domains:** `localhost`, `127.0.0.1`, `pacsarcade.com`, `www.pacsarcade.com`

---

## ✅ Completed Work

- [x] Three-page link-in-bio site (index, aboutpac, pacs-arcade-links)
- [x] Dark brutalist CSS theme with retro arcade typography
- [x] Twitch auto-embed on aboutpac page (shows when live)
- [x] Joystick 🕹️ navigation between pages
- [x] OG banner image for social sharing
- [x] Retronoid game assets
- [x] Deployed to Netlify
- [x] Pushed to GitHub ✅

---

## 🔲 Remaining Work / Planned Improvements

### Design & UX
- [ ] Modernize the overall aesthetic (current design is functional but basic)
- [ ] Add hover animations / micro-interactions to link buttons
- [ ] Responsive polish (test all breakpoints)
- [ ] Add a proper favicon (retro arcade themed)
- [ ] Update copyright year from 2022 to current

### Content & Features
- [ ] Add Retronoid game embed or link
- [ ] Consider adding a news/updates section
- [ ] Blog or changelog page

### Technical
- [ ] Consider migrating to a framework (if features grow complex)
- [ ] Set up Netlify auto-deploy from GitHub (if not already configured)
- [ ] Add meta descriptions and structured data for SEO

---

## Sister Projects

| Domain | Repo | Purpose |
|--------|------|---------|
| **pacsarcade.com** | `PacsArcade/pacsarcade-com` | This repo — link-in-bio hub |
| **pacsarcade.org** | `PacsArcade/pacsarcade-org` | Crowdfunding platform (Next.js on Plesk) |
| **pacsarcade.net** | TBD | Game server dashboard — live game status, player counts, AMP panel access |
| **degenwonderland.com** | `Degen-Wonderland/dw-com` | Bitcoin Ordinal minting (Next.js) |

---

## Getting Started

```bash
# Clone
git clone https://github.com/PacsArcade/pacsarcade-com.git
cd pacsarcade-com

# No build step needed — just open index.html in a browser
# Or use a local server:
npx serve .
```
