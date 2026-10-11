import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
interface Slide {
  id: number;
  kicker: string;
  headline: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    kicker: 'Effortless Mobility',
    headline: 'Power your journey.',
    subheading: 'Find, book and charge at stations around you with verified bay availability.',
    ctaText: 'Explore Chargers',
    ctaLink: '/explore',
    imageSrc: '/images/i2.png',
    imageAlt: 'Family charging an electric vehicle at an EVConnect charging station',
    imagePosition: 'object-[65%_center] md:object-[72%_center]'
  },
  {
    id: 2,
    kicker: 'Clean Mobility',
    headline: 'Drive electric. Leave a lighter footprint.',
    subheading: 'See how your charging journey contributes to a cleaner future without the guesswork.',
    ctaText: 'Explore Your Impact',
    ctaLink: '/impact',
    imageSrc: '/images/i1.avif',
    imageAlt: 'Lush green forest canopy representing clean environmental impact',
    imagePosition: 'object-center'
  },
  {
    id: 3,
    kicker: 'Connected Ecosystem',
    headline: 'Be a part of the EVConnect Network.',
    subheading: 'Connect drivers, charging networks and smarter journeys across independent operators.',
    ctaText: 'Explore the Network',
    ctaLink: '/explore',
    imageSrc: '/images/i3.png',
    imageAlt: 'Electric vehicle driving along scenic highway route connecting charging networks',
    imagePosition: 'object-[65%_center] md:object-[70%_center]'
  }
];

export const HeroSlideshow: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [currentSlideIndex]);

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <section
      className="relative w-full h-[580px] md:h-[640px] overflow-hidden bg-[#06241C]"
      aria-label="Featured EV Highlights"
    >
      {/* Slides rendered with crossfade */}
      {SLIDES.map((slide, index) => {
        const isActive = index === currentSlideIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <img
              src={slide.imageSrc}
              alt={slide.imageAlt}
              className={`w-full h-full object-cover ${slide.imagePosition || 'object-center'}`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        );
      })}

      {/* Measured Dark Gradient Scrim to ensure WCAG 4.5:1 text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#041B15]/95 via-[#041B15]/80 md:via-[#041B15]/70 to-[#041B15]/30 md:to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041B15]/90 via-transparent to-transparent sm:hidden z-20 pointer-events-none" />

      {/* Hero Content Overlay (Glassmorphic highlight on text panel) */}
      <div className="relative z-30 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl text-white pt-8">
          {/* Editorial kicker */}
          <div className="text-xs font-semibold tracking-wider uppercase text-emerald-400 mb-3">
            <span>{currentSlide.kicker}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-display mb-4 leading-[1.08] text-balance">
            {currentSlide.headline}
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-8 max-w-xl">
            {currentSlide.subheading}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={currentSlide.ctaLink}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#04241B] font-bold text-sm tracking-tight transition-all duration-150 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/assistant"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl glass-panel-dark text-emerald-100 hover:text-white font-semibold text-sm transition-all duration-150 border border-emerald-600/30 hover:border-emerald-500/60"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ask Copilot</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Carousel Navigation Controls */}
      <div className="absolute bottom-8 right-4 sm:right-8 z-30 flex items-center gap-3">
        {/* Progress Dots */}
        <div className="flex items-center gap-2 mr-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlideIndex
                  ? 'w-8 bg-emerald-400'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Manual Previous / Next arrow buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel-dark border border-white/10 shadow-lg">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
