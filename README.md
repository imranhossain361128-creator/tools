# ToolsBattle — Custom Platform (WordPress Replacement)

A custom full-stack system for **toolsbattle.com**, built to replace WordPress:

- **`backend/`** — Node.js + Express + MongoDB REST API
- **`admin-dashboard/`** — React admin panel to manage all content, categories, static pages, and affiliate click analytics
- **`public-site/`** — React public-facing website (the homepage visitors see), live-connected to the backend API

---

## 1. URL structure this system implements

| Content type | Main page URL | Category page URL |
|---|---|---|
| Comparisons | `/{keyword}-vs-{keyword}/` | `/category/{category}/` |
| Reviews | `/reviews/{keyword}-review/` | `/category/{category}/` |
| Alternatives | `/alternatives/{keyword}-alternative/` | `/alternatives/category/{category}/` |
| Statistics | `/statistics/{keyword}-statistics/` | `/statistics/category/{category}/` |
| AI Tools Directory | `/ai-tools-directory/{keyword}/` | `/ai-tools-directory/category/{category}/` |
| Static pages | `/{slug}/` (e.g. `/about/`, `/contact/`) | — |

Slugs are generated **automatically** from the "Main keyword" field you type in the dashboard — you never type the slug by hand.

---

## 2. Requirements

- Node.js 18+ (you have v22, that's fine)
- A MongoDB database — either:
  - **Local**: install MongoDB Community Server, or
  - **Free cloud option (recommended)**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) — free tier is enough to start

---

## 3. Full content control from the dashboard

Everything visible on the public site — including homepage chrome that used to be
hardcoded — is editable from the admin dashboard:

| What | Where in the dashboard | Backend |
|---|---|---|
| Comparisons / Reviews / Alternatives / Statistics / AI Directory entries | Sidebar → each content type | `Content` model |
| Individual customer reviews (bulk import) | Content editor → "Manage individual customer reviews" | `ProductReview` model |
| Categories | Sidebar → Categories | `Category` model |
| Static pages (About, Contact, etc.) | Sidebar → Static Pages | `Page` model |
| **Homepage hero text, nav menu, footer links, FAQ, "Get Recommendations" steps** | Sidebar → **Site Settings** | `Settings` model (singleton) |
| Affiliate click analytics | Sidebar → Affiliate Clicks | `AffiliateClick` model |

Nothing on the live site is hardcoded content — component files only contain layout and
styling; every word of copy comes from the API. If a `Settings` API call fails (e.g. backend
not running yet), each component falls back to sensible default text so the site still
renders.

## 4. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/toolsbattle
# or your Atlas connection string, e.g.:
# MONGO_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/toolsbattle
JWT_SECRET=some-long-random-string-you-generate
PORT=5000
```

Seed a demo admin account + sample content (one item per content type):

```bash
npm run seed
```

This creates:
- Admin login: **admin@toolsbattle.com** / **ChangeMe123!** (change this password after first login — there's no "change password" screen yet, so update it directly via the `/api/auth/register` flow or a script if needed)

Start the API:

```bash
npm run dev     # auto-restarts on changes (nodemon)
# or
npm start       # plain node
```

The API runs at `http://localhost:5000/api`. Check it's alive:

```bash
curl http://localhost:5000/api/health
```

### Key API routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/content?type=review` | List content by type |
| POST | `/api/content` | Create content (protected) |
| PUT | `/api/content/:id` | Update content (protected) |
| DELETE | `/api/content/:id` | Delete content (protected) |
| GET | `/api/content/public/:type/:slug` | Public: fetch a published page by its live URL slug (for your actual website to render) |
| GET/POST/PUT/DELETE | `/api/categories` | Manage categories |
| GET/POST/PUT/DELETE | `/api/pages` | Manage static pages (About, Contact, etc.) |
| POST | `/api/affiliate/click` | Public: call this from your live site when someone clicks an affiliate button |
| GET | `/api/affiliate/stats` | Protected: click analytics for the dashboard |
| GET | `/api/analytics/overview` | Protected: dashboard home stats |

---

## 5. Admin dashboard setup

```bash
cd admin-dashboard
npm install
cp .env.example .env
```

Edit `.env` if your API isn't on `localhost:5000`:

