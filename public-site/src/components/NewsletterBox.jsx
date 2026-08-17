import { useState } from 'react';

export default function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // No email service wired up yet — this just confirms the intent client-side.
    setSubmitted(true);
  };

  return (
    <section className="max-w-6xl mx-auto px-6">
      <div className="bg-forest-800 text-white rounded-2xl px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-lg font-bold">Your weekly software must-reads</h3>
          <p className="text-white/60 text-sm mt-1 max-w-md">
            Join thousands of business owners for the best new comparisons, reviews, and tool
            recommendations — straight to your inbox.
          </p>
        </div>

        {submitted ? (
          <p className="text-sm font-medium text-battle-gold shrink-0">You're subscribed 🎉</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full sm:w-auto shrink-0">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 sm:w-56 px-4 py-2.5 rounded-l-lg text-sm text-ink-900 outline-none"
            />
            <button className="bg-battle-blue px-5 rounded-r-lg text-sm font-semibold hover:opacity-90 transition">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
