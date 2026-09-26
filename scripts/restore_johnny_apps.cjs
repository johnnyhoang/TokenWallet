/**
 * RESTORE Johnny Hoang's 20 apps to aw_app_projects on msozshwatonyxnkaqjfs
 * Run: node scripts/restore_johnny_apps.cjs
 */
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://msozshwatonyxnkaqjfs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zb3pzaHdhdG9ueXhua2FxamZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MjU5MzYsImV4cCI6MjA4ODIwMTkzNn0.lbfHxn4YxXNLHB0uVBDInrHh8wsCbusDr1_SroACHgk'
);

// Johnny Hoang's 20 apps - restored data
const johnnyApps = [
  {
    id: 'app-github-tokenwallet',
    name: 'jWallet - Token & App Workspace',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/TokenWallet',
    hosting: 'Vercel (token-wallet)',
    url: 'https://jwallet.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 1',
    status: 'Production',
    priority: 'High',
    description: 'Workstation managing AI token quotas, recurring payment schedules, and unified App Store Workspace.',
    tech_stack: 'React 19, Vite, TypeScript, Supabase PostgreSQL, Row Level Security, Vercel Edge',
    tech_notes: 'High-contrast Developer Workstation Architecture',
  },
  {
    id: 'app-1787582510775',
    name: 'GoUs - Family & US Immigration Management',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/gous',
    hosting: 'Vercel (gous)',
    url: 'https://gous.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 1',
    status: 'Production',
    priority: 'High',
    description: 'US Immigration & family dossier platform featuring automated CSPA age calculation and multi-tenancy records.',
    tech_stack: 'React 19, Vite, TypeScript, NestJS 11, TypeORM, PostgreSQL (Supabase), OpenAI API',
    tech_notes: 'Monorepo Architecture (web/ + server/). Hybrid Vercel deployment with serverless API functions.',
  },
  {
    id: 'app-1787582876333',
    name: 'Shopee Buyer History & Refund Tracker',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/shopee-buyer-history',
    hosting: 'Vercel (shopee-buyer-history)',
    url: 'https://shopee.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 1',
    status: 'Production',
    priority: 'Medium',
    description: 'Chrome extension & web platform tracking Shopee purchase histories, refund reconciliation, and financial insights.',
    tech_stack: 'React 19, Vite, Tailwind CSS, PostgreSQL (Supabase), Chrome Extension Manifest V3',
    tech_notes: 'SPA React 19 + Vite with Vercel Serverless Functions.',
  },
  {
    id: 'app-github-beth',
    name: 'BETH Automated Trading System',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/BETH',
    hosting: 'Vercel (beth)',
    url: 'https://beth.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 2',
    status: 'Production',
    priority: 'High',
    description: 'Autonomous quantitative crypto trading platform blending technical analysis with multi-LLM consensus.',
    tech_stack: 'Next.js App Router, TypeScript, Supabase PostgreSQL, Binance API, OpenAI, Gemini, Claude, Groq',
    tech_notes: 'Multi-AI Agentic quantitative engine with Canary Execution mode.',
  },
  {
    id: 'app-github-pc-organize',
    name: 'PC Organize System Guard',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/pc_organize',
    hosting: 'Desktop Windows App',
    url: '',
    type: 'Desktop Tool',
    database: 'JH Supabase Data 2',
    status: 'Production',
    priority: 'High',
    description: 'Intelligent Windows disk space analyzer & safe cleaner featuring 50x Fast Incremental Scan and System Guard.',
    tech_stack: 'C# / .NET / WPF / PowerShell / Windows Shell API',
    tech_notes: 'High-performance incremental disk scanning engine.',
  },
  {
    id: 'app-ade',
    name: 'Admission Decision Engine (ADE)',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/AdmissionDecisionEngine',
    hosting: 'Vercel (ade / ade-backend)',
    url: 'https://ade.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 2',
    status: 'Production',
    priority: 'High',
    description: 'Multi-criteria university admission probability prediction and transcript analysis engine.',
    tech_stack: 'React 19, Vite, NestJS 11, Supabase PostgreSQL, Groq, Gemini, Claude API',
    tech_notes: 'Monorepo (apps/frontend + apps/backend). Multi-criteria decision engine.',
  },
  {
    id: 'app-aws',
    name: 'AWS Practice & Resource Center (Bo Hoc)',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/aws',
    hosting: 'Vercel (aws)',
    url: 'https://bohoc.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 1',
    status: 'Production',
    priority: 'Medium',
    description: 'Interactive AWS Certification prep platform, architecture diagrams, and mock exam simulation suite.',
    tech_stack: 'React 19, Vite, TypeScript, Tailwind CSS, Supabase PostgreSQL',
    tech_notes: 'Client-side test engine with offline caching.',
  },
  {
    id: 'app-mom-health',
    name: 'Mom Health Management',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/mom_health',
    hosting: 'Vercel (mom-health)',
    url: 'https://health.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 1',
    status: 'Production',
    priority: 'High',
    description: 'Maternal health platform tracking vitals, blood pressure, medication schedules, and clinical doctor visit logs.',
    tech_stack: 'React 19, Vite, TypeScript, Tailwind CSS, Supabase PostgreSQL, Chart.js',
    tech_notes: 'Vital signs health tracker with automated anomaly alerts.',
  },
  {
    id: 'app-game-eng',
    name: 'Mikawaii (Game Eng G10)',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/mikawaii',
    hosting: 'Vercel (mikawaii)',
    url: 'https://mikawaii.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 2',
    status: 'Production',
    priority: 'Medium',
    description: 'Gamified Grade 10 English learning platform featuring vocabulary battles, quest lines, and live classrooms.',
    tech_stack: 'React 19, Vite, Express Monorepo, Supabase Realtime, Howler.js, Canvas FX',
    tech_notes: 'Interactive gamified learning platform with real-time multiplayer vocabulary battle rooms.',
  },
  {
    id: 'app-menstrual-cycle',
    name: 'Menstrual Cycle Tracker (MOM)',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/menstrual_cycle',
    hosting: 'Vercel (menstrual-cycle)',
    url: 'https://mom.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 1',
    status: 'Production',
    priority: 'High',
    description: 'Menstrual health, ovulation prediction, and symptom correlation tracking suite.',
    tech_stack: 'React 19, Vite, TypeScript, Tailwind CSS, Supabase PostgreSQL',
    tech_notes: 'Bayesian cycle prediction algorithm with encrypted symptom logs.',
  },
  {
    id: 'app-coffee-shop',
    name: 'Coffee Shop 24h',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/coffee_shop_24hxh',
    hosting: 'Vercel (coffee-shop-24hxh)',
    url: 'https://cf24.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 1',
    status: 'Production',
    priority: 'Medium',
    description: 'Smart 24/7 coffee ordering, POS terminal, kitchen dispatch, and inventory management system.',
    tech_stack: 'React 19, Vite, NestJS Monorepo, Supabase PostgreSQL, WebSockets',
    tech_notes: 'Real-time kitchen order dispatch display (KDS) with automatic ingredient inventory deduction.',
  },
  {
    id: 'app-qlhs-dtnt',
    name: 'Quan ly ho so hoc sinh DTNT (QLHS DTNT)',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/qlhs_dtnt',
    hosting: 'Vercel (dtnt)',
    url: 'https://dtnt.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 2',
    status: 'Production',
    priority: 'High',
    description: 'Digital management platform for Ethnic Minority Boarding School student records, allowances, and boarding.',
    tech_stack: 'React 19, Vite, Express, Supabase PostgreSQL, XLSX Export',
    tech_notes: 'Boarding school student administration system with government subsidy auto-calculation.',
  },
  {
    id: 'app-github-collaboration-board',
    name: 'Collaboration Board',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/collaboration-board',
    hosting: 'Vercel (collaboration-board)',
    url: 'https://collab.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 2',
    status: 'Production',
    priority: 'Medium',
    description: 'Real-time collaborative whiteboard, meeting agenda coordinator, and action items tracker.',
    tech_stack: 'React 19, Vite, TypeScript, Supabase Realtime Channels, Lucide Icons',
    tech_notes: 'Multi-user concurrent canvas synchronization with operational transform.',
  },
  {
    id: 'app-github-office-operating',
    name: 'Office Operating System (JOffice)',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/office-operating',
    hosting: 'Vercel (office-operating)',
    url: 'https://joffice.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 2',
    status: 'Production',
    priority: 'High',
    description: 'Enterprise office operating system, room booking, asset tracking, and internal requisition workflows.',
    tech_stack: 'React 19, Vite, NestJS, Supabase PostgreSQL, FullCalendar',
    tech_notes: 'Office operating suite with conflict-free room scheduling.',
  },
  {
    id: 'app-family-management',
    name: 'Family Management',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/family-management',
    hosting: 'Vercel (family)',
    url: 'https://family.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 2',
    status: 'Production',
    priority: 'High',
    description: 'All-in-one family ecosystem managing shared budgets, chores, schedules, and medical dossiers.',
    tech_stack: 'React 19, Vite, Express Monorepo, Supabase PostgreSQL, Chart.js',
    tech_notes: 'Family operations portal with strict family-id tenancy.',
  },
  {
    id: 'app-github-talent-flow',
    name: 'Talent Flow HR Portal',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/talent-flow',
    hosting: 'Vercel (talent-flow)',
    url: 'https://talent.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 2',
    status: 'Production',
    priority: 'High',
    description: 'Recruitment workflow automation, AI candidate matching, and collaborative talent pipeline management.',
    tech_stack: 'React 19, Vite, TypeScript, NestJS, Supabase PostgreSQL, Gemini API',
    tech_notes: 'End-to-end recruitment tracking system with AI candidate resume parsing.',
  },
  {
    id: 'app-github-learning-dev-operation',
    name: 'Learning & Development Operation (LnD Portal)',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/learning-and-development-operation',
    hosting: 'Vercel (learning-and-development-operation)',
    url: 'https://lnd.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 2',
    status: 'Production',
    priority: 'High',
    description: 'Corporate learning management system, employee training pathways, and skill competency tracking.',
    tech_stack: 'React 19, Vite, TypeScript, Express, Supabase PostgreSQL, Video Player SDK',
    tech_notes: 'Enterprise training management portal with competency gap analysis.',
  },
  {
    id: 'app-github-photo',
    name: 'photo-clear-1',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/photo-clear-1',
    hosting: 'Desktop App / Local',
    url: '',
    type: 'Desktop App',
    database: 'JH Supabase Data 2',
    status: 'Development',
    priority: 'Medium',
    description: 'Duplicate photo finder, perceptual similarity detector, and image quality optimizer.',
    tech_stack: 'Electron / React / OpenCV / Node.js Sharp',
    tech_notes: 'Image deduplication utility using Perceptual Hash (pHash) and Laplacian variance blur detection.',
  },
  {
    id: 'app-github-shared-work-life-hub',
    name: 'Shared Work Life Hub',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/Shared-Work-Life-Hub',
    hosting: 'Vercel (shared-work-life-hub)',
    url: 'https://hub.minkoi.org',
    type: 'Web App',
    database: 'JH Supabase Data 1',
    status: 'Production',
    priority: 'High',
    description: 'Single-pane cockpit aggregating cross-application workflows, notifications, and life balance widgets.',
    tech_stack: 'Next.js App Router, TypeScript, Supabase Realtime, Tailwind CSS',
    tech_notes: 'Unified activity aggregator connecting work and personal sub-apps.',
  },
  {
    id: 'app-github-smart-doc-scanner',
    name: 'Smart Doc Scanner',
    developer: 'johnnyhoang',
    github: 'https://github.com/johnnyhoang/smart-doc-scanner',
    hosting: 'Vercel / Local',
    url: '',
    type: 'Utility',
    database: 'JH Supabase Data 2',
    status: 'Development',
    priority: 'Medium',
    description: 'Document scanner featuring perspective correction, page dewarping, shadow removal, and OCR export.',
    tech_stack: 'React, OpenCV.js WebAssembly, Tesseract.js OCR, PDF-Lib',
    tech_notes: 'In-browser computer vision document scanner with perspective correction and OCR.',
  },
];

