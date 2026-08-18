import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export function trackAffiliateClick({ contentId, toolName, affiliateUrl }) {
  return api
    .post('/affiliate/click', { contentId, toolName, affiliateUrl })
    .catch(() => {}); // never block navigation if tracking fails
}

export default api;
