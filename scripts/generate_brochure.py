import os
from reportlab.lib.pagesizes import landscape
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

PAGE_WIDTH = 1152
PAGE_HEIGHT = 648

# Colors
C_PURPLE = HexColor("#8B5CF6")
C_PURPLE_DARK = HexColor("#6D3FD1")
C_PURPLE_LIGHT = HexColor("#EDE9FE")
C_AUBERGINE = HexColor("#16001E")
C_MIDNIGHT = HexColor("#331E38")
C_LAVENDER = HexColor("#FCF7FF")
C_GOLD = HexColor("#FADF63")
C_ORANGE = HexColor("#FFA552")
C_WHITE = HexColor("#FFFFFF")
C_DARK_CARD = HexColor("#221028")
C_LIGHT_CARD = HexColor("#FFFFFF")
C_LIGHT_BORDER = HexColor("#E2D9EC")
C_DARK_BORDER = HexColor("#472B4D")
C_TEXT_MUTED = HexColor("#6B7280")
C_TEXT_DARK_MUTED = HexColor("#A78BFA")

def draw_tst_logo(c, x, y, size=1.0, color=C_PURPLE):
    """Draws a stylized TST Monogram logo"""
    c.saveState()
    c.translate(x, y)
    c.scale(size, size)
    
    # Background or decorative accents if needed
    c.setFillColor(color)
    c.setFont("Helvetica-Bold", 42)
    c.drawString(0, 0, "TST")
    c.restoreState()

def draw_rounded_rect(c, x, y, w, h, r, fill_color, stroke_color=None, stroke_width=1):
    c.saveState()
    c.setFillColor(fill_color)
    if stroke_color:
        c.setStrokeColor(stroke_color)
        c.setLineWidth(stroke_width)
        c.roundRect(x, y, w, h, r, fill=1, stroke=1)
    else:
        c.roundRect(x, y, w, h, r, fill=1, stroke=0)
    c.restoreState()

def draw_page_number(c, num, total=11, dark=False):
    c.saveState()
    c.setFont("Helvetica", 11)
    c.setFillColor(HexColor("#9CA3AF") if dark else HexColor("#6B7280"))
    c.drawRightString(PAGE_WIDTH - 50, 30, f"{num} / {total}")
    c.restoreState()

def draw_footer_brand(c, num, total=11, dark=False):
    c.saveState()
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(HexColor("#9CA3AF") if dark else HexColor("#6B7280"))
    c.drawString(50, 30, "T H R I V E   S K I L L   T E C H")
    c.drawRightString(PAGE_WIDTH - 50, 30, f"{num} / {total}")
    c.restoreState()

