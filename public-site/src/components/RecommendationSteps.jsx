import useSettings from '../hooks/useSettings';

const FALLBACK_STEPS = [
  { text: 'Share your business and software challenges.' },
  { text: "We'll match you with the best software options for your specific business needs." },
  { text: 'Compare the options and make the right choice with confidence.' },
];

export default function RecommendationSteps() {
  const { settings } = useSettings();
  const title = settings?.recommendationTitle || 'Personalized Software Recommendations — For Free';
  const subtitle =
    settings?.recommendationSubtitle ||
    'Our advisors simplify the software selection process for your business needs.';
  const steps = settings?.recommendationSteps?.length ? settings.recommendationSteps : FALLBACK_STEPS;

  return (
    <section className="bg-mist-50 py-14">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <p className="text-ink-600 text-sm mt-2 max-w-xl mx-auto">{subtitle}</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {steps.map((s, i) => (
            <div key={i} className="bg-white border border-mist-200 rounded-2xl p-5 relative">
              <span className="font-display text-4xl font-extrabold text-mist-200 absolute top-3 right-4">
                {i + 1}
              </span>
              <p className="text-sm text-ink-900 font-medium relative z-10 pr-6">{s.text}</p>
            </div>
          ))}
        </div>

        <a
          href="/get-recommendation"
          className="inline-block mt-8 bg-forest-800 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Get Free Recommendation
        </a>
      </div>
    </section>
  );
}
