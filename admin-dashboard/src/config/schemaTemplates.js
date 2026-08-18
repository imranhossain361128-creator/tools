// Each generator takes the current form data + the live URL of the post and
// returns a ready-to-use JSON-LD object. The admin picks one from a dropdown
// and we auto-fill the Custom Schema box — no hand-writing JSON required.

const SITE_NAME = 'ToolsBattle';

function baseArticle(form, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: form.title || '',
    description: form.excerpt || '',
    url,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
}

function reviewSchema(form, url) {
  const tool = form.tools?.[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: form.title || '',
    reviewBody: form.excerpt || '',
    url,
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: tool?.name || '',
      applicationCategory: 'BusinessApplication',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: tool?.rating || 0,
      bestRating: 5,
    },
    author: { '@type': 'Organization', name: SITE_NAME },
  };
}

function itemListSchema(form, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: form.title || '',
    description: form.excerpt || '',
    url,
    itemListElement: (form.tools || []).map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name || `Item ${i + 1}`,
    })),
  };
}

function datasetSchema(form, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: form.title || '',
    description: form.excerpt || '',
    url,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
}

function softwareAppSchema(form, url) {
  const tool = form.tools?.[0];
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool?.name || form.title || '',
    applicationCategory: 'BusinessApplication',
    url,
  };
  if (tool?.rating) {
    schema.aggregateRating = { '@type': 'AggregateRating', ratingValue: tool.rating, ratingCount: 1 };
  }
  if (tool?.pricing) {
    schema.offers = { '@type': 'Offer', description: tool.pricing };
  }
  return schema;
}

function faqSchema(form) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Your question here',
        acceptedAnswer: { '@type': 'Answer', text: 'Your answer here' },
      },
    ],
  };
}

// Which templates make sense for each content type, in the order shown in the dropdown.
export const SCHEMA_OPTIONS_BY_TYPE = {
  comparison: [
    { key: 'article', label: 'Article (recommended for comparisons)', build: baseArticle },
    { key: 'faq', label: 'FAQ Page', build: faqSchema },
  ],
  review: [
    { key: 'review', label: 'Review (recommended)', build: reviewSchema },
    { key: 'article', label: 'Article', build: baseArticle },
    { key: 'faq', label: 'FAQ Page', build: faqSchema },
  ],
  alternative: [
    { key: 'itemlist', label: 'Item List (recommended for alternatives)', build: itemListSchema },
    { key: 'article', label: 'Article', build: baseArticle },
  ],
  statistic: [
    { key: 'dataset', label: 'Dataset (recommended for statistics)', build: datasetSchema },
    { key: 'article', label: 'Article', build: baseArticle },
  ],
  directory: [
    { key: 'software', label: 'Software Application (recommended for tool profiles)', build: softwareAppSchema },
    { key: 'faq', label: 'FAQ Page', build: faqSchema },
  ],
};

export function collectionPageSchema(categoryName, description, url) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName || '',
    description: description || '',
    url,
  };
}
