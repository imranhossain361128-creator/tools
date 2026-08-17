const mongoose = require('mongoose');

const NavLinkSchema = new mongoose.Schema(
  { label: { type: String, required: true }, href: { type: String, required: true } },
  { _id: false }
);

const FooterLinkSchema = new mongoose.Schema(
  {
    column: { type: String, required: true }, // e.g. "Explore", "Company", "Legal"
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false }
);

const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const RecommendationStepSchema = new mongoose.Schema(
  { text: { type: String, required: true } },
  { _id: false }
);

const SettingsSchema = new mongoose.Schema(
  {
    // Identity
    siteName: { type: String, default: 'ToolsBattle' },
    siteTagline: { type: String, default: 'Compare the best SaaS, AI & software tools' },

    // Homepage hero
    heroBadge: { type: String, default: '★ Trusted SaaS Reviews & Comparisons' },
    heroTitle: { type: String, default: 'Find The Best' },
    heroTitleAccent: { type: String, default: 'Software' },
    heroTitleEnd: { type: String, default: 'For Your Business' },
    heroSubtitle: {
      type: String,
      default:
        'Compare SaaS tools, read expert reviews, discover alternatives, and choose the perfect software for your business.',
    },
    heroTrustText: { type: String, default: '★★★★★ Trusted by 30,000+ Business Owners' },

    // Personalized recommendations section
    recommendationTitle: { type: String, default: 'Personalized Software Recommendations — For Free' },
    recommendationSubtitle: {
      type: String,
      default: 'Our advisors simplify the software selection process for your business needs.',
    },
    recommendationSteps: {
      type: [RecommendationStepSchema],
      default: [
        { text: 'Share your business and software challenges.' },
        { text: "We'll match you with the best software options for your specific business needs." },
        { text: 'Compare the options and make the right choice with confidence.' },
      ],
    },

    // Navigation & footer
    navLinks: {
      type: [NavLinkSchema],
      default: [
        { label: 'Software Categories', href: '/category/all' },
        { label: 'Reviews', href: '/reviews' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    footerLinks: {
      type: [FooterLinkSchema],
      default: [
        { column: 'Explore', label: 'Comparisons', href: '/category/all' },
        { column: 'Explore', label: 'Reviews', href: '/reviews' },
        { column: 'Explore', label: 'Alternatives', href: '/alternatives' },
        { column: 'Explore', label: 'AI Tools Directory', href: '/ai-tools-directory' },
        { column: 'Explore', label: 'Statistics', href: '/statistics' },
        { column: 'Company', label: 'About', href: '/about' },
        { column: 'Company', label: 'Contact', href: '/contact' },
        { column: 'Company', label: 'Editorial Guidelines', href: '/editorial-guidelines' },
        { column: 'Legal', label: 'Terms of Service', href: '/terms-of-service' },
        { column: 'Legal', label: 'Privacy Policy', href: '/privacy-policy' },
        { column: 'Legal', label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
      ],
    },
    footerTagline: {
      type: String,
      default: 'Compare the best SaaS, AI & software tools with honest, independent reviews.',
    },

    // Social
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },

    // FAQ
    faqs: {
      type: [FaqSchema],
      default: [
        {
          question: 'What is ToolsBattle, and how can it help my business?',
          answer:
            'ToolsBattle compares SaaS, AI, and software tools side by side so you can choose the right one with confidence, backed by honest reviews and clear pricing breakdowns.',
          order: 1,
        },
        {
          question: 'Can I trust the software reviews?',
          answer:
            'Yes. Our editorial team tests and researches every tool independently, and we disclose our affiliate relationships clearly on every page.',
          order: 2,
        },
        {
          question: 'Is there a cost associated with using ToolsBattle?',
          answer:
            'No, ToolsBattle is completely free to use. We earn a commission from some vendors when you sign up through our links, at no extra cost to you.',
          order: 3,
        },
        {
          question: 'How can I search for software on ToolsBattle?',
          answer: 'Use the search bar at the top of the homepage, or browse by category from the navigation menu.',
          order: 4,
        },
        {
          question: 'How can I get assistance in choosing the right software?',
          answer:
            'Use our free "Get Personalized Recommendation" tool — tell us about your business needs and we will match you with the best options.',
          order: 5,
        },
        {
          question: 'Which software categories do you cover?',
          answer:
            'We cover Productivity, AI Tools, SEO & Marketing, VPN & Security, Project Management, CRM & Sales, Hosting, Design, and more.',
          order: 6,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', SettingsSchema);
