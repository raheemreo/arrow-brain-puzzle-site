# Arrow Brain Puzzle — Official GitHub Pages Website

This repository contains the complete, production-ready static website for the Android mobile game **Arrow Brain Puzzle**, developed by **REO Technologies**.

Built with semantic **HTML5, CSS3 (Vanilla design system with glassmorphism), and lightweight zero-dependency JavaScript**, this site is optimized for **GitHub Pages**, mobile responsiveness, Google Play Console policy compliance, SEO, and fast load times.

---

## 🌐 Public Live URLs

Once deployed to GitHub Pages, the public URLs for your store listings and app screens are:

| Resource | Public Live URL | Where to Use |
| :--- | :--- | :--- |
| **Website Homepage** | `https://raheemreo.github.io/arrow-brain-puzzle-site/` | Store Listing Website URL, Socials |
| **Privacy Policy** | `https://raheemreo.github.io/arrow-brain-puzzle-site/privacy.html` | Google Play Console &rarr; App Content &rarr; Privacy Policy, In-App Settings |
| **Terms of Service** | `https://raheemreo.github.io/arrow-brain-puzzle-site/terms.html` | In-App Terms link, Google Play store description |
| **Data Deletion Policy** | `https://raheemreo.github.io/arrow-brain-puzzle-site/data-deletion.html` | Google Play Console Data Safety (Data deletion request URL) |
| **Player Support** | `https://raheemreo.github.io/arrow-brain-puzzle-site/contact.html` | Store Listing Support URL, In-App Help button |

---

## 📁 Project Structure

```text
arrow_puzzle_website/
│
├── index.html          # Main landing page (Hero, Demo, Features, How to Play, Screenshots, Play Store CTA)
├── privacy.html        # Google Play Data Safety compliant Privacy Policy
├── terms.html          # Terms of Service (Virtual currency, Hints, Rewarded ads disclosures)
├── data-deletion.html  # Google Play compliant User Data Deletion Request page
├── contact.html        # Support page with diagnostic email template and direct mailto link
├── 404.html            # Custom game-themed 404 page ("This arrow went the wrong way")
├── style.css           # Vanilla CSS Design System (Deep Navy, Cyber Cyan, Purple, Glassmorphism)
├── script.js           # Lightweight vanilla JS (Accessible mobile menu, interactive demo, year updater)
├── README.md           # Deployment documentation and URL guide
└── assets/
    ├── icons/          # Vector SVG & WebP icons (App icon, directional arrows, Play Store icon)
    └── images/         # Official in-game screenshots
```

---

## 🚀 Local Preview

You can preview the website locally using any simple web server or by opening `index.html` directly in your browser:

### Option 1: Python Built-in Server
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

### Option 2: Node.js `npx serve`
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## 📤 GitHub & GitHub Pages Deployment Guide

Follow these steps to publish the website directly to GitHub Pages:

### Step 1: Initialize Git and Commit Files
Open your terminal in this directory:

```bash
git init
git add .
git commit -m "Initial Arrow Brain Puzzle website"
git branch -M main
```

### Step 2: Add Remote and Push to GitHub
Create a new public repository named `arrow-brain-puzzle-site` on GitHub under your account (`raheemreo`), then run:

```bash
git remote add origin https://github.com/raheemreo/arrow-brain-puzzle-site.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub: `https://github.com/raheemreo/arrow-brain-puzzle-site`
2. Click **Settings** (tab at the top).
3. In the left sidebar, click **Pages** (under "Code and automation").
4. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main`
   - **Folder**: Select `/ (root)`
5. Click **Save**.
6. Wait 1–2 minutes. GitHub Pages will display your live site at:
   `https://raheemreo.github.io/arrow-brain-puzzle-site/`

---

## 🔧 Pre-Configured Variables & Placeholders

The website has been configured with the following production values:

- **App Name:** Arrow Brain Puzzle
- **Developer Name:** REO Technologies
- **App Package Name:** `com.reotech.arrow_brain_puzzle`
- **Google Play URL:** `https://play.google.com/store/apps/details?id=com.reotech.arrow_brain_puzzle`
- **Support Email:** `reodevelopers@gmail.com`
- **Website Base URL:** `https://raheemreo.github.io/arrow-brain-puzzle-site/`
- **Effective Date:** August 16, 2026

### In-Game Screenshots Included:
The website showcases 8 real in-game screenshots representing key features of Arrow Brain Puzzle:
1. `assets/images/screenshot-home.jpeg` — Main Menu & Daily Streak
2. `assets/images/screenshot-game-screen.jpeg` — Strategic Puzzle Board
3. `assets/images/screenshot-levels.jpeg` — Progressive Level Map
4. `assets/images/screenshot-daily-challenge.jpeg` — Daily Brain Workout
5. `assets/images/screenshot-trophies.jpeg` — Achievements & Trophies
6. `assets/images/screenshot-leagues.jpeg` — Competitive Leagues
7. `assets/images/screenshot-coin-shop.jpeg` — Coin Shop & Boosters
8. `assets/images/screenshot-settings.jpeg` — Game Settings & Privacy

---

## 📱 Google Play Console Integration Checklist

1. **Privacy Policy Link:**
   - In Google Play Console &rarr; **Policy and programs** &rarr; **App content** &rarr; **Privacy policy**, enter:
     `https://raheemreo.github.io/arrow-brain-puzzle-site/privacy.html`
2. **Store Listing Contact Details:**
   - In Google Play Console &rarr; **Store presence** &rarr; **Store settings** &rarr; **Store listing contact details**:
     - **Email address:** `reodevelopers@gmail.com`
     - **Website:** `https://raheemreo.github.io/arrow-brain-puzzle-site/`
3. **In-App Policy & Support Links:**
   - In your Flutter/Android app's Settings screen, link your Privacy button directly to `https://raheemreo.github.io/arrow-brain-puzzle-site/privacy.html`.
   - Link your Terms button to `https://raheemreo.github.io/arrow-brain-puzzle-site/terms.html`.
   - Link your Support button to `https://raheemreo.github.io/arrow-brain-puzzle-site/contact.html`.

---

## 📄 License & Credits
&copy; 2026 REO Technologies. All rights reserved.
Developed for the official release of **Arrow Brain Puzzle**.
