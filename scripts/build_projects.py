#!/usr/bin/env python3
"""
build_projects.py
=================
IUS Engineering Club - Projects Data Pipeline
Transforms data/projects.xlsx into data/projects.json and projects/data/projects.json.
Features:
  1. Strict Excel schema & value validation (Row, Column, Slug, Difficulty 1-5, Sponsor Status).
  2. Optional automated translation via NVIDIA OpenAI-compatible API (NVIDIA_MODEL).
  3. Quality & fidelity verification (number and acronym consistency between TR and EN).
  4. Optional concept image synthesis via NVIDIA Image API (NVIDIA_IMAGE_MODEL).
  5. WebP image conversion and responsive sizing (1376x768 and 688x384 thumbnails).
  6. Detailed reports: translations_report.md, image_prompts.json, pr_summary.md.
  7. Dry-run mode (--dry-run) for safe inspection and testing without API calls.

Strict security rule: NVIDIA_API_KEY is read strictly from environment.
Never written, logged, or exposed.
"""

import argparse
import base64
import csv
import io
import json
import os
import re
import shutil
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

import openpyxl
from openpyxl.utils import get_column_letter

# PIL is used for WebP conversion and resizing
try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

# requests for NVIDIA API interactions
try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


# Allowed values
ALLOWED_SPONSOR_STATUSES = {None, "", "Sponsor Aranıyor", "Sponsor Gerekmiyor"}
MANDATORY_FIELDS = ["id", "difficulty", "title_tr", "problem_tr", "solution_tr"]

KNOWN_ACRONYMS = {"IUS", "FENS", "RFID", "IoT", "ESP32", "NFC", "BMS", "PWA", "LLM", "AI", "CS", "SE", "EE", "MVP"}

# Canonical Column Definitions
COLUMN_DEFS = [
    ("id", "Slug (Benzersiz ID)*"),
    ("sheet_id", "Sıra No"),
    ("is_flagship", "Flagship (TRUE/FALSE)"),
    ("featured", "Featured (TRUE/FALSE)"),
    ("difficulty", "Zorluk (1-5)*"),
    ("category_tr", "Kategori (TR)"),
    ("category_en", "Kategori (EN)"),
    ("badge_tr", "Rozet (TR)"),
    ("badge_en", "Rozet (EN)"),
    ("status_tr", "Durum (TR)"),
    ("status_en", "Durum (EN)"),
    ("sponsor_status", "Sponsor Durumu"),
    ("joinUrl", "Katılım URL"),
    ("title_tr", "Başlık (TR)*"),
    ("title_en", "Başlık (EN)"),
    ("tagline_tr", "Slogan (TR)"),
    ("tagline_en", "Slogan (EN)"),
    ("author", "Yazar / Lider"),
    ("ownership_tr", "Sahiplik (TR)"),
    ("ownership_en", "Sahiplik (EN)"),
    ("target_audience_tr", "Hedef Kitle (TR)"),
    ("target_audience_en", "Hedef Kitle (EN)"),
    ("image", "Görsel Yolu"),
    ("image_prompt", "Görsel Promptu (EN)"),
    ("image_alt_tr", "Görsel Alt (TR)"),
    ("image_alt_en", "Görsel Alt (EN)"),
    ("regenerate_image", "Yeniden Üret (TRUE/FALSE)"),
    ("problem_tr", "Problem (TR)*"),
    ("problem_en", "Problem (EN)"),
    ("solution_tr", "Çözüm (TR)*"),
    ("solution_en", "Çözüm (EN)"),
    ("first_step_tr", "İlk Adım (TR)"),
    ("first_step_en", "İlk Adım (EN)"),
    ("spec1_label_tr", "Param 1 Başlık (TR)"),
    ("spec1_label_en", "Param 1 Başlık (EN)"),
    ("spec1_val_tr", "Param 1 Değer (TR)"),
    ("spec1_val_en", "Param 1 Değer (EN)"),
    ("spec2_label_tr", "Param 2 Başlık (TR)"),
    ("spec2_label_en", "Param 2 Başlık (EN)"),
    ("spec2_val_tr", "Param 2 Değer (TR)"),
    ("spec2_val_en", "Param 2 Değer (EN)"),
    ("spec3_label_tr", "Param 3 Başlık (TR)"),
    ("spec3_label_en", "Param 3 Başlık (EN)"),
    ("spec3_val_tr", "Param 3 Değer (TR)"),
    ("spec3_val_en", "Param 3 Değer (EN)"),
    ("spec4_label_tr", "Param 4 Başlık (TR)"),
    ("spec4_label_en", "Param 4 Başlık (EN)"),
    ("spec4_val_tr", "Param 4 Değer (TR)"),
    ("spec4_val_en", "Param 4 Değer (EN)"),
    ("links", "Referans Linkleri"),
    ("palette", "Renk Paleti"),
    ("gallery", "Galeri Görselleri"),
]

TRANSLATION_PAIRS = [
    ("status_tr", "status_en", "Durum"),
    ("category_tr", "category_en", "Kategori"),
    ("badge_tr", "badge_en", "Rozet"),
    ("title_tr", "title_en", "Başlık"),
    ("tagline_tr", "tagline_en", "Slogan"),
    ("ownership_tr", "ownership_en", "Sahiplik"),
    ("target_audience_tr", "target_audience_en", "Hedef Kitle"),
    ("problem_tr", "problem_en", "Problem"),
    ("solution_tr", "solution_en", "Çözüm"),
    ("first_step_tr", "first_step_en", "İlk Adım"),
    ("spec1_label_tr", "spec1_label_en", "Param 1 Başlık"),
    ("spec1_val_tr", "spec1_val_en", "Param 1 Değer"),
    ("spec2_label_tr", "spec2_label_en", "Param 2 Başlık"),
    ("spec2_val_tr", "spec2_val_en", "Param 2 Değer"),
    ("spec3_label_tr", "spec3_label_en", "Param 3 Başlık"),
    ("spec3_val_tr", "spec3_val_en", "Param 3 Değer"),
    ("spec4_label_tr", "spec4_label_en", "Param 4 Başlık"),
    ("spec4_val_tr", "spec4_val_en", "Param 4 Değer"),
    ("image_alt_tr", "image_alt_en", "Görsel Alt"),
]