def build_pdf(filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    c = canvas.Canvas(filename, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))
    
    # ---------------- PAGE 1: COVER ----------------
    # Dark Aubergine BG
    c.setFillColor(C_AUBERGINE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    
    # Top-right Purple Accent Block
    c.setFillColor(C_PURPLE)
    c.rect(PAGE_WIDTH - 380, PAGE_HEIGHT - 300, 380, 300, fill=1, stroke=0)
    
    # Bottom-left Orange Accent Block
    c.setFillColor(C_ORANGE)
    c.rect(0, 0, 300, 220, fill=1, stroke=0)
    
    # Center Brand Info
    c.setFillColor(C_PURPLE)
    c.setFont("Helvetica-Bold", 96)
    c.drawCentredString(PAGE_WIDTH / 2, 420, "TST")
    
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 54)
    c.drawCentredString(PAGE_WIDTH / 2, 310, "Content to Career")
    
    c.setFillColor(HexColor("#D8B4FE"))
    c.setFont("Helvetica", 22)
    c.drawCentredString(PAGE_WIDTH / 2, 250, "AI-first career accelerator for content creators, AI automators & digital marketers")
    
    # Bottom Info Pill
    draw_rounded_rect(c, (PAGE_WIDTH - 440) / 2, 70, 440, 52, 26, C_PURPLE)
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 17)
    c.drawCentredString(PAGE_WIDTH / 2, 90, "Bhandara • Mumbai | +91 84596 12191")
    c.showPage()
    
    # ---------------- PAGE 2: WHO WE ARE ----------------
    # Left Dark Column
    c.setFillColor(C_MIDNIGHT)
    c.rect(0, 0, 420, PAGE_HEIGHT, fill=1, stroke=0)
    
    # Right Light Column
    c.setFillColor(C_LAVENDER)
    c.rect(420, 0, PAGE_WIDTH - 420, PAGE_HEIGHT, fill=1, stroke=0)
    
    # Left Content
    c.setFillColor(C_PURPLE)
    c.setFont("Helvetica-Bold", 60)
    c.drawString(60, 510, "TST")
    
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 34)
    c.drawString(60, 410, "Who We Are")
    
    who_we_are_text = (
        "Founded in 2026 by Shantnu Shivkumar Gabhane & Heena Manish Dalal, "
        "Thrive Skill Tech is an MSME-registered institution helping learners "
        "across Maharashtra build real careers in content and digital marketing."
    )
    style_dark = ParagraphStyle('DarkPara', fontName='Helvetica', fontSize=18, leading=28, textColor=HexColor("#E9D5FF"))
    p = Paragraph(who_we_are_text, style_dark)
    p.wrapOn(c, 300, 300)
    p.drawOn(c, 60, 220)
    
    # Right Content Cards (Vision, Mission, Brand Promise)
    items = [
        ("V", C_GOLD, "Vision", "To become India's most trusted AI-first learning institution that prepares students for the future of work."),
        ("M", C_ORANGE, "Mission", "Empower learners through practical AI education, real-world projects, mentorship, and career-focused learning experiences."),
        ("B", C_GOLD, "Brand Promise", "We don't teach software. We build AI-ready professionals.")
    ]
    
    y_pos = 460
    for letter, color, title, desc in items:
        # Card container
        draw_rounded_rect(c, 460, y_pos, 630, 120, 16, C_WHITE, C_LIGHT_BORDER)
        
        # Letter Box
        draw_rounded_rect(c, 480, y_pos + 40, 42, 42, 8, color)
        c.setFillColor(C_AUBERGINE)
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(501, y_pos + 52, letter)
        
        # Title
        c.setFillColor(C_AUBERGINE)
        c.setFont("Helvetica-Bold", 26)
        c.drawString(536, y_pos + 52, title)
        
        # Description
        p_desc = Paragraph(desc, ParagraphStyle('LightPara', fontName='Helvetica', fontSize=15, leading=22, textColor=HexColor("#374151")))
        p_desc.wrapOn(c, 560, 60)
        p_desc.drawOn(c, 536, y_pos + 12)
        
        y_pos -= 145
        
    draw_page_number(c, 2, 11, dark=False)
    c.showPage()
    
    # ---------------- PAGE 3: WHY LEARN WITH US ----------------
    c.setFillColor(C_LAVENDER)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    
    c.setFillColor(C_AUBERGINE)
    c.setFont("Helvetica-Bold", 36)
    c.drawString(60, 560, "WHY LEARN WITH US")
    c.setFillColor(C_TEXT_MUTED)
    c.setFont("Helvetica", 18)
    c.drawString(60, 530, "Professional. Practical. Future-focused.")
    
    cards_p3 = [
        ("01", C_PURPLE, "Affordable Pricing", "Career-grade skills starting at just ₹99, built for every learner's budget."),
        ("02", C_ORANGE, "Internship Certificate", "Real internship experience and certification with select programs."),
        ("03", C_GOLD, "Practical Over Theory", "Every module ends in a hands-on project or assignment, not just slides."),
        ("04", C_PURPLE, "AI-First Curriculum", "Learn to use AI agents and automation tools that the industry is adopting now."),
        ("05", C_ORANGE, "Local + Global Reach", "Content in Hindi, English & Marathi — built for Maharashtra, ready for the world."),
        ("06", C_GOLD, "Mentorship & Community", "Learn alongside a community of creators and marketers, guided by mentors.")
    ]
    
    for idx, (num, color, title, desc) in enumerate(cards_p3):
        col = idx % 3
        row = idx // 3
        card_x = 60 + col * 350
        card_y = 320 - row * 200
        
        draw_rounded_rect(c, card_x, card_y, 330, 180, 16, C_WHITE, C_LIGHT_BORDER)
        
        # Number Badge
        draw_rounded_rect(c, card_x + 20, card_y + 120, 44, 34, 8, color)
        c.setFillColor(C_WHITE if color == C_PURPLE else C_AUBERGINE)
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(card_x + 42, card_y + 131, num)
        
        # Title
        c.setFillColor(C_AUBERGINE)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(card_x + 20, card_y + 85, title)
        
        # Desc
        p_c = Paragraph(desc, ParagraphStyle('CardDesc', fontName='Helvetica', fontSize=14, leading=20, textColor=HexColor("#4B5563")))
        p_c.wrapOn(c, 290, 80)
        p_c.drawOn(c, card_x + 20, card_y + 15)
        
    draw_footer_brand(c, 3, 11, dark=False)
    c.showPage()
    
    # ---------------- PAGE 4: PROGRAMS AT A GLANCE ----------------
    c.setFillColor(C_AUBERGINE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 38)
    c.drawString(60, 560, "Our Programs at a Glance")
    c.setFillColor(HexColor("#D8B4FE"))
    c.setFont("Helvetica", 18)
    c.drawString(60, 528, "Six pathways — from a 7-day starter to a full career transformation.")
    
    programs = [
        ("Starter Content Courses guide", "1 day each", "₹99", C_GOLD, C_AUBERGINE),
        ("Bootcamp courses", "21 days", "₹1,500", C_PURPLE, C_WHITE),
        ("Certified Content Strategy Course (CCSC)", "4 weeks + 1 month internship", "₹9,999", C_GOLD, C_AUBERGINE),
        ("Master in Content Creation & Digital Marketing (MCDM)", "2 months + 1 month internship", "₹14,999", C_PURPLE, C_WHITE),
        ("AI Agents & Automation for Digital Marketers", "10–12 weeks + 1 month internship", "₹24,999", C_GOLD, C_AUBERGINE)
    ]
    
    y_pos = 430
    for name, dur, price, p_color, p_text_color in programs:
        draw_rounded_rect(c, 60, y_pos, 1032, 68, 12, C_DARK_CARD, C_DARK_BORDER)
        
        # Name
        c.setFillColor(C_WHITE)
        c.setFont("Helvetica-Bold", 19)
        c.drawString(85, y_pos + 26, name)
        
        # Duration
        c.setFillColor(HexColor("#C084FC"))
        c.setFont("Helvetica", 16)
        c.drawRightString(870, y_pos + 26, dur)
        
        # Price badge
        draw_rounded_rect(c, 890, y_pos + 10, 180, 48, 8, p_color)
        c.setFillColor(p_text_color)
        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(980, y_pos + 25, price)
        
        y_pos -= 82
        
    draw_page_number(c, 4, 11, dark=True)
    c.showPage()
    
    # ---------------- PAGE 5: STARTER CONTENT COURSES ----------------
    c.setFillColor(C_LAVENDER)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    
    c.setFillColor(C_AUBERGINE)
    c.setFont("Helvetica-Bold", 36)
    c.drawString(60, 560, "Starter Content Courses")
    
    # Price Badge
    draw_rounded_rect(c, 900, 545, 192, 54, 8, C_GOLD)
    c.setFillColor(C_AUBERGINE)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(996, 563, "₹99")
    
    c.setFillColor(C_TEXT_MUTED)
    c.setFont("Helvetica", 18)
    c.drawString(60, 528, "Bite-sized, beginner-friendly courses to test the waters.")
    
    starters = [
        ("1", C_PURPLE, "UGC Content Creation", "Learn to create authentic user-generated content that brands and audiences love — from concept to final cut."),
        ("2", C_ORANGE, "Education Content Creation", "Turn knowledge into scroll-stopping educational reels, carousels, and videos that teach and grow an audience."),
        ("3", C_GOLD, "Faceless Content Creation", "Build a content channel without showing your face — voiceovers, text-based videos, and faceless niches."),
        ("4", C_PURPLE, "Content Creation Basics", "The essential starter kit: hooks, scripting, shooting on a phone, and posting consistently.")
    ]
    
    for idx, (num, col_b, title, desc) in enumerate(starters):
        c_x = 60 + (idx % 2) * 530
        c_y = 310 - (idx // 2) * 200
        
        draw_rounded_rect(c, c_x, c_y, 500, 180, 16, C_WHITE, C_LIGHT_BORDER)
        
        # Badge
        draw_rounded_rect(c, c_x + 24, c_y + 115, 38, 38, 8, col_b)
        c.setFillColor(C_WHITE if col_b == C_PURPLE else C_AUBERGINE)
        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(c_x + 43, c_y + 126, num)
        
        # Title
        c.setFillColor(C_AUBERGINE)
        c.setFont("Helvetica-Bold", 20)
        c.drawString(c_x + 75, c_y + 126, title)
        
        # Desc
        p_s = Paragraph(desc, ParagraphStyle('StarterDesc', fontName='Helvetica', fontSize=15, leading=22, textColor=HexColor("#4B5563")))
        p_s.wrapOn(c, 450, 90)
        p_s.drawOn(c, c_x + 24, c_y + 20)
        
    draw_footer_brand(c, 5, 11, dark=False)
    c.showPage()
    
    # ---------------- PAGE 6: BOOTCAMP COURSES ----------------
    c.setFillColor(C_AUBERGINE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    
    c.setFillColor(C_PURPLE)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(60, 580, "7-DAY PROGRAM")
    
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 36)
    c.drawString(60, 535, "Bootcamp Courses")
    
    # Top Badges
    draw_rounded_rect(c, 640, 520, 200, 70, 8, C_PURPLE)
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(660, 555, "₹1,500")
    c.setFont("Helvetica", 13)
    c.drawString(660, 535, "Each course")
    
    draw_rounded_rect(c, 860, 520, 230, 70, 8, C_DARK_CARD, C_DARK_BORDER)
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(880, 555, "21 Days")
    c.setFillColor(HexColor("#C084FC"))
    c.setFont("Helvetica", 13)
    c.drawString(880, 535, "Duration")
    
    bootcamps = [
        ("1", C_GOLD, "Content Creation", "Learn introduction of content creation — perfect for absolute beginners who want core skills and confidence in just one week."),
        ("2", C_PURPLE, "SEO", "Learn the introduction of SEO in digital marketing—perfect for beginners who want core skills in just a week!"),
        ("3", C_ORANGE, "Reel Creation", "Learn the introduction of reel creation—perfect for beginners who want core skills in just a week!"),
        ("4", C_GOLD, "Python", "Learn basics of python in our 1week bootcamp for beginners who want to ace")
    ]
    
    for idx, (num, col_b, title, desc) in enumerate(bootcamps):
        c_x = 60 + (idx % 2) * 530
        c_y = 310 - (idx // 2) * 200
        
        draw_rounded_rect(c, c_x, c_y, 500, 180, 16, C_DARK_CARD, C_DARK_BORDER)
        
        draw_rounded_rect(c, c_x + 24, c_y + 115, 38, 38, 8, col_b)
        c.setFillColor(C_AUBERGINE if col_b != C_PURPLE else C_WHITE)
        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(c_x + 43, c_y + 126, num)
        
        c.setFillColor(C_WHITE)
        c.setFont("Helvetica-Bold", 22)
        c.drawString(c_x + 75, c_y + 126, title)
        
        p_b = Paragraph(desc, ParagraphStyle('BootDesc', fontName='Helvetica', fontSize=15, leading=23, textColor=HexColor("#D8B4FE")))
        p_b.wrapOn(c, 450, 90)
        p_b.drawOn(c, c_x + 24, c_y + 20)
        
    draw_page_number(c, 6, 11, dark=True)
    c.showPage()
    
    # ---------------- PAGE 7: MASTER IN CONTENT CREATION & DIGITAL MARKETING ----------------
    c.setFillColor(C_LAVENDER)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    
    c.setFillColor(C_ORANGE)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(60, 585, "FLAGSHIP PROGRAM")
    
    c.setFillColor(C_AUBERGINE)
    c.setFont("Helvetica-Bold", 32)
    c.drawString(60, 540, "Master in Content Creation &")
    c.drawString(60, 500, "Digital Marketing (MCDM)")
    
    p_mcdm_intro = Paragraph(
        "Our most complete program—content creation, personal branding, communication skills, and digital marketing, capped with a real internship.",
        ParagraphStyle('MCDMIntro', fontName='Helvetica', fontSize=16, leading=24, textColor=HexColor("#4B5563"))
    )
    p_mcdm_intro.wrapOn(c, 480, 80)
    p_mcdm_intro.drawOn(c, 60, 410)
    
    # Fee & Duration Cards
    draw_rounded_rect(c, 60, 310, 220, 80, 10, C_ORANGE)
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(170, 345, "₹14,999")
    c.setFont("Helvetica", 13)
    c.drawCentredString(170, 323, "Course Fee")
    
    draw_rounded_rect(c, 295, 310, 280, 80, 10, C_WHITE, C_ORANGE, 2)
    c.setFillColor(C_AUBERGINE)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(435, 348, "2 Months + 1 Month Internship")
    c.setFillColor(C_TEXT_MUTED)
    c.setFont("Helvetica", 13)
    c.drawCentredString(435, 323, "Duration")
    
    p_grad = Paragraph(
        "<i>Graduate with a full portfolio, an internship certificate, and the skills to work as a creator, marketer, or freelancer.</i>",
        ParagraphStyle('MCDMOt', fontName='Helvetica-Oblique', fontSize=16, leading=24, textColor=HexColor("#374151"))
    )
    p_grad.wrapOn(c, 500, 80)
    p_grad.drawOn(c, 60, 190)
    
    # Right: What You'll Learn
    c.setFillColor(C_AUBERGINE)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(620, 560, "What You'll Learn")
    
    mcdm_modules = [
        "Content creation & Marketing",
        "Online Reputation Management",
        "Website Planning & Creation",
        "Algorithms, SEO & growth strategy",
        "Affiliate marketing",
        "Google Analytics Setup",
        "Digital marketing & paid ads",
        "Sales funnels & lead generation",
        "1-month guided internship"
    ]
    
    y_mod = 505
    for m in mcdm_modules:
        draw_rounded_rect(c, 620, y_mod + 2, 18, 18, 4, C_ORANGE)
        c.setFillColor(C_AUBERGINE)
        c.setFont("Helvetica", 17)
        c.drawString(650, y_mod + 4, m)
        y_mod -= 45
        
    draw_page_number(c, 7, 11, dark=False)
    c.showPage()
    
    # ---------------- PAGE 8: AI AGENTS & AUTOMATION ----------------
    c.setFillColor(C_AUBERGINE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    
    c.setFillColor(C_GOLD)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(60, 585, "AI-FIRST PROGRAM")
    
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 32)
    c.drawString(60, 540, "AI Agents & Automation for Digital")
    c.drawString(60, 500, "Marketers")
    
    p_ai_intro = Paragraph(
        "Learn to build AI agents and agentic workflows that automate marketing operations using Python, APIs, LangChain & LangGraph.",
        ParagraphStyle('AIIntro', fontName='Helvetica', fontSize=16, leading=24, textColor=HexColor("#E9D5FF"))
    )
    p_ai_intro.wrapOn(c, 480, 80)
    p_ai_intro.drawOn(c, 60, 410)
    
    draw_rounded_rect(c, 60, 310, 220, 80, 10, C_GOLD)
    c.setFillColor(C_AUBERGINE)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(170, 345, "₹24,999")
    c.setFont("Helvetica", 13)
    c.drawCentredString(170, 323, "Course Fee")
    
    draw_rounded_rect(c, 295, 310, 280, 80, 10, C_DARK_CARD, C_GOLD, 2)
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(435, 350, "10–12 Weeks + 1 month")
    c.drawCentredString(435, 332, "internship")
    c.setFillColor(HexColor("#D8B4FE"))
    c.setFont("Helvetica", 12)
    c.drawCentredString(435, 315, "Duration")
    
    p_cap = Paragraph(
        "<i>Capstone: build your own AI Marketing Employee — an AI SEO Specialist, Content Strategist, or custom automation agent.</i>",
        ParagraphStyle('AICap', fontName='Helvetica-Oblique', fontSize=16, leading=24, textColor=HexColor("#FDE68A"))
    )
    p_cap.wrapOn(c, 500, 80)
    p_cap.drawOn(c, 60, 190)
    
    # Right: What You'll Learn
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(620, 560, "What You'll Learn")
    
    ai_modules = [
        "AI & LLM fundamentals, prompt engineering",
        "Python programming & API automation",
        "AI agent architecture, memory & tools",
        "LangChain: models, chains, tools, memory",
        "LangGraph: nodes, edges, human-in-loop",
        "SEO, competitor & content creation agents",
        "Retrieval-Augmented Generation (RAG)",
        "Multi-agent marketing agency workflow",
        "Deployment with FastAPI & Streamlit"
    ]
    
    y_mod = 505
    for m in ai_modules:
        draw_rounded_rect(c, 620, y_mod + 2, 18, 18, 4, C_GOLD)
        c.setFillColor(HexColor("#F3E8FF"))
        c.setFont("Helvetica", 17)
        c.drawString(650, y_mod + 4, m)
        y_mod -= 45
        
    draw_page_number(c, 8, 11, dark=True)
    c.showPage()
    
    # ---------------- PAGE 9: CERTIFIED CONTENT STRATEGY COURSE (CCSC) ----------------
    c.setFillColor(C_LAVENDER)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    
    c.setFillColor(C_ORANGE)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(60, 585, "PROFESSIONAL PROGRAM")
    
    c.setFillColor(C_AUBERGINE)
    c.setFont("Helvetica-Bold", 32)
    c.drawString(60, 540, "Certified Content Strategy")
    c.drawString(60, 500, "Course (CCSC)")
    
    p_ccsc_intro = Paragraph(
        "A dedicated, in-depth program for creators who want to master every stage of content — from idea to a monetized, growing channel.",
        ParagraphStyle('CCSCIntro', fontName='Helvetica', fontSize=16, leading=24, textColor=HexColor("#4B5563"))
    )
    p_ccsc_intro.wrapOn(c, 480, 80)
    p_ccsc_intro.drawOn(c, 60, 410)
    
    draw_rounded_rect(c, 60, 310, 220, 80, 10, C_ORANGE)
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(170, 345, "₹9,999")
    c.setFont("Helvetica", 13)
    c.drawCentredString(170, 323, "Course Fee")
    
    draw_rounded_rect(c, 295, 310, 280, 80, 10, C_WHITE, C_ORANGE, 2)
    c.setFillColor(C_AUBERGINE)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(435, 348, "4 Weeks + 1 month internship")
    c.setFillColor(C_TEXT_MUTED)
    c.setFont("Helvetica", 13)
    c.drawCentredString(435, 323, "Duration")
    
    p_ccsc_out = Paragraph(
        "<i>Leave with a content calendar, editing workflow, and monetization plan ready to execute across Instagram, YouTube & more.</i>",
        ParagraphStyle('CCSCOut', fontName='Helvetica-Oblique', fontSize=16, leading=24, textColor=HexColor("#374151"))
    )
    p_ccsc_out.wrapOn(c, 500, 80)
    p_ccsc_out.drawOn(c, 60, 190)
    
    # Right: What You'll Learn
    c.setFillColor(C_AUBERGINE)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(620, 560, "What You'll Learn")
    
    ccsc_modules = [
        "Niche selection & personal branding",
        "Hooks, scripting & storytelling",
        "Shooting on a phone: lighting & angles",
        "Editing: CapCut, VN & Premiere Pro",
        "Instagram & YouTube algorithm mastery",
        "Organic growth & hashtag strategy",
        "Monetization: brand deals & affiliates",
        "Consistency, mindset & handling criticism"
    ]
    
    y_mod = 505
    for m in ccsc_modules:
        draw_rounded_rect(c, 620, y_mod + 2, 18, 18, 4, C_ORANGE)
        c.setFillColor(C_AUBERGINE)
        c.setFont("Helvetica", 17)
        c.drawString(650, y_mod + 4, m)
        y_mod -= 48
        
    draw_page_number(c, 9, 11, dark=False)
    c.showPage()
    
    # ---------------- PAGE 10: CONCLUSION & CONTACT ----------------
    c.setFillColor(C_AUBERGINE)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    
    # Left Section
    c.setFillColor(C_PURPLE)
    c.setFont("Helvetica-Bold", 54)
    c.drawString(60, 530, "TST")
    
    c.setFillColor(C_WHITE)
    c.setFont("Helvetica-Bold", 38)
    c.drawString(60, 440, "Start Your Career Today")
    
    p_concl = Paragraph(
        "From a ₹99 starter course to a full AI-first career program — pick your path and Thrive.",
        ParagraphStyle('ConclPara', fontName='Helvetica', fontSize=18, leading=26, textColor=HexColor("#E9D5FF"))
    )
    p_concl.wrapOn(c, 480, 80)
    p_concl.drawOn(c, 60, 360)
    
    # Contact items
    contacts = [
        ("PHONE", "+91 84596 12191"),
        ("INSTAGRAM", "@thrive_skill_tech"),
        ("FACEBOOK", "Thrive Skill Tech"),
        ("LOCATION", "Bhandara & Mumbai, Maharashtra")
    ]
    
    y_cnt = 290
    for label, val in contacts:
        draw_rounded_rect(c, 60, y_cnt + 2, 14, 18, 2, C_GOLD)
        c.setFillColor(HexColor("#C084FC"))
        c.setFont("Helvetica-Bold", 12)
        c.drawString(85, y_cnt + 14, label)
        c.setFillColor(C_WHITE)
        c.setFont("Helvetica-Bold", 17)
        c.drawString(85, y_cnt - 4, val)
        y_cnt -= 52
        
    # Right Section: Program Fees Box
    draw_rounded_rect(c, 620, 90, 470, 480, 20, C_DARK_CARD, C_DARK_BORDER)
    
    c.setFillColor(HexColor("#C084FC"))
    c.setFont("Helvetica-Bold", 14)
    c.drawString(660, 520, "PROGRAM FEES")
    
    fee_items = [
        ("Starter Courses", "₹99"),
        ("Bootcamp Courses", "₹1,500"),
        ("CCSC", "₹9,999"),
        ("MCDM", "₹14,999"),
        ("AI Agents & Automation", "₹24,999")
    ]
    
    y_f = 460
    for p_name, p_val in fee_items:
        c.setFillColor(C_WHITE)
        c.setFont("Helvetica", 17)
        c.drawString(660, y_f, p_name)
        
        c.setFillColor(C_GOLD if p_val in ["₹99", "₹9,999", "₹24,999"] else C_WHITE)
        c.setFont("Helvetica-Bold", 18)
        c.drawRightString(1040, y_f, p_val)
        
        c.setStrokeColor(HexColor("#3F2646"))
        c.setLineWidth(1)
        c.line(660, y_f - 12, 1040, y_f - 12)
        
        y_f -= 54
        
    # Tagline inside box
    c.setFillColor(HexColor("#D8B4FE"))
    c.setFont("Helvetica-Oblique", 20)
    c.drawCentredString(855, 130, "Content to Career")
    
    draw_page_number(c, 10, 11, dark=True)
    c.showPage()
    
    c.save()
    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    build_pdf("public/Thrive_Skill_Tech_Brochure.pdf")
