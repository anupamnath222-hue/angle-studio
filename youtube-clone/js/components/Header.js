/**
 * YouTube Clone - Header Component
 * Sticky top navigation bar matching YouTube's authentic layout and interactions.
 */

import {
  Menu,
  Logo,
  Search,
  Mic,
  Video,
  Bell,
  Moon,
  Sun,
  User,
  Close
} from './Icons.js';

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);
const { useState, useRef, useEffect } = React || {};

export function Header({
  onSearch,
  onMenuToggle,
  currentQuery = '',
  setQuery,
  onLogoClick,
  theme = 'dark',
  toggleTheme
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const inputRef = useRef(null);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  const createMenuRef = useRef(null);

  const isDark = theme === 'dark';

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (onSearch) {
      onSearch(currentQuery ? currentQuery.trim() : '');
    }
  };

  // Clear query button action
  const handleClear = () => {
    if (setQuery) setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Voice Search Simulation / Web Speech API integration
  const handleVoiceSearch = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        setIsListening(true);

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (setQuery) setQuery(transcript);
          if (onSearch) onSearch(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (err) {
        // Fall through to simulation if speech recognition fails or is denied
      }
    }

    // Interactive Voice search modal simulation
    setIsListening(true);
  };

  // Simulate picking speech in voice search modal
  const handleSimulatedVoiceSelect = (simulatedPhrase) => {
    if (setQuery) setQuery(simulatedPhrase);
    if (onSearch) onSearch(simulatedPhrase);
    setIsListening(false);
  };

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setShowCreateMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 h-14 px-4 flex items-center justify-between transition-colors duration-200 ${
        isDark
          ? 'bg-[#0F0F0F] text-[#F1F1F1] border-b border-[#222222]'
          : 'bg-[#FFFFFF] text-[#0F0F0F] border-b border-[#E5E5E5]'
      }`}
    >
      {/* LEFT SECTION: Hamburger Menu & YouTube Logo */}
      <div className="flex items-center space-x-4 shrink-0">
        <button
          type="button"
          onClick={onMenuToggle}
          className={`p-2 rounded-full focus:outline-none transition-colors ${
            isDark ? 'hover:bg-[#272727] text-white active:bg-[#3F3F3F]' : 'hover:bg-[#E5E5E5] text-black active:bg-[#CCCCCC]'
          }`}
          title="Guide"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={onLogoClick}
          className="flex items-center cursor-pointer select-none relative group"
          title="YouTube Home"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onLogoClick && onLogoClick(); }}
        >
          <Logo className="h-5" showText={true} />
          <span className="text-[10px] text-[#AAAAAA] dark:text-[#AAAAAA] font-normal ml-1 -mt-2 self-start">
            IN
          </span>
        </div>
      </div>

      {/* CENTER SECTION: Search Form & Voice Search */}
      <div className="flex items-center justify-center flex-1 max-w-[720px] mx-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center w-full max-w-[600px] relative"
          role="search"
        >
          <div
            className={`flex items-center w-full rounded-l-full border px-4 py-0 h-10 transition-colors ${
              isFocused
                ? isDark
                  ? 'border-[#1c62b9] bg-[#121212]'
                  : 'border-[#1c62b9] bg-white'
                : isDark
                ? 'border-[#303030] bg-[#121212]'
                : 'border-[#CCCCCC] bg-white'
            }`}
          >
            {isFocused && (
              <Search
                className={`w-4 h-4 mr-3 shrink-0 ${
                  isDark ? 'text-[#AAAAAA]' : 'text-[#606060]'
                }`}
              />
            )}
            <input
              ref={inputRef}
              type="text"
              value={currentQuery}
              onChange={(e) => setQuery && setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search"
              className={`w-full bg-transparent focus:outline-none text-sm placeholder-opacity-70 ${
                isDark
                  ? 'text-white placeholder-[#888888]'
                  : 'text-black placeholder-[#717171]'
              }`}
            />
            {currentQuery && currentQuery.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className={`p-1 rounded-full hover:bg-neutral-700/30 transition-colors shrink-0 ${
                  isDark ? 'text-[#AAAAAA] hover:text-white' : 'text-[#606060] hover:text-black'
                }`}
                title="Clear search query"
                aria-label="Clear search input"
              >
                <Close className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Action Button */}
          <button
            type="submit"
            className={`flex items-center justify-center h-10 px-6 rounded-r-full border border-l-0 transition-colors shrink-0 ${
              isDark
                ? 'bg-[#222222] border-[#303030] hover:bg-[#272727] text-white'
                : 'bg-[#F8F8F8] border-[#CCCCCC] hover:bg-[#F0F0F0] text-black'
            }`}
            title="Search"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        {/* Voice Search Button */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`p-2.5 ml-3 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isListening
              ? 'bg-red-600 text-white animate-pulse'
              : isDark
              ? 'bg-[#222222] hover:bg-[#272727] text-white'
              : 'bg-[#F2F2F2] hover:bg-[#E5E5E5] text-black'
          }`}
          title="Search with your voice"
          aria-label="Search with voice"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* RIGHT SECTION: Theme Toggle, Create, Notifications, Profile */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${
            isDark
              ? 'hover:bg-[#272727] text-[#F1F1F1]'
              : 'hover:bg-[#E5E5E5] text-[#0F0F0F]'
          }`}
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          aria-label="Toggle theme appearance"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-neutral-700" />}
        </button>

        {/* Create Video Menu Button */}
        <div className="relative" ref={createMenuRef}>
          <button
            type="button"
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? 'hover:bg-[#272727] text-[#F1F1F1]'
                : 'hover:bg-[#E5E5E5] text-[#0F0F0F]'
            }`}
            title="Create"
            aria-label="Create content"
          >
            <Video className="w-5 h-5" />
          </button>

          {showCreateMenu && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl py-2 z-50 border ${
                isDark
                  ? 'bg-[#282828] text-white border-[#3F3F3F]'
                  : 'bg-white text-black border-[#E5E5E5]'
              }`}
            >
              <button
                type="button"
                onClick={() => { setShowCreateMenu(false); alert("Upload video feature opened."); }}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center space-x-3 transition-colors ${
                  isDark ? 'hover:bg-[#3F3F3F]' : 'hover:bg-[#F2F2F2]'
                }`}
              >
                <Video className="w-4 h-4 text-red-500" />
                <span>Upload video</span>
              </button>
              <button
                type="button"
                onClick={() => { setShowCreateMenu(false); alert("Go live simulator started."); }}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center space-x-3 transition-colors ${
                  isDark ? 'hover:bg-[#3F3F3F]' : 'hover:bg-[#F2F2F2]'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping mr-1" />
                <span>Go live</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full relative transition-colors ${
              isDark
                ? 'hover:bg-[#272727] text-[#F1F1F1]'
                : 'hover:bg-[#E5E5E5] text-[#0F0F0F]'
            }`}
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl overflow-hidden z-50 border ${
                isDark
                  ? 'bg-[#282828] text-white border-[#3F3F3F]'
                  : 'bg-white text-black border-[#E5E5E5]'
              }`}
            >
              <div
                className={`p-3 border-b flex items-center justify-between font-medium text-sm ${
                  isDark ? 'border-[#3F3F3F]' : 'border-[#E5E5E5]'
                }`}
              >
                <span>Notifications</span>
                <span className="text-xs text-blue-500 hover:underline cursor-pointer">
                  Mark all as read
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-800">
                <div
                  className={`p-3 flex space-x-3 cursor-pointer text-xs transition-colors ${
                    isDark ? 'hover:bg-[#3F3F3F]' : 'hover:bg-[#F2F2F2]'
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&auto=format&fit=crop&q=80"
                    alt="avatar"
                    className="w-8 h-8 rounded-full shrink-0"
                  />
                  <div>
                    <p className="font-semibold">Marques Brownlee uploaded:</p>
                    <p className="text-neutral-400 mt-0.5">The Smartphone of the Future Teardown</p>
                    <span className="text-[10px] text-neutral-500">2 hours ago</span>
                  </div>
                </div>
                <div
                  className={`p-3 flex space-x-3 cursor-pointer text-xs transition-colors ${
                    isDark ? 'hover:bg-[#3F3F3F]' : 'hover:bg-[#F2F2F2]'
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&auto=format&fit=crop&q=80"
                    alt="avatar"
                    className="w-8 h-8 rounded-full shrink-0"
                  />
                  <div>
                    <p className="font-semibold">Lofi Girl is currently live</p>
                    <p className="text-neutral-400 mt-0.5">beats to relax/study to 24/7</p>
                    <span className="text-[10px] text-neutral-500">Live now</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative ml-1" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full overflow-hidden border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="User Profile"
            aria-label="User account menu"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="You"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
              Y
            </div>
          </button>

          {showUserMenu && (
            <div
              className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl py-2 z-50 border ${
                isDark
                  ? 'bg-[#282828] text-white border-[#3F3F3F]'
                  : 'bg-white text-black border-[#E5E5E5]'
              }`}
            >
              <div
                className={`px-4 py-3 border-b flex items-center space-x-3 ${
                  isDark ? 'border-[#3F3F3F]' : 'border-[#E5E5E5]'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                  Y
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate">You</p>
                  <p className="text-xs text-neutral-400 truncate">@user-ytclone</p>
                  <a
                    href="#channel"
                    onClick={(e) => { e.preventDefault(); setShowUserMenu(false); }}
                    className="text-xs text-blue-500 hover:underline mt-1 inline-block"
                  >
                    View your channel
                  </a>
                </div>
              </div>

              <div className="py-1 text-sm">
                <button
                  type="button"
                  onClick={() => { toggleTheme(); setShowUserMenu(false); }}
                  className={`w-full px-4 py-2 text-left flex items-center justify-between transition-colors ${
                    isDark ? 'hover:bg-[#3F3F3F]' : 'hover:bg-[#F2F2F2]'
                  }`}
                >
                  <span>Appearance: {isDark ? 'Dark' : 'Light'}</span>
                  {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowUserMenu(false); }}
                  className={`w-full px-4 py-2 text-left transition-colors ${
                    isDark ? 'hover:bg-[#3F3F3F]' : 'hover:bg-[#F2F2F2]'
                  }`}
                >
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => { setShowUserMenu(false); }}
                  className={`w-full px-4 py-2 text-left transition-colors ${
                    isDark ? 'hover:bg-[#3F3F3F]' : 'hover:bg-[#F2F2F2]'
                  }`}
                >
                  Send feedback
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voice Search Simulated Dialog Modal */}
      {isListening && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-fade-in ${
              isDark ? 'bg-[#212121] text-white' : 'bg-white text-black'
            }`}
          >
            <button
              type="button"
              onClick={() => setIsListening(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-neutral-700/30"
              aria-label="Close voice search"
            >
              <Close className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-normal mb-2">Listening...</h3>
            <p className="text-xs text-neutral-400 mb-8">Say something like "React 19" or "Lofi hip hop"</p>

            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-red-600/30 animate-ping absolute inset-0" />
                <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center relative shadow-lg">
                  <Mic className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-700">
              <p className="text-xs text-neutral-400 mb-2 font-medium">Or try searching for:</p>
              <div className="flex flex-wrap gap-2">
                {['React 19', 'Lofi hip hop', 'Marques Brownlee', 'Web development'].map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => handleSimulatedVoiceSelect(phrase)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                      isDark
                        ? 'bg-[#303030] hover:bg-[#3F3F3F] text-white'
                        : 'bg-[#F2F2F2] hover:bg-[#E5E5E5] text-black'
                    }`}
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
