import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ExternalLink, Zap } from 'lucide-react';

const QUOTES = [
  "Cast off the yoke of servitude—no man was born to be a cog.",
  "Break free from digital serfdom—your infrastructure, your sovereignty.",
  "The future belongs to those who decentralize power, not centralize it.",
  "Edge computing isn't just technology—it's digital independence.",
  "Transform idle hardware into revenue streams, reclaim computational autonomy.",
  "Why rent compute when you can own the network?",
  "Join the distributed revolution—every node counts, every host matters.",
  "From consumer to producer: monetize your edge, own your data.",
  "The cloud oligarchy ends where the edge federation begins.",
  "Decentralization is not just a choice—it's digital evolution."
];

export function CallToAction() {
  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    // Select a random quote when component mounts
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setCurrentQuote(QUOTES[randomIndex]);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600/60 to-purple-600/40 border border-blue-500/30 rounded-none p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="tracking-wider uppercase text-white text-base font-medium text-left mx-0">
              JOIN HEX FEDERATION
            </span>
          </div>
          <blockquote className="text-lg font-medium text-white mb-1 italic">
            "{currentQuote}"
          </blockquote>
          <p className="text-base text-blue-100">
            Transform your infrastructure into a revenue-generating edge AI node
          </p>
        </div>
        <div className="ml-6">
          <Button size="lg" className="text-white font-semibold text-lg bg-slate-900 hover:bg-slate-800 border-0">
            <ExternalLink className="w-4 h-4 mr-2" />
            Become a Host
          </Button>
        </div>
      </div>
    </div>
  );
}