class ValidationError(Exception):
    """Raised when Excel schema or value validation fails."""
    pass


def clean_cell_value(val: Any) -> Any:
    """Normalize Excel cell value: empty strings/whitespace become None, strings are stripped."""
    if val is None:
        return None
    if isinstance(val, str):
        s = val.strip()
        return s if s != "" else None
    return val


def parse_bool_value(val: Any) -> Optional[bool]:
    """Parse cell value as boolean."""
    if val is None:
        return None
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return bool(val)
    s = str(val).strip().lower()
    if s in {"true", "1", "evet", "yes", "doğru", "dogru"}:
        return True
    if s in {"false", "0", "hayır", "hayir", "yanlış", "yanlis"}:
        return False
    return None


def extract_numbers(text: str) -> List[str]:
    """Extract all numbers from text for fidelity checking."""
    if not text:
        return []
    # Match integers, decimals with . or ,
    matches = re.findall(r"\b\d+(?:[.,]\d+)?\b", text)
    # Normalize comma to dot for decimal comparison
    return [m.replace(",", ".") for m in matches]


def check_fidelity(tr_text: str, en_text: str) -> Tuple[bool, List[str]]:
    """Compare numbers and key acronyms between TR and EN texts."""
    issues = []
    
    # 1. Number comparison
    tr_nums = extract_numbers(tr_text)
    en_nums = extract_numbers(en_text)
    
    # Check if any number from TR is missing in EN
    tr_set = set(tr_nums)
    en_set = set(en_nums)
    
    missing_nums = tr_set - en_set
    extra_nums = en_set - tr_set
    
    if missing_nums:
        issues.append(f"TR metnindeki sayılar EN çevirisinde bulunamadı: {missing_nums}")
    if extra_nums:
        issues.append(f"EN çevirisine TR metninde olmayan sayılar eklenmiş: {extra_nums}")
        
    # 2. Known Acronyms check
    for acr in KNOWN_ACRONYMS:
        if re.search(r"\b" + re.escape(acr) + r"\b", tr_text, re.IGNORECASE):
            if not re.search(r"\b" + re.escape(acr) + r"\b", en_text, re.IGNORECASE):
                issues.append(f"Önemli kısaltma / terim kayıp: '{acr}'")

    return (len(issues) == 0, issues)


def call_nvidia_chat(api_key: str, model: str, system_prompt: str, user_prompt: str) -> Optional[str]:
    """Call NVIDIA's OpenAI-compatible chat completion endpoint."""
    if not REQUESTS_AVAILABLE:
        print("  [UYARI] 'requests' kütüphanesi yüklü değil, API çağrısı atlanıyor.")
        return None
        
    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.1,
        "top_p": 0.7,
        "max_tokens": 1024
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=45)
        if response.status_code == 200:
            data = response.json()
            choices = data.get("choices", [])
            if choices:
                content = choices[0].get("message", {}).get("content", "").strip()
                # Remove possible markdown fences or wrapping quotes
                content = re.sub(r"^```[a-zA-Z]*\n?", "", content)
                content = re.sub(r"\n?```$", "", content)
                return content.strip().strip('"').strip("'")
            return None
        else:
            print(f"  [UYARI] NVIDIA Chat API HTTP {response.status_code}: {response.text[:180]}")
            return None
    except Exception as exc:
        print(f"  [UYARI] NVIDIA Chat API bağlantı hatası: {exc}")
        return None


def call_nvidia_image(api_key: str, model_or_url: str, prompt: str) -> Optional[bytes]:
    """Call NVIDIA's image generation endpoint."""
    if not REQUESTS_AVAILABLE:
        print("  [UYARI] 'requests' kütüphanesi yüklü değil, görsel üretimi atlanıyor.")
        return None
        
    custom_endpoint = os.environ.get("NVIDIA_IMAGE_ENDPOINT", "").strip()
    if custom_endpoint:
        endpoint_url = custom_endpoint
    elif model_or_url.startswith("http://") or model_or_url.startswith("https://"):
        endpoint_url = model_or_url
    else:
        clean_model = model_or_url.strip("/")
        endpoint_url = f"https://ai.api.nvidia.com/v1/genai/{clean_model}"
        
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    # Try with aspect_ratio first
    payloads_to_try = [
        {"prompt": prompt, "aspect_ratio": "16:9"},
        {"prompt": prompt, "width": 1024, "height": 576},
        {"prompt": prompt}
    ]
    
    for payload in payloads_to_try:
        try:
            response = requests.post(endpoint_url, headers=headers, json=payload, timeout=90)
            if response.status_code == 200:
                res_data = response.json()
                
                # Check for artifacts (NVIDIA NIM standard format)
                artifacts = res_data.get("artifacts", [])
                if artifacts:
                    b64_str = artifacts[0].get("base64") or artifacts[0].get("data")
                    if b64_str:
                        return base64.b64decode(b64_str)
                
                # Check for OpenAI-compatible data array
                data_arr = res_data.get("data", [])
                if data_arr:
                    first_item = data_arr[0]
                    if "b64_json" in first_item:
                        return base64.b64decode(first_item["b64_json"])
                    elif "url" in first_item:
                        img_res = requests.get(first_item["url"], timeout=45)
                        if img_res.status_code == 200:
                            return img_res.content
                            
                # Check for direct image key
                if "image" in res_data:
                    return base64.b64decode(res_data["image"])
                    
                print(f"  [UYARI] Bilinmeyen görsel yanıt yapısı: {list(res_data.keys())}")
                return None
            elif response.status_code in {400, 422}:
                # Parameter validation failure, try next payload configuration
                continue
            else:
                print(f"  [UYARI] NVIDIA Image API HTTP {response.status_code}: {response.text[:200]}")
                return None
        except Exception as exc:
            print(f"  [UYARI] NVIDIA Image API çağrısı sırasında hata: {exc}")
            return None
            
    return None


