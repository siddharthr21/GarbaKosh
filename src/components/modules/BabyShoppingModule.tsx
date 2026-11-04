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
  Search,
  ExternalLink,
  Tag,
  Sparkles,
  ShoppingBag as CartIcon
} from 'lucide-react';

export const BabyShoppingModule: React.FC = () => {
  const { t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [wishlist, setWishlist] = useState<string[]>(['p1', 'p4', 'p9']);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddToRegistry = (name: string) => {
    setAddedNotice(`Added "${name}" to your baby registry checklist!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  const filteredProducts = BABY_SHOPPING_PRODUCTS.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesOrganic = !onlyOrganic || p.isOrganicOrNonToxic;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesOrganic && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-gray-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{t('Curated Nursery & Newborn Gear', 'Curated Nursery & Newborn Gear')}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-black text-gray-900">
          {t('Baby Shopping & Product Safety', 'Baby Shopping & Product Safety')}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {t('Pediatrician-reviewed newborn essentials with verified photos and direct links to Flipkart and Amazon.', 'Pediatrician-reviewed newborn essentials with verified photos and direct links to Flipkart and Amazon.')}
        </p>
      </div>

      {/* Editorial & Safety Policy Banner */}
      <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-emerald-900 uppercase text-[11px]">
            {t('Verified Safe & Indian E-Commerce Ready', 'Verified Safe & Indian E-Commerce Ready')}:
          </h4>
          <p className="text-emerald-900/90 leading-relaxed text-[11px]">
            {t('All products are selected based on CPSC, EN 1888, Greenguard Gold, or GOTS organic standards. Compare live pricing and purchase directly on Amazon India or Flipkart.', 'All products are selected based on CPSC, EN 1888, Greenguard Gold, or GOTS organic standards. Compare live pricing and purchase directly on Amazon India or Flipkart.')}
          </p>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white rounded-3xl p-5 border border-blush-100 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search gear, brand (e.g. Chicco, Avent, Sebamed)..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
            />
          </div>

          {/* Organic / Non-toxic Toggle */}
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer self-start md:self-auto bg-amber-50/60 px-3 py-2 rounded-xl border border-amber-200/50">
            <input
              type="checkbox"
              checked={onlyOrganic}
              onChange={e => setOnlyOrganic(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
            />
            <span className="text-amber-900">🍃 100% Organic / Non-Toxic Only</span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {[
            { id: 'all', label: 'All Essentials' },
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
              className={`px-3 py-1.5 rounded-xl capitalize font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map(prod => {
          const isWishlisted = wishlist.includes(prod.id);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-5 border border-blush-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Product Photo Box with fallback and badges */}
                <div className="h-44 rounded-2xl overflow-hidden bg-gray-100 relative group/img">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback gracefully to colored emoji block if network image is blocked
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex items-center justify-center text-5xl bg-amber-50';
                        fallback.innerHTML = `<span>${prod.imageEmoji}</span>`;
                        parent.appendChild(fallback);
                      }
                    }}
                  />

                  {/* Wishlist toggle */}
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-xs rounded-full hover:bg-white shadow-xs transition-colors cursor-pointer z-10"
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                  </button>

                  {/* Quality Badges */}
                  <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1 z-10">
                    {prod.isIndependentPick && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
                        Pediatric Pick
                      </span>
                    )}
                    {prod.isOrganicOrNonToxic && (
                      <span className="px-2 py-0.5 rounded-md bg-teal-600/90 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
                        Clean / Safe
                      </span>
                    )}
                  </div>
                </div>

                {/* Brand & Stage */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {prod.brand}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold">{prod.stageSuitable}</span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                  {prod.name}
                </h3>

                {/* Rating & INR Price */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-lg font-black text-emerald-700">
                    ₹{prod.priceInr.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/50">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{prod.rating}</span>
                    <span className="text-gray-400 text-[10px]">({prod.reviewCount})</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                {/* Clinical Safety Note */}
                <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100/80 text-[10px] text-amber-900 leading-tight">
                  <span className="font-bold block mb-0.5 text-amber-950">Clinical Pediatric Note:</span>
                  {prod.safetyNote}
                </div>
              </div>

              {/* Action Buttons: Buy on Amazon, Buy on Flipkart, Registry */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  {/* Buy on Amazon Button */}
                  <a
                    href={prod.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2.5 bg-[#FF9900]/10 hover:bg-[#FF9900]/20 text-[#B86B00] border border-[#FF9900]/30 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs group/btn"
                  >
                    <span>Amazon</span>
                    <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>

                  {/* Buy on Flipkart Button */}
                  <a
                    href={prod.flipkartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2.5 bg-[#2874F0]/10 hover:bg-[#2874F0]/20 text-[#2874F0] border border-[#2874F0]/30 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs group/btn"
                  >
                    <span>Flipkart</span>
                    <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                </div>

                {/* Add to Registry / Wishlist Button */}
                <button
                  type="button"
                  onClick={() => handleAddToRegistry(prod.name)}
                  className="w-full py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <CartIcon className="w-3.5 h-3.5" />
                  <span>Add to Baby Registry</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-blush-100 space-y-2">
          <p className="font-bold text-gray-700">No baby products match your filters.</p>
          <p className="text-xs text-gray-500">Try adjusting your search query or reset the organic filter.</p>
        </div>
      )}
    </div>
  );
};
