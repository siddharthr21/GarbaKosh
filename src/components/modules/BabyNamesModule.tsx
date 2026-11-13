'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  BookHeart,
  Search,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Sparkles,
  Filter,
  Check,
  Share2
} from 'lucide-react';

export const BabyNamesModule: React.FC = () => {
  const {
    babyNames,
    toggleFavoriteName,
    voteName,
    addCustomBabyName,
    activeRole,
    selectedLanguage,
    t
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'boy' | 'girl' | 'neutral'>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'explore' | 'shortlist' | 'favorites'>('explore');

  // Custom name form
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customGender, setCustomGender] = useState<'boy' | 'girl' | 'neutral'>('girl');
  const [customOrigin, setCustomOrigin] = useState('Sanskrit');
  const [customMeaning, setCustomMeaning] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const nameToAdd = customName.trim();
    addCustomBabyName(
      nameToAdd,
      customGender,
      customOrigin.trim() || 'Sanskrit',
      customMeaning.trim() || 'Precious family blessing'
    );
    // Clear search and origin filter so it displays immediately at the top
    setSearchQuery('');
    setSelectedGender('all');
    setSelectedOrigin('all');
    setCustomName('');
    setCustomMeaning('');
    setShowAddCustom(false);
    setNotification(`✨ "${nameToAdd}" successfully added to your dictionary and shortlist!`);
    setTimeout(() => setNotification(null), 4500);
  };

  const filteredNames = babyNames.filter(item => {
    const locName = item.localizedNames?.[selectedLanguage] || '';
    const locMeaning = item.localizedMeanings?.[selectedLanguage] || '';

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      locMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender = selectedGender === 'all' || item.gender === selectedGender;
    const matchesOrigin = selectedOrigin === 'all' || item.origin.toLowerCase().includes(selectedOrigin.toLowerCase());
    const matchesStyle = selectedStyle === 'all' || (item.style && item.style.toLowerCase().includes(selectedStyle.toLowerCase()));

    const matchesAll = matchesSearch && matchesGender && matchesOrigin && matchesStyle;
    if (activeTab === 'favorites') return item.isFavorite && matchesAll;
    if (activeTab === 'shortlist') return item.isShortlisted && matchesAll;
    return matchesAll;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold mb-2">
            <BookHeart className="w-3.5 h-3.5" />
            <span>{t('AI Baby Name Explorer & Couple Voting', 'AI Baby Name Explorer & Couple Voting')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {t('babyNamesTitle', 'Baby Names & Shortlist')}
          </h1>
          <p className="text-sm text-gray-600">
            {t('babyNamesSubtitle', 'Curated names across Sanskrit, Tamil, Hindi, Kannada, Telugu, Malayalam, and global origins. Both parents can vote together!')}
          </p>
        </div>

        <button
          onClick={() => setShowAddCustom(!showAddCustom)}
          className="px-4 py-2 bg-gradient-to-r from-blush-500 to-rose-400 hover:from-blush-600 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blush-200 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('Add Custom Name', 'Add Custom Name')}</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-semibold animate-in fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-600 hover:text-emerald-900 text-xs ml-2 font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Add Custom Name Dialog / Panel */}
      {showAddCustom && (
        <form onSubmit={handleAddCustom} className="p-5 bg-gradient-to-r from-cream-100 to-blush-50 rounded-3xl border border-blush-200 text-xs space-y-3">
          <h3 className="font-bold text-gray-900 text-sm">Add Custom Baby Name to Couple Shortlist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Name</label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="e.g. Advika"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Gender</label>
              <select
                value={customGender}
                onChange={e => setCustomGender(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
              >
                <option value="girl">Girl</option>
                <option value="boy">Boy</option>
                <option value="neutral">Gender Neutral</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Origin / Language</label>
              <input
                type="text"
                value={customOrigin}
                onChange={e => setCustomOrigin(e.target.value)}
                placeholder="e.g. Sanskrit / Tamil"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Meaning & Context</label>
              <input
                type="text"
                value={customMeaning}
                onChange={e => setCustomMeaning(e.target.value)}
                placeholder="e.g. Unique; First light"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="px-3 py-1.5 rounded-xl bg-gray-200 text-gray-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-blush-500 hover:bg-blush-600 text-white font-bold shadow-xs"
            >
              Save to Shortlist
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-blush-100 shadow-sm space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-blush-500 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t('Explore All Names', 'Explore All Names')} ({babyNames.length})
            </button>

            <button
              onClick={() => setActiveTab('shortlist')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'shortlist'
                  ? 'bg-blush-500 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{t('shortlist', 'Shared Couple Shortlist')}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {babyNames.filter(n => n.isShortlisted).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-blush-500 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{t('Favorites', 'Favorites')}</span>
            </button>
          </div>

          <span className="text-[11px] text-gray-500 hidden sm:inline">
            {t('Voting as', 'Voting as')}: <strong className="capitalize">{activeRole}</strong>
          </span>
        </div>

        {/* Search input & drop-downs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchNames', 'Search by name, meaning, or keyword...')}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blush-400 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="all">{t('All Genders', 'All Genders')}</option>
              <option value="girl">🌸 {t('filterGirls', 'Girl Names')}</option>
              <option value="boy">💙 {t('filterBoys', 'Boy Names')}</option>
              <option value="neutral">✨ {t('filterNeutral', 'Gender Neutral')}</option>
            </select>
          </div>

          <div>
            <select
              value={selectedOrigin}
              onChange={e => setSelectedOrigin(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="all">All Origins & Languages</option>
              <option value="sanskrit">Sanskrit Classics</option>
              <option value="hindi">Hindi & Northern</option>
              <option value="tamil">Tamil & Southern</option>
              <option value="arabic">Arabic & Persian</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStyle}
              onChange={e => setSelectedStyle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="all">All Styles</option>
              <option value="modern">Modern & Trendy</option>
              <option value="traditional">Traditional Heritage</option>
              <option value="sanskrit">Sanskrit Classic</option>
              <option value="royal">Royal & Regal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Names Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNames.map(name => {
          const totalScore = (name.motherVote || 0) + (name.partnerVote || 0);
          const localizedName = (selectedLanguage !== 'en-US' && name.localizedNames?.[selectedLanguage])
            ? name.localizedNames[selectedLanguage]
            : name.name;
          const localizedMeaning = (selectedLanguage !== 'en-US' && name.localizedMeanings?.[selectedLanguage])
            ? name.localizedMeanings[selectedLanguage]
            : name.meaning;
          const hasDifferentScript = selectedLanguage !== 'en-US' && name.localizedNames?.[selectedLanguage];

          return (
            <div
              key={name.id}
              className="bg-white rounded-3xl p-5 border border-blush-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-gray-900">{localizedName}</span>
                    {hasDifferentScript && (
                      <span className="text-xs text-gray-400 font-semibold">({name.name})</span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      name.gender === 'girl'
                        ? 'bg-rose-100 text-rose-700'
                        : name.gender === 'boy'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {name.gender}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFavoriteName(name.id)}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    title="Toggle favorite"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        name.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-300'
                      }`}
                    />
                  </button>
                </div>

                <div className="text-[11px] text-gray-500 flex items-center gap-2">
                  <span className="font-semibold text-gray-700">{name.origin}</span>
                  <span>·</span>
                  <span className="italic">{name.pronunciation}</span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  <strong>{t('meaning', 'Meaning')}:</strong> {localizedMeaning}
                </p>

                {name.culturalContext && (
                  <p className="text-[11px] text-gray-500 leading-relaxed italic border-t border-gray-100 pt-2">
                    {name.culturalContext}
                  </p>
                )}
              </div>

              {/* Couple Voting System */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Couple Score:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                    totalScore > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {totalScore > 0 ? `+${totalScore}` : totalScore}
                  </span>
                </div>

                {/* Voting buttons for active user */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => voteName(name.id, activeRole, 1)}
                    className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                      (activeRole === 'mother' ? name.motherVote === 1 : name.partnerVote === 1)
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-2xs'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-emerald-50'
                    }`}
                    title="I love this name"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => voteName(name.id, activeRole, -1)}
                    className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                      (activeRole === 'mother' ? name.motherVote === -1 : name.partnerVote === -1)
                        ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-rose-50'
                    }`}
                    title="Not feeling this name"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
