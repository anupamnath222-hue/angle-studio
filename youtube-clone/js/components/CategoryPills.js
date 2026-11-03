/**
 * YouTube Clone - CategoryPills Component
 * Horizontal scrollable category filter chips with active state styling and scroll controls.
 */

import { CATEGORIES } from '../data/videos.js';

// Resolve from imports or fallback to window.YT
const { CATEGORIES: STORED_CATEGORIES } = (typeof window !== 'undefined' && window.YT) || {};
const RESOLVED_CATEGORIES = (typeof CATEGORIES !== 'undefined' && CATEGORIES) || STORED_CATEGORIES || [];

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);
const { useState, useRef, useEffect, useCallback } = React || {};

/**
 * Category filter pills component.
 *
 * @param {Object} props
 * @param {string[]} [props.categories] - Array of category labels.
 * @param {string} [props.selectedCategory='All'] - Currently active category.
 * @param {function} [props.onSelectCategory] - Callback when a category pill is clicked.
 */
export function CategoryPills({
  categories = RESOLVED_CATEGORIES,
  selectedCategory = 'All',
  onSelectCategory
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll boundary visibility for scroll buttons
  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    // Allow small epsilon for subpixel rounding
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons, categories]);

  const handleScroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -220 : 220;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const pillList = Array.isArray(categories) && categories.length > 0 ? categories : RESOLVED_CATEGORIES;

  return (
    <nav
      aria-label="Category Filters"
      className="sticky top-14 z-20 w-full bg-white/95 dark:bg-[#0F0F0F]/95 backdrop-blur-md px-4 py-3 border-b border-transparent transition-colors select-none"
    >
      <div className="relative flex items-center w-full">
        {/* Left Scroll Button with Gradient Mask */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-4 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-[#0F0F0F] dark:via-[#0F0F0F]/90 dark:to-transparent">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 dark:bg-[#222222] hover:bg-neutral-200 dark:hover:bg-[#3F3F3F] text-neutral-800 dark:text-white shadow-md transition-all active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
          </div>
        )}

        {/* Horizontal Scrollable Pills Container */}
        <div
          ref={scrollContainerRef}
          role="tablist"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          className="flex items-center gap-3 overflow-x-auto scroll-smooth w-full [&::-webkit-scrollbar]:hidden"
        >
          {pillList.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory && onSelectCategory(category)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer flex-shrink-0 ${
                  isSelected
                    ? 'bg-white text-black font-semibold hover:bg-neutral-200 shadow-sm'
                    : 'bg-neutral-100 dark:bg-[#272727] text-neutral-900 dark:text-[#F1F1F1] hover:bg-neutral-200 dark:hover:bg-[#3F3F3F]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button with Gradient Mask */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-4 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-[#0F0F0F] dark:via-[#0F0F0F]/90 dark:to-transparent">
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 dark:bg-[#222222] hover:bg-neutral-200 dark:hover:bg-[#3F3F3F] text-neutral-800 dark:text-white shadow-md transition-all active:scale-95"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default CategoryPills;

// Dual-compatibility: attach exports to global YT namespace
if (typeof window !== 'undefined') {
  window.YT = window.YT || {};
  window.YT.CategoryPills = CategoryPills;
}

