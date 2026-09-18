#!/usr/bin/env python3
"""Render guides/longevity-blueprint.md into a branded PDF via ReportLab.

The previous PDF had a stale price, no ShotFreeTRT branding/links, a
localhost-leaking metadata title, and unqualified health-outcome promises.
This regenerates the same three on-disk copies from the corrected Markdown
source, with clean metadata, a running footer (brand + page numbers), and
the source's own branding/CTA content on the first and last pages.

Covers exactly the Markdown constructs actually used in this document:
headings (#/##/###/####), blockquotes, bullet lists (including `- [ ]`
checkboxes), numbered lists, pipe tables, horizontal rules, and inline
bold/italic/link spans. It is not a general Markdown-to-PDF converter.
"""
import re
import shutil
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
SOURCE_MD = ROOT / "guides" / "longevity-blueprint.md"
OUTPUT_PATHS = [
    ROOT / "guides" / "longevity-blueprint.pdf",
    ROOT / "public" / "longevity-blueprint.pdf",
    ROOT / "public" / "guides" / "longevity-blueprint.pdf",
]

BRAND = "ShotFreeTRT"
SITE_URL = "https://shotfreetrt.com"
PDF_TITLE = "The Longevity Blueprint (2026 Edition) — ShotFreeTRT"

styles = getSampleStyleSheet()
BODY = ParagraphStyle("Body", parent=styles["BodyText"], fontSize=10, leading=14, spaceAfter=8)
H1 = ParagraphStyle("H1", parent=styles["Heading1"], fontSize=22, leading=26, spaceBefore=4, spaceAfter=12)
H2 = ParagraphStyle("H2", parent=styles["Heading2"], fontSize=16, leading=20, spaceBefore=16, spaceAfter=8, textColor=colors.HexColor("#1E3A5F"))
H3 = ParagraphStyle("H3", parent=styles["Heading3"], fontSize=13, leading=17, spaceBefore=12, spaceAfter=6, textColor=colors.HexColor("#1E3A5F"))
H4 = ParagraphStyle("H4", parent=styles["Heading4"], fontSize=11, leading=15, spaceBefore=10, spaceAfter=4, textColor=colors.HexColor("#334155"))
QUOTE = ParagraphStyle("Quote", parent=BODY, leftIndent=18, textColor=colors.HexColor("#334155"), borderColor=colors.HexColor("#94A3B8"), borderWidth=0, spaceBefore=6, spaceAfter=10)
LIST_ITEM = ParagraphStyle("ListItem", parent=BODY, spaceAfter=3, leftIndent=16, firstLineIndent=-16)
TABLE_CELL = ParagraphStyle("TableCell", parent=BODY, fontSize=8.5, leading=11, spaceAfter=0)
TABLE_HEADER = ParagraphStyle("TableHeader", parent=TABLE_CELL, textColor=colors.white, fontName="Helvetica-Bold")

INLINE_LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
INLINE_BOLD_RE = re.compile(r"\*\*(.+?)\*\*")
INLINE_ITALIC_RE = re.compile(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)")


def inline_markup(text: str) -> str:
    """Escape XML entities, then convert **bold**, *italic*, and [text](url) to ReportLab markup."""
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = INLINE_LINK_RE.sub(r'<link href="\2" color="#2563EB">\1</link>', text)
    text = INLINE_BOLD_RE.sub(r"<b>\1</b>", text)
    text = INLINE_ITALIC_RE.sub(r"<i>\1</i>", text)
    return text.strip()


def parse_table(lines: list[str]) -> Table:
    rows = [ln.strip().strip("|").split("|") for ln in lines if not re.match(r"^\s*\|?\s*-{2,}", ln.replace(" ", ""))]
    data = []
    for r_i, raw_row in enumerate(rows):
        style = TABLE_HEADER if r_i == 0 else TABLE_CELL
        data.append([Paragraph(inline_markup(cell.strip()), style) for cell in raw_row])
    table = Table(data, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E3A5F")),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F8FAFC")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return table


