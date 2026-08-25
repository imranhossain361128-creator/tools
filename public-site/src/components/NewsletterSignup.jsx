import { useState } from 'react';

export default function NewsletterSignup({ topics = [] }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // No email service wired up yet — this just confirms the intent client-side.
    setSubmitted(true);
  };

  return (
    <section className="bg-[#FBF1D9]">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-center">
        <div>
          <span className="text-2xl">✉️</span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-3">
            Join 40,000+ Business Owners.
          </h2>
          <p className="text-sm text-ink-600 mt-2 mb-6 max-w-md">
            Get the best new software comparisons, reviews, and picks — straight to your inbox,
            every week.
          </p>

          {submitted ? (
            <p className="text-sm font-semibold text-forest-800">You're subscribed 🎉</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap gap-3 mb-5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email*"
                  className="flex-1 min-w-[200px] border border-mist-200 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:border-battle-blue"
                />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="flex-1 min-w-[160px] border border-mist-200 rounded-lg px-4 py-3 text-sm bg-white outline-none focus:border-battle-blue"
                />
              </div>

              {topics.length > 0 && (
                <div className="flex flex-wrap items-center gap-4 text-sm mb-5">
                  <span className="font-bold">Topics of interest*</span>
                  {topics.map((t) => (
                    <label key={t} className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(t)}
                        onChange={() => toggleTopic(t)}
                      />
                      {t}
                    </label>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="bg-forest-800 text-white text-sm font-bold px-7 py-3.5 rounded-full hover:opacity-90 transition"
              >
                Subscribe now →
              </button>

              <p className="text-[11px] text-ink-600 mt-3.5 max-w-md">
                By clicking "Subscribe now", I agree and accept the{' '}
                <a href="/privacy-policy" className="text-battle-blue underline">
                  privacy policy
                </a>{' '}
                of ToolsBattle.
              </p>
            </form>
          )}
        </div>

        <div className="bg-white rounded-2xl border-4 border-navy-950 p-3.5 max-w-[260px] mx-auto hidden sm:block">
          <div className="bg-mist-50 rounded-xl p-3 mb-2.5">
            <p className="text-[10px] font-bold text-battle-blue uppercase mb-1">Review</p>
            <p className="text-xs font-bold leading-snug">Semrush Review 2026: Is It Still Worth It?</p>
            <p className="text-[10px] text-ink-600 mt-1.5">Read more →</p>
          </div>
          <div className="bg-mist-50 rounded-xl p-3 mb-2.5">
            <p className="text-[10px] font-bold text-battle-blue uppercase mb-1">Comparison</p>
            <p className="text-xs font-bold leading-snug">Mullvad vs NordVPN: Full Breakdown</p>
            <p className="text-[10px] text-ink-600 mt-1.5">Aug 12, 2026</p>
          </div>
          <div className="bg-mist-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-battle-blue uppercase mb-1">Statistics</p>
            <p className="text-xs font-bold leading-snug">VPN Adoption Trends for 2026</p>
            <p className="text-[10px] text-ink-600 mt-1.5">Aug 1, 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
}
