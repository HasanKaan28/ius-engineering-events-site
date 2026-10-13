/**
 * IUS Engineering Club — Innovation Projects Showcase Engine
 * Single Source of Truth: data/projects.json via async fetch
 * WCAG 2.2 AA Focus Management & Screen Reader Announcements
 * High Performance WebP / Srcset Image Engine with Zero-CLS
 * Multilingual SEO, Deep Linking (#slug), & Maintainer Admin Preview
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // SECURITY & ARCHITECTURE NOTE:
  // '?admin=true' is purely a client-side interface toggle for maintainers, NOT
  // an authentication or security boundary. In GitHub Pages (static hosting),
  // any modifications made in admin mode are scoped strictly to the local
  // browser's localStorage. They will NEVER propagate to other visitors.
  // The only mechanism to persist changes globally is for maintainers to
  // download/copy the updated JSON and commit it to the repository.
  // --------------------------------------------------------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get('admin') === 'true';

  // --------------------------------------------------------------------------
  // 1. DICTIONARY & I18N
  // --------------------------------------------------------------------------
  const I18N = {
    tr: {
      sound_label: "Ses: Kapalı",
      sound_on: "Ses: Açık",
      all_projects: "Önerilen Projeler",
      btn_submit_idea: "Fikir Gönder",
      hero_title_1: "Kampüsü Değiştirecek",
      hero_title_2: "Önerilen Proje Fikirleri.",
      hero_subtitle: "Öğrencilerimiz tarafından hazırlanan, kampüsümüzü ve öğrenci deneyimini geliştirmesi hedeflenen proje fikirleri. FENS amfilerinden teknoloji ekosistemine uzanan donanım, yapay zeka ve yazılım önerilerimiz.",
      hero_explore: "Fikirleri İncele",
      stat_projects_label: "Önerilen Proje",
      stat_categories_label: "Proje Alanı",
      scroll_hint: "Aşağı Kaydırın",
      skip_to_content: "İçeriğe Doğrudan Geç",
      drawer_title: "Proje Kataloğu",
      drawer_subtitle: "Önerilen Proje Fikirleri — Doğrudan istediğiniz inovasyona atlayın",
      search_placeholder: "Proje, kategori veya etiket ara...",
      sort_label: "Sırala:",
      sort_default: "Varsayılan Sıra",
      sort_diff_desc: "Zorluk (En Yüksek)",
      sort_diff_asc: "Zorluk (En Düşük)",
      sort_sponsor: "Sponsor Durumu",
      filter_all: "Tümü",
      loading_projects: "Proje fikirleri yükleniyor...",
      error_loading: "Projeler yüklenemedi, sayfayı yenileyin",
      btn_retry: "Yeniden Dene",
      btn_inspect_detail: "Detayları İncele",
      btn_copy_link: "Bağlantıyı Kopyala",
      btn_support_project: "Bu Projeye Katıl / Destek Ol",
      first_step_heading: "Planlanan İlk Somut Adım",
      specs_heading: "Teknik Parametreler & Planlanan Altyapı",
      edit_modal_title: "Projeyi Düzenle (Yönetici Modu)",
      edit_modal_desc: "Metinleri, sponsorluk durumunu, görselleri ve teknik parametreleri anında değiştirin.",
      label_title_tr: "Başlık (Türkçe)",
      label_title_en: "Title (English)",
      label_tagline_tr: "Slogan / Kısa Açıklama (Türkçe)",
      label_tagline_en: "Tagline (English)",
      label_category_tr: "Kategori (TR)",
      label_author: "Öneren / Yazar",
      label_sponsor_status: "Sponsor Durumu",
      label_project_status: "Proje Durumu",
      label_difficulty: "Zorluk Seviyesi (1 - 5)",
      label_owner: "Proje Sorumlusu / Ekip (TR)",
      label_palette: "Renk Paleti (5 Resmi Seçenek)",
      label_gallery: "Konsept Görsel Seçimi",
      ph_custom_url: "veya Özel Görsel URL'si yapıştırın...",
      label_problem_tr: "Problem / Gerekçe (Türkçe)",
      label_problem_en: "Problem / Motivation (English)",
      label_solution_tr: "Önerilen Çözüm & Mühendislik İşleyişi (Türkçe)",
      label_solution_en: "Proposed Solution & Technical Operation (English)",
      label_first_step_tr: "İlk Somut Adım (Türkçe)",
      label_first_step_en: "First Concrete Step (English)",
      btn_reset: "Varsayılana Sıfırla",
      btn_copy_json: "JSON Kopyala",
      btn_download_json: "projects.json İndir",
      btn_save_changes: "Önizlemeyi Kaydet",
      card_problem_title: "Problem & İhtiyaç",
      card_solution_title: "Mühendislik Çözümü",
      btn_edit: "Düzenle",
      btn_share: "Paylaş",
      toast_copied: "Proje derin bağlantısı (#slug) panoya kopyalandı!",
      toast_saved: "Önizleme güncellendi (Yalnızca bu tarayıcıda kayıtlı)!",
      toast_json_copied: "projects.json verisi panoya kopyalandı! Repoya commit edebilirsiniz.",
      toast_json_downloaded: "projects.json başarıyla indirildi. Repoya commit ediniz.",
      toast_reset: "Proje orijinal repodaki ayarlara sıfırlandı!",
      title_sound: "Ses Aç/Kapat",
      title_palette: "Genel Renk Paleti",
      title_submit: "Yeni Proje / Fikir Gönder",
      title_switch_palette: "Renk Paletini Değiştir",
      theme_changed: "Genel tema:",
      admin_banner_text: "Yönetici Modu Aktif (Önizleme). Değişiklikler yalnızca bu tarayıcıda geçerlidir; kalıcı olması için JSON'u indirip repoya commit edin.",
      btn_exit_admin: "Normal Görünüme Dön",
      status_label_prefix: "Durum:",
      sponsor_label_prefix: "Sponsor:",
      sr_lang_changed: "Sayfa dili Türkçe olarak ayarlandı.",
      footer_affiliation: "Uluslararası Saraybosna Üniversitesi (IUS) Mühendislik ve Doğa Bilimleri Fakültesi (FENS) Öğrenci Kulübü Portfolyosu.",
      footer_back_to_top: "Yukarı Dön",
      about_nav_link: "Hakkımızda",
      about_badge: "Kulüp Vizyonu & Topluluk",
      about_title_1: "Geleceği Birlikte",
      about_title_2: "İnşa Ediyoruz.",
      about_subtitle: "Uluslararası Saraybosna Üniversitesi Mühendislik ve Doğa Bilimleri Fakültesi (FENS) bünyesinde; teorik eğitimi kampüsün ihtiyaçlarına ve küresel mühendislik vizyonuna uygun somut projelere dönüştüren öğrenci inovasyon topluluğu.",
      about_pillar_1_title: "Donanım & Kampüs IoT",
      about_pillar_1_desc: "Öğrenci kartı (RFID) entegrasyonlu akıllı dolaplar, otonom güç istasyonları ve mikrodenetleyici tabanlı kampüs donanımları.",
      about_pillar_2_title: "Yazılım & Yapay Zeka",
      about_pillar_2_desc: "Yemekhane canlı veri sistemleri, akran LLM ve modern araç laboratuvarları ile açık kaynak yazılım mimarileri.",
      about_pillar_3_title: "Ekosistem & Hackathonlar",
      about_pillar_3_desc: "Saraybosna teknoloji ekosistemi ile köprü, 48 saatlik DevHack yarışmaları ve mezun-öğrenci mentörlük ağı.",
      about_stat_members: "Aktif Üye & Geliştirici",
      about_stat_depts: "FENS Mühendislik Disiplini",
      about_stat_proposals: "Hazır Proje Önerisi",
      about_stat_initiative: "Öğrenci İnisiyatifi",
      about_cta_join: "Bu Vizyona Katıl / Fikir Gönder",
      about_cta_web: "IUS Resmi Web",
      page_seo_title: "IEC // Proje Fikirleri — IUS Mühendislik Kulübü",
      page_seo_desc: "International University of Sarajevo (IUS) Mühendislik Kulübü öğrenci proje fikirleri ve inovasyon portfolyosu. FENS öğrencileri tarafından tasarlanan donanım, IoT, yazılım ve yapay zeka önerileri."
    },
    en: {
      sound_label: "Sound: Muted",
      sound_on: "Sound: Active",
      all_projects: "Proposed Projects",
      btn_submit_idea: "Submit Idea",
      hero_title_1: "Campus Innovations",
      hero_title_2: "Proposed Project Ideas.",
      hero_subtitle: "Project proposals developed by engineering students to enhance campus life. Proposed hardware, AI, and software concepts from FENS lecture halls to the tech ecosystem.",
      hero_explore: "Explore Proposals",
      stat_projects_label: "Proposed Projects",
      stat_categories_label: "Project Domains",
      scroll_hint: "Scroll Down",
      skip_to_content: "Skip directly to content",
      drawer_title: "Project Catalog",
      drawer_subtitle: "Proposed Project Ideas — Jump directly to any initiative",
      search_placeholder: "Search projects, categories or tags...",
      sort_label: "Sort by:",
      sort_default: "Default Order",
      sort_diff_desc: "Difficulty (Highest)",
      sort_diff_asc: "Difficulty (Lowest)",
      sort_sponsor: "Sponsor Status",
      filter_all: "All",
      loading_projects: "Loading proposed project ideas...",
      error_loading: "Projects could not be loaded, please reload the page",
      btn_retry: "Retry",
      btn_inspect_detail: "Inspect Details",
      btn_copy_link: "Copy Direct Link",
      btn_support_project: "Join / Support This Project",
      first_step_heading: "Planned First Concrete Milestone",
      specs_heading: "Technical Architecture & Proposed Specs",
      edit_modal_title: "Edit Project Specs (Maintainer Mode)",
      edit_modal_desc: "Modify copy, sponsorship status, renders, and engineering parameters.",
      label_title_tr: "Title (Turkish)",
      label_title_en: "Title (English)",
      label_tagline_tr: "Tagline / Summary (Turkish)",
      label_tagline_en: "Tagline (English)",
      label_category_tr: "Category (TR)",
      label_author: "Submitted By / Author",
      label_sponsor_status: "Sponsorship Status",
      label_project_status: "Project Status",
      label_difficulty: "Difficulty Level (1 - 5)",
      label_owner: "Project Lead / Team (TR)",
      label_palette: "Color Palette (5 Official Choices)",
      label_gallery: "Concept Visual Selection",
      ph_custom_url: "or paste custom Image URL...",
      label_problem_tr: "Problem / Motivation (Turkish)",
      label_problem_en: "Problem / Motivation (English)",
      label_solution_tr: "Proposed Solution & Engineering (Turkish)",
      label_solution_en: "Proposed Solution & Technical Operation (English)",
      label_first_step_tr: "First Concrete Step (Turkish)",
      label_first_step_en: "First Concrete Step (English)",
      btn_reset: "Reset to Default",
      btn_copy_json: "Copy JSON",
      btn_download_json: "Download projects.json",
      btn_save_changes: "Save Local Preview",
      card_problem_title: "Problem & Motivation",
      card_solution_title: "Engineering Solution",
      btn_edit: "Edit Project",
      btn_share: "Share",
      toast_copied: "Project deep link (#slug) copied to clipboard!",
      toast_saved: "Preview updated (Persisted strictly in local browser)!",
      toast_json_copied: "projects.json copied to clipboard! Ready to commit to repo.",
      toast_json_downloaded: "projects.json downloaded. Commit to repo to persist globally.",
      toast_reset: "Reset back to repository defaults!",
      title_sound: "Toggle Sound",
      title_palette: "Global Color Palette",
      title_submit: "Submit New Project / Idea",
      title_switch_palette: "Switch Color Palette",
      theme_changed: "Global theme:",
      admin_banner_text: "Maintainer Mode Active (Preview). Changes remain local to this browser; commit the downloaded JSON to persist globally.",
      btn_exit_admin: "Exit Admin View",
      status_label_prefix: "Status:",
      sponsor_label_prefix: "Sponsor:",
      sr_lang_changed: "Page language switched to English.",
      footer_affiliation: "International University of Sarajevo (IUS) Faculty of Engineering and Natural Sciences (FENS) Student Club Portfolio.",
      footer_back_to_top: "Back to Top",
      about_nav_link: "About Us",
      about_badge: "Club Vision & Community",
      about_title_1: "Engineering the Future,",
      about_title_2: "Together.",
      about_subtitle: "A student innovation collective within the International University of Sarajevo Faculty of Engineering and Natural Sciences (FENS); translating lecture theory into tangible campus projects and global engineering benchmarks.",
      about_pillar_1_title: "Hardware & Campus IoT",
      about_pillar_1_desc: "Smart RFID-integrated docks, portable energy stations, and microcontroller-driven autonomous campus hardware.",
      about_pillar_2_title: "Software & Artificial Intelligence",
      about_pillar_2_desc: "Real-time dining feeds, peer LLM study stations, and production-grade open-source software architectures.",
      about_pillar_3_title: "Ecosystem & Hackathons",
      about_pillar_3_desc: "Direct integration with the Sarajevo tech hub, 48-hour DevHack challenges, and structured student-alumni mentorship.",
      about_stat_members: "Active Members & Devs",
      about_stat_depts: "FENS Engineering Disciplines",
      about_stat_proposals: "Ready Project Proposals",
      about_stat_initiative: "Student-Led Initiative",
      about_cta_join: "Join This Vision / Submit Idea",
      about_cta_web: "IUS Official Portal",
      page_seo_title: "IEC // Innovation Showcase — IUS Engineering Portfolio",
      page_seo_desc: "Student engineering project proposals and innovation portfolio at International University of Sarajevo (IUS). Hardware, IoT, software and AI initiatives engineered by FENS students."
    }
  };

  // Runtime Specification Translations
  const SPEC_TRANSLATIONS = {
    'Mimari': { en: 'Architecture', tr: 'Mimari' },
    'Architecture': { en: 'Architecture', tr: 'Mimari' },
    'Doğrulama': { en: 'Authentication', tr: 'Doğrulama' },
    'Authentication': { en: 'Authentication', tr: 'Doğrulama' },
    'Güvenlik': { en: 'Safety', tr: 'Güvenlik' },
    'Safety': { en: 'Safety', tr: 'Güvenlik' },
    'Gövde': { en: 'Enclosure', tr: 'Gövde' },
    'Enclosure': { en: 'Enclosure', tr: 'Gövde' },
    'Şasi': { en: 'Chassis & Enclosure', tr: 'Şasi' },
    'Chassis & Enclosure': { en: 'Chassis & Enclosure', tr: 'Şasi' },
    'Platform': { en: 'Platform', tr: 'Platform' },
    'Veri Akışı': { en: 'Data Feed', tr: 'Veri Akışı' },
    'Data Feed': { en: 'Data Feed', tr: 'Veri Akışı' },
    'Veri Kaynağı': { en: 'Data Source', tr: 'Veri Kaynağı' },
    'Data Source': { en: 'Data Source', tr: 'Veri Kaynağı' },
    'Geliştirme': { en: 'Development', tr: 'Geliştirme' },
    'Development': { en: 'Development', tr: 'Geliştirme' },
    'Geliştirme Modeli': { en: 'Development Model', tr: 'Geliştirme Modeli' },
    'Development Model': { en: 'Development Model', tr: 'Geliştirme Modeli' },
    'Kapsam': { en: 'Scope', tr: 'Kapsam' },
    'Scope': { en: 'Scope', tr: 'Kapsam' },
    'İçerik': { en: 'Scope', tr: 'İçerik' },
    'Katılımcı': { en: 'Participants', tr: 'Katılımcı' },
    'Participants': { en: 'Participants', tr: 'Katılımcı' },
    'Süre': { en: 'Duration', tr: 'Süre' },
    'Duration': { en: 'Duration', tr: 'Süre' },
    'Ödül': { en: 'Prizes', tr: 'Ödül' },
    'Prizes': { en: 'Prizes', tr: 'Ödül' },
    'Mekân': { en: 'Venue', tr: 'Mekân' },
    'Venue': { en: 'Venue', tr: 'Mekân' },
    'Lokasyon': { en: 'Location', tr: 'Lokasyon' },
    'Location': { en: 'Location', tr: 'Lokasyon' },
    'Periyot': { en: 'Cadence', tr: 'Periyot' },
    'Cadence': { en: 'Cadence', tr: 'Periyot' },
    'Format': { en: 'Format', tr: 'Format' },
    'Kapasite': { en: 'Capacity', tr: 'Kapasite' },
    'Capacity': { en: 'Capacity', tr: 'Kapasite' },
    'Sertifika': { en: 'Certification', tr: 'Sertifika' },
    'Certification': { en: 'Certification', tr: 'Sertifika' },
    'Katılım': { en: 'Attendance', tr: 'Katılım' },
    'Attendance': { en: 'Attendance', tr: 'Katılım' },
    'Konuşmacılar': { en: 'Speakers', tr: 'Konuşmacılar' },
    'Speakers': { en: 'Speakers', tr: 'Konuşmacılar' },
    'Sergi': { en: 'Exhibition', tr: 'Sergi' },
    'Exhibition': { en: 'Exhibition', tr: 'Sergi' },
    'Kariyer': { en: 'Career Track', tr: 'Kariyer' },
    'Career Track': { en: 'Career Track', tr: 'Kariyer' }
  };

  // --------------------------------------------------------------------------
  // PALETTES DEFINITIONS (5 Authentic Palettes with Exact Hex Codes)
  // --------------------------------------------------------------------------
  const PALETTES = {
    'gothic-noir': {
      id: 'gothic-noir',
      name: 'Gothic noir',
      swatches: ['#09090B', '#16161C', '#C5C5CD', '#E2B85C']
    },
    'cobalt-sky': {
      id: 'cobalt-sky',
      name: 'Cobalt sky',
      swatches: ['#09090B', '#16161C', '#7E9BB8', '#E2B85C']
    },
    'chili-spice': {
      id: 'chili-spice',
      name: 'Chili spice',
      swatches: ['#09090B', '#16161C', '#B86B64', '#E2B85C']
    },
    'ink-wash': {
      id: 'ink-wash',
      name: 'Ink wash',
      swatches: ['#09090B', '#16161C', '#A8A69E', '#E2B85C']
    },
    'urban-loft': {
      id: 'urban-loft',
      name: 'Urban loft',
      swatches: ['#09090B', '#16161C', '#B08974', '#E2B85C']
    }
  };

  // --------------------------------------------------------------------------
  // 2. HTML SANITIZER & BADGE LOGIC
  // --------------------------------------------------------------------------
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Safely extract localized strings from multilingual objects, strings, or null/undefined
  function getLocalizedValue(obj, lang = currentLang) {
    if (!obj) return '';
    if (typeof obj === 'object') {
      return obj[lang] || obj.en || obj.tr || '';
    }
    return String(obj);
  }

  // Screen Reader Live Announcements (WCAG 2.2 AA)
  function announceToScreenReader(message) {
    const srEl = document.getElementById('sr-announcements');
    if (!srEl) return;
    srEl.textContent = '';
    setTimeout(() => {
      srEl.textContent = message;
    }, 50);
  }

  // Returns true if the badge value is null, undefined, blank, or unspecified
  function isUndeterminedBadge(val) {
    if (!val) return true;
    if (typeof val === 'object') {
      val = val[currentLang] || val.tr || val.en || '';
    }
    const s = String(val).trim().toLowerCase();
    return s === '' || s === 'belirlenmedi' || s === 'undetermined' || s === '-' || s === 'null' || s === 'undefined' || s === 'none' || s === 'belirtilmedi';
  }

  // Returns true ONLY if this project's status differs from the dominant/default status across all projects
  function shouldShowStatusBadge(project) {
    if (!project) return false;
    const statusVal = getLocalizedValue(project.status);

    if (isUndeterminedBadge(statusVal)) return false;

    // Tally status frequencies across projectsData
    const counts = {};
    projectsData.forEach(p => {
      const raw = p && p.status ? (typeof p.status === 'object' ? (p.status.tr || p.status.en || '') : String(p.status)) : '';
      if (!isUndeterminedBadge(raw)) {
        const key = raw.trim().toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    const keys = Object.keys(counts);
    // If all projects share the exact same status (e.g. all are "Öneri"), do not repeat the badge on cards
    if (keys.length <= 1) return false;

    // Find the baseline majority status
    let maxCount = 0;
    let majorityStatus = '';
    for (const k of keys) {
      if (counts[k] > maxCount) {
        maxCount = counts[k];
        majorityStatus = k;
      }
    }

    const currentKey = statusVal.trim().toLowerCase();
    return currentKey !== majorityStatus;
  }

  // --------------------------------------------------------------------------
  // 3. WCAG 2.2 AA FOCUS TRAP HELPER
  // --------------------------------------------------------------------------
  let currentFocusTrapCleanup = null;

  function trapFocus(containerEl, onEscape) {
    if (currentFocusTrapCleanup) {
      currentFocusTrapCleanup();
      currentFocusTrapCleanup = null;
    }
    if (!containerEl) return;

    const previousActiveElement = document.activeElement;
    const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function getFocusableElements() {
      return Array.from(containerEl.querySelectorAll(focusableSelector)).filter(el => {
        return (el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
      });
    }

    // Set initial focus to the first focusable element inside the modal
    setTimeout(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, 60);

    function handleKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (typeof onEscape === 'function') onEscape();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusableElements();
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !containerEl.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !containerEl.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    containerEl.addEventListener('keydown', handleKeydown);

    currentFocusTrapCleanup = () => {
      containerEl.removeEventListener('keydown', handleKeydown);
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        try {
          previousActiveElement.focus();
        } catch (err) {}
      }
      currentFocusTrapCleanup = null;
    };

    return currentFocusTrapCleanup;
  }

  // --------------------------------------------------------------------------
  // 4. PERFORMANCE: RESPONSIVE WEBP PICTURE BUILDER (Zero CLS)
  // --------------------------------------------------------------------------
  function getResponsiveImageMarkup(src, alt, isHero, idAttr) {
    const cleanSrc = escapeHtml(src);
    const cleanAlt = escapeHtml(alt);
    const fetchAttr = isHero ? 'fetchpriority="high" loading="eager"' : 'loading="lazy" decoding="async"';
    const idStr = idAttr ? `id="${idAttr}"` : '';

    if (src && src.endsWith('.webp') && !src.includes('-sm.webp')) {
      const smSrc = escapeHtml(src.replace(/\.webp$/, '-sm.webp'));
      return `
        <picture>
          <source type="image/webp" srcset="${smSrc} 688w, ${cleanSrc} 1376w" sizes="(max-width: 900px) 100vw, 55vw">
          <img ${idStr} src="${cleanSrc}" alt="${cleanAlt}" class="visual-image" width="1376" height="768" ${fetchAttr}>
        </picture>
      `;
    }
    return `<img ${idStr} src="${cleanSrc}" alt="${cleanAlt}" class="visual-image" width="1376" height="768" ${fetchAttr}>`;
  }

  // --------------------------------------------------------------------------
  // 5. STATE & STORAGE (Default: English; Turkish available as an option)
  // --------------------------------------------------------------------------
  const urlLangParam = new URLSearchParams(window.location.search).get('lang');
  let currentLang = (urlLangParam === 'tr' || urlLangParam === 'en')
    ? urlLangParam
    : (localStorage.getItem('iec_user_pref_lang') || 'en');
  let soundEnabled = false;
  let audioCtx = null;
  let activeSectionIndex = 0;
  let projectsData = [];
  let activeCategoryFilter = 'all';
  let activeSortMode = 'default';

  // --------------------------------------------------------------------------
  // 6. DATA LOADER (Single Source of Truth: data/projects.json)
  // --------------------------------------------------------------------------
  async function loadProjectsData() {
    const wrapper = document.getElementById('projects-wrapper');
    try {
      if (isAdmin) {
        const cachedCustom = localStorage.getItem('iec_projects_custom');
        if (cachedCustom) {
          const parsed = JSON.parse(cachedCustom);
          if (Array.isArray(parsed) && parsed.length > 0) {
            projectsData = parsed;
            onDataLoaded();
            return;
          }
        }
      }

      // Robust candidate URLs for GitHub Pages subpath and query versioning
      const candidateUrls = [
        './data/projects.json?v=4',
        'data/projects.json?v=4'
      ];
      if (window.location.pathname.includes('/projects')) {
        candidateUrls.push('/ius-engineering-events-site/projects/data/projects.json?v=4');
      }

      let data = null;
      let lastError = null;

      for (const url of candidateUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const parsed = await response.json();
            if (Array.isArray(parsed) && parsed.length > 0) {
              data = parsed;
              break;
            }
          } else {
            lastError = new Error(`HTTP ${response.status} (${url})`);
          }
        } catch (fetchErr) {
          lastError = fetchErr;
        }
      }

      if (!data) {
        throw lastError || new Error("Dataset is empty or could not be loaded");
      }

      projectsData = data;
      onDataLoaded();
    } catch (err) {
      console.error("Projeler yüklenemedi, sayfayı yenileyin:", err);

      const navCount = document.getElementById('nav-project-count');
      if (navCount) navCount.textContent = '!';
      const statProjects = document.getElementById('hero-stat-projects');
      if (statProjects) statProjects.textContent = '!';
      const statCategories = document.getElementById('hero-stat-categories');
      if (statCategories) statCategories.textContent = '!';

      if (wrapper) {
        wrapper.innerHTML = `
          <div class="projects-error-card" role="alert" style="text-align: center; padding: 48px 24px; margin: 40px auto; max-width: 520px; background: rgba(20, 20, 26, 0.85); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); backdrop-filter: blur(20px);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" aria-hidden="true" style="margin: 0 auto 16px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <h3 style="font-family: var(--font-heading); color: #FFFFFF; font-size: 1.25rem; margin-bottom: 8px;">${escapeHtml(I18N[currentLang].error_loading)}</h3>
            <p class="error-detail" style="color: var(--text-tertiary); font-size: 0.85rem; margin-bottom: 24px;">${escapeHtml(err.message)}</p>
            <button class="btn-glow-primary" id="btn-retry-load" style="margin: 0 auto;">
              <span>${escapeHtml(I18N[currentLang].btn_retry)}</span>
            </button>
          </div>
        `;
        document.getElementById('btn-retry-load')?.addEventListener('click', loadProjectsData);
      }
    }
  }

  function onDataLoaded() {
    updateHeroStats();
    populateCategoryFilters();
    renderAllProjects();
    populateDrawerList();
    handleDeepLinkHash();
  }

  // --------------------------------------------------------------------------
  // 7. HERO METRICS (Strictly Derived from Dataset: Projects & Categories)
  // --------------------------------------------------------------------------
  function updateHeroStats() {
    const statProjects = document.getElementById('hero-stat-projects');
    const statCategories = document.getElementById('hero-stat-categories');
    const navCount = document.getElementById('nav-project-count');

    if (projectsData.length === 0) return;

    const totalProjects = projectsData.length;
    const categoryCount = new Set(projectsData.map(p => {
      if (p.category && typeof p.category === 'object') return p.category.tr || p.category.en;
      return p.category || '';
    }).filter(Boolean)).size;

    if (navCount) navCount.textContent = totalProjects;

    animateCount(statProjects, totalProjects);
    animateCount(statCategories, categoryCount);
  }

  function animateCount(el, targetNum) {
    if (!el) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(targetNum * easeOut);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = targetNum;
      }
    }
    requestAnimationFrame(tick);
  }

  // --------------------------------------------------------------------------
  // 8. SOUND SYNTHESIZER (Web Audio API)
  // --------------------------------------------------------------------------
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playUiBeep(freq = 600, duration = 0.04) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    const pill = document.getElementById('audio-indicator');
    const label = pill ? pill.querySelector('.sound-label') : null;
    if (soundEnabled) {
      initAudio();
      if (pill) {
        pill.classList.add('active');
        pill.setAttribute('aria-pressed', 'true');
      }
      if (label) label.textContent = I18N[currentLang].sound_on;
      playUiBeep(880, 0.08);
      showToast(I18N[currentLang].sound_on);
    } else {
      if (pill) {
        pill.classList.remove('active');
        pill.setAttribute('aria-pressed', 'false');
      }
      if (label) label.textContent = I18N[currentLang].sound_label;
      showToast(I18N[currentLang].sound_label);
    }
  }

  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // --------------------------------------------------------------------------
  // 9. RENDER PROJECTS DOM (Semantic HTML & WCAG 2.2 AA)
  // --------------------------------------------------------------------------
  function renderAllProjects() {
    const wrapper = document.getElementById('projects-wrapper');
    const dotsList = document.getElementById('progress-dots-list');
    if (!wrapper || !dotsList) return;

    wrapper.innerHTML = '';
    dotsList.innerHTML = '';

    // Hero dot
    const heroDot = document.createElement('li');
    heroDot.className = 'dot-item active';
    heroDot.innerHTML = `
      <button class="dot-btn" aria-label="Hero"></button>
      <div class="dot-tooltip">00 // Intro</div>
    `;
    heroDot.addEventListener('click', () => {
      playUiBeep(520, 0.03);
      const hero = document.getElementById('hero');
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    });
    dotsList.appendChild(heroDot);

    projectsData.forEach((project, index) => {
      // Semantic <article> container for each project showcase
      const article = document.createElement('article');
      article.className = 'snap-section project-section';
      article.id = project.id || `project-${index}`;
      article.dataset.index = index + 1;
      article.dataset.projectId = project.id;
      article.setAttribute('aria-labelledby', `project-title-${index}`);

      // Palette Resolution
      const defaultPaletteCycle = ['gothic-noir', 'cobalt-sky', 'chili-spice', 'ink-wash', 'urban-loft'];
      const fallbackPalette = defaultPaletteCycle[index % defaultPaletteCycle.length];
      const savedPalette = localStorage.getItem('iec_palette_' + project.id) || project.palette || fallbackPalette;
      const currentPalConfig = PALETTES[savedPalette] || PALETTES['gothic-noir'];
      article.dataset.palette = currentPalConfig.id;

      const title = getLocalizedValue(project.title);
      const tagline = getLocalizedValue(project.tagline);
      const category = getLocalizedValue(project.category);
      const problem = getLocalizedValue(project.problem);
      const solution = getLocalizedValue(project.solution);
      const ownership = getLocalizedValue(project.ownership) || (project.author || '');
      
      const statusVal = getLocalizedValue(project.status);
      const sponsorVal = getLocalizedValue(project.sponsor_status);
      const difficulty = Math.max(1, Math.min(5, parseInt(project.difficulty, 10) || 3));

      // Build difficulty dots HTML
      const diffDots = Array.from({ length: 5 }, (_, d) => 
        `<span class="diff-dot ${d < difficulty ? 'filled' : ''}" aria-hidden="true"></span>`
      ).join('');

      // Status Badge: Only rendered if this project's status differs from the dominant/default status
      const statusBadgeHtml = shouldShowStatusBadge(project)
        ? `<span class="badge-status" title="${escapeHtml(I18N[currentLang].status_label_prefix)} ${escapeHtml(statusVal)}">${escapeHtml(I18N[currentLang].status_label_prefix)} ${escapeHtml(statusVal)}</span>`
        : '';
      // Sponsor Badge: Only rendered if sponsor is non-null and not undetermined
      const sponsorBadgeHtml = !isUndeterminedBadge(sponsorVal)
        ? `<span class="badge-sponsor" title="${escapeHtml(I18N[currentLang].sponsor_label_prefix)} ${escapeHtml(sponsorVal)}">${escapeHtml(I18N[currentLang].sponsor_label_prefix)} ${escapeHtml(sponsorVal)}</span>`
        : '';

      // Build specs
      const allSpecs = [];
      (project.specs || []).forEach(s => {
        let l = getLocalizedValue(s.label);
        let v = getLocalizedValue(s.value);
        if (SPEC_TRANSLATIONS[l]) {
          l = SPEC_TRANSLATIONS[l][currentLang] || l;
        }
        allSpecs.push({ label: l, value: v });
      });

      const specsHtml = allSpecs.slice(0, 4).map(s => `
        <div class="spec-cell">
          <span class="spec-name">${escapeHtml(s.label)}</span>
          <span class="spec-val">${escapeHtml(s.value)}</span>
        </div>
      `).join('');

      // Gallery Thumbs HTML with explicit dimensions & lazy loading
      const gallery = project.gallery && project.gallery.length > 0 ? project.gallery : [project.image];
      const galleryThumbsHtml = gallery.length > 1 ? gallery.map((imgSrc, gIdx) => `
        <button type="button" class="thumb-item ${gIdx === 0 ? 'active' : ''}" data-src="${escapeHtml(imgSrc)}" aria-label="Thumbnail ${gIdx + 1}">
          <img src="${escapeHtml(imgSrc)}" alt="" width="96" height="54" loading="lazy" decoding="async">
        </button>
      `).join('') : '';

      // Edit Button for admin mode
      const editButtonHtml = isAdmin ? `
        <button class="btn-edit-trigger" data-edit-index="${index}" title="Yönetici Düzenleme Modu" aria-label="${escapeHtml(title)} düzenle">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          <span>${escapeHtml(I18N[currentLang].btn_edit)}</span>
        </button>
      ` : '';

      // Responsive picture markup (First card is eager/fetchpriority=high, rest are lazy)
      const isHeroCard = (index === 0);
      const pictureMarkup = getResponsiveImageMarkup(project.image, title, isHeroCard, `main-img-${index}`);

      article.innerHTML = `
        <div class="project-stage">
          <!-- LEFT NARRATIVE -->
          <div class="project-narrative">
            <div class="project-header-meta">
              <span class="project-category-text">${escapeHtml(category)}</span>
              <div class="project-badges-row">
                ${statusBadgeHtml}
                ${sponsorBadgeHtml}
              </div>
              <span class="project-lead-meta">${escapeHtml(ownership)}</span>
            </div>

            <h2 class="project-title" id="project-title-${index}">${escapeHtml(title)}</h2>
            <p class="project-tagline">${escapeHtml(tagline)}</p>

            <!-- Difficulty Rating Indicator -->
            <div class="project-difficulty-bar" aria-label="Zorluk Seviyesi: ${difficulty}/5">
              <span class="diff-label">Zorluk:</span>
              <div class="diff-dots-track">${diffDots}</div>
              <span class="diff-val">${difficulty}/5</span>
            </div>

            <!-- Problem & Solution Glass Cards with Semantic H3 Hierarchy -->
            <div class="project-cards-container">
              <div class="feature-glass-card">
                <div class="card-title-bar">
                  <h3 class="card-title-text">${escapeHtml(I18N[currentLang].card_problem_title)}</h3>
                </div>
                <p class="card-body-text">${escapeHtml(problem)}</p>
              </div>

              <div class="feature-glass-card">
                <div class="card-title-bar">
                  <h3 class="card-title-text">${escapeHtml(I18N[currentLang].card_solution_title)}</h3>
                </div>
                <p class="card-body-text">${escapeHtml(solution)}</p>
              </div>
            </div>

            <!-- Technical Specs Summary -->
            ${specsHtml ? `<div class="tech-specs-bar">${specsHtml}</div>` : ''}

            <!-- Action Buttons -->
            <div class="project-actions-row">
              <button class="btn-inspect-trigger" data-detail-index="${index}" aria-label="${escapeHtml(title)} detaylarını incele">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>${escapeHtml(I18N[currentLang].btn_inspect_detail)}</span>
              </button>

              ${editButtonHtml}

              <!-- Share Direct Slug Button -->
              <button class="btn-icon-subtle" data-share-slug="${project.id}" title="${escapeHtml(I18N[currentLang].btn_share)}" aria-label="${escapeHtml(title)} bağlantısını kopyala">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
              </button>
            </div>
          </div>

          <!-- RIGHT HERO VISUAL STAGE -->
          <div class="project-visual-stage">
            <div class="visual-canvas-card" id="card-stage-${index}">
              ${pictureMarkup}
            </div>

            ${galleryThumbsHtml ? `<div class="visual-gallery-thumbs" id="thumbs-${index}">${galleryThumbsHtml}</div>` : ''}
          </div>
        </div>
      `;

      wrapper.appendChild(article);

      // Dot Nav Item
      const dot = document.createElement('li');
      dot.className = 'dot-item';
      dot.innerHTML = `
        <button class="dot-btn" aria-label="Project ${index + 1}: ${escapeHtml(title)}"></button>
        <div class="dot-tooltip">0${index + 1} // ${escapeHtml(title.slice(0, 22))}</div>
      `;
      dot.addEventListener('click', () => {
        playUiBeep(640, 0.03);
        article.scrollIntoView({ behavior: 'smooth' });
      });
      dotsList.appendChild(dot);

      // 3D Tilt
      const visualCard = article.querySelector(`#card-stage-${index}`);
      if (visualCard) attach3DTilt(visualCard);

      // Gallery Thumbnails
      const thumbs = article.querySelectorAll('.thumb-item');
      thumbs.forEach(t => {
        t.addEventListener('click', () => {
          playUiBeep(720, 0.02);
          const newSrc = t.dataset.src;
          const stageCard = article.querySelector(`#card-stage-${index}`);
          if (stageCard) {
            stageCard.innerHTML = getResponsiveImageMarkup(newSrc, title, false, `main-img-${index}`);
          }
          thumbs.forEach(other => other.classList.remove('active'));
          t.classList.add('active');
        });
      });
    });

    // About Us dot (Index: projectsData.length + 1)
    const aboutDot = document.createElement('li');
    aboutDot.className = 'dot-item';
    aboutDot.innerHTML = `
      <button class="dot-btn" aria-label="${currentLang === 'tr' ? 'Hakkımızda' : 'About Us'}"></button>
      <div class="dot-tooltip">${String(projectsData.length + 1).padStart(2, '0')} // ${currentLang === 'tr' ? 'Hakkımızda' : 'About'}</div>
    `;
    aboutDot.addEventListener('click', () => {
      playUiBeep(520, 0.03);
      const aboutSec = document.getElementById('about');
      if (aboutSec) aboutSec.scrollIntoView({ behavior: 'smooth' });
    });
    dotsList.appendChild(aboutDot);

    // Bind Detail Modal Triggers
    document.querySelectorAll('.btn-inspect-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.detailIndex, 10);
        openDetailModal(idx);
      });
    });

    // Bind Admin Edit Buttons
    if (isAdmin) {
      document.querySelectorAll('.btn-edit-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.editIndex, 10);
          openEditModal(idx);
        });
      });
    }

    // Bind Share Slug Buttons
    document.querySelectorAll('[data-share-slug]').forEach(btn => {
      btn.addEventListener('click', () => {
        playUiBeep(800, 0.04);
        const slug = btn.dataset.shareSlug;
        const url = `${window.location.origin}${window.location.pathname}#${slug}`;
        navigator.clipboard.writeText(url).then(() => {
          showToast(I18N[currentLang].toast_copied);
        });
      });
    });

    setupScrollObserver();
  }

  // --------------------------------------------------------------------------
  // 10. PROJECT DETAIL MODAL & DEEP LINKING (#slug) WITH FOCUS TRAP
  // --------------------------------------------------------------------------
  function openDetailModal(index) {
    const p = projectsData[index];
    if (!p) return;

    playUiBeep(750, 0.03);
    const modal = document.getElementById('detail-modal');
    if (!modal) return;

    const title = getLocalizedValue(p.title);
    const tagline = getLocalizedValue(p.tagline);
    const category = getLocalizedValue(p.category);
    const problem = getLocalizedValue(p.problem);
    const solution = getLocalizedValue(p.solution);
    const firstStep = getLocalizedValue(p.first_step);
    const ownership = getLocalizedValue(p.ownership) || (p.author || '');
    
    const statusVal = getLocalizedValue(p.status);
    const sponsorVal = getLocalizedValue(p.sponsor_status);

    document.getElementById('detail-modal-title').textContent = title;
    document.getElementById('detail-modal-tagline').textContent = tagline;

    // Badges in Modal: Only shown if distinct / assigned
    const statusBadgeHtml = shouldShowStatusBadge(p)
      ? `<span class="badge-status">${escapeHtml(I18N[currentLang].status_label_prefix)} ${escapeHtml(statusVal)}</span>`
      : '';
    const sponsorBadgeHtml = !isUndeterminedBadge(sponsorVal)
      ? `<span class="badge-sponsor">${escapeHtml(I18N[currentLang].sponsor_label_prefix)} ${escapeHtml(sponsorVal)}</span>`
      : '';

    // Tags
    const tagsContainer = document.getElementById('detail-meta-tags');
    tagsContainer.innerHTML = `
      <span class="project-category-text">${escapeHtml(category)}</span>
      ${statusBadgeHtml}
      ${sponsorBadgeHtml}
      <span class="detail-owner-tag">${escapeHtml(ownership)}</span>
    `;

    // Specs
    const allSpecs = [];
    (p.specs || []).forEach(s => {
      let l = getLocalizedValue(s.label);
      let v = getLocalizedValue(s.value);
      if (SPEC_TRANSLATIONS[l]) {
        l = SPEC_TRANSLATIONS[l][currentLang] || l;
      }
      allSpecs.push({ label: l, value: v });
    });

    const specsTableHtml = allSpecs.map(s => `
      <div class="detail-spec-row">
        <span class="detail-spec-key">${escapeHtml(s.label)}</span>
        <span class="detail-spec-val">${escapeHtml(s.value)}</span>
      </div>
    `).join('');

    const bodyContainer = document.getElementById('detail-modal-body');
    bodyContainer.innerHTML = `
      <div class="detail-section-block">
        <h3 class="detail-block-title">${escapeHtml(I18N[currentLang].card_problem_title)}</h3>
        <p class="detail-block-text">${escapeHtml(problem)}</p>
      </div>

      <div class="detail-section-block">
        <h3 class="detail-block-title">${escapeHtml(I18N[currentLang].card_solution_title)}</h3>
        <p class="detail-block-text">${escapeHtml(solution)}</p>
      </div>

      ${firstStep ? `
        <div class="detail-section-block highlight-block">
          <h3 class="detail-block-title">${escapeHtml(I18N[currentLang].first_step_heading)}</h3>
          <p class="detail-block-text">${escapeHtml(firstStep)}</p>
        </div>
      ` : ''}

      ${specsTableHtml ? `
        <div class="detail-section-block">
          <h3 class="detail-block-title">${escapeHtml(I18N[currentLang].specs_heading)}</h3>
          <div class="detail-specs-table">${specsTableHtml}</div>
        </div>
      ` : ''}
    `;

    // Footer Join Button: Only visible if joinUrl is provided and not null, with rel="noopener noreferrer"
    const joinBtn = document.getElementById('btn-detail-join');
    if (joinBtn) {
      if (p.joinUrl && typeof p.joinUrl === 'string' && p.joinUrl.trim().length > 0) {
        joinBtn.href = p.joinUrl;
        joinBtn.target = '_blank';
        joinBtn.rel = 'noopener noreferrer';
        joinBtn.style.display = 'inline-flex';
      } else {
        joinBtn.style.display = 'none';
        joinBtn.removeAttribute('href');
      }
    }

    // Bind direct share button inside modal
    const shareBtn = document.getElementById('btn-detail-share');
    if (shareBtn) {
      shareBtn.onclick = () => {
        playUiBeep(800, 0.04);
        const url = `${window.location.origin}${window.location.pathname}#${p.id}`;
        navigator.clipboard.writeText(url).then(() => {
          showToast(I18N[currentLang].toast_copied);
        });
      };
    }

    // Dynamic document title update for rich browser history
    document.title = `${title} — IEC // IUS Engineering`;

    // Update URL hash without page jump
    history.replaceState(null, '', `#${p.id}`);

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    // Trap focus inside modal (WCAG 2.2 AA)
    trapFocus(modal, closeDetailModal);
  }

  function closeDetailModal() {
    const modal = document.getElementById('detail-modal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    // Revert page title
    document.title = I18N[currentLang].page_seo_title;

    if (currentFocusTrapCleanup) {
      currentFocusTrapCleanup();
    }
  }

  function handleDeepLinkHash() {
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) return;

    const targetIndex = projectsData.findIndex(p => p.id === hash);
    if (targetIndex >= 0) {
      const targetSec = document.getElementById(hash) || document.getElementById(`project-${targetIndex}`);
      if (targetSec) {
        setTimeout(() => {
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }

  window.addEventListener('hashchange', handleDeepLinkHash);

  // --------------------------------------------------------------------------
  // 11. DRAWER CATALOG, SEARCH, FILTERS & SORT WITH FOCUS TRAP
  // --------------------------------------------------------------------------
  function populateCategoryFilters() {
    const chipsContainer = document.getElementById('drawer-category-chips');
    if (!chipsContainer || projectsData.length === 0) return;

    const categories = ['all', ...new Set(projectsData.map(p => {
      if (p.category && typeof p.category === 'object') return p.category.tr || p.category.en;
      return p.category || '';
    }).filter(Boolean))];

    chipsContainer.innerHTML = categories.map(cat => {
      const label = cat === 'all' ? I18N[currentLang].filter_all : cat;
      return `
        <button type="button" class="chip-filter-btn ${cat === activeCategoryFilter ? 'active' : ''}" data-cat="${escapeHtml(cat)}">
          ${escapeHtml(label)}
        </button>
      `;
    }).join('');

    chipsContainer.querySelectorAll('.chip-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playUiBeep(680, 0.02);
        chipsContainer.querySelectorAll('.chip-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategoryFilter = btn.dataset.cat;
        populateDrawerList();
      });
    });
  }

  function populateDrawerList() {
    const list = document.getElementById('drawer-projects-list');
    const searchInput = document.getElementById('drawer-search-input');
    if (!list) return;

    const query = (searchInput?.value || '').toLowerCase().trim();

    // 1. Filter
    let filtered = projectsData.filter((p, originalIdx) => {
      p._originalIndex = originalIdx;
      const title = getLocalizedValue(p.title).toLowerCase();
      const cat = getLocalizedValue(p.category).toLowerCase();
      const rawCat = (p.category && typeof p.category === 'object') ? (p.category.tr || p.category.en || '') : (p.category || '');

      const matchesQuery = !query || title.includes(query) || cat.includes(query);
      const matchesCategory = activeCategoryFilter === 'all' || rawCat === activeCategoryFilter;

      return matchesQuery && matchesCategory;
    });

    // 2. Sort
    if (activeSortMode === 'difficulty-desc') {
      filtered.sort((a, b) => (b.difficulty || 0) - (a.difficulty || 0));
    } else if (activeSortMode === 'difficulty-asc') {
      filtered.sort((a, b) => (a.difficulty || 0) - (b.difficulty || 0));
    } else if (activeSortMode === 'sponsor') {
      filtered.sort((a, b) => {
        const sA = getLocalizedValue(a.sponsor_status);
        const sB = getLocalizedValue(b.sponsor_status);
        return sA.localeCompare(sB);
      });
    }

    list.innerHTML = '';
    if (filtered.length === 0) {
      list.innerHTML = `<div class="drawer-empty-msg">${currentLang === 'tr' ? 'Eşleşen proje fikri bulunamadı.' : 'No matching project proposals found.'}</div>`;
      return;
    }

    filtered.forEach(p => {
      const title = getLocalizedValue(p.title);
      const cat = getLocalizedValue(p.category);
      const statusVal = getLocalizedValue(p.status);
      const sponsorVal = getLocalizedValue(p.sponsor_status);

      const statusMiniHtml = shouldShowStatusBadge(p)
        ? `<span class="badge-mini status">${escapeHtml(I18N[currentLang].status_label_prefix)} ${escapeHtml(statusVal)}</span>`
        : '';
      const sponsorMiniHtml = !isUndeterminedBadge(sponsorVal)
        ? `<span class="badge-mini sponsor">${escapeHtml(I18N[currentLang].sponsor_label_prefix)} ${escapeHtml(sponsorVal)}</span>`
        : '';

      const card = document.createElement('a');
      card.className = 'drawer-project-card';
      card.href = `#${p.id}`;
      card.innerHTML = `
        <img src="${escapeHtml(p.image)}" alt="" class="drawer-card-thumb" width="72" height="48" loading="lazy" decoding="async">
        <div class="drawer-card-info">
          <div class="drawer-card-title">${escapeHtml(title)}</div>
          <div class="drawer-card-cat">${escapeHtml(cat)}</div>
          <div class="drawer-card-badges">
            ${statusMiniHtml}
            ${sponsorMiniHtml}
            <span class="badge-mini diff">${p.difficulty || 3}/5</span>
          </div>
        </div>
      `;
      card.addEventListener('click', (e) => {
        e.preventDefault();
        closeDrawer();
        playUiBeep(600, 0.03);
        const targetSec = document.getElementById(p.id);
        if (targetSec) targetSec.scrollIntoView({ behavior: 'smooth' });
        history.replaceState(null, '', `#${p.id}`);
      });
      list.appendChild(card);
    });
  }

  function openDrawer() {
    playUiBeep(500, 0.04);
    populateDrawerList();
    const drawer = document.getElementById('index-drawer');
    const trigger = document.getElementById('open-index-drawer');
    if (drawer) {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      trigger?.setAttribute('aria-expanded', 'true');
      trapFocus(drawer, closeDrawer);
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById('index-drawer');
    const trigger = document.getElementById('open-index-drawer');
    if (drawer) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      trigger?.setAttribute('aria-expanded', 'false');
    }
    if (currentFocusTrapCleanup) {
      currentFocusTrapCleanup();
    }
  }

  // --------------------------------------------------------------------------
  // 12. PROJECT PALETTE ENGINE
  // --------------------------------------------------------------------------
  function applyProjectPalette(projectIndex, paletteId) {
    const project = projectsData[projectIndex];
    if (!project) return;
    const sec = document.getElementById(project.id) || document.getElementById(`project-${projectIndex}`);
    const pal = PALETTES[paletteId] || PALETTES['gothic-noir'];
    if (!sec || !pal) return;

    sec.dataset.palette = pal.id;
    project.palette = pal.id;
    localStorage.setItem(`iec_palette_${project.id}`, pal.id);

    playUiBeep(840, 0.04);
  }

  function initGlobalPaletteSwitcher() {
    // Single Cohesive Palette: Dark Obsidian & Architectural Warm Gold
    document.body.className = `lang-${currentLang} theme-dark`;
    if (document.body.dataset.globalPalette) {
      delete document.body.dataset.globalPalette;
    }
  }

  // --------------------------------------------------------------------------
  // 13. INTERACTIVE 3D CARD TILT
  // --------------------------------------------------------------------------
  function attach3DTilt(cardElement) {
    if (!cardElement) return;

    cardElement.addEventListener('mousemove', (e) => {
      const rect = cardElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    cardElement.addEventListener('mouseleave', () => {
      cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // --------------------------------------------------------------------------
  // 14. SCROLL OBSERVER & DOT TRACKER
  // --------------------------------------------------------------------------
  let observer = null;
  function setupScrollObserver() {
    if (observer) observer.disconnect();

    const sections = document.querySelectorAll('.snap-section');
    const dots = document.querySelectorAll('.side-progress-nav .dot-item');

    const observerOptions = {
      root: document.getElementById('scroll-container'),
      threshold: 0.55
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index, 10);
          activeSectionIndex = index;

          dots.forEach((dot, dIdx) => {
            dot.classList.toggle('active', dIdx === index);
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
  }

  // --------------------------------------------------------------------------
  // 15. IN-PLACE LIVE EDIT MODAL (Maintainer Admin Mode Only)
  // --------------------------------------------------------------------------
  let currentlyEditingIndex = -1;

  function initModalPaletteChoices(activeId) {
    const picker = document.getElementById('modal-palette-picker');
    const inputHidden = document.getElementById('edit-palette');
    if (!picker || !inputHidden) return;

    picker.innerHTML = Object.values(PALETTES).map(pal => `
      <div class="palette-modal-choice ${pal.id === activeId ? 'selected' : ''}" data-modal-palette-id="${pal.id}">
        <div class="palette-swatch-bar">
          <span style="background: ${pal.swatches[0]}"></span>
          <span style="background: ${pal.swatches[1]}"></span>
          <span style="background: ${pal.swatches[2]}"></span>
          <span style="background: ${pal.swatches[3]}"></span>
        </div>
        <span>${escapeHtml(pal.name)}</span>
      </div>
    `).join('');

    picker.querySelectorAll('.palette-modal-choice').forEach(choice => {
      choice.addEventListener('click', () => {
        playUiBeep(750, 0.02);
        picker.querySelectorAll('.palette-modal-choice').forEach(c => c.classList.remove('selected'));
        choice.classList.add('selected');
        inputHidden.value = choice.dataset.modalPaletteId;
      });
    });
  }

  function openEditModal(index) {
    if (!isAdmin) return;
    currentlyEditingIndex = index;
    const p = projectsData[index];
    if (!p) return;

    playUiBeep(700, 0.04);
    const modal = document.getElementById('edit-modal');
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    document.getElementById('edit-project-id').value = index;
    document.getElementById('edit-title-tr').value = (p.title && p.title.tr) || (typeof p.title === 'string' ? p.title : '');
    document.getElementById('edit-title-en').value = (p.title && p.title.en) || '';
    document.getElementById('edit-tagline-tr').value = (p.tagline && p.tagline.tr) || (typeof p.tagline === 'string' ? p.tagline : '');
    document.getElementById('edit-tagline-en').value = (p.tagline && p.tagline.en) || '';
    document.getElementById('edit-category-tr').value = (p.category && (p.category.tr || p.category[currentLang])) || '';
    document.getElementById('edit-author').value = p.author || '';

    const sponsorSelect = document.getElementById('edit-sponsor-status');
    const projectStatusSelect = document.getElementById('edit-project-status');
    if (sponsorSelect) {
      sponsorSelect.value = (typeof p.sponsor_status === 'object' && p.sponsor_status ? p.sponsor_status.tr : p.sponsor_status) || '';
    }
    if (projectStatusSelect) {
      projectStatusSelect.value = (typeof p.status === 'object' && p.status ? p.status.tr : p.status) || 'Öneri';
    }

    const diffSlider = document.getElementById('edit-difficulty');
    if (diffSlider) {
      diffSlider.value = p.difficulty || 3;
      document.getElementById('edit-difficulty-val').textContent = `${p.difficulty || 3}/5`;
    }

    document.getElementById('edit-ownership-tr').value = (p.ownership && (p.ownership.tr || p.ownership[currentLang])) || p.author || '';
    document.getElementById('edit-image-url').value = p.image || '';

    document.getElementById('edit-problem-tr').value = (p.problem && p.problem.tr) || '';
    document.getElementById('edit-problem-en').value = (p.problem && p.problem.en) || '';
    document.getElementById('edit-solution-tr').value = (p.solution && p.solution.tr) || '';
    document.getElementById('edit-solution-en').value = (p.solution && p.solution.en) || '';

    document.getElementById('edit-first-step-tr').value = (p.first_step && p.first_step.tr) || '';
    document.getElementById('edit-first-step-en').value = (p.first_step && p.first_step.en) || '';

    const currentPal = localStorage.getItem('iec_palette_' + p.id) || p.palette || 'gothic-noir';
    initModalPaletteChoices(currentPal);

    highlightSelectedGallery(p.image);
    trapFocus(modal, closeEditModal);
  }

  function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    currentlyEditingIndex = -1;
    if (currentFocusTrapCleanup) {
      currentFocusTrapCleanup();
    }
  }

  function highlightSelectedGallery(src) {
    document.querySelectorAll('.gallery-choice').forEach(choice => {
      choice.classList.toggle('selected', choice.dataset.src === src);
    });
  }

  function downloadProjectsJson() {
    const jsonStr = JSON.stringify(projectsData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playUiBeep(900, 0.06);
    showToast(I18N[currentLang].toast_json_downloaded);
  }

  function copyProjectsJson() {
    const jsonStr = JSON.stringify(projectsData, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      playUiBeep(850, 0.05);
      showToast(I18N[currentLang].toast_json_copied);
    });
  }

  // --------------------------------------------------------------------------
  // 16. MULTILINGUAL SEO & LANGUAGE SWITCHER (TR / EN)
  // --------------------------------------------------------------------------
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('iec_user_pref_lang', lang);
    localStorage.setItem('iec_lang', lang);
    document.documentElement.lang = lang;
    document.body.className = `lang-${lang} theme-dark`;

    // 1. Synchronize Document Title & Meta Description
    document.title = I18N[lang].page_seo_title;

    const pageMeta = document.getElementById('page-meta-desc');
    if (pageMeta) {
      pageMeta.content = I18N[lang].page_seo_desc;
    }

    // 2. Synchronize Social Open Graph & Twitter Cards
    const ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.content = I18N[lang].page_seo_title;

    const ogDesc = document.getElementById('og-desc');
    if (ogDesc) ogDesc.content = I18N[lang].page_seo_desc;

    const twTitle = document.getElementById('twitter-title');
    if (twTitle) twTitle.content = I18N[lang].page_seo_title;

    const twDesc = document.getElementById('twitter-desc');
    if (twDesc) twDesc.content = I18N[lang].page_seo_desc;

    // 3. Update Language Switcher Buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // 4. Update data-i18n Nodes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (I18N[lang] && I18N[lang][key]) {
        el.textContent = I18N[lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.dataset.i18nPh;
      if (I18N[lang] && I18N[lang][key]) {
        el.placeholder = I18N[lang][key];
      }
    });

    // 5. Screen Reader Live Notification (WCAG 2.2 AA)
    announceToScreenReader(I18N[lang].sr_lang_changed);

    // 6. Re-render dynamic elements
    if (projectsData.length > 0) {
      renderAllProjects();
      populateDrawerList();
      populateCategoryFilters();
      updateHeroStats();
    }
  }

  // --------------------------------------------------------------------------
  // 17. INITIALIZATION & GLOBAL LISTENERS
  // --------------------------------------------------------------------------
  function init() {
    // 1. Check Admin Mode
    const adminBanner = document.getElementById('admin-mode-banner');
    if (adminBanner) {
      adminBanner.style.display = isAdmin ? 'block' : 'none';
    }
    const exitAdminBtn = document.getElementById('exit-admin-btn');
    if (exitAdminBtn) {
      exitAdminBtn.href = window.location.pathname;
    }

    // 2. Sound Toggle Listener
    const soundPill = document.getElementById('audio-indicator');
    if (soundPill) {
      soundPill.addEventListener('click', toggleSound);
      soundPill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSound();
        }
      });
    }

    // 3. Language Switcher Buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        playUiBeep(700, 0.03);
        setLanguage(lang);
      });
    });

    // 4. Drawer Open / Close
    const openDrawerBtn = document.getElementById('open-index-drawer');
    const closeDrawerBtn = document.getElementById('close-index-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const drawerAboutBtn = document.getElementById('drawer-about-btn');
    if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
    if (drawerAboutBtn) {
      drawerAboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeDrawer();
        playUiBeep(600, 0.03);
        const aboutSec = document.getElementById('about');
        if (aboutSec) aboutSec.scrollIntoView({ behavior: 'smooth' });
        history.replaceState(null, '', '#about');
      });
    }

    // 5. Drawer Search & Sort Listeners
    const searchInput = document.getElementById('drawer-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        populateDrawerList();
      });
    }

    const sortSelect = document.getElementById('drawer-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        playUiBeep(640, 0.02);
        activeSortMode = e.target.value;
        populateDrawerList();
      });
    }

    // 6. Detail Modal Close
    const closeDetailBtn = document.getElementById('close-detail-modal');
    const detailBackdrop = document.getElementById('detail-modal-backdrop');
    if (closeDetailBtn) closeDetailBtn.addEventListener('click', closeDetailModal);
    if (detailBackdrop) detailBackdrop.addEventListener('click', closeDetailModal);

    // 7. Edit Modal Close & Form Listeners
    const closeEditBtn = document.getElementById('close-edit-modal');
    const editBackdrop = document.getElementById('edit-modal-backdrop');
    if (closeEditBtn) closeEditBtn.addEventListener('click', closeEditModal);
    if (editBackdrop) editBackdrop.addEventListener('click', closeEditModal);

    document.querySelectorAll('.gallery-choice').forEach(choice => {
      choice.addEventListener('click', () => {
        playUiBeep(850, 0.02);
        highlightSelectedGallery(choice.dataset.src);
        const editImg = document.getElementById('edit-image-url');
        if (editImg) editImg.value = choice.dataset.src;
      });
    });

    const diffSlider = document.getElementById('edit-difficulty');
    if (diffSlider) {
      diffSlider.addEventListener('input', (e) => {
        document.getElementById('edit-difficulty-val').textContent = `${e.target.value}/5`;
      });
    }

    // 8. Maintainer Form Submit
    const editForm = document.getElementById('edit-project-form');
    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (currentlyEditingIndex < 0 || !isAdmin) return;

        const p = projectsData[currentlyEditingIndex];
        p.title = p.title || {};
        p.title.tr = document.getElementById('edit-title-tr').value;
        p.title.en = document.getElementById('edit-title-en').value;
        p.tagline = p.tagline || {};
        p.tagline.tr = document.getElementById('edit-tagline-tr').value;
        p.tagline.en = document.getElementById('edit-tagline-en').value;
        
        p.category = p.category || {};
        p.category.tr = document.getElementById('edit-category-tr').value;
        
        p.author = document.getElementById('edit-author').value;

        const sponsorSelect = document.getElementById('edit-sponsor-status');
        const projectStatusSelect = document.getElementById('edit-project-status');
        if (sponsorSelect) {
          const sVal = sponsorSelect.value;
          const sEn = sVal === 'Sponsor Aranıyor' ? 'Seeking Sponsor' : sVal === 'Sponsor Gerekmiyor' ? 'No Sponsor Needed' : '';
          p.sponsor_status = sVal ? { tr: sVal, en: sEn } : null;
        }
        if (projectStatusSelect) {
          const stVal = projectStatusSelect.value;
          const stEn = stVal === 'Öneri' ? 'Proposal' : stVal === 'Planlanan' ? 'Planned' : stVal === 'Prototip' ? 'Prototype' : stVal === 'Aktif' ? 'Active' : '';
          p.status = stVal ? { tr: stVal, en: stEn } : { tr: 'Öneri', en: 'Proposal' };
        }

        p.difficulty = parseInt(document.getElementById('edit-difficulty').value, 10);
        
        p.ownership = p.ownership || {};
        p.ownership.tr = document.getElementById('edit-ownership-tr').value;

        p.image = document.getElementById('edit-image-url').value || p.image;
        if (!p.gallery || !p.gallery.includes(p.image)) {
          p.gallery = [p.image, ...(p.gallery || [])];
        }

        p.problem = p.problem || {};
        p.problem.tr = document.getElementById('edit-problem-tr').value;
        p.problem.en = document.getElementById('edit-problem-en').value;
        p.solution = p.solution || {};
        p.solution.tr = document.getElementById('edit-solution-tr').value;
        p.solution.en = document.getElementById('edit-solution-en').value;

        p.first_step = p.first_step || {};
        p.first_step.tr = document.getElementById('edit-first-step-tr').value;
        p.first_step.en = document.getElementById('edit-first-step-en').value;

        const modalPal = (document.getElementById('edit-palette') && document.getElementById('edit-palette').value) || 'gothic-noir';
        p.palette = modalPal;
        localStorage.setItem('iec_palette_' + p.id, modalPal);

        localStorage.setItem('iec_projects_custom', JSON.stringify(projectsData));

        const scrollPos = document.getElementById('scroll-container').scrollTop;
        renderAllProjects();
        populateDrawerList();
        document.getElementById('scroll-container').scrollTop = scrollPos;

        closeEditModal();
        playUiBeep(920, 0.08);
        showToast(I18N[currentLang].toast_saved);
      });
    }

    // 9. Reset Button in Modal
    const btnReset = document.getElementById('btn-reset-project-default');
    if (btnReset) {
      btnReset.addEventListener('click', async () => {
        const confirmMsg = currentLang === 'tr'
          ? "Bu projenin tüm yerel düzenlemelerini silip depodaki orijinal ayarlara dönmek istediğinize emin misiniz?"
          : "Reset all local customizations and revert back to repository defaults?";
        if (confirm(confirmMsg)) {
          localStorage.removeItem('iec_projects_custom');
          await loadProjectsData();
          closeEditModal();
          showToast(I18N[currentLang].toast_reset);
        }
      });
    }

    // 10. Download & Copy JSON
    const btnDownload = document.getElementById('btn-download-project-json');
    if (btnDownload) btnDownload.addEventListener('click', downloadProjectsJson);

    const btnCopy = document.getElementById('btn-copy-project-json');
    if (btnCopy) btnCopy.addEventListener('click', copyProjectsJson);

    // 11. Keyboard Navigation (Arrows & Page Keys)
    window.addEventListener('keydown', (e) => {
      const modalOpen = document.getElementById('edit-modal')?.classList.contains('open');
      const detailOpen = document.getElementById('detail-modal')?.classList.contains('open');
      const drawerOpen = document.getElementById('index-drawer')?.classList.contains('open');

      if (e.key === 'Escape') {
        if (modalOpen) closeEditModal();
        if (detailOpen) closeDetailModal();
        if (drawerOpen) closeDrawer();
        return;
      }

      if (modalOpen || detailOpen || drawerOpen) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const maxIdx = document.querySelectorAll('.snap-section').length - 1;
        const nextIdx = Math.min(activeSectionIndex + 1, maxIdx);
        const targetSec = document.querySelector(`.snap-section[data-index="${nextIdx}"]`);
        if (targetSec) {
          playUiBeep(520, 0.02);
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevIdx = Math.max(activeSectionIndex - 1, 0);
        const targetSec = document.querySelector(`.snap-section[data-index="${prevIdx}"]`);
        if (targetSec) {
          playUiBeep(480, 0.02);
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (isAdmin && (e.key === 'e' || e.key === 'E')) {
        if (activeSectionIndex > 0) {
          openEditModal(activeSectionIndex - 1);
        }
      }
    });

    // 12. Global Theme & Language Init
    initGlobalPaletteSwitcher();
    setLanguage(currentLang);

    // 13. Fetch Projects Data from data/projects.json
    loadProjectsData();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
