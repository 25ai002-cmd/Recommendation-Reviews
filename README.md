# ReviewFlow - Multi-Business NFC Review Accelerator SaaS

ReviewFlow is a production-ready, multi-tenant SaaS application that enables physical retail, dining, medical, and service businesses to rapidly generate 5-star Google reviews via in-person NFC card taps and QR codes.

---

## 🚀 Key Features

1. **Multi-Business SaaS Architecture**:
   - Each business has its own authentication, dedicated URL slug (e.g. `/r/apex-dental`), brand accent colors, custom welcome prompt, and isolated dashboard.
2. **Instant NFC Tap & QR Landing Page (`/r/:slug`)**:
   - Optimized for instant in-person taps at the cash register, front desk, or dining table.
   - Works seamlessly on all modern iOS and Android smartphones without requiring any app install.
3. **Randomized Suggestion Engine (Zero Paid AI Costs)**:
   - Uses category-aware combinatorial grammars and mad-lib sentence synthesis.
   - Customers tap 1–3 highlight chips (e.g., *"Friendly Staff"*, *"Gentle Care"*, *"Delicious Food"*).
   - Generates 3 authentic, glowing review variations with different vibes (*Enthusiastic*, *Concise*, *Detailed*) and a *Shuffle* button.
   - Eliminates writer's block and mobile keyboard fatigue.
4. **Smart Negative Review Interception (Gatekeeper)**:
   - **4–5 Stars**: Activates the template engine and direct "Copy & Open Google Reviews" button.
   - **1–3 Stars**: Intercepts the customer and routes them to a private feedback form that alerts management directly, preventing damaging public 1-star reviews on Google.
5. **Business Dashboard**:
   - Live metrics: Total NFC Taps/Scans, Google Conversions, Intercepted Negative Reviews, Tap Conversion Rate %.
   - **QR Code Suite**: Live QR generator, direct PNG download, and printable countertop table tent / stand poster with 1-click print.
   - **Private Feedback Inbox**: View intercepted customer complaints, contact info, and track resolution status (*New*, *Contacted*, *Resolved*).

---

## 📁 Complete Folder Structure

```text
nfc-recommendation/
├── index.html                   # HTML entry point with Plus Jakarta Sans typography
├── netlify.toml                 # Netlify build configuration & SPA redirects
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite build configuration
├── tailwind.config.js           # Tailwind CSS configuration with custom brand palette
├── postcss.config.js            # PostCSS configuration
├── .env.example                 # Environment variables template
├── README.md                    # Project documentation & setup instructions
│
├── netlify/                     # Netlify Serverless Backend
│   └── functions/
│       ├── log-scan.ts          # Serverless endpoint to track NFC scans & conversions
│       ├── private-feedback.ts  # Serverless endpoint for intercepted 1-3 star complaints
│       └── generate-review.ts   # Serverless template engine endpoint for external devices
│
├── supabase/
│   └── schema.sql               # Complete PostgreSQL schema with RLS & seed templates
│
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # React Router routes definition
    ├── index.css                # Tailwind directives & print styles
    ├── types/
    │   └── index.ts             # TypeScript domain models & interfaces
    ├── lib/
    │   ├── supabase.ts          # Supabase client initializer
    │   ├── templateEngine.ts    # Combinatorial randomized review suggestion engine
    │   └── store.ts             # Unified storage layer (Supabase + localStorage fallback)
    ├── components/
    │   ├── Navbar.tsx           # Global navigation with business switcher & quick NFC link
    │   ├── StarRating.tsx       # Interactive 5-star rating selector
    │   ├── QRModal.tsx          # QR Code preview, PNG download & NFC writing instructions
    │   └── StandPosterModal.tsx # Print-ready acrylic table tent & counter stand poster
    └── pages/
        ├── LandingPage.tsx      # Public SaaS marketing page with live demos
        ├── AuthPage.tsx         # Business owner login with 1-click demo accounts
        ├── OnboardingPage.tsx   # 60-second business setup wizard
        ├── DashboardPage.tsx    # Multi-tenant analytics, QR generation & feedback inbox
        └── CustomerReviewPage.tsx # High-converting NFC tap / QR landing page (/r/:slug)
```

---

## 🗄️ SQL Schema (PostgreSQL / Supabase)

The complete SQL schema is located in `supabase/schema.sql`. It includes:

1. **`businesses`**:
   - `id`, `owner_id`, `name`, `slug`, `category`, `google_review_url`, `brand_color`, `custom_prompt`, `min_rating_for_google`, `is_active`.
2. **`review_tags`**:
   - Category-specific highlights (e.g. *Delicious Food*, *Gentle Treatment*, *Punctual*).
3. **`review_templates`**:
   - Base templates categorized by industry and vibe.
4. **`scan_events`**:
   - Telemetry for taps, reviews copied, and conversion events.
5. **`private_feedback`**:
   - Intercepted 1–3 star ratings with customer contact information and resolution status.
6. **Row Level Security (RLS)**:
   - Businesses can only access and update their own data.
   - Customers can anonymously view active business slugs, log scan events, and submit private feedback.

---

## 🛠️ Step-by-Step Setup Guide

### 1. Local Development
```bash
# Clone or navigate to the workspace
cd "C:\Users\301461\Desktop\NFC recommendation"

# Dependencies are already installed
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
- Try the landing page: `/`
- Try pre-configured customer tap pages:
  - Apex Dental: `/r/apex-dental`
  - Trattoria Roma: `/r/trattoria-roma`
- Try the business dashboard: `/dashboard` (Login via `/login` with 1-click demo buttons).

---

### 2. Connect Supabase Database (Optional for Production)
The app runs out-of-the-box using resilient local storage. To connect your cloud database:
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and run the contents of [supabase/schema.sql](file:///C:/Users/301461/Desktop/NFC%20recommendation/supabase/schema.sql).
3. Copy your **Project URL** and **Anon Key** from *Project Settings > API*.
4. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
5. Restart Vite (`npm run dev`). The app will automatically switch to Supabase.

---

### 3. Deploy to Netlify

#### Option A: 1-Click Deploy via GitHub
1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial ReviewFlow MVP"
   git remote add origin https://github.com/<your-username>/reviewflow.git
   git push -u origin main
   ```
2. Log into [netlify.com](https://www.netlify.com) and click **"Add new site" > "Import an existing project"**.
3. Select your repository.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. (Optional) In Netlify's *Site configuration > Environment variables*, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
6. Click **Deploy**. Your SaaS will be live on a `*.netlify.app` URL with custom domain support.

#### Option B: Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## 📱 How to Program Physical NFC Hardware (Cards / Stands / Stickers)

1. Buy blank NFC tags on Amazon:
   - Search for **NTAG213** or **NTAG215** stickers, keychains, or acrylic stands (~$0.25 to $1.50 each).
2. Download the free **NFC Tools** app on your iPhone or Android:
   - [iOS App Store: NFC Tools](https://apps.apple.com/app/nfc-tools/id1252962749)
   - [Google Play: NFC Tools](https://play.google.com/store/apps/details?id=com.wakdev.wdnfc)
3. Open **NFC Tools** > tap **Write** > **Add a record** > **URL / URI**.
4. Enter your business ReviewFlow URL:
   ```text
   https://your-site.netlify.app/r/your-slug
   ```
5. Tap **Write** and hold your phone against the NFC sticker or stand.
6. Done! Any customer who taps their phone will instantly open your review flow.
