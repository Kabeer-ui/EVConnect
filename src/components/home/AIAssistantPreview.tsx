import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, MessageSquare, Compass, Zap } from 'lucide-react';

export const AIAssistantPreview: React.FC = () => {
  const examplePrompts = [
    'Find a fast charger near me',
    "What's my upcoming booking?",
    'Book a charger for 7 PM',
    'Which charger is closest?'
  ];

  return (
    <section className="py-14 bg-[#F8FAF9] border-b border-emerald-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#06241C] to-[#0A382C] text-white p-8 md:p-10 border border-emerald-900/60 shadow-xl relative overflow-hidden">
          {/* Subtle geometric light arcs */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Smart Mobility Copilot</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-3">
                Meet your EVConnect Assistant
              </h2>
              <p className="text-sm text-emerald-100/80 leading-relaxed mb-6 max-w-lg">
                Find chargers, understand live network availability, and manage your bookings through intuitive conversational queries.
              </p>

              <Link
                to="/assistant"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-[#05251D] font-bold text-xs tracking-tight transition-all duration-150 shadow-md hover:scale-[1.02]"
              >
                <span>Open Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Example prompts card showcase */}
            <div className="lg:col-span-5 space-y-2.5">
              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
                Sample Questions
              </span>
              {examplePrompts.map((promptText, i) => (
                <Link
                  key={i}
                  to={`/assistant?q=${encodeURIComponent(promptText)}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl glass-panel-dark border border-emerald-700/30 text-xs text-emerald-100 hover:text-white hover:border-emerald-400/50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>"{promptText}"</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400/70 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
