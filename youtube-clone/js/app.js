/**
 * YouTube Clone - Root Application Component & View Router
 * Assembles Header, Sidebar, VideoGrid, WatchPage, SearchResults, ChannelPage,
 * integrates with state store, handles URL hash routing, keyboard shortcuts,
 * and manages dark/light theme switching.
 */

import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { CategoryPills } from './components/CategoryPills.js';
import { VideoGrid } from './components/VideoGrid.js';
import { WatchPage } from './components/WatchPage.js';
import { SearchResults } from './components/SearchResults.js';
import { ChannelPage } from './components/ChannelPage.js';
import {
  History as HistoryIcon,
  Like as LikeIcon,
  Subscriptions as SubscriptionsIcon,
  Play as PlayIcon
} from './components/Icons.js';
import { VIDEOS, CHANNELS, CATEGORIES } from './data/videos.js';
import {
  getStoredState,
  saveState,
  toggleLike,
  toggleDislike,
  toggleSubscribe,
  addComment,
  toggleCommentLike,
  toggleCommentDislike,
  addToHistory,
  clearHistory,
  toggleTheme,
  setTheme
} from './store/state.js';

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);
const ReactDOM = window.ReactDOM || (typeof globalThis !== 'undefined' ? globalThis.ReactDOM : null);
const { useState, useEffect, useCallback, useMemo, useRef } = React || {};

/**
 * Parses URL hash into view routing state
 * Supported formats:
 * - '#', '', '#home' -> view: 'home'
 * - '#watch?v=videoId' -> view: 'watch', videoId
 * - '#channel?c=channelId' -> view: 'channel', channelId
 * - '#search?q=queryText' -> view: 'search', query
 * - '#history' -> view: 'history'
 * - '#liked' -> view: 'liked'
 * - '#subscriptions' -> view: 'subscriptions'
 * - '#shorts' -> view: 'shorts'
 * - '#library' -> view: 'library'
 */