def read_and_validate_excel(excel_path: Path) -> List[Dict[str, Any]]:
    """Read Excel workbook, validate schema, types, slugs, and sponsor statuses strictly."""
    if not excel_path.exists():
        raise ValidationError(f"Excel dosyası bulunamadı: {excel_path}")
        
    wb = openpyxl.load_workbook(str(excel_path), data_only=True)
    ws = wb.active
    
    # 1. Read header row
    headers: Dict[str, Tuple[int, str]] = {}  # col_key -> (col_index, col_letter)
    for col_idx in range(1, ws.max_column + 1):
        cell_val = ws.cell(row=1, column=col_idx).value
        if cell_val is not None:
            key = str(cell_val).strip()
            col_letter = get_column_letter(col_idx)
            headers[key] = (col_idx, col_letter)
            
    # Check if mandatory column keys exist in header
    for m_field in MANDATORY_FIELDS:
        if m_field not in headers:
            raise ValidationError(f"Excel başlık satırında (1. satır) zorunlu sütun eksik: '{m_field}'")
            
    # 2. Iterate data rows
    projects: List[Dict[str, Any]] = []
    seen_slugs: Dict[str, int] = {}  # slug -> row_idx
    
    for row_idx in range(2, ws.max_row + 1):
        # Check if entire row is empty
        is_empty_row = True
        for col_idx in range(1, ws.max_column + 1):
            if ws.cell(row=row_idx, column=col_idx).value is not None:
                is_empty_row = False
                break
        if is_empty_row:
            continue
            
        row_dict: Dict[str, Any] = {}
        row_dict["_row_idx"] = row_idx
        
        # Read all known columns
        for col_key, _ in COLUMN_DEFS:
            if col_key in headers:
                c_idx, c_letter = headers[col_key]
                val = ws.cell(row=row_idx, column=c_idx).value
                row_dict[col_key] = clean_cell_value(val)
            else:
                row_dict[col_key] = None
                
        # --- Strict Validations ---
        # 1. Mandatory fields
        for req_field in MANDATORY_FIELDS:
            val = row_dict.get(req_field)
            if val is None or str(val).strip() == "":
                c_idx, c_letter = headers.get(req_field, (0, "?"))
                raise ValidationError(
                    f"Zorunlu alan boş bırakılamaz! Satır: {row_idx}, Sütun: {c_letter} ('{req_field}')"
                )
                
        # 2. Slug (id) format & uniqueness
        slug = str(row_dict["id"]).strip()
        slug_col_idx, slug_col_letter = headers["id"]
        if not re.match(r"^[a-z0-9-_]+$", slug):
            raise ValidationError(
                f"Geçersiz slug formatı! Satır: {row_idx}, Sütun: {slug_col_letter} ('id'). "
                f"Slug sadece küçük harf, rakam, tire (-) ve alt çizgi (_) içerebilir. Verilen: '{slug}'"
            )
        if slug in seen_slugs:
            prev_row = seen_slugs[slug]
            raise ValidationError(
                f"Slug tekrar ediyor (Benzersiz olmalıdır)! Satır: {row_idx}, Sütun: {slug_col_letter} ('id'). "
                f"Slug '{slug}' daha önce Satır {prev_row} üzerinde tanımlandı."
            )
        seen_slugs[slug] = row_idx
        row_dict["id"] = slug
        
        # 3. Difficulty validation (1-5 integer)
        diff_val = row_dict["difficulty"]
        diff_col_idx, diff_col_letter = headers["difficulty"]
        try:
            diff_int = int(diff_val)
            if not (1 <= diff_int <= 5):
                raise ValueError()
            row_dict["difficulty"] = diff_int
        except (ValueError, TypeError):
            raise ValidationError(
                f"Zorluk değeri 1 ile 5 arasında bir tam sayı olmalıdır! "
                f"Satır: {row_idx}, Sütun: {diff_col_letter} ('difficulty'), Verilen: '{diff_val}'"
            )
            
        # 4. Sponsor status validation
        sponsor_val = row_dict.get("sponsor_status")
        if sponsor_val is not None:
            sponsor_str = str(sponsor_val).strip()
            if sponsor_str not in ALLOWED_SPONSOR_STATUSES:
                s_col_idx, s_col_letter = headers.get("sponsor_status", (0, "?"))
                raise ValidationError(
                    f"Geçersiz sponsor_status değeri! Satır: {row_idx}, Sütun: {s_col_letter} ('sponsor_status'). "
                    f"Verilen: '{sponsor_str}'. İzin verilen değerler: Boş (null), 'Sponsor Aranıyor', 'Sponsor Gerekmiyor'."
                )
            row_dict["sponsor_status"] = sponsor_str if sponsor_str != "" else None
        else:
            row_dict["sponsor_status"] = None
            
        # 5. Boolean conversions
        for bool_field in ["is_flagship", "featured", "regenerate_image"]:
            b_val = row_dict.get(bool_field)
            if b_val is not None:
                parsed_b = parse_bool_value(b_val)
                row_dict[bool_field] = parsed_b if parsed_b is not None else False
            else:
                row_dict[bool_field] = False
                
        projects.append(row_dict)
        
    wb.close()
    return projects


