# 🚀 IUS Engineering Club — Student Innovations Portfolio

[![Build & Sync Pipeline](https://github.com/HasanKaan28/ius-engineering-events-site/actions/workflows/update-projects.yml/badge.svg)](https://github.com/HasanKaan28/ius-engineering-events-site/actions/workflows/update-projects.yml)
[![Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Live%20Site-success?style=flat&logo=github)](https://hasankaan28.github.io/ius-engineering-events-site/projects/)
[![Tech Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20ES6%2B-blue)](https://hasankaan28.github.io/ius-engineering-events-site/projects/)
[![AI Integration](https://img.shields.io/badge/AI-NVIDIA%20LLaMA%203.3%20%26%20SD%203.5-76B900?logo=nvidia)](https://build.nvidia.com)

Welcome to the official student engineering innovation portfolio of the **IUS Engineering Club** at the **International University of Sarajevo (IUS)**.

Explore our flagship student engineering initiatives, IoT power stations, campus digital cafeteria systems, 24-hour hackathons, and hands-on AI laboratories developed by Faculty of Engineering and Natural Sciences (**FENS**) students.

🌐 **Live Website:** [https://hasankaan28.github.io/ius-engineering-events-site/projects/](https://hasankaan28.github.io/ius-engineering-events-site/projects/)

---

## 📖 Guide for Contributors (Developer Guide)

> ⚠️ **IMPORTANT:** Before writing code, changing the design, or adding a new feature to this project, please read **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** from start to finish. It covers the project architecture and the **RULES THAT MUST NEVER BE BROKEN**.

👉 **Detailed Guide:** [DEVELOPER_GUIDE.md — Developer Guide & Contribution Rules](DEVELOPER_GUIDE.md)

---

## ⚡ Highlights

- **Single Source of Truth:** No project card is ever hand-written into the HTML. All data is pulled dynamically from `data/projects.json` and rendered as semantic `<article>` cards.
- **Autonomous Data & AI Pipeline:** Every project submitted through the [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSeZ3RHZbw2BMaboNw4yS0xLALOv4KXzXdAg1gyF-434rMP5Ew/viewform) is fetched periodically by GitHub Actions, translated into English with NVIDIA LLaMA 3.3 70B, given a 16:9 concept image generated with NVIDIA Stable Diffusion 3.5 Large, and **published straight to the live site**.
- **Bilingual Support (i18n):** Smooth, instant one-click switching between English (default) and Turkish.
- **5 Official Color Palettes:** Gothic noir, Cobalt sky, Chili spice, Ink wash, and Urban loft themes.
- **Advanced Web Audio API:** Futuristic UI sound effects powered by the browser's native audio engine.
- **Flawless Mobile Experience:** Dynamic Island / notch compatible (`viewport-fit=cover`), 16px form protection, 44px+ touch targets, and an image-first, story-style card layout.
- **Zero Bloat:** No React, Vue, Tailwind, or external CSS/JS libraries; pure Vanilla technologies deliver 60 FPS performance.

---

## 📁 Project Directory Structure

```plaintext
├── .github/workflows/       # Autonomous CI/CD build and live deployment workflow
├── assets/                  # Root-level assets & 16:9 WebP concept renders
├── data/                    # projects.json, projects.xlsx, and AI reports
├── projects/                # Main showcase application (index.html, style.css, app.js)
├── scripts/                 # Python data pipeline and image prompt engine
├── DEVELOPER_GUIDE.md       # Detailed developer guide and strict rules
└── README.md                # General repository overview
```

---

## 💻 Local Development (Quick Start)

You can run the project in your local environment instantly with a static server:

```powershell
# Start a server in the project root directory:
python -m http.server 8099
```

Open in your browser:
- **Projects Showcase:** [http://localhost:8099/projects/](http://localhost:8099/projects/)

To test the Python pipeline (without making external API calls):
```powershell
python scripts/build_projects.py --dry-run
```

---

## 🤝 Want to Propose a New Project?

IUS students can submit their new ideas and projects directly to the system through the form:
📝 **[Project Idea Application Form (Google Forms)](https://docs.google.com/forms/d/e/1FAIpQLSeZ3RHZbw2BMaboNw4yS0xLALOv4KXzXdAg1gyF-434rMP5Ew/viewform)**

---

*International University of Sarajevo (IUS) — Faculty of Engineering and Natural Sciences (FENS)*  
*IUS Engineering Club (IEC)*
