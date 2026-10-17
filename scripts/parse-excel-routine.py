#!/usr/bin/env python3
"""
Parses Routinly_Fall2026_Master_Routine.xlsx directly into structured JSON.
Generates:
  - src/data/new-routine.json (Routinly Optimized)
  - src/data/previous-routine.json (Preserves the published v4.1 routine)
"""

import os
import re
import json
import openpyxl

REPORTS_EXCEL_PATH = r"C:\Users\bayzid\Documents\routinly-v1.5\reports\Routinly_Fall2026_Master_Routine.xlsx"
DOWNLOADS_EXCEL_PATH = r"C:\Users\bayzid\Downloads\Telegram Desktop\Routinly_Fall2026_Master_Routine.xlsx"
EXCEL_PATH = REPORTS_EXCEL_PATH if os.path.exists(REPORTS_EXCEL_PATH) else DOWNLOADS_EXCEL_PATH
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DATA_DIR = os.path.join(BASE_DIR, "src", "data")
NEW_ROUTINE_PATH = os.path.join(SRC_DATA_DIR, "new-routine.json")
PREV_ROUTINE_PATH = os.path.join(SRC_DATA_DIR, "previous-routine.json")
OFFICIAL_ROUTINE_PATH = os.path.join(SRC_DATA_DIR, "official-routine.json")

# Ensure previous-routine.json exists
if not os.path.exists(PREV_ROUTINE_PATH) and os.path.exists(OFFICIAL_ROUTINE_PATH):
    with open(OFFICIAL_ROUTINE_PATH, "r", encoding="utf-8") as f:
        prev_data = json.load(f)
    prev_data["version"] = "Fall 2026 Published (v4.1)"
    with open(PREV_ROUTINE_PATH, "w", encoding="utf-8") as f:
        json.dump(prev_data, f, ensure_ascii=False, indent=2)
    print(f"Created {PREV_ROUTINE_PATH} from official-routine.json")

# Load faculty database for teacher names
faculty_names = {}
try:
    with open(os.path.join(SRC_DATA_DIR, "faculty.ts"), "r", encoding="utf-8") as f:
        content = f.read()
        matches = re.findall(r"code:\s*'([A-Za-z0-9_-]+)'\s*,\s*name:\s*'([^']+)'", content)
        for code, name in matches:
            faculty_names[code.upper()] = name
except Exception as e:
    print(f"Warning reading faculty.ts: {e}")

# Load course catalog for titles
course_titles = {}
try:
    with open(os.path.join(BASE_DIR, "src", "lib", "courses.ts"), "r", encoding="utf-8") as f:
        content = f.read()
        matches = re.findall(r"([A-Za-z0-9]+):\s*\{\s*code:\s*'[^']+',\s*name:\s*'([^']+)'", content)
        for code, title in matches:
            course_titles[code.upper()] = title
except Exception as e:
    print(f"Warning reading courses.ts: {e}")

def parse_course_str(course_str):
    c = course_str.strip()
    m = re.match(r"^([A-Za-z0-9]+)\(([0-9]+)_([A-Za-z]+)(?:_?([12]))?\)$", c)
    if m:
        return {
            "courseCodeClean": m.group(1).upper(),
            "batch": m.group(2),
            "section": m.group(3).upper(),
            "subSection": m.group(4) if m.group(4) else None,
            "sectionId": f"{m.group(2)}_{m.group(3).upper()}",
            "formattedCode": f"{m.group(1).upper()}({m.group(2)}_{m.group(3).upper()}{m.group(4) if m.group(4) else ''})"
        }
    m2 = re.match(r"^([A-Za-z0-9]+)\((.+)\)$", c)
    if m2:
        course_code = m2.group(1).upper()
        inner = m2.group(2).strip()
        m_b = re.match(r"^([0-9]+)_([A-Za-z0-9_]+)$", inner)
        if m_b:
            return {
                "courseCodeClean": course_code,
                "batch": m_b.group(1),
                "section": m_b.group(2).upper(),
                "subSection": None,
                "sectionId": f"{m_b.group(1)}_{m_b.group(2).upper()}",
                "formattedCode": f"{course_code}({m_b.group(1)}_{m_b.group(2).upper()})"
            }
        sub_m = re.search(r"([12])\s*(?:\(|$)", inner)
        sub = sub_m.group(1) if sub_m else None
        sec_clean = re.sub(r"\(.*?\)", "", inner).strip()
        sec_clean = re.sub(r"[12]$", "", sec_clean).strip()
        section_id = sec_clean.upper() if sec_clean.upper().startswith("RE_") else f"RE_{sec_clean.upper()}"
        return {
            "courseCodeClean": course_code,
            "batch": "RE",
            "section": sec_clean.upper(),
            "subSection": sub,
            "sectionId": section_id,
            "formattedCode": c
        }
    return None