def process_translations(
    projects: List[Dict[str, Any]],
    api_key: Optional[str],
    model: Optional[str],
    dry_run: bool
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Translate empty EN fields where TR is present using NVIDIA OpenAI-compatible endpoint.
    Returns (updated_projects, translation_report_records).
    """
    report_records: List[Dict[str, Any]] = []
    
    can_translate = bool(api_key and model and not dry_run)
    if not api_key:
        print("[BİLGİ] NVIDIA_API_KEY bulunamadı veya boş. Çeviri adımı atlanıyor.")
    elif not model:
        print("[BİLGİ] NVIDIA_MODEL ortam değişkeni tanımlı değil. Çeviri adımı atlanıyor.")
    elif dry_run:
        print("[DRY-RUN] Çeviri API çağrıları simüle ediliyor (çeviri yapılmayacak).")

    system_prompt = (
        "You are a strict, faithful technical translator from Turkish to English for an academic engineering club. "
        "Translate the user input into professional English.\n"
        "STRICT RULES:\n"
        "1. Translate ONLY. Do not add any new information, figures, claims, sponsor names, explanations, or commentary.\n"
        "2. Do NOT expand or embellish the meaning under any circumstance.\n"
        "3. Preserve all numbers, measurements, percentages, proper names, and technical acronyms (such as IUS, FENS, RFID, IoT, ESP32, PWA, etc.) exactly.\n"
        "4. Output ONLY the raw English translation with no markdown fences, no quotes, and no intro/outro text."
    )

    for p in projects:
        slug = p["id"]
        for tr_key, en_key, field_label in TRANSLATION_PAIRS:
            tr_val = p.get(tr_key)
            en_val = p.get(en_key)
            
            # Condition: TR is filled, but EN is empty
            if tr_val and (en_val is None or str(en_val).strip() == ""):
                tr_text = str(tr_val).strip()
                
                if dry_run:
                    report_records.append({
                        "id": slug,
                        "field": en_key,
                        "label": field_label,
                        "tr": tr_text,
                        "en": "[DRY-RUN: Çeviri simülasyonu]",
                        "status": "Dry-Run Planlandı",
                        "notes": "API çağrılmadı"
                    })
                    continue
                    
                if not can_translate:
                    report_records.append({
                        "id": slug,
                        "field": en_key,
                        "label": field_label,
                        "tr": tr_text,
                        "en": None,
                        "status": "Atlandı",
                        "notes": "NVIDIA_API_KEY veya NVIDIA_MODEL yok"
                    })
                    continue
                    
                # Execute NVIDIA translation
                print(f"  -> Çevriliyor [{slug}] {field_label}...")
                translated = call_nvidia_chat(api_key, model, system_prompt, tr_text)
                
                if translated:
                    # Fidelity check
                    is_faithful, issues = check_fidelity(tr_text, translated)
                    if is_faithful:
                        p[en_key] = translated
                        report_records.append({
                            "id": slug,
                            "field": en_key,
                            "label": field_label,
                            "tr": tr_text,
                            "en": translated,
                            "status": "Onaylandı (Uyumlu)",
                            "notes": "Sayılar ve terimler doğrulandı."
                        })
                    else:
                        # Mismatch detected: leave untranslated and record warning
                        issue_msg = "; ".join(issues)
                        print(f"  [UYARI] [{slug}] {field_label} için uyuşmazlık tespit edildi: {issue_msg}. Alan çevrilmemiş bırakıldı.")
                        report_records.append({
                            "id": slug,
                            "field": en_key,
                            "label": field_label,
                            "tr": tr_text,
                            "en": None,
                            "status": "Uyuşmazlık Nedeniyle Reddedildi",
                            "notes": f"Alan boş bırakıldı. Tespit edilen sorunlar: {issue_msg}"
                        })
                else:
                    report_records.append({
                        "id": slug,
                        "field": en_key,
                        "label": field_label,
                        "tr": tr_text,
                        "en": None,
                        "status": "Başarısız",
                        "notes": "API yanıt vermedi veya hata döndü"
                    })
                    
                time.sleep(0.3)  # Gentle rate limiting

    return projects, report_records


def process_concept_images(
    projects: List[Dict[str, Any]],
    api_key: Optional[str],
    chat_model: Optional[str],
    image_model: Optional[str],
    style_suffix: str,
    assets_dirs: List[Path],
    dry_run: bool
) -> Tuple[List[Dict[str, Any]], Dict[str, Any], List[str]]:
    """
    Handle automated concept render prompt synthesis and image generation.
    Returns (updated_projects, prompt_records, generated_assets_list).
    """
    prompt_records: Dict[str, Any] = {}
    generated_assets: List[str] = []
    
    can_gen_prompt = bool(api_key and chat_model and not dry_run)
    can_gen_image = bool(api_key and image_model and not dry_run and PIL_AVAILABLE)
    
    if not api_key:
        print("[BİLGİ] NVIDIA_API_KEY bulunamadı veya boş. Görsel üretimi atlanıyor.")
    elif not image_model:
        print("[BİLGİ] NVIDIA_IMAGE_MODEL ortam değişkeni tanımlı değil. Görsel üretimi atlanıyor.")
    elif dry_run:
        print("[DRY-RUN] Görsel üretimi simüle ediliyor (API çağrılmayacak).")

    prompt_gen_system = (
        "You are an expert prompt engineer creating a visual concept render prompt for a 3D architectural/industrial design AI model.\n"
        "Write a concise, vivid English description capturing the core hardware or scene described in the project.\n"
        "CRITICAL RULES:\n"
        "1. Do NOT include any text, letters, signage, typography, logos, brand names, or watermarks.\n"
        "2. Do NOT include identifiable human faces or identifiable people.\n"
        "3. Include NOTHING that is not explicitly part of the project's title, problem, and solution.\n"
        "4. Output ONLY the raw descriptive prompt sentence, no commentary, no markdown, no quotes."
    )

    for p in projects:
        slug = p["id"]
        img_val = p.get("image")
        regen = bool(p.get("regenerate_image"))
        
        # Check if assets/<slug>.webp exists in any target directory
        asset_exists = any((d / f"{slug}.webp").exists() for d in assets_dirs)
        
        # Decide if this project needs image generation
        needs_image = False
        if regen:
            needs_image = True
        elif (img_val is None or str(img_val).strip() == "") and not asset_exists:
            needs_image = True
            
        if not needs_image:
            # Project already has an image, ensure image path is populated
            if not img_val and asset_exists:
                p["image"] = f"./assets/{slug}.webp"
                p["gallery"] = [f"./assets/{slug}.webp"]
            continue

        print(f"\n[Görsel Gerekli] Proje '{slug}' için konsept görseli işleniyor...")
        
        # 1. Determine prompt
        base_prompt = p.get("image_prompt")
        full_prompt = ""
        prompt_source = "manual"
        
        if base_prompt and str(base_prompt).strip():
            full_prompt = f"{str(base_prompt).strip().rstrip('. ')}, {style_suffix.strip()}"
            prompt_source = "excel_image_prompt"
        else:
            if dry_run:
                full_prompt = f"[DRY-RUN PROMPT: AI concept for {slug}], {style_suffix.strip()}"
                prompt_source = "dry_run_simulated"
            elif can_gen_prompt:
                title = p.get("title_en") or p.get("title_tr") or slug
                prob = p.get("problem_en") or p.get("problem_tr") or ""
                sol = p.get("solution_en") or p.get("solution_tr") or ""
                user_msg = f"Title: {title}\nProblem: {prob}\nSolution: {sol}"
                
                print(f"  -> Prompt üretiliyor (NVIDIA_MODEL: {chat_model})...")
                ai_prompt = call_nvidia_chat(api_key, chat_model, prompt_gen_system, user_msg)
                if ai_prompt:
                    full_prompt = f"{ai_prompt.rstrip('. ')}, {style_suffix.strip()}"
                    prompt_source = "nvidia_chat_model"
                else:
                    full_prompt = f"Futuristic engineering concept hardware for {title}, {style_suffix.strip()}"
                    prompt_source = "fallback_rule"
            else:
                title = p.get("title_en") or p.get("title_tr") or slug
                full_prompt = f"Futuristic engineering concept hardware for {title}, {style_suffix.strip()}"
                prompt_source = "fallback_offline"

        prompt_records[slug] = {
            "prompt": full_prompt,
            "source": prompt_source,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

        if dry_run:
            print(f"  [DRY-RUN] Üretilecek görsel: assets/{slug}.webp")
            print(f"  [DRY-RUN] Kullanılacak Prompt: {full_prompt}")
            p["image"] = f"./assets/{slug}.webp"
            p["gallery"] = [f"./assets/{slug}.webp"]
            p["imageIsConcept"] = True
            continue

        # 2. Generate Image via NVIDIA Image API
        if not can_gen_image:
            print("  [UYARI] Görsel üretimi atlandı (NVIDIA_IMAGE_MODEL veya anahtar yok).")
            continue
            
        print(f"  -> Görsel üretiliyor (NVIDIA_IMAGE_MODEL: {image_model})...")
        img_bytes = call_nvidia_image(api_key, image_model, full_prompt)
        
        if img_bytes:
            try:
                # Process with PIL
                img = Image.open(io.BytesIO(img_bytes))
                if img.mode != "RGB":
                    img = img.convert("RGB")
                    
                # Resize to standard hero dimensions: 1376x768
                hero_img = img.resize((1376, 768), Image.Resampling.LANCZOS)
                # Small thumbnail: 688x384
                sm_img = img.resize((688, 384), Image.Resampling.LANCZOS)
                
                # Save to all target asset directories
                for a_dir in assets_dirs:
                    a_dir.mkdir(parents=True, exist_ok=True)
                    main_path = a_dir / f"{slug}.webp"
                    sm_path = a_dir / f"{slug}-sm.webp"
                    
                    hero_img.save(str(main_path), format="WEBP", quality=85)
                    sm_img.save(str(sm_path), format="WEBP", quality=80)
                    
                generated_assets.append(f"assets/{slug}.webp")
                generated_assets.append(f"assets/{slug}-sm.webp")
                
                p["image"] = f"./assets/{slug}.webp"
                p["gallery"] = [f"./assets/{slug}.webp"]
                p["imageIsConcept"] = True
                print(f"  [BAŞARILI] Konsept görseli kaydedildi: assets/{slug}.webp (1376x768 ve 688x384)")
            except Exception as save_err:
                print(f"  [HATA] Görsel kaydedilemedi: {save_err}")
        else:
            print(f"  [UYARI] Proje '{slug}' için görsel üretilemedi. image alanı boş bırakıldı.")

    return projects, prompt_records, generated_assets


def assemble_final_json(projects: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Convert flat tabular row dictionary to exact projects.json schema format."""
    output: List[Dict[str, Any]] = []
    
    for p in projects:
        # Build specs
        specs: List[Dict[str, Any]] = []
        for i in range(1, 5):
            lbl_tr = p.get(f"spec{i}_label_tr")
            lbl_en = p.get(f"spec{i}_label_en")
            val_tr = p.get(f"spec{i}_val_tr")
            val_en = p.get(f"spec{i}_val_en")
            
            if lbl_tr or val_tr or lbl_en or val_en:
                specs.append({
                    "label": {
                        "tr": lbl_tr,
                        "en": lbl_en
                    },
                    "value": {
                        "tr": val_tr,
                        "en": val_en
                    }
                })
                
        # Parse links
        links_raw = p.get("links")
        links_list: List[str] = []
        if isinstance(links_raw, str) and links_raw.strip():
            links_list = [l.strip() for l in re.split(r"[,;\n]+", links_raw) if l.strip()]
        elif isinstance(links_raw, list):
            links_list = links_raw
            
        # Parse gallery
        gallery_raw = p.get("gallery")
        gallery_list: List[str] = []
        if isinstance(gallery_raw, str) and gallery_raw.strip():
            gallery_list = [g.strip() for g in re.split(r"[,;\n]+", gallery_raw) if g.strip()]
        elif isinstance(gallery_raw, list):
            gallery_list = gallery_raw
        elif p.get("image"):
            gallery_list = [p["image"]]
            
        # Alt texts
        image_alt_tr = p.get("image_alt_tr") or p.get("title_tr")
        image_alt_en = p.get("image_alt_en") or p.get("title_en")
        image_alt_obj = None
        if image_alt_tr or image_alt_en:
            image_alt_obj = {
                "tr": image_alt_tr,
                "en": image_alt_en
            }

        item: Dict[str, Any] = {
            "id": p["id"],
            "sheet_id": p.get("sheet_id"),
            "is_flagship": bool(p.get("is_flagship")),
            "featured": bool(p.get("featured")),
            "status": {
                "tr": p.get("status_tr"),
                "en": p.get("status_en")
            },
            "sponsor_status": p.get("sponsor_status"),
            "joinUrl": p.get("joinUrl"),
            "category": {
                "tr": p.get("category_tr"),
                "en": p.get("category_en")
            },
            "badge": {
                "tr": p.get("badge_tr"),
                "en": p.get("badge_en")
            },
            "title": {
                "tr": p.get("title_tr"),
                "en": p.get("title_en")
            },
            "tagline": {
                "tr": p.get("tagline_tr"),
                "en": p.get("tagline_en")
            },
            "author": p.get("author"),
            "ownership": {
                "tr": p.get("ownership_tr"),
                "en": p.get("ownership_en")
            },
            "difficulty": p.get("difficulty"),
            "target_audience": {
                "tr": p.get("target_audience_tr"),
                "en": p.get("target_audience_en")
            },
            "image": p.get("image"),
            "gallery": gallery_list,
            "problem": {
                "tr": p.get("problem_tr"),
                "en": p.get("problem_en")
            },
            "solution": {
                "tr": p.get("solution_tr"),
                "en": p.get("solution_en")
            },
            "specs": specs,
            "links": links_list,
            "first_step": {
                "tr": p.get("first_step_tr"),
                "en": p.get("first_step_en")
            },
            "palette": p.get("palette") or "gothic-noir"
        }
        
        if image_alt_obj:
            item["image_alt"] = image_alt_obj
            
        if p.get("imageIsConcept"):
            item["imageIsConcept"] = True

        output.append(item)
        
    return output


def write_translation_report(report_records: List[Dict[str, Any]], output_paths: List[Path], model_used: Optional[str]) -> None:
    """Generate Markdown report of all translations performed."""
    lines = [
        "# NVIDIA Otomatik Çeviri Denetim Raporu",
        "",
        f"- **Tarih (UTC):** {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}",
        f"- **Kullanılan Model:** `{model_used or 'Tanımsız / Çevrimdışı'}`",
        f"- **İşlenen Toplam Alan:** {len(report_records)}",
        "",
        "| Proje ID | Alan | Türkçe Kaynak | İngilizce Çeviri | Durum | Notlar |",
        "| :--- | :--- | :--- | :--- | :--- | :--- |"
    ]
    
    if not report_records:
        lines.append("| - | - | Eksik İngilizce alan bulunamadı. | - | Temiz | Çeviri gerekmedi. |")
    else:
        for r in report_records:
            tr_esc = (r.get("tr") or "").replace("|", "\\|").replace("\n", " ")
            en_esc = (r.get("en") or "-").replace("|", "\\|").replace("\n", " ")
            lines.append(
                f"| `{r['id']}` | **{r['label']}** (`{r['field']}`) | {tr_esc} | {en_esc} | {r['status']} | {r['notes']} |"
            )
            
    lines.extend([
        "",
        "---",
        "*Not: Rakam veya kritik kısaltma uyuşmazlığı tespit edilen alanlar güvenli biçimde boş bırakılır ve onay için burada işaretlenir.*"
    ])
    
    content = "\n".join(lines) + "\n"
    for out_p in output_paths:
        out_p.parent.mkdir(parents=True, exist_ok=True)
        out_p.write_text(content, encoding="utf-8")


def write_pr_summary(
    output_path: Path,
    generated_assets: List[str],
    prompt_records: Dict[str, Any],
    report_records: List[Dict[str, Any]],
    total_projects: int
) -> None:
    """Generate pull request body summary markdown."""
    lines = [
        "## 🚀 Otomatik Proje Verisi & Görsel Güncellemesi",
        "",
        "Bu Pull Request, `data/projects.xlsx` Excel dosyasından otomatik olarak üretilmiştir.",
        "",
        f"- **Toplam Doğrulanan Proje:** {total_projects}",
        f"- **Yeni Üretilen Görsel Dosyaları:** {len(generated_assets)}",
        f"- **Otomatik Çevrilen Alan Sayısı:** {len([r for r in report_records if r.get('status') == 'Onaylandı (Uyumlu)'])}",
        "",
        "### 🖼️ Üretilen Dosyalar ve Promptlar"
    ]
    
    if generated_assets:
        lines.append("#### Üretilen Varlıklar:")
        for ast in generated_assets:
            lines.append(f"- `{ast}`")
            
    if prompt_records:
        lines.append("\n#### Kullanılan Görsel Promptları:")
        for slug, pdata in prompt_records.items():
            lines.append(f"- **`{slug}`** ({pdata.get('source')}): `{pdata.get('prompt')}`")
    else:
        lines.append("*Yeni görsel üretilmedi veya mevcut görseller korundu.*")
        
    lines.extend([
        "",
        "### 📋 İnceleme & Onay Kontrol Listesi",
        "- [ ] Veri şeması ve Türkçe/İngilizce metinler doğrulandı.",
        "- [ ] **Görseli ben inceledim ve sitede yayına uygun olduğunu onaylıyorum.**",
        "",
        "*(Bu PR onaylandığında GitHub Pages sitesi yeni proje verileriyle anında canlıya geçecektir.)*"
    ])
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def slugify(text: str) -> str:
    """Generate clean slug from Turkish or English title."""
    text = text.lower().strip()
    tr_map = str.maketrans("çğıöşü", "cgiosu")
    text = text.translate(tr_map)
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "proje-onerisi"


def sync_google_sheet(
    sheet_id_or_url: str,
    excel_paths: List[Path],
    dry_run: bool = False
) -> int:
    """
    Fetch responses from Google Sheet (connected to Google Forms).
    If a new response is detected that is not in projects.xlsx, append it to projects.xlsx.
    Returns count of new projects added.
    """
    if not REQUESTS_AVAILABLE:
        print("  [UYARI] 'requests' kütüphanesi yok, Google Sheets senkronizasyonu atlandı.")
        return 0
        
    # Extract sheet ID
    match = re.search(r"/spreadsheets/d/([a-zA-Z0-9-_]+)", sheet_id_or_url)
    sheet_id = match.group(1) if match else sheet_id_or_url.strip()
    
    csv_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv"
    try:
        res = requests.get(csv_url, timeout=20)
        if res.status_code != 200:
            print(f"  [UYARI] Google Sheets export alınamadı (HTTP {res.status_code})")
            return 0
        
        reader = csv.reader(io.StringIO(res.text))
        rows = list(reader)
        if len(rows) < 2:
            return 0
    except Exception as e:
        print(f"  [UYARI] Google Sheets bağlantı hatası: {e}")
        return 0

    # Load existing Excel to find existing slugs & titles
    target_excel = excel_paths[0]
    if not target_excel.exists():
        return 0
        
    wb = openpyxl.load_workbook(str(target_excel))
    ws = wb.active
    
    # Map header keys to column indices
    col_map = {}
    for col_idx in range(1, ws.max_column + 1):
        k = ws.cell(row=1, column=col_idx).value
        if k:
            col_map[str(k).strip()] = col_idx
            
    existing_slugs = set()
    existing_titles = set()
    for row_idx in range(2, ws.max_row + 1):
        s_val = ws.cell(row=row_idx, column=col_map.get("id", 1)).value
        t_val = ws.cell(row=row_idx, column=col_map.get("title_tr", 14)).value
        if s_val:
            existing_slugs.add(str(s_val).strip().lower())
        if t_val:
            existing_titles.add(str(t_val).strip().lower())

    palettes = ["gothic-noir", "cobalt-sky", "chili-spice", "ink-wash", "urban-loft"]
    new_added = 0
    
    # Process Google Sheet rows (row 0 is header)
    for r_idx, r in enumerate(rows[1:], 1):
        if len(r) < 5:
            continue
            
        title_raw = r[2].strip() if len(r) > 2 else ""
        if not title_raw:
            continue
            
        base_slug = slugify(title_raw)
        
        # Check if already exists by slug or title match
        is_dup = (base_slug in existing_slugs or title_raw.lower() in existing_titles)
        if not is_dup:
            for kw in ["powerbank", "yemekhane", "dining", "devhack", "hackathon", "prompt-labs", "techsummit"]:
                if (kw in base_slug or kw in title_raw.lower()) and any(kw in es or kw in et for es in existing_slugs for et in existing_titles):
                    is_dup = True
                    break
        if is_dup:
            continue
            
        # Unique slug resolution
        cand_slug = base_slug
        suffix_num = 2
        while cand_slug in existing_slugs:
            cand_slug = f"{base_slug}-{suffix_num}"
            suffix_num += 1
            
        existing_slugs.add(cand_slug)
        existing_titles.add(title_raw.lower())
        
        author_raw = r[1].strip() if len(r) > 1 else "Öğrenci Girişimi"
        category_raw = r[3].strip() if len(r) > 3 else "Genel Mühendislik İnovasyonu"
        category_clean = category_raw.split(",")[0].strip() or "Mühendislik & İnovasyon"
        problem_raw = r[4].strip() if len(r) > 4 else "Problem detayı formda belirtilmemiş."
        solution_raw = r[5].strip() if len(r) > 5 else "Çözüm adımları formda belirtilmemiş."
        audience_raw = r[6].strip() if len(r) > 6 else "Tüm IUS Öğrencileri"
        cost_raw = r[7].strip() if len(r) > 7 else ""
        diff_raw = r[8].strip() if len(r) > 8 else "3"
        first_step_raw = r[10].strip() if len(r) > 10 else "Teknik ön fizibilite yapılması."
        links_raw = r[11].strip() if len(r) > 11 else ""
        
        # Difficulty int 1-5
        diff_match = re.search(r"\d+", diff_raw)
        diff_int = int(diff_match.group(0)) if diff_match else 3
        diff_int = max(1, min(5, diff_int))
        
        # Sponsor status
        sponsor_status = "Sponsor Aranıyor" if any(w in cost_raw.lower() for w in ["sponsor", "büyük bütçe", "400+"]) else "Sponsor Gerekmiyor"
        
        # Palette cycle
        cur_row_count = ws.max_row
        pal = palettes[cur_row_count % len(palettes)]
        
        print(f"  [GOOGLE FORM YANITI] Yeni proje tespit edildi: '{title_raw}' -> Slug: '{cand_slug}', Lider: {author_raw}")
        new_added += 1
        
        if dry_run:
            continue
            
        # Write new row in Excel
        new_row_idx = ws.max_row + 1
        row_cells = {
            "id": cand_slug,
            "sheet_id": new_row_idx - 1,
            "is_flagship": True,
            "featured": True,
            "difficulty": diff_int,
            "category_tr": category_clean,
            "badge_tr": "Proje Fikri",
            "status_tr": "Öneri",
            "sponsor_status": sponsor_status,
            "title_tr": title_raw,
            "author": author_raw,
            "ownership_tr": author_raw,
            "target_audience_tr": audience_raw,
            "regenerate_image": False,
            "problem_tr": problem_raw,
            "solution_tr": solution_raw,
            "first_step_tr": first_step_raw,
            "spec1_label_tr": "Kategori",
            "spec1_val_tr": category_clean,
            "spec2_label_tr": "Hedef Kitle",
            "spec2_val_tr": audience_raw,
            "spec3_label_tr": "Bütçe Kapsamı",
            "spec3_val_tr": cost_raw.split("(")[0].strip() or "Öğrenci Projesi",
            "spec4_label_tr": "Zorluk",
            "spec4_val_tr": f"{diff_int} / 5",
            "links": links_raw,
            "palette": pal
        }
        
        for k, v in row_cells.items():
            if k in col_map:
                ws.cell(row=new_row_idx, column=col_map[k], value=v)

    if new_added > 0 and not dry_run:
        wb.save(str(target_excel))
        wb.close()
        # Mirror to all target excel paths
        for other_p in excel_paths[1:]:
            other_p.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(str(target_excel), str(other_p))
        print(f"[BAŞARILI] {new_added} yeni proje Google Sheets'ten Excel'e aktarıldı.")
    else:
        wb.close()
        
    return new_added


def main():
    parser = argparse.ArgumentParser(description="IUS Engineering Club - Projects Excel Pipeline")
    parser.add_argument("--excel", type=str, default=None, help="Path to input projects.xlsx")
    parser.add_argument("--google-sheet", type=str, default=None, help="Google Sheet URL or ID to pull responses from")
    parser.add_argument("--dry-run", action="store_true", help="Inspect and validate without making API calls or modifying assets")
    parser.add_argument("--skip-translate", action="store_true", help="Skip NVIDIA translation step")
    parser.add_argument("--skip-images", action="store_true", help="Skip concept image generation step")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent

    # Determine input Excel paths
    excel_candidates = [
        Path(args.excel) if args.excel else None,
        repo_root / "data" / "projects.xlsx",
        repo_root / "projects" / "data" / "projects.xlsx"
    ]
    excel_path = None
    all_excel_paths = []
    for cand in excel_candidates:
        if cand and cand.exists():
            if not excel_path:
                excel_path = cand
            all_excel_paths.append(cand)

    if not excel_path:
        print("[HATA] projects.xlsx dosyası bulunamadı! Aranan konumlar:")
        for cand in excel_candidates:
            if cand:
                print(f"  - {cand}")
        sys.exit(1)

    print(f"=== IUS Engineering Pipeline Başlatıldı ===")
    print(f"Girdi Dosyası: {excel_path}")
    if args.dry_run:
        print("[MOD] --dry-run devrede. Harici API çağrısı yapılmayacak.")

    # Optional Google Sheets Auto-Sync (connected to Google Forms)
    sheet_param = args.google_sheet or os.environ.get("GOOGLE_SHEET_ID") or os.environ.get("GOOGLE_SHEET_URL") or "1r9aVO0WNHy4AtvIQu1rExEB9X1of1KBOU5ErUTf0jFw"
    if sheet_param:
        print(f"[GOOGLE FORMS ENTEGRASYONU] Google E-Tablo kontrol ediliyor ({sheet_param[:18]}...)...")
        sync_google_sheet(sheet_param, all_excel_paths, args.dry_run)

    # Read and Validate Excel
    try:
        raw_projects = read_and_validate_excel(excel_path)
        print(f"[BAŞARILI] Excel başarıyla doğrulandı. Toplam {len(raw_projects)} proje bulundu.")
    except ValidationError as val_err:
        print(f"\n[DOĞRULAMA HATASI] {val_err}\n")
        sys.exit(1)

    # Environment variables (Never logged)
    api_key = os.environ.get("NVIDIA_API_KEY", "").strip() or None
    chat_model = os.environ.get("NVIDIA_MODEL", "").strip() or None
    image_model = os.environ.get("NVIDIA_IMAGE_MODEL", "").strip() or None

    # Load style suffix
    style_file = repo_root / "scripts" / "image_style.txt"
    style_suffix = "photorealistic concept render, modern university campus setting, cinematic dusk lighting, dark graphite tones with warm gold accents, shallow depth of field, 16:9, no text, no logos, no watermark, no identifiable faces"
    if style_file.exists():
        style_suffix = style_file.read_text(encoding="utf-8").strip()

    # Asset directories to update
    assets_dirs = [
        repo_root / "projects" / "assets",
        repo_root / "assets"
    ]

    # Translation step
    translation_records = []
    if not args.skip_translate:
        raw_projects, translation_records = process_translations(
            raw_projects, api_key, chat_model, args.dry_run
        )
    else:
        print("[BİLGİ] --skip-translate belirtildi, çeviri adımı atlandı.")

    # Image generation step
    prompt_records = {}
    generated_assets = []
    if not args.skip_images:
        raw_projects, prompt_records, generated_assets = process_concept_images(
            raw_projects, api_key, chat_model, image_model, style_suffix, assets_dirs, args.dry_run
        )
    else:
        print("[BİLGİ] --skip-images belirtildi, görsel adımı atlandı.")

    # Assemble final JSON
    final_json = assemble_final_json(raw_projects)

    # Target output paths (synced in both root and projects/)
    json_targets = [
        repo_root / "projects" / "data" / "projects.json",
        repo_root / "data" / "projects.json"
    ]
    report_targets = [
        repo_root / "projects" / "data" / "translations_report.md",
        repo_root / "data" / "translations_report.md"
    ]
    prompts_targets = [
        repo_root / "projects" / "data" / "image_prompts.json",
        repo_root / "data" / "image_prompts.json"
    ]
    pr_summary_path = repo_root / "data" / "pr_summary.md"

    if args.dry_run:
        print("\n=== DRY-RUN ÖZETİ ===")
        print(f"Toplam Proje: {len(final_json)}")
        print(f"Planlanan Çeviriler: {len(translation_records)}")
        print(f"Planlanan Görsel Promptları: {len(prompt_records)}")
        print("Dry-run başarıyla tamamlandı. Hiçbir dosya değiştirilmedi.")
        sys.exit(0)

    # Write files
    for j_path in json_targets:
        j_path.parent.mkdir(parents=True, exist_ok=True)
        with open(j_path, "w", encoding="utf-8") as f:
            json.dump(final_json, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"[YAZILDI] {j_path.relative_to(repo_root)}")

    # Write reports
    write_translation_report(translation_records, report_targets, chat_model)
    print(f"[YAZILDI] translations_report.md")

    if prompt_records:
        for pr_path in prompts_targets:
            pr_path.parent.mkdir(parents=True, exist_ok=True)
            with open(pr_path, "w", encoding="utf-8") as f:
                json.dump(prompt_records, f, ensure_ascii=False, indent=2)
                f.write("\n")
        print(f"[YAZILDI] image_prompts.json")

    write_pr_summary(pr_summary_path, generated_assets, prompt_records, translation_records, len(final_json))
    print(f"[YAZILDI] pr_summary.md")

    print("\n=== Pipeline Başarıyla Tamamlandı! ===")


if __name__ == "__main__":
    main()
