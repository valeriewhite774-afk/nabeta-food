import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Search, 
  Filter, 
  ArrowLeft, 
  CheckCircle2, 
  MessageSquare,
  Plus,
  ThumbsUp
} from 'lucide-react';
import { MenuItem, Review } from '../types';

interface GourmetReviewsProps {
  darkMode: boolean;
  onBack: () => void;
  menuItems: MenuItem[];
  activeReviewFilter: string;
  setActiveReviewFilter: (filter: string) => void;
  onAddReview: (menuItemId: string, review: Review) => void;
}

export const GourmetReviews: React.FC<GourmetReviewsProps> = ({
  darkMode,
  onBack,
  menuItems,
  activeReviewFilter,
  setActiveReviewFilter,
  onAddReview,
}) => {
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formText, setFormText] = useState('');
  const [formStars, setFormStars] = useState(5);
  const [formHoverStars, setFormHoverStars] = useState<number | null>(null);
  const [formItemId, setFormItemId] = useState(menuItems[0]?.id || '');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Search & Rating Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  // Likes simulation state
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Compile all reviews from the active list of products
  const allReviewsWithItem = useMemo(() => {
    const list: { review: Review; item: MenuItem }[] = [];
    menuItems.forEach(item => {
      // Ensure reviews exists and map over them
      const revs = item.reviews || [item.review];
      revs.forEach(rev => {
        list.push({ review: rev, item });
      });
    });
    return list;
  }, [menuItems]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalStars = 0;
    let count = 0;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    allReviewsWithItem.forEach(({ review }) => {
      totalStars += review.stars;
      count++;
      const rounded = Math.min(5, Math.max(1, Math.round(review.stars))) as 5 | 4 | 3 | 2 | 1;
      distribution[rounded]++;
    });

    const average = count > 0 ? (totalStars / count).toFixed(1) : '5.0';

    return {
      average,
      count,
      distribution,
    };
  }, [allReviewsWithItem]);

  // Filter list of reviews
  const filteredReviews = useMemo(() => {
    return allReviewsWithItem.filter(({ review, item }) => {
      // 1. Soup/Item filter
      if (activeReviewFilter !== 'all' && item.id !== activeReviewFilter) {
        return false;
      }
      // 2. Rating filter
      if (ratingFilter !== 'all' && review.stars !== ratingFilter) {
        return false;
      }
      // 3. Search query (matches text, author name, or location)
      if (searchQuery.trim() !== '') {
        const text = review.text.toLowerCase();
        const author = review.author.toLowerCase();
        const loc = review.location.toLowerCase();
        const query = searchQuery.toLowerCase();
        if (!text.includes(query) && !author.includes(query) && !loc.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [allReviewsWithItem, activeReviewFilter, ratingFilter, searchQuery]);

  // Handle new review submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formText.trim()) {
      setFormError('Please fill in your name and review details.');
      return;
    }
    setFormError('');

    const newReview: Review = {
      stars: formStars,
      text: `"${formText.replace(/^"|"$/g, '')}"`, // wrap nicely in quotes if not already
      author: formName.trim(),
      location: formLocation.trim() || 'Verified Customer',
    };

    onAddReview(formItemId, newReview);

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsFormOpen(false);
      // Reset form states
      setFormName('');
      setFormLocation('');
      setFormText('');
      setFormStars(5);
    }, 1800);
  };

  const toggleLike = (reviewText: string, author: string) => {
    const key = `${author}-${reviewText}`;
    setLikedReviews(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className={`p-4 flex flex-col min-h-full font-sans ${
      darkMode ? 'bg-[#0F1110] text-gray-100' : 'bg-gray-50 text-neutral-900'
    }`}>
      
      {/* Dynamic Back Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800/10 mb-4">
        <button 
          onClick={onBack}
          className={`flex items-center space-x-1.5 text-xs font-semibold px-2 py-1.5 rounded-full transition-all ${
            darkMode ? 'hover:bg-neutral-800 text-gray-300' : 'hover:bg-gray-100 text-[#40685D]'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>
        <span className="text-[10px] bg-[#40685D]/10 text-[#40685D] px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wider uppercase">
          Verified Reviews
        </span>
      </div>

      {/* Header Banner */}
      <div className="mb-4">
        <h2 className="font-serif font-bold text-2xl tracking-tight mb-1 text-neutral-900 dark:text-white">
          Customer Voice
        </h2>
        <p className="text-gray-500 text-xs font-sans leading-snug">
          100% certified dining reviews from real Deltans enjoying NabetaFood.
        </p>
      </div>

      {/* Stats Summary Bento Block */}
      <div className={`p-4 rounded-3xl border mb-5 flex flex-col md:flex-row gap-4 items-center justify-between ${
        darkMode ? 'bg-[#151716] border-gray-800' : 'bg-white border-gray-200'
      } shadow-premium-soft`}>
        {/* Large average score badge */}
        <div className="flex flex-col items-center justify-center p-2 text-center md:border-r border-gray-800/10 md:pr-6 whitespace-nowrap">
          <span className="text-4xl font-serif font-black text-[#40685D] dark:text-[#5fa290]">
            {stats.average}
          </span>
          <span className="text-[10px] text-gray-500 font-sans tracking-wider uppercase mt-1">out of 5 stars</span>
          <div className="flex text-amber-500 mt-1 scale-95">
            {Array.from({ length: 5 }).map((_, i) => {
              const fill = i < Math.round(Number(stats.average));
              return <Star key={i} className={`w-3.5 h-3.5 ${fill ? 'fill-current' : 'text-gray-400'}`} />;
            })}
          </div>
          <span className="text-[11px] text-gray-400 mt-1.5">
            {stats.count} reviews overall
          </span>
        </div>

        {/* Dynamic bar charts */}
        <div className="flex-1 w-full flex flex-col space-y-1.5">
          {([5, 4, 3, 2, 1] as const).map((stars) => {
            const count = stats.distribution[stars];
            const pct = stats.count > 0 ? (count / stats.count) * 100 : 0;
            return (
              <div key={stars} className="flex items-center text-xs font-sans">
                <span className="w-12 text-gray-500 font-semibold">{stars} Star</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-zinc-800 rounded-full mx-2 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-400 text-[10px] font-mono">
                  {Math.round(pct)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls Suite */}
      <div className="flex flex-col space-y-2.5 mb-5">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, authors, communities..."
            className={`w-full py-2.5 pl-10 pr-4 text-xs font-sans rounded-2xl outline-none transition-all border ${
              darkMode 
                ? 'bg-[#151716] border-gray-800 text-white placeholder-gray-500 focus:border-[#40685D]' 
                : 'bg-white border-gray-200 text-neutral-900 placeholder-gray-400 focus:border-[#40685D]'
            }`}
          />
        </div>

        {/* Dynamic Filter Row */}
        <div className="flex space-x-2">
          {/* Soup Product Filter */}
          <div className="flex-1 relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#40685D]" />
            <select
              value={activeReviewFilter}
              onChange={(e) => setActiveReviewFilter(e.target.value)}
              className={`w-full py-2 pl-7 pr-4 text-xs font-sans rounded-xl border outline-none appearance-none font-medium ${
                darkMode
                  ? 'bg-[#151716] border-gray-800 text-gray-200'
                  : 'bg-white border-gray-200 text-neutral-800'
              }`}
            >
              <option value="all">🍛 All Soups</option>
              {menuItems.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          {/* Stars filter option */}
          <div className="w-[35%]">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className={`w-full py-2 px-2.5 text-xs font-sans rounded-xl border outline-none appearance-none font-medium ${
                darkMode
                  ? 'bg-[#151716] border-gray-800 text-gray-200'
                  : 'bg-white border-gray-200 text-neutral-800'
              }`}
            >
              <option value="all">⭐ Star Level</option>
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Action: Write a review banner */}
      {!isFormOpen && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="mb-5 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#40685D] to-[#4e7d70] text-white flex items-center justify-between text-xs font-bold shadow-md hover:opacity-95 transition-all select-none"
        >
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-emerald-300" />
            <div className="text-left">
              <p>Loved our fresh swallows?</p>
              <p className="text-[10px] font-normal text-emerald-100">Click to write and submit your own dining review</p>
            </div>
          </div>
          <Plus className="w-4 h-4 bg-white/20 p-0.5 rounded-full" />
        </button>
      )}

      {/* Multi-step review submission form inside a clean overlay layout */}
      {isFormOpen && (
        <div className={`p-4 rounded-3xl border mb-5 animate-fade-in ${
          darkMode ? 'bg-[#161a18] border-emerald-900/40' : 'bg-emerald-50/40 border-emerald-200'
        }`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-serif font-bold text-sm text-[#40685D] dark:text-emerald-400">
              Submit Your Dining Review
            </h3>
            <button
              onClick={() => { setIsFormOpen(false); setFormError(''); }}
              className="text-xs text-gray-500 hover:text-black font-semibold dark:hover:text-white"
            >
              Cancel
            </button>
          </div>

          {formSuccess ? (
            <div className="p-4 text-center flex flex-col items-center justify-center space-y-2 py-8 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-lg">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="font-serif text-sm font-bold text-[#40685D] dark:text-emerald-400">Review Published!</span>
              <p className="text-[11px] text-gray-400 leading-snug">
                Your dining review has been added to our live feed. Thank you!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Star selector */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  How many stars?
                </label>
                <div className="flex space-x-1.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starsIndex = i + 1;
                    const isFlipped = formHoverStars !== null ? starsIndex <= formHoverStars : starsIndex <= formStars;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormStars(starsIndex)}
                        onMouseEnter={() => setFormHoverStars(starsIndex)}
                        onMouseLeave={() => setFormHoverStars(null)}
                        className={`p-1 rounded-md transition-transform active:scale-95 ${
                          isFlipped ? 'text-amber-500' : 'text-gray-400 dark:text-zinc-700'
                        }`}
                      >
                        <Star className={`w-6 h-6 ${isFlipped ? 'fill-current' : ''}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Soup product selection */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Which Soup did you order?
                </label>
                <select
                  value={formItemId}
                  onChange={(e) => setFormItemId(e.target.value)}
                  className={`w-full p-2 text-xs rounded-xl border outline-none font-sans ${
                    darkMode
                      ? 'bg-[#1F2321] border-gray-800 text-white'
                      : 'bg-white border-gray-200 text-neutral-900'
                  }`}
                >
                  {menuItems.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Oghenetega"
                    className={`w-full p-2 text-xs rounded-xl border outline-none font-sans ${
                      darkMode
                        ? 'bg-[#1F2321] border-gray-800 text-white'
                        : 'bg-white border-gray-200 text-neutral-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Location / Community
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Airport Road, Warri"
                    className={`w-full p-2 text-xs rounded-xl border outline-none font-sans ${
                      darkMode
                        ? 'bg-[#1F2321] border-gray-800 text-white'
                        : 'bg-white border-gray-200 text-neutral-900'
                    }`}
                  />
                </div>
              </div>

              {/* Review content */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Your dining review
                </label>
                <textarea
                  required
                  rows={2}
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Tell us about the rich flavor of palm oil, the quantity of periwinkles or the smooth swallow..."
                  className={`w-full p-2 text-xs rounded-xl border outline-none font-sans resize-none ${
                    darkMode
                      ? 'bg-[#1F2321] border-gray-800 text-white'
                      : 'bg-white border-gray-200 text-neutral-900'
                  }`}
                />
              </div>

              {formError && (
                <p className="text-[10px] font-semibold text-red-500 font-sans">{formError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#40685D] text-white text-xs font-bold shadow hover:bg-emerald-800 transition-all"
              >
                Publish Dining Review
              </button>
            </form>
          )}
        </div>
      )}

      {/* Feed list */}
      <div className="flex-1 flex flex-col space-y-3.5">
        <div className="flex items-center justify-between text-xs text-gray-500 px-1 font-sans">
          <span>Found {filteredReviews.length} matching reviews</span>
          {activeReviewFilter !== 'all' && (
            <button 
              onClick={() => setActiveReviewFilter('all')}
              className="text-[#40685D] font-bold"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredReviews.length === 0 ? (
          <div className={`p-8 text-center rounded-3xl border whitespace-pre-wrap ${
            darkMode ? 'bg-[#151716] border-zinc-900 text-zinc-500' : 'bg-white border-zinc-100 text-zinc-400'
          }`}>
            <p className="text-xs leading-relaxed">
              No matching dining reviews found for your current filter/search. 
              Be the first to submit a review for this soup!
            </p>
          </div>
        ) : (
          filteredReviews.map(({ review, item }, idx) => {
            const initial = review.author ? review.author.split(' ').map(n => n[0]).join('') : 'U';
            const likeKey = `${review.author}-${review.text}`;
            const isLiked = likedReviews[likeKey];

            return (
              <div 
                key={idx} 
                className={`p-4 rounded-3xl border transition-all animate-fade-in ${
                  darkMode ? 'bg-[#151716] border-gray-800/80 hover:border-gray-700' : 'bg-white border-gray-200/80 hover:border-gray-300'
                } shadow-premium-soft`}
              >
                {/* Product Tag */}
                <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-[#40685D] uppercase tracking-wider mb-2 bg-[#D6E6DB] px-2.5 py-0.5 rounded-full">
                  <span>🍛 {item.name}</span>
                </span>

                {/* Stars and indicator */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-500 scale-90 -translate-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.stars ? 'fill-current' : 'text-gray-300 dark:text-zinc-700'}`} />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] font-sans font-bold text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Purchase</span>
                  </div>
                </div>

                {/* Quote details */}
                <p className={`text-xs italic leading-relaxed font-serif ${
                  darkMode ? 'text-gray-200' : 'text-neutral-900'
                }`}>
                  {review.text}
                </p>

                {/* Review footer author + date */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#D6E6DB] text-[#40685D] text-[10px] font-sans font-black flex items-center justify-center">
                      {initial}
                    </div>
                    <div>
                      <span className={`text-[11px] font-bold font-sans block leading-tight ${
                        darkMode ? 'text-white' : 'text-neutral-900'
                      }`}>{review.author}</span>
                      <span className="text-[9px] text-gray-500 font-sans block mt-0.5">{review.location}</span>
                    </div>
                  </div>

                  {/* Likes count & helpful tag */}
                  <button 
                    onClick={() => toggleLike(review.text, review.author)}
                    className={`flex items-center space-x-1.5 text-[10.5px] font-semibold px-2 py-1 rounded-full border transition-all ${
                      isLiked 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800' 
                        : 'border-transparent text-gray-400 hover:text-[#40685D]'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3 stroke-[2.5]" />
                    <span>{isLiked ? 'Helpful (1)' : 'Helpful'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
