import React from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, Shield, Truck, Sparkles, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setActiveView } = useStore();

  return (
    <footer className="bg-[#181411] text-[#E8E1D9] border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Manifesto */}
          <div className="space-y-4">
            <span className="font-serif-luxury text-2xl font-bold tracking-widest text-[#FAF8F5] block">
              THE LEATHER WORKX
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              Bespoke hand-painted leather artistry and master-crafted full-grain goods. Rooted in Lahore's rich leather tanning heritage, delivering timeless heirlooms nationwide across Pakistan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/923008452109"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#25D366] text-white text-xs font-semibold rounded hover:bg-[#20ba59] transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Atelier</span>
              </a>
            </div>
          </div>

          {/* Quick Collections */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setSelectedCategory('bespoke')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Bespoke Hand-Painted Art
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('travel')}
                  className="hover:text-white transition cursor-pointer"
                >
                  The Heritage Weekender Duffle
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('wallets')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Bifold & Minimalist Wallets
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('bags')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Diplomat Briefcases & Messengers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('accessories')}
                  className="hover:text-white transition cursor-pointer"
                >
                  English Bridle Belts & Tech Sleeves
                </button>
              </li>
            </ul>
          </div>

          {/* Delivery & Payment Information */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              Delivery & Payment
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Cash on Delivery across Karachi, Lahore, Islamabad, Peshawar, Quetta & all 100+ cities</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Free nationwide courier shipping on orders over Rs. 5,000</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Complimentary custom name/initials monogram foil stamping</span>
              </li>
            </ul>
          </div>

          {/* Lahore Atelier Contact & Owner Portal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
              Atelier & Workshop
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Studio 8, Gulberg III, Lahore, Punjab, Pakistan</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+92 300 8452109</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>concierge@theleatherworkx.pk</span>
              </p>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setActiveView('admin')}
                className="w-full py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold rounded border border-stone-700 transition cursor-pointer"
              >
                🔐 Business Owner Admin Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} The Leather Workx (Pakistan). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Cash on Delivery (COD)</span>
            <span>•</span>
            <span>TCS & Leopards Partner</span>
            <span>•</span>
            <span>Full-Grain Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