def main():
    print(f"Opening workbook: {EXCEL_PATH}")
    wb = openpyxl.load_workbook(EXCEL_PATH, data_only=True)
    ws = wb["Master_Routine"]

    slots = [
        ("08:30", "10:00"),
        ("10:00", "11:30"),
        ("11:30", "13:00"),
        ("13:00", "14:30"),
        ("14:30", "16:00"),
        ("16:00", "17:30"),
    ]

    current_day = None
    all_classes = []
    class_idx = 0

    for r_idx, row in enumerate(ws.iter_rows(values_only=True), start=1):
        val0 = str(row[0]).strip().upper() if row[0] else ""
        if val0 in ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"]:
            current_day = val0
            continue
        if val0.startswith("SLOT") or val0 == "ROOM" or "DEPARTMENT" in val0 or not val0:
            continue
        if not current_day:
            continue

        s = 0
        while s < 6:
            c = row[s * 3 + 1]
            t = row[s * 3 + 2]
            r = row[s * 3]
            if not c or not str(c).strip() or str(c).strip() == "Course":
                s += 1
                continue

            c_str = str(c).strip()
            t_str = str(t).strip().upper() if t else "TBA"
            r_str = str(r).strip() if r else ""

            run_len = 1
            while s + run_len < 6:
                c_next = str(row[(s + run_len) * 3 + 1] or "").strip()
                t_next = str(row[(s + run_len) * 3 + 2] or "").strip().upper()
                r_next = str(row[(s + run_len) * 3] or "").strip()
                if c_next == c_str and t_next == t_str and (r_next == r_str or not r_next):
                    run_len += 1
                else:
                    break

            start_time = slots[s][0]
            end_time = slots[s + run_len - 1][1]

            parsed = parse_course_str(c_str)
            if not parsed:
                print(f"Unparseable course: {c_str}")
                s += run_len
                continue

            course_code_clean = parsed["courseCodeClean"]
            sec_id = parsed["sectionId"]
            sub_sec = parsed["subSection"]
            batch = parsed["batch"]
            sec_letter = parsed["section"]

            # Determine Lab vs Theory
            is_lab = run_len > 1 or sub_sec is not None or "LAB" in r_str.upper() or "LAB" in c_str.upper()
            title = course_titles.get(course_code_clean, course_code_clean)
            teacher_name = faculty_names.get(t_str, t_str)

            sub_id = f"sub{sub_sec}" if sub_sec else "common"
            slot_id = f"{sec_id}-{course_code_clean}-{sub_id}-{current_day}-{start_time.replace(':', '')}-{class_idx}"
            class_idx += 1

            cls_obj = {
                "id": slot_id,
                "batch": batch,
                "section": sec_letter,
                "sectionId": sec_id,
                "subSection": sub_sec,
                "courseCode": parsed["formattedCode"],
                "courseTitle": title,
                "teacherCode": t_str,
                "teacherName": teacher_name,
                "room": r_str,
                "dayOfWeek": current_day,
                "startTime": start_time,
                "endTime": end_time,
                "type": "Lab" if is_lab else "Theory",
                "color": ("amber" if sub_sec == "1" else "rose") if is_lab else "indigo"
            }

            all_classes.append(cls_obj)
            s += run_len

    print(f"Extracted {len(all_classes)} scheduled events from Excel.")

    by_section = {}
    by_teacher = {}
    unique_rooms = set()

    for c in all_classes:
        sec = c["sectionId"]
        by_section.setdefault(sec, []).append(c)

        t = c["teacherCode"]
        if t and t != "TBA":
            by_teacher.setdefault(t, []).append(c)

        if c["room"]:
            unique_rooms.add(c["room"])

    payload = {
        "version": "Fall 2026 Routinly (Optimized)",
        "totalClasses": len(all_classes),
        "totalSections": len(by_section),
        "totalTeachers": len(by_teacher),
        "sections": by_section,
        "teachers": by_teacher,
        "rooms": sorted(list(unique_rooms))
    }

    with open(NEW_ROUTINE_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    # Also overwrite official-routine.json so other system components (like room occupancy) use the new version
    with open(OFFICIAL_ROUTINE_PATH, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"Wrote {NEW_ROUTINE_PATH} & {OFFICIAL_ROUTINE_PATH}")
    print(f"  Total events: {len(all_classes)}")
    print(f"  Total sections: {len(by_section)}")
    print(f"  Total teachers: {len(by_teacher)}")
    print(f"  Total rooms: {len(unique_rooms)}")

if __name__ == "__main__":
    main()
