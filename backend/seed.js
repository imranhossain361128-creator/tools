// Run with: npm run seed
// Creates one admin user + sample categories/content in each of the 5 types
// so you can log into the dashboard and see real data immediately.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Content = require('./models/Content');
const ProductReview = require('./models/ProductReview');
const slugify = require('./utils/slugify');

// Mirrors the slug logic in routes/content.js so seeded content gets the same
// real URL format as content created from the dashboard.
function buildSlug(type, mainKeyword) {
  const base = slugify(mainKeyword);
  switch (type) {
    case 'review':
      return base.endsWith('-review') ? base : `${base}-review`;
    case 'alternative':
      return base.endsWith('-alternative') ? base : `${base}-alternative`;
    case 'statistic':
      return base.endsWith('-statistics') ? base : `${base}-statistics`;
    default:
      return base;
  }
}

async function seed() {
  await connectDB();

  const adminEmail = 'admin@toolsbattle.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Imran Hossain',
      email: adminEmail,
      password: 'ChangeMe123!',
      role: 'admin',
    });
    console.log('Created admin user:', adminEmail, '(password: ChangeMe123!)');
  }

  const categoriesData = [
    { name: 'VPN & Security Tools', type: 'comparison' },
    { name: 'SEO & Marketing Tools', type: 'review' },
    { name: 'SEO Tools', type: 'alternative' },
    { name: 'AI', type: 'statistic' },
    { name: 'AI Chatbots', type: 'directory' },
  ];

  const categories = {};
  for (const c of categoriesData) {
    const slug = c.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    let cat = await Category.findOne({ slug, type: c.type });
    if (!cat) cat = await Category.create({ ...c, slug });
    categories[c.type] = cat._id;
  }

  const sampleContent = [
    {
      type: 'comparison',
      title: 'Mullvad vs NordVPN: Which VPN Is Better in 2026',
      mainKeyword: 'mullvad-vs-nordvpn',
      excerpt: 'You want a VPN, but you are stuck between two huge names: Mullvad and NordVPN...',
      status: 'published',
      category: categories.comparison,
    },
    {
      type: 'review',
      title: 'Semrush Review 2026: Features, Pricing & Verdict',
      mainKeyword: 'semrush',
      excerpt: 'An in-depth look at whether Semrush is worth it for SEO and marketing teams.',
      status: 'published',
      category: categories.review,
      featuredImage: '',
      content: `
        <h2>Is Semrush worth it in 2026?</h2>
        <p>If you need a reliable all-in-one platform for SEO, content, and competitor research, Semrush remains one of the strongest options on the market. It isn't cheap, but the depth of its keyword and backlink data is hard to match.</p>
        <h2>What you can do with Semrush</h2>
        <p>Semrush bundles keyword research, site audits, rank tracking, and competitor analysis into a single dashboard.</p>
        <h3>Keyword research</h3>
        <p>The Keyword Magic Tool surfaces thousands of keyword ideas from a single seed term, with filters for volume, difficulty, and intent.</p>
        <h3>Competitor analysis</h3>
        <p>You can see exactly which keywords, pages, and backlinks are driving traffic to your competitors.</p>
        <h2>Pricing</h2>
        <p>Plans start at $139.95/month for the Pro tier, scaling up for agencies and larger teams.</p>
        <h2>Final verdict</h2>
        <p>Semrush is best suited to marketing teams and agencies that need deep, reliable data — freelancers on a budget may want to start with a lighter tool first.</p>
      `,
      tools: [
        {
          name: 'Semrush',
          rating: 4.5,
          pricing: 'From $139.95/mo',
          pros: ['Massive keyword & backlink database', 'All-in-one toolkit', 'Reliable competitor data'],
          cons: ['Expensive for solo users', 'Steep learning curve'],
          affiliateUrl: 'https://semrush.com',
        },
      ],
    },
    {
      type: 'alternative',
      title: 'Best Semrush Alternatives in 2026',
      mainKeyword: 'semrush',
      excerpt: 'Looking for a Semrush alternative? Here are the top picks by budget and feature set.',
      status: 'published',
      category: categories.alternative,
    },
    {
      type: 'statistic',
      title: 'ChatGPT Statistics 2026: Users, Growth & Market Data',
      mainKeyword: 'chatgpt',
      excerpt: 'The latest ChatGPT usage statistics, growth trends, and market share data.',
      status: 'published',
      category: categories.statistic,
    },
    {
      type: 'directory',
      title: 'Claude AI — Tool Profile',
      mainKeyword: 'claude',
      excerpt: 'Claude is Anthropic\'s AI assistant, known for coding, writing, and reasoning tasks.',
      status: 'published',
      category: categories.directory,
      content: `
        <p>Claude is an AI assistant built by Anthropic, designed to be helpful, harmless, and honest. It's widely used for coding, long-form writing, research, and complex reasoning tasks.</p>
        <h2>What can you do with Claude?</h2>
        <p>Claude can write and debug code, summarize long documents, draft emails and reports, analyze data, and hold detailed multi-turn conversations while keeping track of context.</p>
        <h2>FAQs</h2>
        <h3>Is Claude free to use?</h3>
        <p>Claude offers a free tier with usage limits, plus paid plans for higher limits and additional features.</p>
        <h3>What makes Claude different from other AI assistants?</h3>
        <p>Claude is known for longer context windows, strong coding ability, and a careful approach to safety and honesty.</p>
      `,
      tools: [
        {
          name: 'Claude',
          rating: 4.8,
          pricing: 'Free, with paid plans from $20/mo',
          pros: ['Strong coding & reasoning ability', 'Large context window', 'Careful, honest responses'],
          cons: ['Free tier has usage limits'],
          affiliateUrl: 'https://claude.ai',
        },
      ],
    },
  ];

  for (const item of sampleContent) {
    const exists = await Content.findOne({ type: item.type, mainKeyword: item.mainKeyword });
    if (!exists) {
      const created = await Content.create({
        ...item,
        slug: buildSlug(item.type, item.mainKeyword),
        author: admin._id,
        publishedAt: new Date(),
      });

      // For the Semrush review, seed a batch of individual customer reviews so the
      // rating-breakdown + filter/sort/pagination features have real data to show.
      if (item.type === 'review' && item.mainKeyword === 'semrush') {
        const sampleReviews = [
          {
            rating: 5,
            title: 'Best keyword research tool we\'ve used',
            body: 'Switched from a cheaper tool and never looked back. The keyword database is massive and the competitor analysis saves us hours every week.',
            pros: 'Huge keyword database, great competitor analysis',
            cons: 'Can be overwhelming for beginners',
            reviewerName: 'Sarah K.',
            reviewerRole: 'Marketing Manager',
            companyIndustry: 'Marketing and Advertising',
            companySize: '11-50 employees',
            source: 'Imported from Capterra',
            helpfulCount: 12,
            publishedAt: new Date('2026-06-10'),
          },
          {
            rating: 4,
            title: 'Powerful but pricey',
            body: 'Semrush does everything we need for SEO and content, but the price jump between plans is steep for a small team.',
            pros: 'All-in-one toolkit, reliable data',
            cons: 'Expensive for small teams',
            reviewerName: 'James T.',
            reviewerRole: 'Founder',
            companyIndustry: 'E-commerce',
            companySize: '1-10 employees',
            source: 'Imported from TrustRadius',
            helpfulCount: 8,
            publishedAt: new Date('2026-05-22'),
          },
          {
            rating: 5,
            title: 'Essential for our agency',
            body: 'We run every client audit through Semrush. The site audit and position tracking reports are client-ready out of the box.',
            pros: 'Client-ready reports, position tracking',
            cons: '',
            reviewerName: 'Priya M.',
            reviewerRole: 'SEO Lead',
            companyIndustry: 'Marketing and Advertising',
            companySize: '51-200 employees',
            source: 'Imported from Capterra',
            helpfulCount: 21,
            publishedAt: new Date('2026-07-02'),
          },
          {
            rating: 3,
            title: 'Good data, clunky interface',
            body: 'The data quality is excellent but the interface has gotten more cluttered as they\'ve added more toolkits. Takes new hires a while to get comfortable.',
            pros: 'Accurate data',
            cons: 'Cluttered UI, steep learning curve',
            reviewerName: 'David R.',
            reviewerRole: 'Content Strategist',
            companyIndustry: 'Publishing',
            companySize: '11-50 employees',
            source: 'Imported from TrustRadius',
            helpfulCount: 5,
            publishedAt: new Date('2026-04-18'),
          },
          {
            rating: 2,
            title: 'Billing issues frustrated us',
            body: 'The tool itself is fine, but we had recurring billing surprises and support took days to resolve them.',
            pros: 'Solid feature set',
            cons: 'Billing surprises, slow support',
            reviewerName: 'Anonymous',
            reviewerRole: '',
            companyIndustry: 'Retail',
            companySize: '1-10 employees',
            source: 'Imported from Capterra',
            helpfulCount: 3,
            publishedAt: new Date('2026-03-05'),
          },
        ];
        await ProductReview.insertMany(sampleReviews.map((r) => ({ ...r, content: created._id })));
      }
    }
  }

  console.log('Seed complete.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
