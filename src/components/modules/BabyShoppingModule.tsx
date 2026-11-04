'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { BABY_SHOPPING_PRODUCTS, BabyProduct } from '@/data/shoppingData';
import {
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Check,
  Filter,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';

export const BabyShoppingModule: React.FC = () => {
  const { t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [wishlist, setWishlist] = useState<string[]>(['p1', 'p4']);
  const [onlyOrganic, setOnlyOrganic] = useState(false);

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredProducts = BABY_SHOPPING_PRODUCTS.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesOrganic = !onlyOrganic || p.isOrganicOrNonToxic;
    return matchesCat && matchesOrganic;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{t('Curated Nursery & Newborn Gear', 'Curated Nursery & Newborn Gear')}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          {t('Baby Shopping & Product Safety', 'Baby Shopping & Product Safety')}
        </h1>
        <p className="text-sm text-gray-600">
          {t('Independent, pediatrician-reviewed newborn recommendations. Free of sponsored bias with non-toxic certifications.', 'Independent, pediatrician-reviewed newborn recommendations. Free of sponsored bias with non-toxic certifications.')}
        </p>
      </div>

      {/* Safety & Independence Guarantee Banner */}
      <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-emerald-900 uppercase text-[11px]">{t('Independent Editorial Policy', 'Independent Editorial Policy')}:</h4>
          <p className="text-emerald-900/90 leading-relaxed">
            {t('BloomNest does not accept paid placements or algorithmic affiliate prioritization. All listed products adhere to Consumer Product Safety Commission (CPSC), Greenguard Gold, or GOTS organic standards.', 'BloomNest does not accept paid placements or algorithmic affiliate prioritization. All listed products adhere to Consumer Product Safety Commission (CPSC), Greenguard Gold, or GOTS organic standards.')}
          </p>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="bg-white rounded-3xl p-5 border border-blush-100 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            {[
              { id: 'all', label: 'All Gear' },
              { id: 'clothing', label: 'Clothing' },
              { id: 'diapering', label: 'Diapering' },
              { id: 'skincare', label: 'Skincare' },
              { id: 'feeding', label: 'Feeding' },
              { id: 'bedding', label: 'Crib & Sleep' },
              { id: 'gear', label: 'Strollers & Seats' },
              { id: 'bathing', label: 'Bath' },
              { id: 'safety', label: 'Safety & Monitors' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl capitalize font-bold transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={onlyOrganic}
              onChange={e => setOnlyOrganic(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400"
            />
            <span>Organic / Non-Toxic Only</span>
          </label>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map(prod => {
          const isWishlisted = wishlist.includes(prod.id);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-5 border border-blush-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="h-32 rounded-2xl bg-gradient-to-br from-cream-100 to-amber-50 flex items-center justify-center text-4xl relative">
                  <span>{prod.imageEmoji}</span>

                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 backdrop-blur-xs rounded-full hover:bg-white shadow-xs transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                  </button>

                  <div className="absolute bottom-2 left-2 flex gap-1">
                    {prod.isIndependentPick && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold uppercase">
                        Pediatric Pick
                      </span>
                    )}
                    {prod.isOrganicOrNonToxic && (
                      <span className="px-2 py-0.5 rounded-md bg-teal-600 text-white text-[9px] font-bold uppercase">
                        Clean / Non-Toxic
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400">{prod.stageSuitable}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{prod.rating}</span>
                      <span className="text-gray-400 text-[10px]">({prod.reviewCount})</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                    {prod.name}
                  </h3>

                  <div className="text-sm font-black text-emerald-700">{prod.priceEstimate}</div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="p-2 bg-amber-50/70 rounded-xl border border-amber-100 text-[10px] text-amber-900 leading-tight">
                  <span className="font-bold block mb-0.5">Clinical Safety Note:</span>
                  {prod.safetyNote}
                </div>

                <button
                  onClick={() => alert(`Saved "${prod.name}" to your registry shopping list!`)}
                  className="w-full py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Add to Registry / Wishlist</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
