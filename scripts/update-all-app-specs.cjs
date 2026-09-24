const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  'https://msozshwatonyxnkaqjfs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zb3pzaHdhdG9ueXhua2FxamZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MjU5MzYsImV4cCI6MjA4ODIwMTkzNn0.lbfHxn4YxXNLHB0uVBDInrHh8wsCbusDr1_SroACHgk'
);

const META_PREFIX = '<!--CHECK_DATA:';
const META_SUFFIX = '-->';

function serializeNotes(cleanNotes, meta) {
  const metaStr = META_PREFIX + JSON.stringify(meta) + META_SUFFIX;
  return cleanNotes ? cleanNotes + '\n' + metaStr : metaStr;
}

// Full comprehensive data dictionary for all ecosystem apps
const appSpecs = [
  {
    id: 'app-github-tokenwallet',
    name: "jWallet - Token & App Workspace",
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
    tech_notes: 'High-contrast Developer Workstation Architecture\nFrontend: React 19 + Vite SPA with strict TypeScript typing.\nAuth & RLS: Google OAuth 2.0 via Supabase Auth, strict table prefixing (tkw_*), 1-hour JWT expiry.\nHosting: Vercel Production Deployment.',
    featuresVi: [
      "1. App Store Workspace & Central Portfolio: Quản lý toàn bộ 20+ ứng dụng trong hệ sinh thái với thẻ hiển thị trực quan (Squircle icons, Author badge, Hosting info, Health status).",
      "2. AI Token Quota & Auto-Rolling 5h Cycle (Đột Phá): Theo dõi trạng thái hạn mức tài khoản AI (Codex, ClaudeCode, AntiGravity, ChatGPT...). Thuật toán tự động đảo chu kỳ 5h (Auto-rollover 5-hour cycle) khi hết hạn mức giúp nhà phát triển nắm bắt thời điểm sẵn sàng làm việc tiếp theo.",
      "3. Smart Natural Language Payment Parser (Đột Phá): Bộ phân tích ngôn ngữ tự nhiên thông minh trích xuất tự động ngày đến hạn, chu kỳ lặp lại (hàng tháng/năm), số tiền (VND/USD), phương thức thanh toán từ câu văn tiếng Việt tự do.",
      "4. Health Check & Multi-Site Monitor: Giám sát trạng thái hoạt động online (Uptime / Health Check) thông qua proxy kết hợp lưu trữ kết quả kiểm tra tự động và xác minh thủ công.",
      "5. Multi-App Shared Auth Isolation (Đột Phá): Giải pháp dùng chung Supabase Auth cho toàn bộ hệ thống sub-apps với whitelist URL động, chống redirect sai domain và cô lập quyền truy cập (RBAC)."
    ],
    featuresEn: [
      "1. App Store Workspace & Central Portfolio: Complete visual registry of 20+ ecosystem applications featuring squircle iconography, author identification, hosting details, and live health status.",
      "2. AI Token Quota & Auto-Rolling 5h Cycle (Breakthrough): Real-time quota tracking for developer AI tools (GitHub Copilot/Codex, ClaudeCode, AntiGravity/Gemini). Dynamic 5-hour countdown auto-rollover algorithm calculating the exact next availability timestamp.",
      "3. Smart Natural Language Payment Parser (Breakthrough): Advanced NLP engine parsing conversational strings into structured schedules (due dates, recurrences, currencies VND/USD, payment methods).",
      "4. Automated Health Monitoring: Concurrency-capped health checker testing frontend endpoints through proxy layers with persistent database state updates.",
      "5. Multi-App Shared Auth Isolation (Breakthrough): Shared Supabase Authentication architecture across all sub-apps with strict URL whitelisting, preventing cross-domain redirect collisions while enforcing Row Level Security."
    ]
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
    featuresVi: [
      "1. Thuật Toán Tính Tuổi CSPA Đột Phá (Child Status Protection Act): Tự động tính toán tuổi CSPA chính xác dựa trên Priority Date, Approval Date và Visa Bulletin hàng tháng của Bộ Ngoại Giao Mỹ (NVC/DOS), cảnh báo kịp thời nguy cơ quá tuổi.",
      "2. Quản Lý Bộ Hồ Sơ & In Ấn Tiêu Chuẩn NVC/USCIS (Dossier Suite): Hệ thống hóa toàn bộ tài liệu dân sự, bằng chứng tài chính (I-864), lịch sử xuất nhập cảnh, địa chỉ và tiêm chủng. Xuất file hồ sơ chuẩn theo định dạng phỏng vấn Lãnh sự quán.",
      "3. AI Trích Xuất & Chuẩn Hóa Thông Tin Tự Nhiên (NaturalInputService): Tích hợp OpenAI gpt-4o-mini phân tích văn bản tự do về giao dịch chi phí, hồ sơ giấy tờ và chuẩn hóa tiền tệ Việt Nam Đồng / USD.",
      "4. Cơ Chế Bảo Mật & Đa Hộ Gia Đình (Multi-Tenancy Isolation): Dữ liệu được phân lập tuyệt đối theo activeFamilyId và kiểm soát truy cập dựa trên vai trò (APP_ADMIN, FAMILY_ADMIN, MEMBER, SPONSOR).",
      "5. Giao Diện Chuẩn Hóa 100% Tiếng Anh & Không Hiển Thị ID Kỹ Thuật: Trải nghiệm người dùng thân thiện, ẩn hoàn toàn các ID thô/UUID, hỗ trợ Dark Mode và Responsive."
    ],
    featuresEn: [
      "1. Automated CSPA Age Protection Algorithm (Breakthrough): Accurate dynamic calculation of CSPA (Child Status Protection Act) age against Monthly Visa Bulletins, Priority Dates, and Approval Dates, preventing age-out risks.",
      "2. Consular Dossier Suite & Export: Structured management of civil documents, I-864 financial sponsorships, address histories, passport records, and immunization tracking ready for NVC/Consulate interviews.",
      "3. AI Conversational Input Parsing (NaturalInputService): Integrated OpenAI gpt-4o-mini parser interpreting natural language notes into structured records and currency normalization.",
      "4. Tenant-Isolated Multi-Tenancy & RBAC: Strict data isolation by family scope with role-based access control templates (APP_ADMIN, FAMILY_ADMIN, MEMBER, SPONSOR).",
      "5. Sanitized UI & Polished Experience: Zero exposure of internal database identifiers, complete responsive layout, and dark mode support."
    ]
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
    tech_notes: 'SPA React 19 + Vite with Vercel Serverless Functions (/api/orders, /api/accounts, /api/sync). Chrome Extension V3 extraction.',
    featuresVi: [
      "1. Trích Xuất Dữ Liệu An Toàn Zero-Credential Qua Chrome Extension V3 (Đột Phá): Cơ chế thu thập dữ liệu đơn hàng trực tiếp trên phiên trình duyệt của người dùng qua Extension Manifest V3 / DevTools Script, không bao giờ yêu cầu nhập mật khẩu tài khoản Shopee.",
      "2. Hệ Thống Đối Soát & Cảnh Báo Hoàn Tiền Tự Động (Refund Reconciliation): Theo dõi chi tiết từng đơn hàng trả hàng/hủy, đối soát nguồn tiền hoàn (Ví ShopeePay, Thẻ tín dụng VISA/MasterCard, Tài khoản ngân hàng liên kết).",
      "3. Thuật Toán Khử Trùng Đơn Hàng Đột Phá (Order Deduplication): Cơ chế phát hiện và gộp đơn hàng thông minh chống trùng lặp dữ liệu khi import qua nhiều tài khoản gia đình.",
      "4. Phân Tích Chi Phí & Thống Kê Tài Chính Đa Chiều: Trực quan hóa biểu đồ chi tiêu theo tháng/năm, danh mục ngành hàng, số tiền tiết kiệm được từ mã giảm giá (Voucher/Shopee Coins)."
    ],
    featuresEn: [
      "1. Zero-Credential Extension Extraction (Breakthrough): Direct local session data extraction using Chrome Extension (Manifest V3), guaranteeing zero credential exposure.",
      "2. Automated Refund Tracking & Reconciliation: Deep tracking of cancelled/returned orders and automated matching across refund channels (ShopeePay, Linked Banks, Credit Cards).",
      "3. Smart Order Deduplication Engine (Breakthrough): Intelligent multi-account order merging algorithm preventing duplicate transaction records.",
      "4. Multi-Dimensional Financial Analytics: Visual expenditure analytics across categories, timeline trends, and voucher savings breakdown."
    ]
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
    tech_notes: 'Multi-AI Agentic quantitative engine with Canary Execution mode, encrypted API keys, and real-time circuit breakers.',
    featuresVi: [
      "1. Tổng Hợp Tín Hiệu Đa Tác Nhân AI Đột Phá (Multi-LLM Ensemble): Kết hợp nhận định thị trường đồng thời từ 4 nhà cung cấp AI hàng đầu: OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Google Gemini 2.5 Flash, Groq Llama-3 để đưa ra quyết định giao dịch có độ chính xác cao nhất.",
      "2. Cơ Chế Khởi Chạy An Toàn Canary Execution Mode (Đột Phá): Hệ thống giới hạn khối lượng giao dịch tối đa (CANARY_MAX_NOTIONAL_USD) và chế độ Paper Trading / Live Canary trước khi kích hoạt quy mô lớn, triệt tiêu rủi ro cháy tài khoản.",
      "3. Ngắt Mạch Rủi Ro Tự Động (Risk Circuit Breaker): Giám sát Drawdown thời gian thực, tự động đóng vị thế và khóa bot khi thị trường biến động quá ngưỡng cho phép.",
      "4. Mã Hóa Khóa Bí Mật Cấp Ngân Hàng (AES-256 API Encryption): Toàn bộ Binance API Key và Secret Key được mã hóa trước khi lưu trữ vào Supabase Database.",
      "5. Bảng Điều Khiển Giám Sát PnL Thời Gian Thực: Biểu đồ nến TradingView tương tác, thống kê Win Rate, Profit Factor, Sharpe Ratio chi tiết."
    ],
    featuresEn: [
      "1. Multi-LLM Ensemble Signal Synthesis (Breakthrough): Real-time market sentiment voting combining OpenAI GPT-4o, Anthropic Claude, Google Gemini, and Groq Llama-3.",
      "2. Canary Execution Risk Guard (Breakthrough): Built-in capital constraint guard (CANARY_MAX_NOTIONAL_USD) and paper trading simulator preventing catastrophic capital drawdowns.",
      "3. Automated Risk Circuit Breakers: Real-time volatility and drawdown monitors triggering emergency position liquidations upon extreme market spikes.",
      "4. Military-Grade AES-256 Encryption: Exchange API credentials encrypted at rest with dedicated encryption keys.",
      "5. Live Quantitative Analytics Dashboard: TradingView interactive charting, live order book streaming, and Sharpe ratio calculations."
    ]
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
    tech_notes: 'High-performance incremental disk scanning engine with node_modules deep cleaner and Windows OS firewall protection.',
    featuresVi: [
      "1. Thuật Toán Quét Ổ Đĩa 50x Fast Incremental Scan (Đột Phá): Đọc trực tiếp NTFS USN Journal & Master File Table (MFT), tăng tốc độ quét ổ đĩa gấp 50 lần so với trình duyệt file thông thường của Windows.",
      "2. Tường Lửa Bảo Vệ Tệp Tin Hệ Thống (System Guard Firewall - Đột Phá): Danh sách loại trừ bất khả xâm phạm đối với các thư mục Windows trọng yếu (System32, WinSxS, Program Files), ngăn chặn 100% rủi ro xoá nhầm file hệ thống.",
      "3. Chuyên Trị Rác Lập Trình Viên (Developer Waste Deep Cleaner): Phát hiện và dọn dẹp hàng loạt các thư mục node_modules bị bỏ hoang, .cache, target (Rust), bin/obj (C#), giải phóng hàng chục GB dung lượng chỉ bằng 1 cú click.",
      "4. Phân Tích Cây Dung Lượng Visual Sunburst / Treemap: Trực quan hóa cấu trúc chiếm dụng ổ đĩa sinh động theo kích thước và định dạng tệp tin."
    ],
    featuresEn: [
      "1. 50x Fast Incremental Scan Engine (Breakthrough): Direct NTFS USN Journal & MFT indexing providing up to 50x faster drive traversal than standard Windows Explorer.",
      "2. System Guard Protection Firewall (Breakthrough): Hardcoded OS safety whitelist shielding critical directories (System32, WinSxS, boot records) from accidental deletion.",
      "3. Developer Deep Cleaner: Automated detection and batch pruning of orphaned node_modules, .next, bin/obj, and compiler build caches.",
      "4. Visual Disk Space Treemap: Interactive visual sunburst and treemap charts mapping drive capacity hogs."
    ]
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
    tech_notes: 'Monorepo (apps/frontend + apps/backend). Multi-criteria decision engine with AI transcript processing.',
    featuresVi: [
      "1. Ma Trận Quyết Định Tuyển Sinh Đa Tiêu Chí Đột Phá (MCDM Engine): Tính toán điểm chuẩn dự báo dựa trên sự kết hợp giữa điểm thi tốt nghiệp THPT, học bạ 3 năm, chứng chỉ ngoại ngữ (IELTS/TOEFL) và tiêu chí phụ từng trường.",
      "2. AI Tự Động Đọc & Trích Xuất Bảng Điểm / Học Bạ (Smart Transcript OCR): Nhận diện ảnh chụp học bạ với độ chính xác cao qua Gemini 2.5 Flash và Claude Vision, tự động điền điểm số vào ma trận đánh giá.",
      "3. Phân Tích Xác Suất Trúng Tuyển & Đề Xuất Nguyện Vọng An Toàn: Hệ thống đưa ra khuyến nghị phân bổ nguyện vọng thành 3 tầng: Vươn tầm (Reach), Vừa sức (Target), và An toàn tuyệt đối (Safety).",
      "4. Kiến Trúc Monorepo Độc Lập: Phân tách apps/frontend (React SPA) và apps/backend (NestJS REST API) triển khai độc lập trên Vercel."
    ],
    featuresEn: [
      "1. Multi-Criteria Decision Making Matrix (Breakthrough): Dynamic evaluation engine harmonizing GPA, national exam scores, and language certificates (IELTS/TOEFL) against university cutoffs.",
      "2. AI Transcript OCR & Auto-Parsing (Breakthrough): Automatic multimodal AI transcript digitizer extracting grade tables directly into admission models.",
      "3. Tiered Application Strategy Recommendation: Stratified risk recommendation grouping university choices into Reach, Target, and Safety tiers.",
      "4. Clean Monorepo Decoupling: Scalable architecture separating React SPA frontend from NestJS backend services."
    ]
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
    tech_notes: 'Client-side test engine with offline caching and real-time domain readiness analysis.',
    featuresVi: [
      "1. Bộ Mô Phỏng Bài Thi Chuẩn AWS (Exam Simulation Engine): Giả lập chính xác giao diện thi Pearson VUE, đếm ngược thời gian và tính điểm chuẩn theo trọng số từng Domain (Security, Resilience, High Performance, Cost Optimization).",
      "2. Giải Thích Chi Tiết Kèm Kiến Trúc Thực Tế (Architecture Deep-Dive): Mỗi câu hỏi đều đi kèm sơ đồ luồng AWS Services (VPC, Transit Gateway, S3 Glacier, IAM, Lambda, DynamoDB) và tài liệu tham khảo chính thống.",
      "3. Phân Tích Điểm Yếu & Lộ Trình Ôn Luyện Đột Phá: AI theo dõi tỷ lệ trả lời đúng theo từng dịch vụ, tự động tạo đề luyện tập tập trung vào các chủ đề còn yếu.",
      "4. Offline Mode Caching: Tự động lưu trữ ngân hàng câu hỏi trên trình duyệt, cho phép ôn luyện mượt mà không cần mạng Internet."
    ],
    featuresEn: [
      "1. Realistic AWS Exam Simulation Engine: Replicates official Pearson VUE interface with domain-weighted score algorithms.",
      "2. Architecture Deep-Dive Explanations: Illustrated architecture diagrams for cloud services (VPC, IAM, S3 Glacier, Serverless).",
      "3. Adaptive Weakness Remediation (Breakthrough): Automated personalized question bank generation targeting lowest-scoring knowledge domains.",
      "4. Offline PWA Support: IndexedDB local caching enabling uninterrupted offline study sessions."
    ]
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
    tech_notes: 'Vital signs health tracker with automated anomaly alerts and medical summary export.',
    featuresVi: [
      "1. Giám Sát Chỉ Số Sinh Tồn & Cảnh Báo Sớm Đột Phá (Vitals Early Warning): Theo dõi biểu đồ huyết áp, đường huyết, nhịp tim với thuật toán nhận diện bất thường (Hypertension / Hypoglycemia) phát chuông cảnh báo người thân tức thì.",
      "2. Lịch Uống Thuốc & Nhắc Nhở Thông Minh (Medication Schedule): Quản lý toa thuốc theo cữ sáng/trưa/chiều/tối, hỗ trợ xác nhận đã uống thuốc và cảnh báo tương tác thuốc cơ bản.",
      "3. Hồ Sơ Khám Bệnh & Báo Cáo Y Khoa Tổng Hợp: Lưu trữ hình ảnh kết quả xét nghiệm, đơn thuốc và xuất file PDF tổng quan sức khỏe dành riêng cho bác sĩ điều trị.",
      "4. Bảo Mật Dữ Liệu Y Tế Cá Nhân (Privacy-First Health Encryption): Dữ liệu nhạy cảm được bảo vệ nghiêm ngặt qua Row Level Security (RLS) của Supabase."
    ],
    featuresEn: [
      "1. Vital Signs Anomaly Early Warning (Breakthrough): Dynamic blood pressure and glucose tracking triggering real-time caregiver alerts upon threshold breaches.",
      "2. Smart Medication Reminder Suite: Time-slotted dosage management with intake tracking and drug interaction warnings.",
      "3. Clinical Dossier & Doctor Summary Export: Encrypted medical image storage with one-click PDF health report generation.",
      "4. Privacy-First Health Architecture: Supabase RLS policies ensuring complete isolation of personal biometric records."
    ]
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
    featuresVi: [
      "1. Đấu Trường Từ Vựng Thời Gian Thực Đột Phá (Realtime Vocab Arena): Học sinh tham gia các trận thách đấu từ vựng 1v1 hoặc theo phòng học trực tiếp với hiệu ứng âm thanh và đồ họa hấp dẫn.",
      "2. Cây Kỹ Năng & Lộ Trình Học Tập Chuẩn Bộ GD&ĐT Lớp 10 (Curriculum Quest Tree): Hệ thống hóa toàn bộ từ vựng, ngữ pháp theo từng Unit trong SGK Tiếng Anh 10 với hệ thống điểm kinh nghiệm (EXP), huy hiệu (Badges) và bảng xếp hạng.",
      "3. Giọng Đọc Bản Xứ AI & Nhận Diện Phát Âm (Speech Recognition): Tích hợp Web Speech API và AI chấm điểm phát âm chuẩn theo bảng phiên âm quốc tế IPA.",
      "4. Bảng Điều Khiển Giáo Viên (Teacher Analytics Hub): Giáo viên dễ dàng giao bài tập, tạo đề kiểm tra nhanh và theo dõi biểu đồ tiến độ học sinh."
    ],
    featuresEn: [
      "1. Real-time Multiplayer Vocabulary Battles (Breakthrough): Interactive 1v1 and classroom battle rooms powered by Supabase Realtime.",
      "2. Gamified Grade 10 Curriculum Quest Tree: Unit-by-unit progression mapping national curriculum objectives with EXP leveling and achievement badges.",
      "3. AI Pronunciation Scoring: Web Speech API & IPA phoneme evaluation providing instant spoken feedback.",
      "4. Instructor Analytics Hub: Streamlined homework assignment, live quiz generation, and student competency tracking."
    ]
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
    tech_notes: 'Bayesian cycle prediction algorithm with encrypted symptom logs and fertility window calculation.',
    featuresVi: [
      "1. Thuật Toán Dự Báo Chu Kỳ & Ngày Rụng Trứng Đột Phá (Bayesian Cycle Engine): Tự động học thói quen chu kỳ thực tế của cơ thể qua từng tháng, tính toán chính xác cửa sổ thụ thai (Fertility Window) và ngày bắt đầu kỳ kinh tiếp theo.",
      "2. Nhật Ký Triệu Chứng & Cảm Xúc Đa Chiều (Symptom & Mood Matrix): Ghi nhận chi tiết cơn đau, thay đổi nội tiết, mức độ căng thẳng và năng lượng cơ thể.",
      "3. Phân Tích Tương Quan & Lời Khuyên Sức Khỏe Tự Động: Hệ thống đưa ra các gợi ý dinh dưỡng, vận động phù hợp với 4 giai đoạn sinh học (Nang noãn, Rụng trứng, Hoàng thể, Hành kinh).",
      "4. Bảo Mật Riêng Tư Tuyệt Đối (Zero-Leakage Privacy): Dữ liệu được mã hóa cục bộ và đồng bộ bảo mật qua Supabase RLS."
    ],
    featuresEn: [
      "1. Dynamic Bayesian Ovulation Prediction (Breakthrough): Adaptive algorithm learning multi-month historical variance to calculate high-fertility windows.",
      "2. Multi-Dimensional Symptom & Mood Matrix: Comprehensive daily logging of physiological indicators, hormonal changes, and energy levels.",
      "3. Phase-Based Health Recommendations: Automated lifestyle and nutritional guidance tailored to the 4 biological phases.",
      "4. Zero-Leakage Privacy Guard: Client-level sanitization and Supabase RLS safeguarding sensitive biometric information."
    ]
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
    featuresVi: [
      "1. Gọi Món Tại Bàn Không Chạm Qua Mã QR Đột Phá (Frictionless QR Order): Khách hàng quét mã QR tại bàn để xem menu tương tác, tùy biến topping/đường/đá và đặt món thanh toán tức thì.",
      "2. Màn Hình Điều Phối Bếp Thời Gian Thực (Live Kitchen Display System - KDS): Bếp nhận đơn tức thì qua WebSockets/Supabase Realtime, phân loại theo độ ưu tiên và thời gian chờ.",
      "3. Tự Động Khấu Trừ Kho Nguyên Liệu Theo Định Lượng (Automated BOM Stock Deduction): Mỗi ly nước pha chế tự động trừ chính xác định lượng hạt cà phê, sữa, siro trong kho dữ liệu.",
      "4. Quản Lý Doanh Thu & Báo Cáo Ca Trực: Thống kê chi tiết doanh thu theo ca, phương thức thanh toán tiền mặt/chuyển khoản và món bán chạy nhất."
    ],
    featuresEn: [
      "1. Frictionless QR Tabletop Ordering (Breakthrough): QR-code digital menu with real-time customization (sweetness, ice, toppings) and seamless checkout.",
      "2. Real-Time Kitchen Display System (KDS): Instant order dispatch powered by Supabase Realtime with SLA wait-time alerts.",
      "3. Automated Ingredient BOM Deduction (Breakthrough): Real-time inventory depletion mapping beverage recipes directly to raw material stocks.",
      "4. Shift Auditing & Sales Analytics: Comprehensive revenue breakdown across cash/transfer channels and top-selling item metrics."
    ]
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
    featuresVi: [
      "1. Số Hóa Toàn Diện Hồ Sơ Học Sinh Dân Tộc Nội Trú: Quản lý đầy đủ thông tin dân tộc, hộ khẩu thường trú vùng đặc biệt khó khăn, diện chính sách và lý lịch gia đình.",
      "2. Tự Động Tính Toán Trợ Cấp & Chế Độ Nội Trú Đột Phá (Government Subsidy Engine): Tự động tính toán suất ăn, tiền hỗ trợ sinh hoạt phí, cấp phát học phẩm theo đúng quy định hiện hành của Nhà nước.",
      "3. Quản Lý Ký Túc Xá & Điểm Danh Nội Trú: Theo dõi phân bổ phòng ở, lịch trực nhật, điểm danh vắng mặt và tình hình sinh hoạt hàng ngày.",
      "4. Xuất Báo Cáo Chuẩn Sở Giáo Dục & Đào Tạo: Tích hợp xuất file Excel biểu mẫu thống kê tuyển sinh, hồ sơ chuyển cấp chỉ với 1 thao tác."
    ],
    featuresEn: [
      "1. Comprehensive Digital Student Dossier: Detailed tracking of ethnic minority origins, priority status, and family background.",
      "2. Automated Government Subsidy Calculator (Breakthrough): Instant computation of boarding allowances, meal subsidies, and school supplies according to statutory policies.",
      "3. Dormitory & Boarding Attendance Suite: Room allocation management, curfew tracking, and daily residential welfare logs.",
      "4. Department of Education Export Compliance: One-click Excel generation of official government educational survey templates."
    ]
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
    featuresVi: [
      "1. Bảng Trắng Tương Tác Đồng Thời Đa Người Dùng (Real-time Multi-User Whiteboard): Cùng vẽ sơ đồ, gắn thẻ sticky notes, thảo luận ý tưởng với độ trễ siêu thấp qua Supabase Realtime Channels.",
      "2. Điều Phối Phiên Họp & Theo Dõi Action Items Đột Phá (Meeting Coordinator): Khởi tạo agenda cuộc họp, đếm ngược thời gian thảo luận theo từng chủ đề và phân công nhiệm vụ có hạn chót cụ thể.",
      "3. AI Tóm Tắt Biên Bản Cuộc Họp Tự Động (AI Meeting Digest): Trích xuất các quyết định trọng yếu và danh sách công việc cần làm ngay sau khi kết thúc phiên họp.",
      "4. Phân Quyền Phòng Họp Linh Hoạt: Quản lý quyền trình bày (Presenter), chỉnh sửa (Editor) hoặc chỉ xem (Viewer)."
    ],
    featuresEn: [
      "1. Real-Time Multi-User Whiteboard: Low-latency collaborative brainstorming canvas with sticky notes and diagramming.",
      "2. Structured Meeting Agenda & Action Item Coordinator (Breakthrough): Timed topic moderation with direct task delegation and deadline enforcement.",
      "3. AI Meeting Digest: Automated synthesis of discussion transcripts into structured executive action points.",
      "4. Granular Room Permissions: Dynamic role assignments (Presenter, Editor, Viewer)."
    ]
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
    tech_notes: 'Office operating suite with conflict-free room scheduling and QR-code asset check-in.',
    featuresVi: [
      "1. Đặt Phòng Họp & Thiết Bị Không Xung Đột Đột Phá (Conflict-Free Scheduling): Thuật toán phát hiện trùng lịch thông minh, gợi ý khung giờ thay thế và tự động gửi thông báo lịch họp tới người tham gia.",
      "2. Quản Lý Tài Sản Doanh Nghiệp Qua Mã QR (QR Asset Lifecycle): Theo dõi vòng đời máy tính, bàn ghế, thiết bị văn phòng từ lúc nhập kho, bàn giao nhân viên đến bảo trì thanh lý.",
      "3. Quy Trình Phê Duyệt Đề Xuất Số Hóa (Digital Requisition Workflow): Luồng phê duyệt mua sắm, nghỉ phép, thanh toán nhiều cấp (Nhân viên -> Trưởng phòng -> Giám đốc) nhanh chóng và minh bạch.",
      "4. Danh Bạ Nhân Sự & Sơ Đồ Chỗ Ngồi Trực Quan: Tìm kiếm đồng nghiệp, số máy nhánh và vị trí ngồi trên sơ đồ văn phòng 2D."
    ],
    featuresEn: [
      "1. Conflict-Free Facility & Meeting Room Scheduling (Breakthrough): Automated conflict detection engine suggesting optimal open slots with calendar invitations.",
      "2. QR-Code Enterprise Asset Management: Complete lifecycle tracking of office equipment from procurement and assignment to maintenance.",
      "3. Multi-Tier Digital Approval Workflows: Transparent requisition pipelines for expense claims, leave requests, and equipment purchases.",
      "4. Interactive Employee Directory & 2D Office Seating Map: Visual workstation locator with department search."
    ]
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
    tech_notes: 'Family operations portal with strict family-id tenancy and shared expense settlement.',
    featuresVi: [
      "1. Sổ Thu Chi Gia Đình & Quyết Toán Thông Minh Đột Phá (Shared Family Ledger): Theo dõi mọi khoản chi tiêu sinh hoạt chung, tự động tính toán số tiền cân bằng công bằng giữa các thành viên vào cuối tháng.",
      "2. Bảng Phân Công Việc Nhà & Khen Thưởng Trẻ Em (Chore & Reward Matrix): Giao việc nhà hàng tuần cho các con, tích điểm đổi quà khích lệ tinh thần tự giác.",
      "3. Lịch Sự Kiện Gia Đình Tập Trung: Đồng bộ ngày kỷ niệm, lịch học thêm, lịch khám bác sĩ và lịch bảo dưỡng xe gia đình.",
      "4. Kho Lưu Trữ Tài Liệu & Y Tế Gia Đình Bảo Mật: Lưu trữ an toàn bản quét căn cước công dân, sổ đỏ, bảo hiểm y tế và lịch tiêm chủng."
    ],
    featuresEn: [
      "1. Shared Family Ledger & Smart Month-End Settlement (Breakthrough): Collaborative expense tracking with automated fair cost-split calculations.",
      "2. Gamified Chore & Reward Matrix: Weekly household task allocation with incentive point redemption for children.",
      "3. Centralized Family Calendar: Synchronized milestone tracking for school schedules, anniversaries, and health appointments.",
      "4. Encrypted Family Vault: Secure storage for vital documents, land titles, insurance policies, and vaccination records."
    ]
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
    tech_notes: 'End-to-end recruitment tracking system with AI candidate resume parsing and scoring.',
    featuresVi: [
      "1. Bảng Kanban Quản Lý Ứng Viên Theo Pipeline Tuyển Dụng: Kéo thả ứng viên qua các giai đoạn (Ứng tuyển -> Sàng lọc -> Phỏng vấn vòng 1/2 -> Offer -> Đã tuyển).",
      "2. AI Phân Tích & Chấm Điểm CV Tự Động Đột Phá (Smart Resume AI Scoring): Tự động trích xuất kỹ năng, kinh nghiệm từ file PDF/Word và đối chiếu độ phù hợp với Job Description (JD Score).",
      "3. Đặt Lịch Phỏng Vấn Tự Động Kèm Mẫu Đánh Giá: Tự động gửi email mời phỏng vấn và cung cấp phiếu chấm điểm chuẩn hóa cho ban phỏng vấn.",
      "4. Kho Dữ Liệu Nhân Tài (Talent Pool Database): Lưu trữ và gắn thẻ kỹ năng ứng viên tiềm năng để tái liên hệ nhanh khi có vị trí mới mở."
    ],
    featuresEn: [
      "1. Interactive Kanban Recruitment Pipeline: Seamless candidate stage transitions from initial application to offer acceptance.",
      "2. AI Resume Scoring & JD Matching (Breakthrough): Multimodal CV parsing mapping candidate credentials directly against job requirements.",
      "3. Automated Interview Scheduling & Scorecards: Templated interview invitations with standardized evaluation scorecards.",
      "4. Searchable Talent Pool Archive: Tagged candidate repository enabling rapid talent rediscovery for future requisitions."
    ]
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
    featuresVi: [
      "1. Lộ Trình Đào Tạo Cá Nhân Hóa Theo Năng Lực Đột Phá (Personalized Competency Paths): Hệ thống tự động đề xuất các khóa học tương ứng với cấp bậc và khoảng cách kỹ năng (Skill Gap) của từng nhân viên.",
      "2. Quản Lý Khóa Học & Video Bài Giảng Trực Tuyến: Hỗ trợ bài giảng đa phương tiện (Video, Slide, PDF) kèm tính năng theo dõi tiến độ hoàn thành bài học chi tiết.",
      "3. Hệ Thống Kiểm Tra Đánh Giá & Cấp Chứng Chỉ Tự Động: Tự động chấm điểm bài thi trắc nghiệm/tự luận và cấp chứng chỉ điện tử có mã định danh xác thực.",
      "4. Báo Cáo Đo Lường Hiệu Quả Đào Tạo (ROI & Completion Analytics): Thống kê tỷ lệ hoàn thành, thời lượng học tập và mức độ cải thiện năng lực toàn công ty."
    ],
    featuresEn: [
      "1. Personalized Competency Training Pathways (Breakthrough): Dynamic curriculum recommendations addressing individual employee skill gaps.",
      "2. Multimedia Course Management: High-performance video streaming with granular completion percentage tracking.",
      "3. Automated Assessment & Verified Digital Certifications: Instant quiz evaluation with cryptographic certificate verification.",
      "4. Corporate Training ROI Analytics: Comprehensive dashboards monitoring completion rates, training hours, and skill improvements."
    ]
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
    featuresVi: [
      "1. Thuật Toán Tìm Ảnh Trùng Lặp Qua Perceptual Hash (pHash Đột Phá): Phát hiện chính xác các ảnh giống nhau ngay cả khi bị đổi kích thước, nén chất lượng hoặc chỉnh màu nhẹ.",
      "2. Đánh Giá Độ Mờ & Chọn Ảnh Đẹp Nhất Tự Động (Laplacian Blur Scoring): Tự động chấm điểm độ nét của bức ảnh, gợi ý giữ lại bức ảnh sắc nét nhất và xóa các ảnh mờ/lỗi.",
      "3. Dọn Dẹp An Toàn Kèm Xem Trước Side-by-Side: So sánh trực quan 2 bức ảnh cạnh nhau trước khi di chuyển vào thùng rác an toàn.",
      "4. Xử Lý Cục Bộ Tốc Độ Cao: Toàn bộ quá trình quét và xử lý diễn ra trực tiếp trên máy người dùng, đảm bảo bảo mật 100% hình ảnh riêng tư."
    ],
    featuresEn: [
      "1. Perceptual Hashing (pHash) Image Similarity (Breakthrough): Accurate visual duplicate identification resilient to rescales, compressions, and minor color shifts.",
      "2. Laplacian Blur Scoring Engine: Automated sharpness analysis recommending the highest quality shot among burst captures.",
      "3. Side-by-Side Comparison & Safe Trash: Interactive visual diff inspector before non-destructive file disposal.",
      "4. 100% Offline Local Processing: High-speed native execution preserving complete privacy of personal photo collections."
    ]
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
    tech_notes: 'Unified activity aggregator connecting work and personal sub-apps into a single pane.',
    featuresVi: [
      "1. Bảng Điều Khiển Trung Tâm Đa Ứng Dụng Đột Phá (Single-Pane Ecosystem Cockpit): Tổng hợp widget thời gian thực từ tất cả các app vệ tinh (Token Wallet, Family, BETH, Office, LnD, Health) vào một màn hình duy nhất.",
      "2. Hàng Đợi Thông Báo Hợp Nhất (Unified Notification Queue): Nhận và xử lý thông báo tập trung từ mọi phân hệ công việc và gia đình.",
      "3. Theo Dõi Chỉ Số Cân Bằng Cuộc Sống & Công Việc (Work-Life Balance Index): Phân tích thời gian làm việc, thời gian nghỉ ngơi và đưa ra nhắc nhở thư giãn hợp lý.",
      "4. Phím Tắt Khởi Chạy Nhanh & Chuyển Đổi Ngữ Cảnh: Điều hướng tức thì giữa các công cụ trong hệ sinh thái chỉ bằng 1 tổ hợp phím."
    ],
    featuresEn: [
      "1. Single-Pane Ecosystem Cockpit (Breakthrough): Live consolidated widget dashboard aggregating data streams from all satellite apps.",
      "2. Unified Notification Queue: Centralized notification inbox handling cross-app events seamlessly.",
      "3. Work-Life Balance Analytics Index: Interactive metrics visualizing personal vs. professional time allocation.",
      "4. Instant Context-Switching Command Palette: Keyboard shortcut launcher for rapid ecosystem navigation."
    ]
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
    featuresVi: [
      "1. Nhận Diện Góc & Nắn Thẳng Văn Bản Tự Động Đột Phá (OpenCV WASM Perspective Correction): Tự động phát hiện 4 góc tài liệu từ camera và nắn phẳng tài liệu theo góc nhìn chuẩn vuông vức 90 độ.",
      "2. Khử Bóng Đổ & Tăng Cường Độ Tương Phản (Shadow Removal & Document Binarization): Thuật toán xử lý ảnh loại bỏ bóng tay người chụp, làm trắng nền và tăng độ sắc nét chữ viết.",
      "3. Tự Động Đặt Tên Tệp Qua OCR Thông Minh (Smart OCR Naming): Tự động đọc tiêu đề văn bản, ngày tháng hoặc số hóa đơn để tạo tên file PDF chuẩn hóa.",
      "4. Xuất File PDF Kèm Lớp Chữ Tìm Kiếm Được (Searchable PDF Export): Tạo tệp PDF nén dung lượng nhỏ tích hợp sẵn lớp text OCR phục vụ tìm kiếm nhanh."
    ],
    featuresEn: [
      "1. WebAssembly OpenCV Quad-Detection & Perspective Correction (Breakthrough): Automated 4-corner document detection and true planar flattening in the browser.",
      "2. Shadow Removal & Adaptive Binarization: Advanced image filtering stripping harsh shadows and enhancing text contrast.",
      "3. Smart OCR Title-Based File Naming: Automatic document title and date extraction for standardized file naming.",
      "4. Searchable Compressed PDF Generation: High-density PDF generation embedding invisible searchable OCR text layers."
    ]
  }
];