```
VITE_API_URL=http://localhost:5000/api
```

Run it:

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`), log in with the seeded admin account, and you'll see:

- **Overview** — content counts, top-viewed pages, affiliate clicks (last 30 days)
- **Comparisons / Reviews / Alternatives / Statistics / AI Tools Directory** — each has its own list + add/edit form. The form's "Main keyword" field shows you exactly what URL will be generated.
- **Categories** — add categories per content type; each shows its correct live URL pattern
- **Static Pages** — About, Contact, Terms, etc.
- **Affiliate Clicks** — charts + tables of affiliate link performance

Build for production:

```bash
npm run build
```

This outputs static files to `admin-dashboard/dist/` — deploy that folder to any static host (Vercel, Netlify, your own server) and point `VITE_API_URL` at your live backend.

---

## 6. Public website (`public-site/`)

This is the live homepage visitors see, built with React + Vite + Tailwind, styled to match
the ToolsBattle homepage design (dark navy hero, "Find The Best Software For Your Business",
popular tools grid, personalized recommendation steps, popular reviews, ContentHub articles,
FAQ, footer). It fetches everything live from the backend API — nothing is hardcoded.

### Setup

```bash
cd public-site
npm install
cp .env.example .env   # set VITE_API_URL to your backend
npm run dev
```

### What each homepage section pulls from the API

| Section | API call |
|---|---|
| Popular software & tools | `GET /api/content?type=directory&status=published&limit=4` |
| Popular Software Reviews | `GET /api/content?type=review&status=published&limit=3` |
| Latest articles in ContentHub | `GET /api/content?status=published&limit=6` (mixed types) |

If a section shows "No … yet", it just means you haven't published that content type
in the dashboard yet — add some and refresh.

Only the homepage (`/`) and the blog hub (`/blog`, `/blog/:type`) are built so far. Every
other route (`/reviews`, `/alternatives`, `/ai-tools-directory`, single content pages, etc.)
currently renders a "Coming soon" placeholder in `src/pages/ComingSoon.jsx` — these are the
next pages to build:

1. ~~Blog/Category listing page~~ ✅ done — `/blog` (hub, ahrefs-blog-style) and `/blog/:type` (per-topic feed with category sidebar filter)
2. ~~Single Review/Blog page~~ ✅ done — `/reviews/:slug`, `/alternatives/:slug`, `/statistics/:slug`, `/ai-tools-directory/:slug`, `/:slug` (comparisons). One template (`src/pages/SingleContent.jsx`) powers all five types: auto-generated Table of Contents from `<h2>`/`<h3>` in the body, a sticky "quick verdict" card (rating, pricing, Visit Site CTA), a pros/cons box, affiliate click tracking, and related posts.
3. ~~AI Tools Directory (list + single tool page)~~ ✅ done — `/ai-tools-directory` (b12.io-style list) and `/ai-tools-directory/:slug` (b12.io single-tool-profile style: screenshot, pricing/tags sidebar card, "Try [Tool]" CTA, description + FAQ prose, "Trending AI tools" related grid)
4. ~~Reviews page~~ ✅ done — merges TrustRadius + Capterra product-review pages + Capterra category page into one system:
   - `/reviews` — category-style listing (sort by rating, filter by category, "Read Reviews" / "Visit Site" per product)
   - `/reviews/:slug` — single product page with a TrustRadius-style rating breakdown (average + 5-star histogram), star/sort filters, and a paginated list of individual customer reviews
   - **Built for large-scale imports.** A separate `ProductReview` model (indexed on `content + rating + publishedAt`) stores individual reviews independently from the editorial write-up, with a `POST /api/reviews/bulk` endpoint for pasting in hundreds or thousands of reviews at once. See "Importing reviews at scale" below.

### Note on SEO / rendering

This is a client-rendered React app (no server-side rendering), which is the fastest way
to get you a working, API-connected site. For best SEO on content pages, a future step would
be migrating to a framework with SSR/SSG (like Next.js) — happy to do that once the page set
is finalized, since switching frameworks after building every page is wasted work.

### Affiliate click tracking

Wire this up on any "Visit Site" button:

```js
fetch(`${API_URL}/affiliate/click`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contentId: '<the content _id>',
    toolName: 'Semrush',
    affiliateUrl: 'https://semrush.com/?ref=...',
  }),
});
```

### Migrating off WordPress

You have two paths:
1. Point a subdomain/staging URL at `public-site` now, populate content via the admin
   dashboard, and cut over your DNS once every page type is built.
2. Migrate content type by type — e.g. move Reviews first, redirect those WordPress URLs,
   then move Comparisons, etc.

---

## 7. Security notes before going live

- Change `JWT_SECRET` to a long random string in production.
- Change the seeded admin password immediately.
- Restrict `/api/auth/register` — right now it only allows the *first* user to self-register as admin; every user after that needs an existing admin's token. Review this logic before opening the API publicly.
- Put the API behind HTTPS in production.
- Consider rate-limiting `/api/affiliate/click` since it's a public endpoint.

---

## 8. Importing reviews at scale (50k–1M+)

Individual customer reviews are stored separately from the editorial review write-up, in
their own `ProductReview` collection, so a single product can hold a very large number of
reviews without slowing down the page.

**From the dashboard:** open a Review's editor → "Manage individual customer reviews" →
paste a JSON array into the bulk-import box. Example format:

```json
[
  {
    "rating": 5,
    "title": "Great for keyword research",
    "body": "We've used this for two years and it keeps getting better.",
    "pros": "Huge keyword database, easy to learn",
    "cons": "Pricey for solo users",
    "reviewerName": "Sarah K.",
    "reviewerRole": "Marketing Manager",
    "companyIndustry": "Marketing and Advertising",
    "companySize": "11-50 employees",
    "source": "Imported from Capterra",
    "sourceUrl": "https://www.capterra.com/...",
    "publishedAt": "2026-03-14"
  }
]
```

Only `rating` is required — everything else is optional. This works well for batches of
hundreds to a few thousand reviews per request.

**For true bulk scale (50,000+ reviews):** write a small script that reads your source data
(e.g. a CSV export) and calls `POST /api/reviews/bulk` in batches of a few thousand at a
time, authenticated with an admin JWT:

```bash
curl -X POST https://your-api-domain.com/api/reviews/bulk \
  -H "Authorization: Bearer <admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{"content": "<contentId>", "reviews": [ ... ]}'
