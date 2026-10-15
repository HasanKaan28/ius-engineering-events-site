// IUS Engineering Club - Live Project Showcase Dataset
// Bilingual (TR / EN) Full Architecture Dataset
window.IEC_PROJECTS = [
  {
    "id": "powerbank-station",
    "sheet_id": 1,
    "is_flagship": true,
    "featured": true,
    "status": {
      "tr": "Öneri",
      "en": "Proposal"
    },
    "sponsor_status": null,
    "joinUrl": null,
    "category": {
      "tr": "Donanım & IoT Kampüs İnovasyonu",
      "en": "Hardware & IoT Campus Innovation"
    },
    "badge": {
      "tr": "Proje Fikri",
      "en": "Project Idea"
    },
    "title": {
      "tr": "IUS PowerHub (Akıllı Powerbank İstasyonu)",
      "en": "IUS PowerHub (Smart Campus Powerbank Station)"
    },
    "tagline": {
      "tr": "Öğrenci kartı (RFID) ile tek dokunuşta taşınabilir kampüs enerjisi sağlama hedefi.",
      "en": "Proposed one-tap portable energy powered by IUS Student RFID IDs."
    },
    "author": "Hasan Kaan Karabulut (Başkan)",
    "ownership": {
      "tr": "Hasan Kaan Karabulut (Proje Lideri & Donanım)",
      "en": "Hasan Kaan Karabulut (Project Lead & Hardware)"
    },
    "difficulty": 5,
    "target_audience": {
      "tr": "Tüm IUS Öğrencileri & Personel",
      "en": "All IUS Students & Staff"
    },
    "image": "./assets/powerbank_station_hero.webp",
    "gallery": [
      "./assets/powerbank_station_hero.webp"
    ],
    "problem": {
      "tr": "Amfilerde, kütüphanede ve kafeteryada priz yetersizliği sebebiyle öğrencilerin ders aralarında cihazlarının şarjsız kalması ve priz arama karmaşası yaşaması.",
      "en": "Shortage of accessible wall outlets across lecture halls, the library, and cafeterias leads to depleted student devices and disrupted study sessions."
    },
    "solution": {
      "tr": "Öğrencilerin IUS kartını okutarak otomatik şarj olan powerbank alabileceği, blok girişlerine yerleştirilmesi planlanan otonom manyetik şarj istasyonları kurulması hedeflenmektedir.",
      "en": "Proposed deployment of smart magnetic charging docks in campus lobbies where students can tap their university RFID card to borrow a charged powerbank."
    },
    "specs": [
      {
        "label": {
          "tr": "Mimari",
          "en": "Architecture"
        },
        "value": {
          "tr": "ESP32 / IoT Kontrolcü",
          "en": "ESP32 / IoT Controller"
        }
      },
      {
        "label": {
          "tr": "Doğrulama",
          "en": "Authentication"
        },
        "value": {
          "tr": "NFC / RFID Okuyucu",
          "en": "NFC / RFID Reader"
        }
      },
      {
        "label": {
          "tr": "Güvenlik",
          "en": "Safety"
        },
        "value": {
          "tr": "BMS Batarya Koruması",
          "en": "BMS Battery Protection"
        }
      },
      {
        "label": {
          "tr": "Gövde",
          "en": "Enclosure"
        },
        "value": {
          "tr": "3D Baskı / Kompakt Gövde",
          "en": "3D Printed / Compact Body"
        }
      }
    ],
    "links": [
      "https://porty.tech/"
    ],
    "first_step": {
      "tr": "FENS dekanlığına teknik proje önerisinin sunulması ve ilk prototip donanım bileşenleri için sponsorluk görüşmelerine başlanması planlanmaktadır.",
      "en": "Present the engineering proposal to FENS Deanship and initiate preliminary talks with potential hardware sponsors for prototyping modules."
    },
    "palette": "gothic-noir",
    "image_alt": {
      "tr": "IUS PowerHub (Akıllı Powerbank İstasyonu)",
      "en": "IUS PowerHub (Smart Campus Powerbank Station)"
    }
  },
  {
    "id": "dining-menu-system",
    "sheet_id": 2,
    "is_flagship": true,
    "featured": true,
    "status": {
      "tr": "Öneri",
      "en": "Proposal"
    },
    "sponsor_status": null,
    "joinUrl": null,
    "category": {
      "tr": "Web & Mobil Kampüs Yazılımı",
      "en": "Web & Mobile Campus Software"
    },
    "badge": {
      "tr": "Proje Fikri",
      "en": "Project Idea"
    },
    "title": {
      "tr": "IUS Dining (Yemekhane & Menü Takip Sistemi)",
      "en": "IUS Dining (Cafeteria & Live Menu App)"
    },
    "tagline": {
      "tr": "Günlük sıcak yemekler, güncel fiyatlar ve alerjen takibini cebe getirme projesi.",
      "en": "Proposed campus app for daily hot meals, live price list, and nutrition info."
    },
    "author": "Mahmut İhsan Avcı (Başkan Yrd. / Operasyon)",
    "ownership": {
      "tr": "Mahmut İhsan Avcı (Proje Lideri & Operasyon)",
      "en": "Mahmut İhsan Avcı (Project Lead & Ops)"
    },
    "difficulty": 2,
    "target_audience": {
      "tr": "Tüm IUS Öğrencileri & Akademisyenler",
      "en": "All IUS Students & Faculty"
    },
    "image": "./assets/dining_app_hero.webp",
    "gallery": [
      "./assets/dining_app_hero.webp"
    ],
    "problem": {
      "tr": "Yemekhanede fiziki panoların her zaman güncel tutulamaması ve öğrencilerin günün menüsünü öğrenmek için bizzat yemekhaneye gitmek zorunda kalması.",
      "en": "Physical notice boards are not always current, requiring students to physically walk to the cafeteria just to see the daily meal options."
    },
    "solution": {
      "tr": "Günün ana yemeklerini, tatlılarını, güncel fiyatları ve alerjen bilgilerini cep telefonundan anlık gösterecek hafif bir web/PWA platformunun geliştirilmesi planlanmaktadır.",
      "en": "A lightweight progressive web app (PWA) planned to display daily dishes, current prices, and dietary information directly on mobile devices."
    },
    "specs": [
      {
        "label": {
          "tr": "Platform",
          "en": "Platform"
        },
        "value": {
          "tr": "Responsive Web / PWA",
          "en": "Responsive Mobile Web / PWA"
        }
      },
      {
        "label": {
          "tr": "Veri Akışı",
          "en": "Data Feed"
        },
        "value": {
          "tr": "Günlük Menü Yönetim Paneli",
          "en": "Daily Menu Management Panel"
        }
      },
      {
        "label": {
          "tr": "Geliştirme",
          "en": "Development"
        },
        "value": {
          "tr": "Öğrenci Açık Kaynak Ekibi",
          "en": "Student Open-Source Team"
        }
      },
      {
        "label": {
          "tr": "Kapsam",
          "en": "Scope"
        },
        "value": {
          "tr": "Kampüs Kafeterya & Yemekhane",
          "en": "Campus Cafeteria & Dining"
        }
      }
    ],
    "links": [],
    "first_step": {
      "tr": "Kampüs yönetimi ve yemekhane işletmesi ile görüşülerek günlük menü veri akışı mekanizmasının kararlaştırılması hedeflenmektedir.",
      "en": "Consult with campus administration and dining staff to secure a verified daily menu data update process."
    },
    "palette": "cobalt-sky",
    "image_alt": {
      "tr": "IUS Dining (Yemekhane & Menü Takip Sistemi)",
      "en": "IUS Dining (Cafeteria & Live Menu App)"
    }
  },
  {
    "id": "devhack-2027",
    "sheet_id": 3,
    "is_flagship": true,
    "featured": true,
    "status": {
      "tr": "Öneri",
      "en": "Proposal"
    },
    "sponsor_status": null,
    "joinUrl": null,
    "category": {
      "tr": "Yazılım Maratonu & Hackathon",
      "en": "Software Marathon & Hackathon"
    },
    "badge": {
      "tr": "Önerilen Etkinlik",
      "en": "Proposed Event"
    },
    "title": {
      "tr": "IUS DevHack 2027",
      "en": "IUS DevHack 2027"
    },
    "tagline": {
      "tr": "24 saat aralıksız kodlama, donanım prototipleme ve sektör jürisi etkinliği önerisi.",
      "en": "Proposed 24-hour sprint of coding, hardware prototyping, and industry jury feedback."
    },
    "author": "Software & AI Committee & Yönetim Kurulu",
    "ownership": {
      "tr": "Software & AI Komitesi & Yönetim Kurulu",
      "en": "Software & AI Committee & Executive Board"
    },
    "difficulty": 4,
    "target_audience": {
      "tr": "FENS CS/SE/EE Öğrencileri & Saraybosna Yazılımcıları",
      "en": "FENS CS/SE/EE Students & Sarajevo Dev Ecosystem"
    },
    "image": "./assets/hackathon_event_hero.webp",
    "gallery": [
      "./assets/hackathon_event_hero.webp"
    ],
    "problem": {
      "tr": "Öğrencilerin teorik ders projelerinin ötesine geçip gerçek dünya temposunda takım halinde çalışan MVP ürünler ortaya koyabilecekleri rekabetçi bir yarışma ortamı eksikliği.",
      "en": "Lack of high-intensity collegiate platforms where students can build real-world MVPs under realistic deadlines and teamwork conditions."
    },
    "solution": {
      "tr": "FENS laboratuvarlarında ~80 öğrencinin katılımıyla 24 saat sürecek, yazılım ve IoT odaklı bir hackathon maratonu düzenlenmesi planlanmaktadır.",
      "en": "A planned 24-hour engineering marathon in FENS labs where ~80 students build software and IoT solutions with industry mentors and jury members."
    },
    "specs": [
      {
        "label": {
          "tr": "Katılımcı",
          "en": "Participants"
        },
        "value": {
          "tr": "~80 Öğrenci (20 Takım)",
          "en": "~80 Students (20 Teams)"
        }
      },
      {
        "label": {
          "tr": "Süre",
          "en": "Duration"
        },
        "value": {
          "tr": "24 Saatlik Maraton",
          "en": "24 Hours Non-Stop Sprint"
        }
      },
      {
        "label": {
          "tr": "Ödül",
          "en": "Prizes"
        },
        "value": {
          "tr": "Staj & Donanım Ödülleri",
          "en": "Internships & Hardware Awards"
        }
      },
      {
        "label": {
          "tr": "Mekân",
          "en": "Venue"
        },
        "value": {
          "tr": "FENS Laboratuvarları",
          "en": "FENS Computer & Hardware Labs"
        }
      }
    ],
    "links": [
      "https://github.com/HasanKaan28/ius-engineering-events"
    ],
    "first_step": {
      "tr": "FENS dekanlığı ile takvim uygunluğunun görüşülmesi ve teknoloji firmalarıyla sponsorluk temaslarının başlatılması planlanmaktadır.",
      "en": "Coordinate available calendar dates with FENS Deanship and open preliminary discussions with partner tech companies for sponsorship packages."
    },
    "palette": "chili-spice",
    "image_alt": {
      "tr": "IUS DevHack 2027",
      "en": "IUS DevHack 2027"
    }
  },
  {
    "id": "ai-prompt-labs",
    "sheet_id": 4,
    "is_flagship": true,
    "featured": true,
    "status": {
      "tr": "Öneri",
      "en": "Proposal"
    },
    "sponsor_status": null,
    "joinUrl": null,
    "category": {
      "tr": "Yapay Zeka & Akran Eğitimi",
      "en": "Artificial Intelligence & Peer Learning"
    },
    "badge": {
      "tr": "Önerilen Atölye",
      "en": "Proposed Workshop"
    },
    "title": {
      "tr": "Hands-On AI & Prompt Engineering Labs",
      "en": "Hands-On AI & Prompt Engineering Labs"
    },
    "tagline": {
      "tr": "Modern LLM araçları, akıllı kodlama asistanları ve yerel modeller üzerine atölye serisi önerisi.",
      "en": "Proposed workshop series on modern LLM workflows, AI IDEs, and local open-source models."
    },
    "author": "Software & AI Committee",
    "ownership": {
      "tr": "Software & AI Komite Liderliği",
      "en": "Software & AI Committee Leadership"
    },
    "difficulty": 2,
    "target_audience": {
      "tr": "Tüm Üniversite Bölümleri (Yeni Başlayanlar & İleri Düzey)",
      "en": "All Academic Departments (Beginners to Advanced)"
    },
    "image": "./assets/ai_lab_hero.webp",
    "gallery": [
      "./assets/ai_lab_hero.webp"
    ],
    "problem": {
      "tr": "Yapay zeka araçlarının hızla gelişmesine rağmen öğrencilerin üretim süreçlerinde LLM'leri ve akıllı IDE'leri profesyonel seviyede kullanabilmesi için yapılandırılmış bir akran rehberliği eksikliği.",
      "en": "Despite rapid AI breakthroughs, students often lack structured peer-to-peer guidance to leverage AI tools and smart IDEs effectively in daily engineering."
    },
    "solution": {
      "tr": "FENS bilgisayar laboratuvarlarında dönemsel olarak düzenlenmesi hedeflenen uygulamalı kodlama seanslarıyla, modern AI araçları ve akran eğitimi modellerinin öğrencilere aktarılması planlanmaktadır.",
      "en": "Planned hands-on coding sessions in FENS computer labs where students learn practical AI tools, agentic workflows, and peer-to-peer software development."
    },
    "specs": [
      {
        "label": {
          "tr": "Periyot",
          "en": "Cadence"
        },
        "value": {
          "tr": "Dönemsel Atölye Dizisi",
          "en": "Semester Workshop Series"
        }
      },
      {
        "label": {
          "tr": "Format",
          "en": "Format"
        },
        "value": {
          "tr": "Uygulamalı Kodlama Seansı",
          "en": "Hands-On Live Coding Lab"
        }
      },
      {
        "label": {
          "tr": "Mekân",
          "en": "Venue"
        },
        "value": {
          "tr": "FENS Bilgisayar Laboratuvarı",
          "en": "FENS Computer Laboratory"
        }
      },
      {
        "label": {
          "tr": "İçerik",
          "en": "Scope"
        },
        "value": {
          "tr": "Akıllı Araçlar & LLM Temelleri",
          "en": "Smart Tools & LLM Fundamentals"
        }
      }
    ],
    "links": [
      "https://hasankaan28.github.io/ius-engineering-events-site/verify/"
    ],
    "first_step": {
      "tr": "Örnek atölye içeriğinin hazırlanması ve lab kullanımı için FENS yönetimine başvuru yapılması hedeflenmektedir.",
      "en": "Draft the introductory workshop syllabus and submit a reservation inquiry for FENS lab availability."
    },
    "palette": "ink-wash",
    "image_alt": {
      "tr": "Hands-On AI & Prompt Engineering Labs",
      "en": "Hands-On AI & Prompt Engineering Labs"
    }
  },
  {
    "id": "ius-techsummit-2027",
    "sheet_id": 5,
    "is_flagship": true,
    "featured": true,
    "status": {
      "tr": "Öneri",
      "en": "Proposal"
    },
    "sponsor_status": null,
    "joinUrl": null,
    "category": {
      "tr": "Yıllık Zirve & Sektör Ağları",
      "en": "Annual Summit & Industry Networking"
    },
    "badge": {
      "tr": "Önerilen Zirve",
      "en": "Proposed Summit"
    },
    "title": {
      "tr": "IUS TechSummit 2027",
      "en": "IUS TechSummit 2027"
    },
    "tagline": {
      "tr": "Bölgesel teknoloji liderlerini ve öğrenci inovasyonlarını IUS'ta buluşturma hedefi.",
      "en": "Proposed campus summit connecting regional tech leaders with student engineering projects."
    },
    "author": "Yönetim Kurulu & PR Komitesi",
    "ownership": {
      "tr": "Yönetim Kurulu & PR / Sponsorluk Ekibi",
      "en": "Executive Board & PR / Sponsorship Team"
    },
    "difficulty": 4,
    "target_audience": {
      "tr": "150+ Öğrenci, Akademisyenler ve Şirket Yöneticileri",
      "en": "150+ Students, Academics and Industry Leaders"
    },
    "image": "./assets/engineering_summit_hero.webp",
    "gallery": [
      "./assets/engineering_summit_hero.webp"
    ],
    "problem": {
      "tr": "Mühendislik öğrencilerinin mezuniyet öncesinde sektör yöneticileriyle doğrudan tanışıp projelerini sunabileceği prestijli bir kampüs zirvesi ihtiyacı.",
      "en": "Engineering students have limited direct exposure to corporate tech directors on campus to pitch their innovations prior to graduation."
    },
    "solution": {
      "tr": "Büyük amfide sektör konuşmacıları, paneller ve öğrenci proje sergi stantlarını bir araya getirecek bir teknoloji zirvesinin organize edilmesi planlanmaktadır.",
      "en": "A planned one-day engineering summit in the main amphitheater featuring keynote talks, industry panels, and student hardware showcase tables."
    },
    "specs": [
      {
        "label": {
          "tr": "Katılım",
          "en": "Attendance"
        },
        "value": {
          "tr": "~150 Katılımcı",
          "en": "~150 Attendees & Visitors"
        }
      },
      {
        "label": {
          "tr": "Konuşmacılar",
          "en": "Speakers"
        },
        "value": {
          "tr": "Sektör Mühendisleri & Yöneticileri",
          "en": "Industry Engineers & Leaders"
        }
      },
      {
        "label": {
          "tr": "Sergi",
          "en": "Exhibition"
        },
        "value": {
          "tr": "Öğrenci Proje Masaları",
          "en": "Student Project Tables"
        }
      },
      {
        "label": {
          "tr": "Kariyer",
          "en": "Career Track"
        },
        "value": {
          "tr": "Staj & Mentorluk Görüşmeleri",
          "en": "Internship & Mentorship Networking"
        }
      }
    ],
    "links": [
      "https://hasankaan28.github.io/ius-engineering-events-site/"
    ],
    "first_step": {
      "tr": "Amfi takviminin doğrulanması ve potansiyel konuşmacı listesi için ön araştırma yapılması planlanmaktadır.",
      "en": "Confirm amphitheater schedule availability and compile a preliminary list of prospective keynote speakers."
    },
    "palette": "urban-loft",
    "image_alt": {
      "tr": "IUS TechSummit 2027",
      "en": "IUS TechSummit 2027"
    }
  },
  {
    "id": "ius-hydro-plant",
    "sheet_id": 6,
    "is_flagship": true,
    "featured": true,
    "status": {
      "tr": "Öneri",
      "en": "Proposal"
    },
    "sponsor_status": null,
    "joinUrl": null,
    "category": {
      "tr": "Yenilenebilir Enerji & Donanım İnovasyonu",
      "en": "Renewable Energy & Hardware Innovation"
    },
    "badge": {
      "tr": "Proje Fikri",
      "en": "Project Idea"
    },
    "title": {
      "tr": "IUS HydroGen (Kampüs Mikro Hidroelektrik Santrali)",
      "en": "IUS HydroGen (Campus Micro-Hydroelectric Turbine)"
    },
    "tagline": {
      "tr": "Kampüs arazisinden geçen nehirden su türbini ile temiz enerji üretimi ve otonom akıllı depolama hedefi.",
      "en": "Generating clean campus energy and autonomous smart storage from the campus river via a micro water turbine."
    },
    "author": "Bekir Enes Çokbekler (Sayman / Finans)",
    "ownership": {
      "tr": "Bekir Enes Çokbekler (Proje Lideri & Finans)",
      "en": "Bekir Enes Çokbekler (Project Lead & Finance)"
    },
    "difficulty": 5,
    "target_audience": {
      "tr": "FENS Mühendislik Öğrencileri & Araştırmacılar",
      "en": "FENS Engineering Students & Researchers"
    },
    "image": "./assets/hydro_plant_hero.webp",
    "gallery": [
      "./assets/hydro_plant_hero.webp"
    ],
    "problem": {
      "tr": "Kampüs içerisindeki öğrenci projeleri ve açık alan prototipleri için bağımsız, sürdürülebilir yeşil enerji kaynağı eksikliği ve nehir akış potansiyelinin değerlendirilememesi.",
      "en": "Lack of autonomous, off-grid sustainable energy sources for outdoor campus projects and student hardware prototypes, leaving the university's natural river flow unutilized."
    },
    "solution": {
      "tr": "Kampüs arazisinden geçen nehre yerleştirilecek yaklaşık 50 cm çapında ve 1 metre uzunluğunda mikro su değirmeni ve jeneratör mekanizması ile elektrik üretilmesi; akıllı konumlandırma yazılımı ve enerji depolama ünitesiyle kulüp projelerine ve çevre aydınlatmasına temiz güç sağlanması hedeflenmektedir.",
      "en": "Proposed deployment of a micro water turbine (~50cm diameter, 1m length) and generator along the campus river, equipped with dynamic flow-positioning firmware and battery storage to power student hardware and outdoor lighting."
    },
    "specs": [
      {
        "label": {
          "tr": "Türbin / Mekanik",
          "en": "Turbine / Mechanics"
        },
        "value": {
          "tr": "50cm x 1m Silindirik Çark / Redüktör",
          "en": "50cm x 1m Cylindrical Impeller / Gearbox"
        }
      },
      {
        "label": {
          "tr": "Jeneratör & Güç",
          "en": "Generator & Power"
        },
        "value": {
          "tr": "AC/DC Alternatör & MPPT Şarj Devresi",
          "en": "AC/DC Alternator & MPPT Charge Controller"
        }
      },
      {
        "label": {
          "tr": "Kontrol & Yazılım",
          "en": "Control & Software"
        },
        "value": {
          "tr": "ESP32 / Otonom Akış Takip Yazılımı",
          "en": "ESP32 / Autonomous Flow-Tracking Firmware"
        }
      },
      {
        "label": {
          "tr": "Enerji Depolama",
          "en": "Energy Storage"
        },
        "value": {
          "tr": "LiFePO4 Batarya Paketi / BMS",
          "en": "LiFePO4 Battery Bank / BMS Protection"
        }
      }
    ],
    "links": [],
    "first_step": {
      "tr": "IUS Rektörlüğü ve FENS Dekanlığı ile görüşülerek nehir kullanım izinlerinin alınması, su debi rejiminin ölçülmesi ve prototip şasi tasarımı için çalışma ekibinin kurulması planlanmaktadır.",
      "en": "Schedule preliminary briefing with IUS Rectorate and FENS Deanship for site permissions, conduct hydrologic flow measurements, and assemble the multidisciplinary student mechanical & electrical team."
    },
    "palette": "urban-loft",
    "image_alt": {
      "tr": "IUS Kampüsü Nehir Tipi Mikro Hidroelektrik Santrali Konsept Tasarımı",
      "en": "Concept render of IUS Campus Micro-Hydroelectric Power Turbine along the river"
    }
  }
];