export function parseHash(hashStr) {
  const raw = (hashStr || '').replace(/^#\/?/, '').trim();
  if (!raw || raw === 'home') {
    return { view: 'home' };
  }

  const [path, queryString] = raw.split('?');
  const params = new URLSearchParams(queryString || '');

  switch (path) {
    case 'watch':
      return {
        view: 'watch',
        videoId: params.get('v') || ''
      };
    case 'channel':
      return {
        view: 'channel',
        channelId: params.get('c') || ''
      };
    case 'search':
      return {
        view: 'search',
        query: params.get('q') || ''
      };
    case 'history':
      return { view: 'history' };
    case 'liked':
      return { view: 'liked' };
    case 'subscriptions':
      return { view: 'subscriptions' };
    case 'shorts':
      return { view: 'shorts' };
    case 'library':
      return { view: 'library' };
    default:
      return { view: 'home' };
  }
}

/**
 * Builds hash string from view and parameters
 */
export function buildHash(view, params = {}) {
  switch (view) {
    case 'watch':
      return `#watch?v=${params.videoId || params.id || ''}`;
    case 'channel':
      return `#channel?c=${params.channelId || params.id || ''}`;
    case 'search':
      return `#search?q=${encodeURIComponent(params.query || '')}`;
    case 'history':
      return '#history';
    case 'liked':
      return '#liked';
    case 'subscriptions':
      return '#subscriptions';
    case 'shorts':
      return '#shorts';
    case 'library':
      return '#library';
    case 'home':
    default:
      return '#home';
  }
}

/**
 * Root App Component
 */
export function App() {
  // Store state reactivity
  const [storeState, setStoreState] = useState(() => getStoredState());

  // Routing State
  const [currentView, setCurrentView] = useState('home');
  const [selectedVideoId, setSelectedVideoId] = useState(() => VIDEOS[0]?.id || 'v1');
  const [selectedChannelId, setSelectedChannelId] = useState(() => CHANNELS[0]?.id || 'c1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const mainContentRef = useRef(null);

  const theme = storeState?.theme || 'dark';
  const isDark = theme === 'dark';

  // --------------------------------------------------------------------------
  // Theme Synchronization with document DOM
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('bg-white', 'text-[#0F0F0F]', 'bg-yt-light-bg', 'text-yt-light-text');
      document.body.classList.add('bg-[#0F0F0F]', 'text-[#F1F1F1]', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-[#0F0F0F]', 'text-[#F1F1F1]', 'dark');
      document.body.classList.add('bg-white', 'text-[#0F0F0F]');
    }
  }, [isDark]);

  // --------------------------------------------------------------------------
  // Central Navigation Dispatcher
  // --------------------------------------------------------------------------
  const navigateTo = useCallback((view, params = {}) => {
    const newHash = buildHash(view, params);

    // Apply view parameters immediately to local state for instant feedback
    setCurrentView(view);
    if (view === 'watch') {
      const vId = params.videoId || params.id;
      if (vId) {
        setSelectedVideoId(vId);
        const updated = addToHistory(vId);
        setStoreState(updated);
      }
      setIsSidebarOpen(false); // YouTube collapses sidebar on watch page
    } else if (view === 'channel') {
      const cId = params.channelId || params.id;
      if (cId) setSelectedChannelId(cId);
    } else if (view === 'search') {
      if (params.query !== undefined) setSearchQuery(params.query);
    } else if (view === 'home') {
      if (params.category) setSelectedCategory(params.category);
    }

    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }

    // Scroll to top on navigation
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // --------------------------------------------------------------------------
  // Hash Routing Listener (for Forward/Back navigation and initial load)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseHash(window.location.hash);
      setCurrentView(route.view);

      if (route.view === 'watch' && route.videoId) {
        setSelectedVideoId(route.videoId);
        const updated = addToHistory(route.videoId);
        setStoreState(updated);
        setIsSidebarOpen(false);
      } else if (route.view === 'channel' && route.channelId) {
        setSelectedChannelId(route.channelId);
      } else if (route.view === 'search' && route.query !== undefined) {
        setSearchQuery(route.query);
      }

      if (mainContentRef.current) {
        mainContentRef.current.scrollTop = 0;
      }
    };

    // Parse initial route on page mount
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // --------------------------------------------------------------------------
  // Global Keyboard Shortcuts
  // - '/' focuses search input
  // - 'Escape' blurs active input or clears search
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isEditing = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.isContentEditable
      );

      // Focus search shortcut: '/'
      if (e.key === '/' && !isEditing) {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search"]');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Escape shortcut: blur or clear
      if (e.key === 'Escape') {
        if (isEditing) {
          activeEl.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --------------------------------------------------------------------------
  // Store Action Callbacks
  // --------------------------------------------------------------------------
  const handleToggleLike = useCallback((videoId) => {
    const updated = toggleLike(videoId);
    setStoreState(updated);
  }, []);

  const handleToggleDislike = useCallback((videoId) => {
    const updated = toggleDislike(videoId);
    setStoreState(updated);
  }, []);

  const handleToggleSubscribe = useCallback((channelId) => {
    const updated = toggleSubscribe(channelId);
    setStoreState(updated);
  }, []);

  const handleAddComment = useCallback((videoId, text) => {
    const updated = addComment(videoId, text);
    setStoreState(updated);
  }, []);

  const handleToggleCommentLike = useCallback((videoId, commentId) => {
    const updated = toggleCommentLike(videoId, commentId);
    setStoreState(updated);
  }, []);

  const handleToggleCommentDislike = useCallback((videoId, commentId) => {
    const updated = toggleCommentDislike(videoId, commentId);
    setStoreState(updated);
  }, []);

  const handleClearHistory = useCallback(() => {
    const updated = clearHistory();
    setStoreState(updated);
  }, []);

  const handleToggleTheme = useCallback(() => {
    const updated = toggleTheme();
    setStoreState(updated);
  }, []);

  // --------------------------------------------------------------------------
  // View Interaction Handlers
  // --------------------------------------------------------------------------
  const handleSelectVideo = useCallback((video) => {
    const vId = typeof video === 'string' ? video : (video && video.id ? video.id : 'v1');
    navigateTo('watch', { videoId: vId });
  }, [navigateTo]);

  const handleSelectChannel = useCallback((channel) => {
    const cId = typeof channel === 'string'
      ? channel
      : (channel && channel.id ? channel.id : (channel && channel.channelId ? channel.channelId : 'c1'));
    navigateTo('channel', { channelId: cId });
  }, [navigateTo]);

  const handleSearch = useCallback((query) => {
    if (query && query.trim()) {
      navigateTo('search', { query: query.trim() });
    } else {
      navigateTo('home');
    }
  }, [navigateTo]);

  const handleLogoClick = useCallback(() => {
    setSelectedCategory('All');
    setSearchQuery('');
    navigateTo('home');
  }, [navigateTo]);

  const handleMenuToggle = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleSelectSidebarView = useCallback((viewKey, payload = null) => {
    if (viewKey === 'channel' && payload) {
      handleSelectChannel(payload);
    } else if (viewKey === 'explore' && payload) {
      const match = CATEGORIES.find((c) => c.toLowerCase() === String(payload).toLowerCase());
      setSelectedCategory(match || 'All');
      navigateTo('home', { category: match || 'All' });
    } else if (viewKey === 'watch' && payload) {
      handleSelectVideo(payload);
    } else {
      if (viewKey === 'home') {
        setSelectedCategory('All');
      }
      navigateTo(viewKey);
    }
  }, [handleSelectChannel, handleSelectVideo, navigateTo]);

  // --------------------------------------------------------------------------
  // Memoized Data Resolution for Views
  // --------------------------------------------------------------------------
  const filteredHomeVideos = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'All') {
      return VIDEOS;
    }
    return VIDEOS.filter(
      (v) => (v.category || '').toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory]);

  const currentWatchVideo = useMemo(() => {
    return VIDEOS.find((v) => v.id === selectedVideoId) || VIDEOS[0];
  }, [selectedVideoId]);

  const currentWatchChannel = useMemo(() => {
    if (!currentWatchVideo) return CHANNELS[0];
    return CHANNELS.find((c) => c.id === currentWatchVideo.channelId) || CHANNELS[0];
  }, [currentWatchVideo]);

  const relatedWatchVideos = useMemo(() => {
    if (!currentWatchVideo) return VIDEOS;
    return VIDEOS.filter((v) => v.id !== currentWatchVideo.id);
  }, [currentWatchVideo]);

  const currentChannelObj = useMemo(() => {
    return CHANNELS.find((c) => c.id === selectedChannelId) || CHANNELS[0];
  }, [selectedChannelId]);

  const currentChannelVideos = useMemo(() => {
    if (!currentChannelObj) return [];
    return VIDEOS.filter((v) => v.channelId === currentChannelObj.id);
  }, [currentChannelObj]);

  const historyVideos = useMemo(() => {
    const ids = storeState?.watchHistory || [];
    return ids.map((id) => VIDEOS.find((v) => v.id === id)).filter(Boolean);
  }, [storeState?.watchHistory]);

  const likedVideos = useMemo(() => {
    const ids = storeState?.likedVideoIds || [];
    return ids.map((id) => VIDEOS.find((v) => v.id === id)).filter(Boolean);
  }, [storeState?.likedVideoIds]);

  const subscriptionVideos = useMemo(() => {
    const subIds = storeState?.subscribedChannelIds || [];
    return VIDEOS.filter((v) => subIds.includes(v.channelId));
  }, [storeState?.subscribedChannelIds]);

  // --------------------------------------------------------------------------
  // Main Content View Renderer
  // --------------------------------------------------------------------------
  const renderCurrentView = () => {
    switch (currentView) {
      case 'watch':
        return (
          <WatchPage
            video={currentWatchVideo}
            channel={currentWatchChannel}
            relatedVideos={relatedWatchVideos}
            state={storeState}
            isTheaterMode={isTheaterMode}
            onToggleTheater={() => setIsTheaterMode((prev) => !prev)}
            onToggleLike={handleToggleLike}
            onToggleDislike={handleToggleDislike}
            onToggleSubscribe={handleToggleSubscribe}
            onAddComment={handleAddComment}
            onToggleCommentLike={handleToggleCommentLike}
            onSelectVideo={handleSelectVideo}
            onSelectChannel={handleSelectChannel}
          />
        );

      case 'search':
        return (
          <div className="p-4 md:p-6 max-w-6xl mx-auto">
            <SearchResults
              query={searchQuery}
              videos={VIDEOS}
              channels={CHANNELS}
              onSelectVideo={handleSelectVideo}
              onSelectChannel={handleSelectChannel}
              subscribedChannelIds={storeState.subscribedChannelIds}
              onToggleSubscribe={handleToggleSubscribe}
            />
          </div>
        );

      case 'channel':
        return (
          <ChannelPage
            channel={currentChannelObj}
            videos={currentChannelVideos}
            onSelectVideo={handleSelectVideo}
            subscribedChannelIds={storeState.subscribedChannelIds}
            onToggleSubscribe={handleToggleSubscribe}
          />
        );

      case 'history':
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3F3F3F]/40">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Watch history</h1>
                <p className={`text-sm ${isDark ? 'text-[#AAAAAA]' : 'text-[#606060]'} mt-1`}>
                  {historyVideos.length} {historyVideos.length === 1 ? 'video' : 'videos'}
                </p>
              </div>
              {historyVideos.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isDark
                      ? 'bg-[#272727] hover:bg-[#3F3F3F] text-white'
                      : 'bg-[#F2F2F2] hover:bg-[#E5E5E5] text-black'
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                  Clear all watch history
                </button>
              )}
            </div>

            {historyVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <div className={`w-24 h-24 mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-[#222222] text-[#AAAAAA]' : 'bg-[#F2F2F2] text-[#606060]'
                }`}>
                  <HistoryIcon className="w-12 h-12" />
                </div>
                <h2 className="text-xl font-bold mb-2">Keep track of what you watch</h2>
                <p className={`text-sm ${isDark ? 'text-[#AAAAAA]' : 'text-[#606060]'} max-w-md`}>
                  Watch history is empty. Videos you watch will show up here.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="mt-6 px-5 py-2.5 rounded-full bg-[#FF0000] hover:bg-[#CC0000] text-white text-sm font-medium transition-colors"
                >
                  Explore videos
                </button>
              </div>
            ) : (
              <VideoGrid
                videos={historyVideos}
                channels={CHANNELS}
                onSelectVideo={handleSelectVideo}
                onSelectChannel={handleSelectChannel}
              />
            )}
          </div>
        );

      case 'liked':
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
            <div className="pb-4 border-b border-[#3F3F3F]/40">
              <h1 className="text-2xl md:text-3xl font-bold">Liked videos</h1>
              <p className={`text-sm ${isDark ? 'text-[#AAAAAA]' : 'text-[#606060]'} mt-1`}>
                {likedVideos.length} {likedVideos.length === 1 ? 'video' : 'videos'}
              </p>
            </div>

            {likedVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <div className={`w-24 h-24 mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-[#222222] text-[#AAAAAA]' : 'bg-[#F2F2F2] text-[#606060]'
                }`}>
                  <LikeIcon className="w-12 h-12" />
                </div>
                <h2 className="text-xl font-bold mb-2">No liked videos yet</h2>
                <p className={`text-sm ${isDark ? 'text-[#AAAAAA]' : 'text-[#606060]'} max-w-md`}>
                  Use the thumbs up button on any video to add it to your Liked videos playlist.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="mt-6 px-5 py-2.5 rounded-full bg-[#FF0000] hover:bg-[#CC0000] text-white text-sm font-medium transition-colors"
                >
                  Explore videos
                </button>
              </div>
            ) : (
              <VideoGrid
                videos={likedVideos}
                channels={CHANNELS}
                onSelectVideo={handleSelectVideo}
                onSelectChannel={handleSelectChannel}
              />
            )}
          </div>
        );

      case 'subscriptions':
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
            <div className="pb-4 border-b border-[#3F3F3F]/40">
              <h1 className="text-2xl md:text-3xl font-bold">Subscriptions</h1>
              <p className={`text-sm ${isDark ? 'text-[#AAAAAA]' : 'text-[#606060]'} mt-1`}>
                Latest videos from channels you subscribe to
              </p>
            </div>

            {subscriptionVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                <div className={`w-24 h-24 mb-4 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-[#222222] text-[#AAAAAA]' : 'bg-[#F2F2F2] text-[#606060]'
                }`}>
                  <SubscriptionsIcon className="w-12 h-12" />
                </div>
                <h2 className="text-xl font-bold mb-2">Don't miss new videos</h2>
                <p className={`text-sm ${isDark ? 'text-[#AAAAAA]' : 'text-[#606060]'} max-w-md`}>
                  Subscribe to channels to see updates and recent uploads from your favorite creators.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('home')}
                  className="mt-6 px-5 py-2.5 rounded-full bg-[#FF0000] hover:bg-[#CC0000] text-white text-sm font-medium transition-colors"
                >
                  Discover channels
                </button>
              </div>
            ) : (
              <VideoGrid
                videos={subscriptionVideos}
                channels={CHANNELS}
                onSelectVideo={handleSelectVideo}
                onSelectChannel={handleSelectChannel}
              />
            )}
          </div>
        );

      case 'shorts':
        return (
          <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 py-8">
            <div className="text-center space-y-2 mb-8">
              <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                isDark ? 'bg-[#222222] text-[#FF0000]' : 'bg-[#F2F2F2] text-[#FF0000]'
              }`}>
                <PlayIcon className="w-8 h-8" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Shorts</h1>
              <p className={`text-sm ${isDark ? 'text-[#AAAAAA]' : 'text-[#606060]'}`}>
                Trending short-form video clips
              </p>
            </div>
            <VideoGrid
              videos={VIDEOS.slice(0, 6)}
              channels={CHANNELS}
              onSelectVideo={handleSelectVideo}
              onSelectChannel={handleSelectChannel}
            />
          </div>
        );

      case 'library':
        return (
          <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b border-[#3F3F3F]/40">
              <div className="w-16 h-16 rounded-full bg-[#FF0000] flex items-center justify-center text-white font-bold text-2xl shadow-md">
                U
              </div>
              <div>
                <h1 className="text-2xl font-bold">You</h1>
                <p className={`text-sm ${isDark ? 'text-[#AAAAAA]' : 'text-[#606060]'}`}>
                  {storeState?.subscribedChannelIds?.length || 0} subscriptions · {historyVideos.length} watched · {likedVideos.length} liked
                </p>
              </div>
            </div>

            {/* History preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="w-6 h-6" />
                  <h2 className="text-xl font-bold">History</h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('history')}
                  className="text-sm text-blue-500 hover:text-blue-400 font-medium"
                >
                  See all
                </button>
              </div>
              {historyVideos.length > 0 ? (
                <VideoGrid
                  videos={historyVideos.slice(0, 4)}
                  channels={CHANNELS}
                  onSelectVideo={handleSelectVideo}
                  onSelectChannel={handleSelectChannel}
                />
              ) : (
                <p className={`text-sm ${isDark ? 'text-[#AAAAAA]' : 'text-[#606060]'}`}>No watch history yet.</p>
              )}
            </div>

            {/* Liked videos preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LikeIcon className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Liked videos</h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('liked')}
                  className="text-sm text-blue-500 hover:text-blue-400 font-medium"
                >
                  See all
                </button>
              </div>
              {likedVideos.length > 0 ? (
                <VideoGrid
                  videos={likedVideos.slice(0, 4)}
                  channels={CHANNELS}
                  onSelectVideo={handleSelectVideo}
                  onSelectChannel={handleSelectChannel}
                />
              ) : (
                <p className={`text-sm ${isDark ? 'text-[#AAAAAA]' : 'text-[#606060]'}`}>No liked videos yet.</p>
              )}
            </div>
          </div>
        );

      case 'home':
      default:
        return (
          <div className="p-4 md:p-6 space-y-4 max-w-[1920px] mx-auto">
            <CategoryPills
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <VideoGrid
              videos={filteredHomeVideos}
              channels={CHANNELS}
              onSelectVideo={handleSelectVideo}
              onSelectChannel={handleSelectChannel}
            />
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#0F0F0F] text-[#F1F1F1]' : 'bg-white text-[#0F0F0F]'}`}>
      {/* Top Application Header */}
      <Header
        onSearch={handleSearch}
        onMenuToggle={handleMenuToggle}
        currentQuery={searchQuery}
        setQuery={setSearchQuery}
        onLogoClick={handleLogoClick}
        theme={theme}
        toggleTheme={handleToggleTheme}
      />

      {/* Main Body Area: Sidebar + Scrollable View Content */}
      <div className="flex flex-1 relative overflow-hidden">
        {/*
          In 'watch' view: YouTube hides sidebar by default and renders an overlay drawer
          when the hamburger menu is clicked.
          In other views: standard responsive sidebar (mini rail or expanded).
        */}
        {currentView === 'watch' ? (
          isSidebarOpen && (
            <div className="fixed inset-0 z-40 flex" id="watch-sidebar-drawer">
              <div
                className="fixed inset-0 bg-black/60 transition-opacity"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar overlay"
              />
              <div className={`relative z-50 h-full shadow-2xl ${isDark ? 'bg-[#0F0F0F]' : 'bg-white'}`}>
                <Sidebar
                  isOpen={true}
                  currentView={currentView}
                  onSelectView={(v, p) => {
                    setIsSidebarOpen(false);
                    handleSelectSidebarView(v, p);
                  }}
                  subscriptions={storeState.subscribedChannelIds}
                />
              </div>
            </div>
          )
        ) : (
          <Sidebar
            isOpen={isSidebarOpen}
            currentView={currentView}
            onSelectView={handleSelectSidebarView}
            subscriptions={storeState.subscribedChannelIds}
          />
        )}

        {/* Scrollable View Container */}
        <main
          ref={mainContentRef}
          className="flex-1 overflow-y-auto min-w-0"
        >
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default App;

// --------------------------------------------------------------------------
// Root Mount Execution
// --------------------------------------------------------------------------
const rootElement = document.getElementById('root');
if (rootElement) {
  if (ReactDOM && typeof ReactDOM.createRoot === 'function') {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  } else if (ReactDOM && typeof ReactDOM.render === 'function') {
    ReactDOM.render(<App />, rootElement);
  }
}