async function restoreJohnnyApps() {
  console.log('🔄 Restoring Johnny Hoang\'s 20 apps to aw_app_projects...\n');

  // First, delete MinKoi's apps that were wrongly inserted
  const johnnyIds = johnnyApps.map(a => a.id);
  
  // Check current state
  const { data: current, error: fetchErr } = await sb.from('aw_app_projects').select('id, name');
  if (fetchErr) {
    console.error('❌ Cannot fetch current data:', fetchErr);
    return;
  }
  console.log(`📋 Current aw_app_projects has ${current?.length || 0} rows`);
  
  // Delete everything that's not in Johnny's list (MinKoi's apps that were inserted)
  const toDelete = (current || []).filter(r => !johnnyIds.includes(r.id));
  if (toDelete.length > 0) {
    console.log(`🗑️  Removing ${toDelete.length} wrong rows:`, toDelete.map(r => r.name));
    const { error: delErr } = await sb.from('aw_app_projects').delete().in('id', toDelete.map(r => r.id));
    if (delErr) console.error('Delete error:', delErr);
  }

  // Upsert all Johnny's apps
  let ok = 0, fail = 0;
  for (const app of johnnyApps) {
    const row = {
      id: app.id,
      name: app.name,
      developer: app.developer,
      github: app.github,
      hosting: app.hosting,
      url: app.url,
      type: app.type,
      database: app.database,
      status: app.status,
      priority: app.priority,
      description: app.description,
      tech_stack: app.tech_stack,
      tech_notes: app.tech_notes,
      last_updated: Date.now(),
    };
    const { error } = await sb.from('aw_app_projects').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error(`❌ [${app.id}] ${app.name}:`, error.message);
      fail++;
    } else {
      console.log(`✅ [${app.id}] ${app.name}`);
      ok++;
    }
  }

  console.log(`\n✨ Done: ${ok} restored, ${fail} failed`);
}

restoreJohnnyApps();
