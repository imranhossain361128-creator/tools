import { useState } from 'react';
import useSettings from '../hooks/useSettings';

const FALLBACK_FAQS = [
  {
    question: 'What is ToolsBattle, and how can it help my business?',
    answer:
      'ToolsBattle compares SaaS, AI, and software tools side by side so you can choose the right one with confidence, backed by honest reviews and clear pricing breakdowns.',
  },
  {
    question: 'Can I trust the software reviews?',
    answer:
      'Yes. Our editorial team tests and researches every tool independently, and we disclose our affiliate relationships clearly on every page.',
  },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-mist-200 rounded-lg bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium"
      >
        {question}
        <span className={`text-ink-600 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <p className="px-4 pb-4 text-sm text-ink-600">{answer}</p>}
    </div>
  );
}

export default function FAQ() {
  const { settings } = useSettings();
  const faqs = settings?.faqs?.length ? settings.faqs : FALLBACK_FAQS;

  return (
    <section className="max-w-4xl mx-auto px-6 py-14">
      <h2 className="font-display text-xl font-bold text-center">Frequently Asked Questions</h2>
      <p className="text-ink-600 text-sm text-center mt-2 mb-8">
        Quickly answer your top questions about ToolsBattle, software comparisons, and more.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {faqs.map((f, i) => (
          <FaqItem key={i} question={f.question} answer={f.answer} />
        ))}
      </div>
    </section>
  );
}