```

The `ProductReview` collection is indexed on `(content, rating, publishedAt)`, so filtering,
sorting, and paginating stay fast even at very high review counts — the public page never
loads more than one page (10–20 reviews) at a time.

**Note on scraped content:** if you're copying reviews from other review sites, check their
terms of service first — most review platforms (Capterra, TrustRadius, G2, etc.) prohibit
bulk-scraping and republishing their reviews. This system makes importing your *own*
collected reviews (from surveys, your CRM, or sources that explicitly allow reuse) fast —
but the legal question of what you're allowed to import is separate and worth checking per
source.

## 9. Project structure

```
toolsbattle/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/          (User, Category, Content, Page, AffiliateClick, ProductReview, Settings)
│   ├── routes/           (auth, content, categories, pages, affiliate, analytics, reviews, settings)
│   ├── utils/slugify.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── admin-dashboard/
│   ├── src/
│   │   ├── api/client.js
│   │   ├── config/contentTypes.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/ (Layout, StatCard)
│   │   └── pages/ (Login, DashboardHome, ContentList, ContentEditor, Categories, Pages, AffiliateStats, ReviewsManager, Settings)
│   └── package.json
└── public-site/
    ├── src/
    │   ├── api/client.js
    │   ├── config/contentTypes.js
    │   ├── hooks/useSettings.js
    │   ├── utils/ (slugify, parseHeadings)
    │   ├── components/ (Header, Footer, Hero, PopularTools, RecommendationSteps, PopularReviews, ContentHub, FAQ, Stars, TopicTabs, ArticleRow, TopicSection, NewsletterBox, TableOfContents, VerdictCard, ProsConsBox, RelatedArticles, CategoryPills, ToolCard, Pagination, RatingBreakdown, ReviewFilterBar, ReviewCard)
    │   └── pages/ (Home, Blog, TopicListing, Directory, DirectoryDetail, ReviewsDirectory, ReviewDetail, SingleContent, ComingSoon)
    └── package.json
```
