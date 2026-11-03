/**
 * YouTube Clone - Sidebar Component
 * Supports both full collapsible navigation drawer and collapsed mini icon bar.
 */

import {
  Home,
  Shorts,
  Subscriptions,
  Library,
  History,
  Like,
  Flame,
  Compass,
  ChevronDown,
  ChevronUp,
  User,
  Menu,
  Logo
} from './Icons.js';
import { CHANNELS } from '../data/videos.js';

// Resolve from imports or fallback to window.YT
const YT_SIDEBAR = (typeof window !== 'undefined' && window.YT) || {};
const SafeCHANNELS = (typeof CHANNELS !== 'undefined' && CHANNELS) || YT_SIDEBAR.CHANNELS || [];

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);
const { useState } = React || {};

export function Sidebar({
  isOpen = true,
  currentView = 'home',
  onSelectView,
  subscriptions = []
}) {
  const [showAllSubs, setShowAllSubs] = useState(false);

  // Normalise subscriptions list whether passed as channel objects or IDs
  const resolvedSubscriptions = React.useMemo(() => {
    if (!Array.isArray(subscriptions)) return [];
    return subscriptions
      .map((sub) => {
        if (typeof sub === 'string') {
          return SafeCHANNELS.find((c) => c.id === sub) || { id: sub, name: `Channel ${sub}`, avatarUrl: '' };
        }
        return sub;
      })
      .filter(Boolean);
  }, [subscriptions]);


  const displayedSubs = showAllSubs
    ? resolvedSubscriptions
    : resolvedSubscriptions.slice(0, 7);

  const handleItemClick = (viewKey, payload = null) => {
    if (onSelectView) {
      onSelectView(viewKey, payload);
    }
  };

  // -------------------------------------------------------------
  // Collapsed Mini Sidebar (when isOpen is false on desktop)
  // -------------------------------------------------------------
  if (!isOpen) {
    const miniNavItems = [
      { key: 'home', label: 'Home', Icon: Home },
      { key: 'shorts', label: 'Shorts', Icon: Shorts },
      { key: 'subscriptions', label: 'Subscriptions', Icon: Subscriptions },
      { key: 'library', label: 'You', Icon: Library }
    ];

    return (
      <aside
        className="hidden sm:flex flex-col items-center w-[72px] shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] py-2 select-none z-30 transition-all duration-200"
        aria-label="Compact navigation"
      >
        <div className="w-full flex flex-col items-center space-y-1">
          {miniNavItems.map(({ key, label, Icon }) => {
            const isActive = currentView === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleItemClick(key)}
                className={`w-[64px] h-[74px] rounded-xl flex flex-col items-center justify-center space-y-1.5 transition-colors ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title={label}
              >
                <Icon className="w-6 h-6" active={isActive} />
                <span className="text-[10px] leading-tight text-center truncate px-0.5 max-w-[60px]">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  // -------------------------------------------------------------
  // Full Expanded Sidebar Drawer (when isOpen is true)
  // -------------------------------------------------------------
  return (
    <aside
      className="w-60 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-3 py-3 select-none z-30 space-y-3 text-sm transition-all duration-200"
      aria-label="Full navigation"
    >
      {/* SECTION 1: Core Navigation */}
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => handleItemClick('home')}
          className={`w-full flex items-center space-x-6 px-3 py-2.5 rounded-xl transition-colors text-left ${
            currentView === 'home'
              ? 'bg-neutral-100 dark:bg-[#272727] text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#272727] hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 shrink-0" active={currentView === 'home'} />
          <span className="truncate">Home</span>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('shorts')}
          className={`w-full flex items-center space-x-6 px-3 py-2.5 rounded-xl transition-colors text-left ${
            currentView === 'shorts'
              ? 'bg-neutral-100 dark:bg-[#272727] text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#272727] hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Shorts className="w-5 h-5 shrink-0" active={currentView === 'shorts'} />
          <span className="truncate">Shorts</span>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('subscriptions')}
          className={`w-full flex items-center space-x-6 px-3 py-2.5 rounded-xl transition-colors text-left ${
            currentView === 'subscriptions'
              ? 'bg-neutral-100 dark:bg-[#272727] text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#272727] hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Subscriptions className="w-5 h-5 shrink-0" active={currentView === 'subscriptions'} />
          <span className="truncate">Subscriptions</span>
        </button>
      </div>

      <div className="border-t border-neutral-200 dark:border-[#3F3F3F]/60 my-2" />

      {/* SECTION 2: You / Library & History */}
      <div className="space-y-0.5">
        <button
          type="button"
          onClick={() => handleItemClick('library')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-[#272727] font-semibold text-base transition-colors"
        >
          <span>You</span>
          <span className="text-sm font-bold text-neutral-400">›</span>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('history')}
          className={`w-full flex items-center space-x-6 px-3 py-2.5 rounded-xl transition-colors text-left ${
            currentView === 'history'
              ? 'bg-neutral-100 dark:bg-[#272727] text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#272727] hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <History className="w-5 h-5 shrink-0" />
          <span className="truncate">History</span>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('liked')}
          className={`w-full flex items-center space-x-6 px-3 py-2.5 rounded-xl transition-colors text-left ${
            currentView === 'liked'
              ? 'bg-neutral-100 dark:bg-[#272727] text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#272727] hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Like className="w-5 h-5 shrink-0" active={currentView === 'liked'} />
          <span className="truncate">Liked videos</span>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('library')}
          className={`w-full flex items-center space-x-6 px-3 py-2.5 rounded-xl transition-colors text-left ${
            currentView === 'library'
              ? 'bg-neutral-100 dark:bg-[#272727] text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#272727] hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Library className="w-5 h-5 shrink-0" active={currentView === 'library'} />
          <span className="truncate">Library</span>
        </button>
      </div>

      <div className="border-t border-neutral-200 dark:border-[#3F3F3F]/60 my-2" />

      {/* SECTION 3: Subscribed Channels List */}
      <div className="space-y-1">
        <h3 className="px-3 py-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Subscriptions
        </h3>

        {displayedSubs.length === 0 ? (
          <p className="px-3 text-xs text-neutral-400 py-1">
            No subscribed channels yet.
          </p>
        ) : (
          displayedSubs.map((channel) => {
            const isSelected = currentView === `channel:${channel.id}` || currentView === channel.id;
            const isLive = channel.id === 'c3'; // Lofi Girl 24/7 stream indicator

            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => handleItemClick('channel', channel)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors text-left ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-[#272727] text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#272727] hover:text-neutral-900 dark:hover:text-white'
                }`}
                title={channel.name}
              >
                <div className="flex items-center space-x-4 min-w-0">
                  {channel.avatarUrl ? (
                    <img
                      src={channel.avatarUrl}
                      alt={channel.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                      {channel.name ? channel.name[0] : 'C'}
                    </div>
                  )}
                  <span className="truncate text-sm">{channel.name}</span>
                </div>

                {isLive ? (
                  <span className="shrink-0 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-[10px] text-red-500 font-bold uppercase">Live</span>
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                )}
              </button>
            );
          })
        )}

        {resolvedSubscriptions.length > 7 && (
          <button
            type="button"
            onClick={() => setShowAllSubs(!showAllSubs)}
            className="w-full flex items-center space-x-6 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#272727] transition-colors"
          >
            {showAllSubs ? (
              <>
                <ChevronUp className="w-5 h-5 shrink-0" />
                <span>Show fewer</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5 shrink-0" />
                <span>Show {resolvedSubscriptions.length - 7} more</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="border-t border-neutral-200 dark:border-[#3F3F3F]/60 my-2" />

      {/* SECTION 4: Explore Topics */}
      <div className="space-y-0.5">
        <h3 className="px-3 py-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Explore
        </h3>

        <button
          type="button"
          onClick={() => handleItemClick('explore', 'trending')}
          className={`w-full flex items-center space-x-6 px-3 py-2.5 rounded-xl transition-colors text-left ${
            currentView === 'explore:trending'
              ? 'bg-neutral-100 dark:bg-[#272727] text-neutral-900 dark:text-white font-semibold'
              : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#272727] hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Flame className="w-5 h-5 shrink-0 text-amber-500" />
          <span className="truncate">Trending</span>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('explore', 'music')}
          className="w-full flex items-center space-x-6 px-3 py-2.5 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#272727] hover:text-neutral-900 dark:hover:text-white transition-colors text-left"
        >
          <Compass className="w-5 h-5 shrink-0" />
          <span className="truncate">Music</span>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('explore', 'gaming')}
          className="w-full flex items-center space-x-6 px-3 py-2.5 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#272727] hover:text-neutral-900 dark:hover:text-white transition-colors text-left"
        >
          <Compass className="w-5 h-5 shrink-0" />
          <span className="truncate">Gaming</span>
        </button>

        <button
          type="button"
          onClick={() => handleItemClick('explore', 'news')}
          className="w-full flex items-center space-x-6 px-3 py-2.5 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-[#272727] hover:text-neutral-900 dark:hover:text-white transition-colors text-left"
        >
          <Compass className="w-5 h-5 shrink-0" />
          <span className="truncate">News</span>
        </button>
      </div>

      <div className="border-t border-neutral-200 dark:border-[#3F3F3F]/60 my-2" />

      {/* SECTION 5: Footer & Copyright */}
      <div className="px-3 py-2 text-[11px] text-neutral-500 leading-relaxed space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#about" className="hover:text-neutral-400">About</a>
          <a href="#press" className="hover:text-neutral-400">Press</a>
          <a href="#copyright" className="hover:text-neutral-400">Copyright</a>
          <a href="#contact" className="hover:text-neutral-400">Contact us</a>
          <a href="#creators" className="hover:text-neutral-400">Creators</a>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#terms" className="hover:text-neutral-400">Terms</a>
          <a href="#privacy" className="hover:text-neutral-400">Privacy</a>
          <a href="#policy" className="hover:text-neutral-400">Policy & Safety</a>
        </div>
        <p className="pt-2 text-neutral-600">
          © 2026 YouTube Clone LLC
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;

// Dual-compatibility: attach exports to global YT namespace
if (typeof window !== 'undefined') {
  window.YT = window.YT || {};
  window.YT.Sidebar = Sidebar;
}

