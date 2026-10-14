# 🚀 IUS Engineering Club — Student Innovations Portfolio

[![Build & Sync Pipeline](https://github.com/HasanKaan28/ius-engineering-events-site/actions/workflows/update-projects.yml/badge.svg)](https://github.com/HasanKaan28/ius-engineering-events-site/actions/workflows/update-projects.yml)
[![Pages Deployment](https://img.shields.io/badge/GitHub%20Pages-Live%20Site-success?style=flat&logo=github)](https://hasankaan28.github.io/ius-engineering-events-site/projects/)
[![Tech Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20ES6%2B-blue)](https://hasankaan28.github.io/ius-engineering-events-site/projects/)
[![AI Integration](https://img.shields.io/badge/AI-NVIDIA%20LLaMA%203.3%20%26%20SD%203.5-76B900?logo=nvidia)](https://build.nvidia.com)

Welcome to the official student engineering innovation portfolio of the **IUS Engineering Club** at the **International University of Sarajevo (IUS)**.

Explore our flagship student engineering initiatives, IoT power stations, campus digital cafeteria systems, 24-hour hackathons, and hands-on AI laboratories developed by Faculty of Engineering and Natural Sciences (**FENS**) students.

🌐 **Live Website:** [https://hasankaan28.github.io/ius-engineering-events-site/projects/](https://hasankaan28.github.io/ius-engineering-events-site/projects/)

---

## 📖 Projeye Katkıda Bulunacaklar İçin Kılavuz (Geliştirici Rehberi)

> ⚠️ **ÖNEMLİ:** Bu projede kod yazmadan, tasarım değiştirmeden veya yeni bir özellik eklemeden önce lütfen **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** dosyasını baştan sona okuyunuz. Projenin mimarisini ve **KESİNLİKLE YAPILMAMASI GEREKEN KURALLARI** içerir.

👉 **Detaylı Kılavuz:** [DEVELOPER_GUIDE.md — Geliştirici Kılavuzu & Katkı Kuralları](DEVELOPER_GUIDE.md)

---

## ⚡ Temel Özellikler (Highlights)

- **Tek Gerçek Kaynağı (Single Source of Truth):** Hiçbir proje kartı HTML içine elle yazılmaz. Tüm veriler `data/projects.json` dosyasından dinamik olarak çekilir ve semantik `<article>` kartları olarak render edilir.
- **Otonom Veri & AI Hattı:** [Google Formu](https://docs.google.com/forms/d/e/1FAIpQLSeZ3RHZbw2BMaboNw4yS0xLALOv4KXzXdAg1gyF-434rMP5Ew/viewform) doldurulan her proje, GitHub Actions tarafından periyodik olarak çekilir; NVIDIA LLaMA 3.3 70B ile İngilizceye çevrilir; NVIDIA Stable Diffusion 3.5 Large ile 16:9 konsept görseli üretilir ve **doğrudan canlı yayına alınır**.
- **Çift Dil Desteği (i18n):** İngilizce (varsayılan) ve Türkçe arasında tek tıkla pürüzsüz anlık geçiş.
- **5 Resmi Renk Paleti:** Gothic noir, Cobalt sky, Chili spice, Ink wash ve Urban loft temaları.
- **Gelişmiş Web Audio API:** Tarayıcı yerel ses motoruyla çalışan fütüristik kullanıcı arayüzü ses efektleri.
- **Kusursuz Mobil Deneyim:** Dynamic Island / çentik uyumlu (`viewport-fit=cover`), 16px form koruması, 44px+ dokunmatik hedefler ve hikaye formatında görsel öncelikli kart dizilimi.
- **Sıfır Ağır Bağımlılık (Zero Bloat):** React, Vue, Tailwind veya harici CSS/JS kütüphanesi kullanılmaz; saf Vanilla teknolojilerle 60 FPS performans sunar.

---

## 📁 Proje Dizin Yapısı

```plaintext
├── .github/workflows/       # Otonom CI/CD derleme ve canlı yayın iş akışı
├── assets/                  # Kök dizin varlıkları & 16:9 WebP konsept renderları
├── data/                    # projects.json, projects.xlsx ve AI raporları
├── projects/                # Ana vitrin uygulaması (index.html, style.css, app.js)
├── scripts/                 # Python veri boru hattı ve görsel prompt motoru
├── DEVELOPER_GUIDE.md       # Detaylı geliştirici rehberi ve katı kurallar
└── README.md                # Depo genel tanıtımı
```

---

## 💻 Yerel Geliştirme (Quick Start)

Statik bir sunucu ile projeyi anında yerel ortamınızda çalıştırabilirsiniz:

```powershell
# Proje kök dizininde sunucu başlatın:
python -m http.server 8099
```

Tarayıcınızda açın:
- **Projeler Vitrini:** [http://localhost:8099/projects/](http://localhost:8099/projects/)

Python pipeline'ını test etmek için (harici API çağrısı yapmadan):
```powershell
python scripts/build_projects.py --dry-run
```

---

## 🤝 Yeni Proje Önermek İster misiniz?

IUS öğrencileri yeni fikir ve projelerini form üzerinden doğrudan sisteme gönderebilir:
📝 **[Proje Fikri Başvuru Formu (Google Forms)](https://docs.google.com/forms/d/e/1FAIpQLSeZ3RHZbw2BMaboNw4yS0xLALOv4KXzXdAg1gyF-434rMP5Ew/viewform)**

---

*International University of Sarajevo (IUS) — Faculty of Engineering and Natural Sciences (FENS)*  
*IUS Engineering Club (IEC)*