def build_story(markdown_text: str) -> list:
    lines = markdown_text.split("\n")
    story: list = []
    i = 0
    n = len(lines)

    def flush_list(items: list[str], ordered: bool):
        if not items:
            return
        for idx, item in enumerate(items, start=1):
            prefix = f"{idx}." if ordered else "•"
            story.append(Paragraph(f"{prefix}&nbsp;&nbsp;{inline_markup(item)}", LIST_ITEM))
        story.append(Spacer(1, 6))

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        if stripped == "---":
            story.append(Spacer(1, 6))
            story.append(HRFlowable(width="100%", color=colors.HexColor("#CBD5E1"), thickness=0.75))
            story.append(Spacer(1, 10))
            i += 1
            continue

        if stripped.startswith("#### "):
            story.append(Paragraph(inline_markup(stripped[5:]), H4))
            i += 1
            continue
        if stripped.startswith("### "):
            story.append(Paragraph(inline_markup(stripped[4:]), H3))
            i += 1
            continue
        if stripped.startswith("## "):
            story.append(Paragraph(inline_markup(stripped[3:]), H2))
            i += 1
            continue
        if stripped.startswith("# "):
            story.append(Paragraph(inline_markup(stripped[2:]), H1))
            i += 1
            continue

        if stripped.startswith(">"):
            quote_lines = []
            while i < n and lines[i].strip().startswith(">"):
                quote_lines.append(lines[i].strip().lstrip(">").strip())
                i += 1
            text = " ".join(part for part in quote_lines if part)
            story.append(Paragraph(inline_markup(text), QUOTE))
            continue

        if stripped.startswith("|"):
            table_lines = []
            while i < n and lines[i].strip().startswith("|"):
                table_lines.append(lines[i])
                i += 1
            story.append(parse_table(table_lines))
            story.append(Spacer(1, 10))
            continue

        checkbox_match = re.match(r"^- \[[ xX]\]\s+(.*)$", stripped)
        bullet_match = re.match(r"^-\s+(.*)$", stripped)
        ordered_match = re.match(r"^\d+\.\s+(.*)$", stripped)

        if checkbox_match or bullet_match:
            items = []
            while i < n:
                s = lines[i].strip()
                cb = re.match(r"^- \[[ xX]\]\s+(.*)$", s)
                bl = re.match(r"^-\s+(.*)$", s)
                if cb:
                    items.append("☐ " + cb.group(1))
                    i += 1
                elif bl:
                    items.append(bl.group(1))
                    i += 1
                else:
                    break
            flush_list(items, ordered=False)
            continue

        if ordered_match:
            items = []
            while i < n:
                m = re.match(r"^\d+\.\s+(.*)$", lines[i].strip())
                if m:
                    items.append(m.group(1))
                    i += 1
                else:
                    break
            flush_list(items, ordered=True)
            continue

        # Plain paragraph: gather until a blank line or a new block marker.
        para_lines = [stripped]
        i += 1
        while i < n and lines[i].strip() and not re.match(r"^(#{1,4}\s|>|\||-\s|\d+\.\s|---$)", lines[i].strip()):
            para_lines.append(lines[i].strip())
            i += 1
        story.append(Paragraph(inline_markup(" ".join(para_lines)), BODY))

    return story


class NumberedCanvas(pdfcanvas.Canvas):
    """Adds a branded footer with real 'Page X of Y' numbers (two-pass)."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_footer(total_pages)
            super().showPage()
        super().save()

    def draw_footer(self, total_pages: int):
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(0.75 * inch, 0.5 * inch, f"{BRAND} — {SITE_URL}")
        self.drawRightString(
            LETTER[0] - 0.75 * inch,
            0.5 * inch,
            f"Page {self._pageNumber} of {total_pages}",
        )
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.line(0.75 * inch, 0.62 * inch, LETTER[0] - 0.75 * inch, 0.62 * inch)


def main():
    markdown_text = SOURCE_MD.read_text(encoding="utf-8")
    story = build_story(markdown_text)

    primary_path = OUTPUT_PATHS[0]
    primary_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(primary_path),
        pagesize=LETTER,
        leftMargin=0.85 * inch,
        rightMargin=0.85 * inch,
        topMargin=0.85 * inch,
        bottomMargin=0.9 * inch,
        title=PDF_TITLE,
        author=BRAND,
        subject="Evidence-based healthspan guide",
        creator=BRAND,
    )
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"wrote {primary_path.relative_to(ROOT)} ({primary_path.stat().st_size / 1024:.1f}KB)")

    # Copy the exact same bytes to the other two served locations so all
    # three copies are byte-identical, not just independently regenerated
    # (which would give each its own CreationDate and risk drifting apart).
    for output_path in OUTPUT_PATHS[1:]:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(primary_path, output_path)
        print(f"copied -> {output_path.relative_to(ROOT)} ({output_path.stat().st_size / 1024:.1f}KB)")


if __name__ == "__main__":
    main()
