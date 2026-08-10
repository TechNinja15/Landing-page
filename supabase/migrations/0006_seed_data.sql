-- ============================================================
-- 0006_seed_data.sql
-- Real course/module content (from the uploaded curriculum docs),
-- not placeholder lorem ipsum. No fake stats or testimonials —
-- those stay empty until entered from the Admin Portal.
-- ============================================================

insert into public.courses (slug, title, tagline, summary, level, duration_label, mode, is_published, accent_color)
values
  (
    'ai-agents-automation-mastery',
    'AI Agents & Automation Mastery',
    'Build the AI employee, don''t just use one',
    'Build agentic workflows and marketing automations with Python, LangChain and LangGraph — from your first API call to a deployed multi-agent system.',
    'Beginner to Intermediate',
    '10–12 Weeks',
    'Live Online / Hybrid',
    true,
    '#8B5CF6'
  ),
  (
    'digital-marketing-professional',
    'Digital Marketing Professional',
    'From zero to full-funnel marketer',
    'A complete, hour-mapped curriculum from website planning to paid media — SEO, Google & Meta Ads, analytics and conversion, taught end to end.',
    'Beginner to Advanced',
    '8–10 Weeks',
    'Live Online / Hybrid',
    true,
    '#FFA552'
  ),
  (
    'content-creation-personal-branding',
    'Content Creation & Personal Branding',
    'Turn a point of view into a portfolio',
    'Content strategy, short-form video and an AI-assisted production workflow across Instagram, YouTube and LinkedIn.',
    'Beginner to Intermediate',
    '6–8 Weeks',
    'Live Online / Hybrid',
    true,
    '#FADF63'
  )
on conflict (slug) do nothing;

-- ---------- AI Agents & Automation Mastery — modules (from Phase 1–9 curriculum doc) ----------
insert into public.modules (course_id, title, order_index)
select id, m.title, m.order_index
from public.courses c
cross join (values
  ('Phase 1 — Technology Foundations', 1),
  ('Phase 2 — Artificial Intelligence Foundations', 2),
  ('Phase 3 — AI Agents & Agentic Systems', 3),
  ('Phase 4 — LangChain Fundamentals', 4),
  ('Phase 5 — LangGraph Foundations', 5),
  ('Phase 6 — Marketing Automation Projects', 6),
  ('Phase 7 — Retrieval-Augmented Generation (RAG)', 7),
  ('Phase 8 — Multi-Agent Marketing Agency', 8),
  ('Phase 9 — Deployment & Production', 9)
) as m(title, order_index)
where c.slug = 'ai-agents-automation-mastery'
on conflict do nothing;

-- ---------- Digital Marketing Professional — modules (from the hour-mapped slide deck) ----------
insert into public.modules (course_id, title, order_index)
select id, m.title, m.order_index
from public.courses c
cross join (values
  ('1. Digital Marketing Fundamentals & AIDA Funnel', 1),
  ('2. Website Planning & Creation', 2),
  ('3. Google Analytics Set Up', 3),
  ('4. Search Engine Optimization', 4),
  ('5. Canva', 5),
  ('6. CapCut', 6),
  ('7. Google Ads', 7),
  ('8. Meta Ads', 8),
  ('9. Pinterest Marketing', 9),
  ('10. Twitter Marketing', 10),
  ('11. Quora Marketing', 11),
  ('12. Snapchat Ads', 12),
  ('13. WhatsApp Marketing', 13),
  ('14. SMS Marketing', 14),
  ('15. Email Marketing', 15),
  ('16. LinkedIn Marketing', 16),
  ('17. Copy Writing', 17),
  ('18. Content Creation & Marketing', 18),
  ('19. Affiliate Marketing', 19),
  ('20. Online Reputation Management', 20)
) as m(title, order_index)
where c.slug = 'digital-marketing-professional'
on conflict do nothing;

-- ---------- Content Creation & Personal Branding — modules ----------
insert into public.modules (course_id, title, order_index)
select id, m.title, m.order_index
from public.courses c
cross join (values
  ('Content Strategy & Storytelling', 1),
  ('Instagram Growth & Reels', 2),
  ('YouTube Fundamentals', 3),
  ('LinkedIn for Personal Branding', 4),
  ('Video Editing — CapCut & Canva', 5),
  ('AI-Assisted Content Creation', 6),
  ('Portfolio Building', 7)
) as m(title, order_index)
where c.slug = 'content-creation-personal-branding'
on conflict do nothing;

-- ---------- website_settings defaults ----------
-- Hero stats intentionally start empty — the Admin Portal is the only
-- place real numbers get entered. No invented figures ship in seed data.
insert into public.website_settings (key, value)
values
  ('hero_stats', '{"students": null, "projects": null, "courses": 3, "industry_experts": null}'::jsonb),
  ('hero_content', '{
    "headline": "Content to Career. Built with AI.",
    "subheading": "Learn AI Automation, AI Agents, Digital Marketing and Content Creation from industry experts.",
    "primary_cta": "Book Free Demo",
    "secondary_cta": "Download Course Brochure",
    "tertiary_cta": "Join WhatsApp Community"
  }'::jsonb),
  ('contact_details', '{
    "whatsapp": "8369953959",
    "phone": "8459612191",
    "email": "thriveskilltech@gmail.com",
    "social": {
      "x": "https://x.com/thriveskilltech",
      "instagram": "https://www.instagram.com/thriveskill_tech",
      "facebook": "https://www.facebook.com/share/1DKAHZraG8/",
      "linkedin": "https://in.linkedin.com/in/thrive-skills-5088b8426",
      "youtube": "https://youtube.com/@thriveskilltech"
    }
  }'::jsonb)
on conflict (key) do nothing;

-- ============================================================
-- IMPORTANT — creating your first Super Admin
-- ============================================================
-- Seed data cannot create an auth.users row (Supabase manages that
-- table directly). After you sign up your own account through the
-- app once, promote it manually:
--
--   update public.profiles
--   set role = 'super_admin'
--   where email = 'you@thriveskilltech.com';
-- ============================================================
