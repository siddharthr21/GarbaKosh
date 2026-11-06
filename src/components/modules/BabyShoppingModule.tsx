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
  Globe,
  Eye,
  Truck,
  Info,
  Share2,
  CheckCircle2,
  Award,
  BadgePercent
} from 'lucide-react';

export const BabyShoppingModule: React.FC = () => {
  const { addShowerRegistryItem, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [wishlist, setWishlist] = useState<string[]>(['p1', 'p4', 'p9']);
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Selected product for detailed modal view
  const [selectedProductModal, setSelectedProductModal] = useState<BabyProduct | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Custom user products stored in localStorage
  const [customProducts, setCustomProducts] = useState<BabyProduct[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('garbhsarthi_custom_products') || localStorage.getItem('bloomnest_custom_products');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
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
      localStorage.setItem('garbhsarthi_custom_products', JSON.stringify(customProducts));
      localStorage.setItem('bloomnest_custom_products', JSON.stringify(customProducts));
    }
  }, [customProducts]);

  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddToRegistry = (name: string, priceInr = 999, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addShowerRegistryItem(name, priceInr);
    setAddedNotice(`Added "${name}" to your baby shower wishlist registry!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  const handleShareProduct = (prod: BabyProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareText = `Check out "${prod.name}" by ${prod.brand} (₹${prod.priceInr.toLocaleString('en-IN')}) on GarbhSarthi Shopping!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${shareText}\nAmazon: ${prod.amazonUrl}\nFlipkart: ${prod.flipkartUrl}`);
      setAddedNotice('Product link and shopping details copied to clipboard!');
      setTimeout(() => setAddedNotice(null), 3000);
    }
  };

  const openProductDetails = (prod: BabyProduct) => {
    setSelectedProductModal(prod);
    setActivePhotoIndex(0);
  };

  const handleCreateCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const priceNum = Number(newProdPrice) || 999;
    const mrpCalc = Math.round(priceNum * 1.35);
    const cleanSearch = encodeURIComponent(newProdName.trim());
    const fallbackImg = newProdImage.trim() || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80';

    const newProduct: BabyProduct = {
      id: `custom_prod_${Date.now()}`,
      category: newProdCat,
      name: newProdName.trim(),
      brand: newProdBrand.trim() || 'Parent Pick',
      stageSuitable: 'Newborn to Infant',
      priceInr: priceNum,
      mrpInr: mrpCalc,
      discountPercent: 26,
      priceEstimate: `₹${priceNum.toLocaleString('en-IN')}`,
      rating: 5.0,
      reviewCount: 1,
      isIndependentPick: true,
      isOrganicOrNonToxic: true,
      safetyNote: newProdNotes.trim() || 'Parent recommendation checked for infant comfort and hypoallergenic safety.',
      pediatricReason: 'Custom baby item curated for your family nursery registry.',
      description: newProdNotes.trim() || 'Parent curated baby gear added to personalized registry with verified marketplace search links.',
      highlights: [
        'Curated parent recommendation for your baby registry',
        'Direct search links to Amazon India and Flipkart included',
        'Added with custom pricing and notes'
      ],
      specifications: {
        'Category': newProdCat.toUpperCase(),
        'Brand': newProdBrand.trim() || 'Parent Pick',
        'Added Date': new Date().toLocaleDateString()
      },
      whatsIncluded: ['1x ' + newProdName.trim()],
      imageUrl: fallbackImg,
      galleryImages: [fallbackImg],
      imageEmoji: '🍼',
      amazonUrl: newProdAmazon.trim() || `https://www.amazon.in/s?k=${cleanSearch}`,
      flipkartUrl: newProdFlipkart.trim() || `https://www.flipkart.com/search?q=${cleanSearch}`,
      deliveryInfo: 'Fast delivery on Amazon & Flipkart'
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
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-gray-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
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
            {t('Pediatric reviews, full specifications, high-res photos, and live price links to Amazon India & Flipkart.', 'Pediatric reviews, full specifications, high-res photos, and live price links to Amazon India & Flipkart.')}
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
          <h4 className="font-bold text-emerald-900 uppercase text-[11px] flex items-center gap-1.5">
            <span>Verified Pediatric Safety & Live Marketplace Connectivity</span>
            <Award className="w-3.5 h-3.5 text-emerald-600" />
          </h4>
          <p className="text-emerald-900/90 leading-relaxed text-[11px]">
            {t('All featured items meet strict CPSC, GOTS Organic, or European EN safety guidelines. Click any product to inspect full medical specifications, photo angles, and compare live pricing on Amazon India and Flipkart.', 'All featured items meet strict CPSC, GOTS Organic, or European EN safety guidelines. Click any product to inspect full medical specifications, photo angles, and compare live pricing on Amazon India and Flipkart.')}
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
              placeholder="Search gear, brand, or item (e.g. Avent, stroller, crib, Sebamed)..."
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
              className="px-3.5 py-2 bg-[#FF9900] text-black hover:bg-[#FF9900]/90 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Search Amazon India</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#2874F0] text-white hover:bg-[#2874F0]/90 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Search Flipkart</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(prod => {
          const isWishlisted = wishlist.includes(prod.id);
          const mrpVal = prod.mrpInr || Math.round(prod.priceInr * 1.32);
          const discountVal = prod.discountPercent || Math.round(((mrpVal - prod.priceInr) / mrpVal) * 100);

          return (
            <div
              key={prod.id}
              onClick={() => openProductDetails(prod)}
              className="bg-white rounded-3xl p-5 border border-blush-100 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer hover:border-amber-200"
            >
              <div className="space-y-3">
                {/* Product Photo Box with fallback and interactive overlay */}
                <div className="h-48 rounded-2xl overflow-hidden bg-gray-50 relative group/img border border-gray-100">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 text-amber-800 p-4 text-center';
                        fallback.innerHTML = `<span class="text-4xl mb-1">${prod.imageEmoji || '👶'}</span><span class="text-[11px] font-bold text-gray-700">${prod.brand}</span>`;
                        parent.appendChild(fallback);
                      }
                    }}
                  />

                  {/* Wishlist toggle */}
                  <button
                    onClick={(e) => toggleWishlist(prod.id, e)}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-xs rounded-full hover:bg-white shadow-xs transition-colors cursor-pointer z-10"
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                  </button>

                  {/* Hover Quick View Button */}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <span className="px-3.5 py-2 bg-white text-gray-900 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-3.5 h-3.5 text-primary" />
                      <span>Inspect Full Details & Photos</span>
                    </span>
                  </div>

                  {/* Discount & Quality Badges */}
                  <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-1 z-10">
                    {discountVal > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-600/90 backdrop-blur-xs text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5">
                        <BadgePercent className="w-2.5 h-2.5" />
                        <span>{discountVal}% OFF</span>
                      </span>
                    )}
                    {prod.isIndependentPick && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
                        Pediatric Pick
                      </span>
                    )}
                    {prod.isOrganicOrNonToxic && (
                      <span className="px-2 py-0.5 rounded-md bg-teal-600/90 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
                        Clean & Non-Toxic
                      </span>
                    )}
                  </div>
                </div>

                {/* Brand & Stage */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-600" /> {prod.brand}
                  </span>
                  <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded-md">
                    {prod.stageSuitable}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {prod.name}
                </h3>

                {/* Rating & INR Price with Strikethrough MRP */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-baseline gap-2">
                    <div className="text-xl font-black text-emerald-700">
                      ₹{prod.priceInr.toLocaleString('en-IN')}
                    </div>
                    {mrpVal > prod.priceInr && (
                      <div className="text-xs text-gray-400 line-through font-semibold">
                        ₹{mrpVal.toLocaleString('en-IN')}
                      </div>
                    )}
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

                {/* Clinical Safety Note Preview */}
                <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100/80 text-[10px] text-amber-900 leading-tight">
                  <span className="font-bold block mb-0.5 text-amber-950 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    <span>Pediatric Safety Note:</span>
                  </span>
                  <span className="line-clamp-2">{prod.safetyNote}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  {/* Buy on Amazon Button */}
                  <a
                    href={prod.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="py-2 px-2 bg-[#FF9900]/10 hover:bg-[#FF9900]/20 text-[#B86B00] border border-[#FF9900]/30 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-2xs group/btn cursor-pointer"
                  >
                    <span>Amazon</span>
                    <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>

                  {/* Buy on Flipkart Button */}
                  <a
                    href={prod.flipkartUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="py-2 px-2 bg-[#2874F0]/10 hover:bg-[#2874F0]/20 text-[#2874F0] border border-[#2874F0]/30 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-2xs group/btn cursor-pointer"
                  >
                    <span>Flipkart</span>
                    <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openProductDetails(prod);
                    }}
                    className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-gray-600" />
                    <span>Full Specs</span>
                  </button>

                  {/* Add to Registry / Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToRegistry(prod.name, prod.priceInr, e)}
                    className="py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <CartIcon className="w-3 h-3" />
                    <span>+ Registry</span>
                  </button>
                </div>
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

      {/* Comprehensive Product Details Modal */}
      {selectedProductModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setSelectedProductModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-blush-100 animate-in zoom-in-95 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-100 text-amber-800">
                  {selectedProductModal.category}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  {selectedProductModal.brand}
                </span>
              </div>
              <button
                onClick={() => setSelectedProductModal(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Top Section: Photo Gallery & Core Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Photo Gallery Column */}
                <div className="space-y-3">
                  <div className="h-64 md:h-72 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative group">
                    <img
                      src={
                        selectedProductModal.galleryImages && selectedProductModal.galleryImages[activePhotoIndex]
                          ? selectedProductModal.galleryImages[activePhotoIndex]
                          : selectedProductModal.imageUrl
                      }
                      alt={selectedProductModal.name}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />

                    {selectedProductModal.discountPercent && selectedProductModal.discountPercent > 0 && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-xs shadow-md">
                        {selectedProductModal.discountPercent}% OFF
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {selectedProductModal.galleryImages && selectedProductModal.galleryImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {selectedProductModal.galleryImages.map((imgUrl, gIdx) => (
                        <button
                          key={gIdx}
                          onClick={() => setActivePhotoIndex(gIdx)}
                          className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                            activePhotoIndex === gIdx ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Title, Price, Star Ratings, Highlights */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                      {selectedProductModal.stageSuitable}
                    </span>
                    <h2 className="text-lg md:text-xl font-bold font-serif text-gray-900 mt-1 leading-snug">
                      {selectedProductModal.name}
                    </h2>
                  </div>

                  {/* Price Banner */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-emerald-700">
                          ₹{selectedProductModal.priceInr.toLocaleString('en-IN')}
                        </span>
                        {selectedProductModal.mrpInr && selectedProductModal.mrpInr > selectedProductModal.priceInr && (
                          <span className="text-sm text-gray-400 line-through font-semibold">
                            ₹{selectedProductModal.mrpInr.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 block mt-0.5">Inclusive of all taxes</span>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-white px-2.5 py-1 rounded-xl border border-gray-200 shadow-2xs">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{selectedProductModal.rating}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {selectedProductModal.reviewCount} verified ratings
                      </span>
                    </div>
                  </div>

                  {/* Delivery & Assurance note */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{selectedProductModal.deliveryInfo || 'Fast 2-day delivery on Amazon India & Flipkart • 10-day replacement policy'}</span>
                  </div>

                  {/* Primary Buy CTA Buttons */}
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={selectedProductModal.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-[#FF9900] hover:bg-[#FF9900]/90 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <span>Buy on Amazon (₹{selectedProductModal.priceInr.toLocaleString('en-IN')})</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={selectedProductModal.flipkartUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-[#2874F0] hover:bg-[#2874F0]/90 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <span>Buy on Flipkart</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToRegistry(selectedProductModal.name, selectedProductModal.priceInr)}
                        className="flex-1 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <CartIcon className="w-4 h-4 text-amber-400" />
                        <span>Add to My Baby Registry</span>
                      </button>

                      <button
                        onClick={() => toggleWishlist(selectedProductModal.id)}
                        className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                        title="Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(selectedProductModal.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                      </button>

                      <button
                        onClick={() => handleShareProduct(selectedProductModal)}
                        className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                        title="Share Product"
                      >
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pediatric Clinical Clearance Card */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Clinical Pediatric Review & Safety Clearance</span>
                </div>
                <p className="text-xs text-amber-950/90 leading-relaxed">
                  {selectedProductModal.pediatricReason || selectedProductModal.safetyNote}
                </p>
                <div className="text-[11px] text-amber-900/80 pt-1 border-t border-amber-200/50">
                  <span className="font-bold">Safety Guideline: </span>
                  {selectedProductModal.safetyNote}
                </div>
              </div>

              {/* Key Features & Highlights */}
              {selectedProductModal.highlights && selectedProductModal.highlights.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Product Highlights & Key Benefits</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedProductModal.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700 leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Table */}
              {selectedProductModal.specifications && Object.keys(selectedProductModal.specifications).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>Specifications & Materials</span>
                  </h4>
                  <div className="rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 text-xs">
                    {Object.entries(selectedProductModal.specifications).map(([key, val], idx) => (
                      <div key={idx} className="grid grid-cols-3 p-3 bg-white even:bg-gray-50/50">
                        <span className="font-bold text-gray-700">{key}</span>
                        <span className="col-span-2 text-gray-600">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What's In The Box */}
              {selectedProductModal.whatsIncluded && selectedProductModal.whatsIncluded.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Package Contents (What's in the Box)</h4>
                  <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    {selectedProductModal.whatsIncluded.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Full Description */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Full Product Description</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {selectedProductModal.description}
                </p>
              </div>
            </div>
          </div>
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
                    <option value="bedding">Crib & Bedding</option>
                    <option value="gear">Strollers & Gear</option>
                    <option value="bathing">Bathing</option>
                    <option value="safety">Safety & Monitors</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Estimated Price in INR (₹) *</label>
                <input
                  type="number"
                  value={newProdPrice}
                  onChange={e => setNewProdPrice(e.target.value)}
                  placeholder="e.g. 1999"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={newProdImage}
                  onChange={e => setNewProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Amazon India URL (Optional)</label>
                  <input
                    type="url"
                    value={newProdAmazon}
                    onChange={e => setNewProdAmazon(e.target.value)}
                    placeholder="https://www.amazon.in/dp/..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Flipkart URL (Optional)</label>
                  <input
                    type="url"
                    value={newProdFlipkart}
                    onChange={e => setNewProdFlipkart(e.target.value)}
                    placeholder="https://www.flipkart.com/..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Safety & Pediatric Notes</label>
                <textarea
                  value={newProdNotes}
                  onChange={e => setNewProdNotes(e.target.value)}
                  placeholder="e.g. 100% BPA free, certified safe for infant sleep"
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
