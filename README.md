# TAPA (Tap App)

TAPA is a Next.js-based web application providing dynamic Panchang calculation, scripturally aligned Ritual Guides, and an E-Commerce platform for high-vibration puja kits and items.

## Technologies

- **Frontend/Backend:** Next.js (App Router), React, TailwindCSS, Lucide-React
- **Database:** Prisma (PostgreSQL)
- **Search:** Elasticsearch client integration
- **State Management & Forms:** Zustand, React Hook Form, Zod
- **Rich Text Editor:** TipTap
- **Background Jobs:** Inngest

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- (Optional) Elasticsearch instance (if ELASTICSEARCH_NODE is set)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd TAPA
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (see environment variables below).
4. Run database migrations:
   ```bash
   npx prisma db push
   ```
5. Seed the database (Populates admin, products, guides, and banner):
   ```bash
   node scripts/seed.js
   ```

### Running Locally

To run the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## Core Features

- **Panchang Engine:** Calculating high-precision Tithi, Nakshatra, Yoga, Karana using `@bidyashish/panchang` with NOAA Solar Calculator monkeypatch to override buggy sunrise/sunset calculations (see [ARCHITECTURE.md](ARCHITECTURE.md)).
- **CMS-driven Ritual Guides:** Dynamically loaded from database, complete with checklists, Step-by-Step guides, scriptural narrative (Katha), FAQs, and TTS (Text-to-Speech) audio narration.
- **Japa Counter:** Self-contained voice-supported Japa counting tool with target presets (11 / 21 / 108) and speech synthesis loop.
- **E-Commerce & Checkout:** Built-in cart management (via Zustand persistent store) and full Cash-on-Delivery (COD) checkout system.
- **Admin Dashboard:** Management views for Products, Ritual Guides, Announcements, FAQs, Banners, and Tapa Circle broadcasts.

## Scripts & Tools

- `node scripts/seed.js`: Database seeder (consolidated).
- `npx ts-node scripts/sync-elastic.ts`: Re-index and synchronize all guides and kits to Elasticsearch.

## Testing

To run the automated test suite:
- **Load Testing (k6):** `k6 run tests/load-test.js`
- **Token Reuse Verification:** `npx ts-node tests/auth-reuse.test.ts`
- **E2E E-Commerce Verification:** `node tests/ecommerce-flow.js`
