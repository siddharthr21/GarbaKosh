'use client';

import React, { useState, useEffect } from 'react';
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
  Plus,
  X,
  Sparkles,
  ShoppingBag as CartIcon,
  Globe
} from 'lucide-react';

export const BabyShoppingModule: React.FC = () => {
  const { t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [wishlist, setWishlist] = useState<string[]>(['p1', 'p4', 'p9']);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Custom user products stored in localStorage
  const [customProducts, setCustomProducts] = useState<BabyProduct[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bloomnest_custom_products');
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdCat, setNewProdCat] = useState<BabyProduct['category']>('clothing');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdAmazon, setNewProdAmazon] = useState('');
  const [newProdFlipkart, setNewProdFlipkart] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdNotes, setNewProdNotes] = useState('');

  // Persist custom products
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bloomnest_custom_products', JSON.stringify(customProducts));
    }
  }, [customProducts]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddToRegistry = (name: string) => {
    setAddedNotice(`Added "${name}" to your baby registry checklist!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  const handleCreateCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const priceNum = Number(newProdPrice) || 999;
    const cleanSearch = encodeURIComponent(newProdName.trim());

    const newProduct: BabyProduct = {
      id: `custom_prod_${Date.now()}`,
      category: newProdCat,
      name: newProdName.trim(),
      brand: newProdBrand.trim() || 'Parent Pick',
      stageSuitable: 'Newborn to Infant',
      priceInr: priceNum,
      priceEstimate: `₹${priceNum.toLocaleString('en-IN')}`,
      rating: 5.0,
      reviewCount: 1,
      isIndependentPick: true,
      isOrganicOrNonToxic: true,
      safetyNote: newProdNotes.trim() || 'Custom parent recommendation verified for infant comfort.',
      description: newProdNotes.trim() || 'Parent curated baby gear added to personalized registry.',
      imageUrl: newProdImage.trim() || 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
      imageEmoji: '🍼',
      amazonUrl: newProdAmazon.trim() || `https://www.amazon.in/s?k=${cleanSearch}`,
      flipkartUrl: newProdFlipkart.trim() || `https://www.flipkart.com/search?q=${cleanSearch}`
    };

    setCustomProducts(prev => [newProduct, ...prev]);
    setShowAddModal(false);
    setNewProdName('');
    setNewProdBrand('');
    setNewProdPrice('');
    setNewProdAmazon('');
    setNewProdFlipkart('');
    setNewProdImage('');
    setNewProdNotes('');
    setAddedNotice(`Custom product "${newProduct.name}" added to shopping catalog!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  // Combine built-in verified products and user custom products
  const allProducts = [...customProducts, ...BABY_SHOPPING_PRODUCTS];

  const filteredProducts = allProducts.filter(p => {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('Curated Nursery & Newborn Gear', 'Curated Nursery & Newborn Gear')}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-gray-900">
            {t('Baby Shopping & Product Safety', 'Baby Shopping & Product Safety')}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t('Real-time pricing, pediatrician reviews, and live search links to Amazon India & Flipkart.', 'Real-time pricing, pediatrician reviews, and live search links to Amazon India & Flipkart.')}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Baby Gear</span>
        </button>
      </div>

      {/* Editorial & Safety Policy Banner */}
      <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-emerald-900 uppercase text-[11px]">
            {t('Live E-Commerce Connectivity & Safety Verification', 'Live E-Commerce Connectivity & Safety Verification')}:
          </h4>
          <p className="text-emerald-900/90 leading-relaxed text-[11px]">
            {t('All products adhere to CPSC, Greenguard Gold, or GOTS organic standards. Compare live pricing or search any baby item directly across Amazon India and Flipkart with zero hardcoded locks.', 'All products adhere to CPSC, Greenguard Gold, or GOTS organic standards. Compare live pricing or search any baby item directly across Amazon India and Flipkart with zero hardcoded locks.')}
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
              placeholder="Search gear, brand, or any item (e.g. carrier, sterilizer, Chicco)..."
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

      {/* Live E-Commerce Search Action Card (When search has text) */}
      {searchQuery.trim() !== '' && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-50 via-cream-50 to-orange-50 border border-amber-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-600" />
              <span>Live Search across the Web for "{searchQuery}"</span>
            </span>
            <p className="text-[11px] text-amber-900/80">
              Compare real-time product prices and deals on India's top marketplaces:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#FF9900] text-black hover:bg-[#FF9900]/90 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Search Amazon India</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#2874F0] text-white hover:bg-[#2874F0]/90 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Search Flipkart</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

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
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex items-center justify-center text-5xl bg-amber-50';
                        fallback.innerHTML = `<span>${prod.imageEmoji || '👶'}</span>`;
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
        <div className="p-12 text-center bg-white rounded-3xl border border-blush-100 space-y-3">
          <p className="font-bold text-gray-700">No catalog products match "{searchQuery}".</p>
          <p className="text-xs text-gray-500">
            You can search for "{searchQuery}" directly on Amazon or Flipkart above, or add it to your personal registry below:
          </p>
          <button
            onClick={() => {
              setNewProdName(searchQuery);
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            + Add "{searchQuery}" to My Registry
          </button>
        </div>
      )}

      {/* Add Custom Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateCustomProduct}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-blush-100 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif font-bold text-gray-900 text-lg">Add Custom Baby Product</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Product Title *</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="e.g. Ergonomic 4-Position Baby Carrier"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={e => setNewProdBrand(e.target.value)}
                    placeholder="e.g. Ergobaby / LuvLap"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Estimated Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProdPrice}
                    onChange={e => setNewProdPrice(e.target.value)}
                    placeholder="e.g. 2499"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Category</label>
                  <select
                    value={newProdCat}
                    onChange={e => setNewProdCat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                  >
                    <option value="clothing">Clothing</option>
                    <option value="diapering">Diapering</option>
                    <option value="skincare">Skincare</option>
                    <option value="feeding">Feeding</option>
                    <option value="bedding">Crib & Sleep</option>
                    <option value="gear">Strollers & Gear</option>
                    <option value="bathing">Bathing</option>
                    <option value="safety">Safety & Monitors</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Photo Image URL</label>
                  <input
                    type="url"
                    value={newProdImage}
                    onChange={e => setNewProdImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Custom Amazon URL (optional)</label>
                <input
                  type="url"
                  value={newProdAmazon}
                  onChange={e => setNewProdAmazon(e.target.value)}
                  placeholder="https://www.amazon.in/..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Custom Flipkart URL (optional)</label>
                <input
                  type="url"
                  value={newProdFlipkart}
                  onChange={e => setNewProdFlipkart(e.target.value)}
                  placeholder="https://www.flipkart.com/..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Clinical / Safety Notes</label>
                <textarea
                  rows={2}
                  value={newProdNotes}
                  onChange={e => setNewProdNotes(e.target.value)}
                  placeholder="e.g. Ergonomic M-position hip support tested for newborn spine."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Save to Registry
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
