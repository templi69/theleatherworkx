import React from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setSelectedCategory } = useStore();

  return (
    <div className="relative bg-[#1E1915] text-[#FAF8F5] overflow-hidden">
      {/* Subtle textured leather background gradient */}
      <div className="absolute inset-0 bg-radial from-[#3A2A20]/60 via-[#1E1915] to-[#120F0D] opacity-95 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5A2B]/20 border border-[#8B5A2B]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke & Handcrafted in Lahore, Pakistan</span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FAF8F5] leading-none">
              Artisanal Leather Goods <br />
              <span className="italic text-[#D4AF37] font-serif">Made to Last Generations</span>
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Every wallet, weekender duffle, and custom hand-painted passport sleeve is meticulously crafted by master Pakistani leathersmiths using vegetable-tanned full-grain hides.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  const el = document.getElementById('collection-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#8B5A2B] hover:bg-[#A06D3B] text-white text-xs uppercase tracking-widest font-semibold rounded-md shadow-lg transition-all cursor-pointer"
              >
                Shop Full Collection
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('bespoke');
                  const el = document.getElementById('collection-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-transparent border border-[#E8E1D9]/40 hover:border-[#D4AF37] text-[#FAF8F5] hover:text-[#D4AF37] text-xs uppercase tracking-widest font-medium rounded-md transition-all cursor-pointer"
              >
                Explore Hand-Painted Art
              </button>
            </div>

            {/* Guarantees row */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-stone-200">Cash on Delivery</h4>
                  <p className="text-[11px] text-stone-400">Pay at doorstep across Pakistan</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-stone-200">100% Full-Grain</h4>
                  <p className="text-[11px] text-stone-400">Pure cowhide & calfskin</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-stone-200">Bespoke Monogram</h4>
                  <p className="text-[11px] text-stone-400">Free custom gold/blind foil</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Feature Visual Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-xl overflow-hidden border border-stone-700/60 shadow-2xl bg-stone-900 group">
              <img
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
                alt="The Leather Workx Handcrafted Goods"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-[#FAF8F5]/95 backdrop-blur-md rounded-lg text-stone-900 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8B5A2B]">Artisan Spotlight</span>
                  <h5 className="font-serif-luxury text-base font-bold text-stone-900">The Heritage Collection</h5>
                  <p className="text-[11px] text-stone-600">Dispatched via TCS / Leopards within 24h</p>
                </div>
                <span className="text-xs font-bold text-[#8B5A2B] bg-[#F5EDE4] px-2.5 py-1 rounded-full">
                  Rs. 3,800+
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