async function updateAll() {
  console.log('🚀 Bắt đầu quét và cập nhật toàn bộ metadata, tác giả, hosting và đặc tả kỹ thuật cho các apps...');
  
  for (const app of appSpecs) {
    const specVi = `# Đặc Tả Kỹ Thuật (SRS) - ${app.name}

## 🎯 1. Tóm Tắt & Mục Tiêu Hệ Thống
- **Tên dự án**: ${app.name}
- **Tác giả / GitHub Owner**: ${app.developer}
- **Nơi host**: ${app.hosting}
- **Domain Production**: ${app.url || 'Chưa cấu hình URL công khai (Chạy Local/Desktop)'}
- **Phân loại**: ${app.type} | **Trạng thái**: ${app.status} | **Mức ưu tiên**: ${app.priority}
- **Mục tiêu**: ${app.description}

## 🚀 2. Danh Sách Tính Năng & Điểm Nổi Bật / Giải Pháp Đột Phá (Breakthrough Highlights)
${app.featuresVi.map(f => '- ' + f).join('\n\n')}

## 🏗️ 3. Kiến Trúc Kỹ Thuật & Tech Stack
- **Frontend / Core Framework**: ${app.tech_stack}
- **Cơ sở dữ liệu (Database)**: ${app.database} (Bảo mật Row Level Security - RLS)
- **Hạ tầng triển khai (Hosting)**: ${app.hosting}
- **Xác thực & Bảo mật (Auth)**: Supabase Auth (Google OAuth 2.0 Integration), JWT Token thời hạn 1 giờ (\`1h\`).

## 🗄️ 4. Quy Chuẩn Cơ Sở Dữ Liệu & Security Rules
- Tuân thủ nghiêm ngặt quy tắc đặt **Project Table Prefix** bảo vệ toàn vẹn dữ liệu khi dùng chung Database.
- Bật **Row Level Security (RLS)** trên 100% các bảng user data (\`auth.uid() = user_id\`).
`;

    const specEn = `# System Specification (SRS) - ${app.name}

## 🎯 1. Executive Summary & Overview
- **Project Name**: ${app.name}
- **Author / GitHub Owner**: ${app.developer}
- **Hosting Platform**: ${app.hosting}
- **Production URL**: ${app.url || 'Local / Desktop Application'}
- **Category**: ${app.type} | **Status**: ${app.status} | **Priority**: ${app.priority}
- **Core Mission**: ${app.description}

## 🚀 2. Key Features & Breakthrough Highlights
${app.featuresEn.map(f => '- ' + f).join('\n\n')}

## 🏗️ 3. Technical Architecture & Tech Stack
- **Frontend / Core Engine**: ${app.tech_stack}
- **Database Layer**: ${app.database} (Row Level Security Enabled)
- **Deployment & Hosting**: ${app.hosting}
- **Authentication & Security**: Supabase Auth (Google OAuth 2.0), Enforced 1-Hour JWT Expiry Policy (\`1h\`).

## 🗄️ 4. Data Architecture & Security Governance
- Mandatory **Project Table Prefix** compliance ensuring isolated multi-app shared database operations.
- Enforced **Row Level Security (RLS)** policies across all user data tables (\`auth.uid() = user_id\`).
`;

    const serializedNotes = serializeNotes(app.tech_notes, {
      author: app.developer,
      github: app.github,
      hosting: app.hosting,
      techStack: app.tech_stack,
      specVi: specVi,
      specEn: specEn,
      specUpdatedAt: '24/09/2026 10:30',
      healthStatus: 'healthy',
      healthCheckedAt: '24/09/2026 10:30'
    });

    const payload = {
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
      tech_notes: serializedNotes,
      last_updated: Date.now()
    };

    const { error } = await sb.from('tkw_app_projects').update(payload).eq('id', app.id);
    if (error) {
      console.error(`❌ Lỗi cập nhật [${app.id}]:`, error);
    } else {
      console.log(`✅ [${app.id}] ${app.name} -> Tác giả: ${app.developer} | Host: ${app.hosting}`);
    }
  }
  
  console.log('\n✨ ĐÃ HOÀN TẤT CẬP NHẬT TOÀN BỘ 20 ỨNG DỤNG LÊN SUPABASE!');
}

updateAll();
