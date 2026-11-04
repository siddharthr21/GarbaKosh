'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  PartyPopper,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Circle,
  Plus,
  Gift,
  Sparkles,
  MapPin,
  Share2,
  Check,
  Edit3,
  X,
  Save
} from 'lucide-react';

export const BabyShowerModule: React.FC = () => {
  const {
    babyShower,
    updateBabyShowerTheme,
    updateBabyShowerDetails,
    toggleShowerTask,
    addShowerTask,
    addShowerGuest,
    updateGuestRsvp,
    profile,
    t
  } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newGuestName, setNewGuestName] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Edit details state
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editDate, setEditDate] = useState(babyShower.eventDate);
  const [editVenue, setEditVenue] = useState(babyShower.venue);
  const [editBudgetTotal, setEditBudgetTotal] = useState(babyShower.budgetTotal);
  const [editBudgetSpent, setEditBudgetSpent] = useState(babyShower.budgetSpent);
  const [editGuestCount, setEditGuestCount] = useState(babyShower.guestCount);

  useEffect(() => {
    setEditDate(babyShower.eventDate);
    setEditVenue(babyShower.venue);
    setEditBudgetTotal(babyShower.budgetTotal);
    setEditBudgetSpent(babyShower.budgetSpent);
    setEditGuestCount(babyShower.guestCount);
  }, [babyShower]);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateBabyShowerDetails({
      eventDate: editDate,
      venue: editVenue.trim() || 'Celebration Venue',
      budgetTotal: Math.max(0, Number(editBudgetTotal) || 0),
      budgetSpent: Math.max(0, Number(editBudgetSpent) || 0),
      guestCount: Math.max(0, Number(editGuestCount) || 0)
    });
    setIsEditingDetails(false);
  };

  const THEMES = [
    { id: 'Traditional Indian', label: 'Traditional Indian (Godh Bharai / Seemantham)', color: 'from-amber-400 to-rose-400', desc: 'Marigold & jasmine blooms, saffron sweets, traditional silk blessings' },
    { id: 'Floral', label: 'Floral Wonderland', color: 'from-pink-400 to-rose-300', desc: 'Peonies, gentle roses, wildflower arches & sweet berry tea' },
    { id: 'Pastel', label: 'Pastel Dream', color: 'from-blue-300 to-purple-300', desc: 'Soft lavender, mint, and baby blue clouds with macarons' },
    { id: 'Minimalist', label: 'Modern Minimalist', color: 'from-cream-200 to-gray-300', desc: 'Neutral beige, eucalyptus sprigs, chic typography & warm candles' },
    { id: 'Nature-inspired', label: 'Nature & Woodland', color: 'from-emerald-400 to-teal-400', desc: 'Ferns, terracotta pots, forest creatures, and organic wooden accents' }
  ];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addShowerTask(newTaskTitle.trim(), 'general');
    setNewTaskTitle('');
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    addShowerGuest(newGuestName.trim());
    setNewGuestName('');
  };

  const copyInviteText = () => {
    const text = `🌸 Join us in celebrating our baby shower / Godh Bharai! 🌸\nHonoring: ${profile.name} & ${profile.partnerProfile?.name || 'Rohan'}\nDate: ${babyShower.eventDate}\nVenue: ${babyShower.venue}\nTheme: ${babyShower.theme}\nRSVP via BloomNest!`;
    navigator.clipboard.writeText(text);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const attendingCount = babyShower.guests.filter(g => g.rsvp === 'attending').length;
  const budgetRemaining = babyShower.budgetTotal - babyShower.budgetSpent;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-2">
            <PartyPopper className="w-3.5 h-3.5" />
            <span>{t('Celebration & Blessing Planning', 'Celebration & Blessing Planning')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {t('Baby Shower & Ceremony Planner', 'Baby Shower & Ceremony Planner')}
          </h1>
          <p className="text-sm text-gray-600">
            {t('Design your Godh Bharai, Seemantham, or modern baby shower: guest list RSVP, budget, theme, and registry.', 'Design your Godh Bharai, Seemantham, or modern baby shower: guest list RSVP, budget, theme, and registry.')}
          </p>
        </div>

        <button
          onClick={() => setIsEditingDetails(!isEditingDetails)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-muted border-2 border-blush-200 text-foreground font-bold text-xs shadow-xs transition-all self-start sm:self-auto cursor-pointer"
        >
          {isEditingDetails ? <X className="w-4 h-4 text-rose-500" /> : <Edit3 className="w-4 h-4 text-primary" />}
          <span>{isEditingDetails ? t('Cancel Editing', 'Cancel Editing') : t('Edit Event Details', 'Edit Event Details')}</span>
        </button>
      </div>

      {/* Edit Details Drawer/Form */}
      {isEditingDetails && (
        <form onSubmit={handleSaveDetails} className="bg-gradient-to-r from-cream-100 via-blush-50 to-cream-100 p-6 rounded-3xl border-2 border-primary/30 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-primary" />
              <span>Edit Date, Celebration Venue & Budget</span>
            </h3>
            <span className="text-[11px] text-muted-foreground font-medium">Changes persist to your account</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Celebration Date</label>
              <input
                type="date"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-gray-700 font-bold mb-1">Celebration Venue</label>
              <input
                type="text"
                value={editVenue}
                onChange={e => setEditVenue(e.target.value)}
                placeholder="e.g. Gulmohar Garden Courtyard & Banquet"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Total Budget ($)</label>
              <input
                type="number"
                min="0"
                value={editBudgetTotal}
                onChange={e => setEditBudgetTotal(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Budget Spent ($)</label>
              <input
                type="number"
                min="0"
                value={editBudgetSpent}
                onChange={e => setEditBudgetSpent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingDetails(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Event Details</span>
            </button>
          </div>
        </form>
      )}

      {/* Overview Cards: Date, Budget, Guests, Venue */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-3xl border border-blush-100 shadow-2xs space-y-1 relative group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {t('Event Date', 'Event Date')}
            </span>
            <button
              onClick={() => setIsEditingDetails(true)}
              className="text-[10px] text-primary hover:underline font-bold"
              title="Edit Event Date"
            >
              Edit
            </button>
          </div>
          <div className="text-lg font-black text-gray-900">{babyShower.eventDate}</div>
          <span className="text-[10px] text-blush-600 font-semibold">{t('Around Week 30', 'Around Week 30')}</span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-blush-100 shadow-2xs space-y-1 relative group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> {t('Budget Tracker', 'Budget Tracker')}
            </span>
            <button
              onClick={() => setIsEditingDetails(true)}
              className="text-[10px] text-emerald-700 hover:underline font-bold"
              title="Edit Budget"
            >
              Edit
            </button>
          </div>
          <div className="text-lg font-black text-emerald-700">${babyShower.budgetSpent} / ${babyShower.budgetTotal}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">${budgetRemaining} {t('Remaining', 'Remaining')}</span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-blush-100 shadow-2xs space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
            <Users className="w-3 h-3" /> {t('Guests Confirmed', 'Guests Confirmed')}
          </span>
          <div className="text-lg font-black text-purple-700">{attendingCount} {t('Confirmed', 'Confirmed')}</div>
          <span className="text-[10px] text-gray-500">{babyShower.guestCount} {t('Invited', 'Invited')}</span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-blush-100 shadow-2xs space-y-1 relative group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {t('Celebration Venue', 'Celebration Venue')}
            </span>
            <button
              onClick={() => setIsEditingDetails(true)}
              className="text-[10px] text-primary hover:underline font-bold"
              title="Edit Venue"
            >
              Edit
            </button>
          </div>
          <div className="text-xs font-bold text-gray-800 truncate mt-1">{babyShower.venue}</div>
          <span className="text-[10px] text-gray-400">{t('Indoor & Garden', 'Indoor & Garden')}</span>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          {t('Choose Celebration Theme & Aesthetic', 'Choose Celebration Theme & Aesthetic')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEMES.map(th => {
            const isSelected = babyShower.theme === th.id;

            return (
              <div
                key={th.id}
                onClick={() => updateBabyShowerTheme(th.id as any)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-gradient-to-br from-cream-100 to-blush-50 border-blush-400 shadow-md ring-2 ring-blush-300 ring-offset-1'
                    : 'bg-gray-50/60 border-gray-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-xs">{th.label}</span>
                  {isSelected && <span className="text-xs text-blush-600 font-bold">✓ Selected</span>}
                </div>
                <div className={`h-2 rounded-full bg-gradient-to-r ${th.color}`} />
                <p className="text-[11px] text-gray-600 leading-relaxed">{th.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invitation Card Generator & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Digital Invitation Card Preview */}
        <div className="bg-gradient-to-br from-cream-100 via-blush-100/60 to-lavender-100/60 rounded-3xl p-6 border border-blush-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="text-center space-y-2 py-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blush-700">
              You are warmly invited to
            </span>
            <h3 className="text-2xl font-serif font-bold text-gray-900">
              The Baby Shower & Godh Bharai of
            </h3>
            <div className="text-xl font-bold bg-gradient-to-r from-blush-600 to-purple-600 bg-clip-text text-transparent">
              {profile.name} & {profile.partnerProfile?.name || 'Rohan'}
            </div>
            <p className="text-xs text-gray-600 max-w-sm mx-auto pt-2">
              "A brand new life is on the way. Let us shower the expecting mother and baby with endless love, blessings, and joy."
            </p>

            <div className="pt-4 text-xs font-semibold text-gray-800 space-y-1">
              <p>📅 {babyShower.eventDate} · 4:00 PM Onwards</p>
              <p>📍 {babyShower.venue}</p>
              <p>🎨 Theme: {babyShower.theme}</p>
            </div>
          </div>

          <button
            onClick={copyInviteText}
            className="w-full py-2.5 bg-blush-600 hover:bg-blush-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            {copiedInvite ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedInvite ? 'Invitation Text Copied!' : 'Copy Digital Invitation Text'}</span>
          </button>
        </div>

        {/* Task Management */}
        <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Event Tasks & Checklists</h3>
            <span className="text-xs text-gray-500">
              {babyShower.tasks.filter(t => t.completed).length} of {babyShower.tasks.length} done
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {babyShower.tasks.map(task => (
              <div
                key={task.id}
                onClick={() => toggleShowerTask(task.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 text-xs ${
                  task.completed
                    ? 'bg-emerald-50/50 border-emerald-200 text-gray-400 line-through'
                    : 'bg-white border-gray-200 hover:border-blush-300 text-gray-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-400"
                />
                <span className="font-semibold">{task.title}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2 pt-2 border-t border-gray-100">
            <input
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="Add event task (e.g. Order sweets, hire photographer)..."
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
            <button
              type="submit"
              className="p-2 bg-blush-500 hover:bg-blush-600 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Guest List & Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guest RSVP */}
        <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Guest List & RSVPs</h3>
            <span className="text-xs text-gray-500">{babyShower.guests.length} Guests Listed</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {babyShower.guests.map(guest => (
              <div
                key={guest.id}
                className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between gap-2 text-xs"
              >
                <div>
                  <h4 className="font-bold text-gray-900">{guest.name}</h4>
                  {guest.gift && <p className="text-[10px] text-gray-500">🎁 Gift: {guest.gift}</p>}
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold">
                  {(['attending', 'declined', 'pending'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => updateGuestRsvp(guest.id, status)}
                      className={`px-2 py-0.5 rounded-md capitalize transition-all ${
                        guest.rsvp === status
                          ? status === 'attending'
                            ? 'bg-emerald-500 text-white'
                            : status === 'declined'
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-400 text-gray-900'
                          : 'bg-white border border-gray-200 text-gray-500'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddGuest} className="flex gap-2 pt-2 border-t border-gray-100">
            <input
              type="text"
              value={newGuestName}
              onChange={e => setNewGuestName(e.target.value)}
              placeholder="Invite guest name..."
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold"
            >
              Add Guest
            </button>
          </form>
        </div>

        {/* Gift Registry */}
        <div className="bg-white rounded-3xl p-6 border border-blush-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Gift className="w-4 h-4 text-rose-500" />
              Gift Registry
            </h3>
            <span className="text-xs text-rose-600 font-bold">Curated Wishlist</span>
          </div>

          <div className="space-y-2.5">
            {babyShower.registryItems.map(item => (
              <div
                key={item.id}
                className="p-3 bg-cream-50/60 rounded-xl border border-cream-200 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <span className="text-[10px] text-gray-500">
                    {item.claimedBy ? `Claimed by ${item.claimedBy} 🎁` : 'Available to gift'}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  item.claimedBy ? 'bg-emerald-100 text-emerald-800' : 'bg-blush-100 text-blush-800'
                }`}>
                  {item.claimedBy ? 'Claimed' : 'Open'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
