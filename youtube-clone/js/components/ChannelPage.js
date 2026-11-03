/**
 * YouTube Clone - ChannelPage Component
 *
 * Full-featured authentic YouTube channel profile page:
 * - Wide banner image (w-full h-48 md:h-64 object-cover)
 * - Channel profile header: large avatar, name, verified check, handle (@handle),
 *   subscriber count, video count, bio/description, and Subscribe button with active state
 * - Tab navigation: "Videos", "Playlists", "About"
 * - Grid of videos uploaded by this channel using VideoCard components
 * - Playlists showcase with playlist cards and video count overlays
 * - About tab with full description, channel statistics, links, and share action
 */

import { VideoCard } from './VideoCard.js';
import { Verified, Bell, Check, Share, Play } from './Icons.js';
import { VIDEOS, CHANNELS } from '../data/videos.js';

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);
const { useState, useMemo } = React || {};

/**
 * ChannelPage Component
 *
 * @param {Object} props
 * @param {Object} props.channel - Active channel details.
 * @param {Array} [props.videos=VIDEOS] - Video dataset.
 * @param {function} [props.onSelectVideo] - Callback when video is clicked.
 * @param {boolean} [props.isSubscribed=false] - Whether current user is subscribed to this channel.
 * @param {Array} [props.subscribedChannelIds] - Optional list of subscribed channel IDs.
 * @param {function} [props.onToggleSubscribe] - Callback to toggle subscription state.
 */
export function ChannelPage({
  channel,
  videos = VIDEOS,
  onSelectVideo,
  isSubscribed = false,
  subscribedChannelIds,
  onToggleSubscribe
}) {
  const [activeTab, setActiveTab] = useState('Videos'); // 'Videos' | 'Playlists' | 'About'
  const [videoSort, setVideoSort] = useState('Latest'); // 'Latest' | 'Popular' | 'Oldest'
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fallback if no channel provided
  if (!channel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 mb-4 rounded-full bg-[#272727] flex items-center justify-center text-[#AAAAAA]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Channel not found</h2>
        <p className="text-sm text-[#AAAAAA] max-w-sm">
          This channel does not exist or may have been removed.
        </p>
      </div>
    );
  }

  // Determine subscription state
  const subscribed = useMemo(() => {
    if (typeof isSubscribed === 'boolean') {
      return isSubscribed;
    }
    if (Array.isArray(subscribedChannelIds)) {
      return subscribedChannelIds.includes(channel.id);
    }
    return false;
  }, [isSubscribed, subscribedChannelIds, channel.id]);

  // Handle subscribe action
  const handleSubscribeToggle = () => {
    if (onToggleSubscribe) {
      onToggleSubscribe(channel.id);
    }
  };

  // Derive handle
  const handle = channel.handle || `@${channel.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  // Filter channel's uploaded videos
  const allChannelVideos = useMemo(() => {
    const list = Array.isArray(videos) ? videos : VIDEOS;
    return list.filter((v) => v.channelId === channel.id);
  }, [videos, channel.id]);

  // Sort channel videos according to sub-pill
  const sortedVideos = useMemo(() => {
    const vList = [...allChannelVideos];
    if (videoSort === 'Latest') {
      return vList;
    }
    if (videoSort === 'Popular') {
      return vList.sort((a, b) => {
        const parseViews = (str) => {
          if (!str) return 0;
          const num = parseFloat(str) || 0;
          if (str.includes('B')) return num * 1_000_000_000;
          if (str.includes('M')) return num * 1_000_000;
          if (str.includes('K')) return num * 1_000;
          return num;
        };
        return parseViews(b.views) - parseViews(a.views);
      });
    }
    if (videoSort === 'Oldest') {
      return vList.reverse();
    }
    return vList;
  }, [allChannelVideos, videoSort]);

  // Calculate total views for About tab
  const totalViewsFormatted = useMemo(() => {
    let total = 0;
    allChannelVideos.forEach((v) => {
      if (!v.views) return;
      const num = parseFloat(v.views) || 0;
      if (v.views.includes('B')) total += num * 1_000_000_000;
      else if (v.views.includes('M')) total += num * 1_000_000;
      else if (v.views.includes('K')) total += num * 1_000;
      else total += num;
    });
    if (total === 0) return '1,420,892 views';
    return `${total.toLocaleString()} views`;
  }, [allChannelVideos]);

  // Share channel link with toast feedback
  const handleShareChannel = () => {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setToastMessage('Channel link copied to clipboard!');
        setTimeout(() => setToastMessage(''), 3000);
      }).catch(() => {
        setToastMessage('Link copied!');
        setTimeout(() => setToastMessage(''), 3000);
      });
    } else {
      setToastMessage('Channel link copied!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // Sample playlists for channel
  const samplePlaylists = useMemo(() => [
    {
      id: `pl-${channel.id}-1`,
      title: `${channel.name} – Complete Masterclass`,
      videoCount: 14,
      thumbnail: allChannelVideos[0]?.thumbnailUrl || channel.bannerUrl || channel.avatarUrl,
      updated: 'Updated 2 days ago'
    },
    {
      id: `pl-${channel.id}-2`,
      title: 'Popular Uploads & Best Highlights',
      videoCount: 8,
      thumbnail: allChannelVideos[1]?.thumbnailUrl || channel.avatarUrl,
      updated: 'Updated last week'
    },
    {
      id: `pl-${channel.id}-3`,
      title: 'Deep Dives & Community Specials',
      videoCount: 6,
      thumbnail: allChannelVideos[2]?.thumbnailUrl || channel.bannerUrl || channel.avatarUrl,
      updated: 'Updated last month'
    }
  ], [channel, allChannelVideos]);

  const tabs = ['Videos', 'Playlists', 'About'];

  return (
    <div className="w-full text-white bg-[#0F0F0F] min-h-screen pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#212121] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#3F3F3F] text-sm animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Channel Banner Image */}
      <div className="w-full h-36 sm:h-48 md:h-64 overflow-hidden bg-neutral-900 relative">
        <img
          src={channel.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80'}
          alt={`${channel.name} banner`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Channel Header Info Row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pt-5 pb-4">
          {/* Avatar */}
          <div className="flex-shrink-0 -mt-10 sm:-mt-12 relative z-10">
            <img
              src={channel.avatarUrl}
              alt={channel.name}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#0F0F0F] shadow-xl bg-neutral-800"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80';
              }}
            />
          </div>

          {/* Details & Action Controls */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            {/* Channel Name & Verified Badge */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                {channel.name}
              </h1>
              {channel.verified && (
                <Verified className="w-5 h-5 sm:w-6 sm:h-6 text-[#AAAAAA] flex-shrink-0" />
              )}
            </div>

            {/* Metadata Line */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-xs sm:text-sm text-[#AAAAAA] mb-2 font-normal">
              <span className="text-white/90 font-medium">{handle}</span>
              <span>•</span>
              <span>{channel.subscribers}</span>
              <span>•</span>
              <span>{allChannelVideos.length} {allChannelVideos.length === 1 ? 'video' : 'videos'}</span>
            </div>

            {/* Bio / Description */}
            {channel.description && (
              <div className="text-xs sm:text-sm text-[#AAAAAA] max-w-2xl mb-4 leading-relaxed">
                <p className={isBioExpanded ? '' : 'line-clamp-2'}>
                  {channel.description}
                </p>
                {channel.description.length > 80 && (
                  <button
                    type="button"
                    onClick={() => setIsBioExpanded(!isBioExpanded)}
                    className="text-white font-medium hover:underline mt-0.5 text-xs inline-block"
                  >
                    {isBioExpanded ? 'Show less' : '...more'}
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons: Subscribe, Share */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
              <button
                type="button"
                aria-label={subscribed ? `Unsubscribe from ${channel.name}` : `Subscribe to ${channel.name}`}
                onClick={handleSubscribeToggle}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-200 shadow-md ${
                  subscribed
                    ? 'bg-[#272727] text-white hover:bg-[#3F3F3F] border border-[#3F3F3F]'
                    : 'bg-white text-black hover:bg-[#E5E5E5]'
                }`}
              >
                {subscribed ? (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>

              <button
                type="button"
                aria-label="Share channel"
                onClick={handleShareChannel}
                className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-[#272727] text-white hover:bg-[#3F3F3F] flex items-center gap-2 transition-colors border border-transparent"
              >
                <Share className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Header */}
        <div className="border-b border-[#3F3F3F] mt-4 mb-6">
          <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none" aria-label="Channel Tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 text-sm sm:text-base font-medium transition-colors relative select-none whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : 'text-[#AAAAAA] hover:text-white'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content 1: Videos */}
        {activeTab === 'Videos' && (
          <div>
            {/* Sub-pills: Latest / Popular / Oldest */}
            {allChannelVideos.length > 0 && (
              <div className="flex items-center gap-2 mb-6">
                {['Latest', 'Popular', 'Oldest'].map((sort) => (
                  <button
                    key={sort}
                    type="button"
                    onClick={() => setVideoSort(sort)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      videoSort === sort
                        ? 'bg-white text-black'
                        : 'bg-[#272727] text-white hover:bg-[#3F3F3F]'
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            )}

            {/* Video Cards Grid */}
            {sortedVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-7 w-full">
                {sortedVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    channel={channel}
                    onClick={onSelectVideo}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-[#272727] flex items-center justify-center text-[#AAAAAA]">
                  <Play className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  This channel has no videos
                </h3>
                <p className="text-xs sm:text-sm text-[#AAAAAA] max-w-sm">
                  Check back later to see videos uploaded by {channel.name}.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Playlists */}
        {activeTab === 'Playlists' && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
              Created playlists
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {samplePlaylists.map((pl) => (
                <div
                  key={pl.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (allChannelVideos[0] && onSelectVideo) {
                      onSelectVideo(allChannelVideos[0]);
                    }
                  }}
                  className="group cursor-pointer select-none"
                >
                  {/* Thumbnail with Stack Overlay */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#272727] mb-2.5">
                    <img
                      src={pl.thumbnail}
                      alt={pl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=450&q=80';
                      }}
                    />
                    {/* Dark Right-Side Playlist Badge */}
                    <div className="absolute right-0 top-0 bottom-0 w-28 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white text-center p-2">
                      <span className="text-sm font-semibold">{pl.videoCount}</span>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-300">videos</span>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-1 opacity-80">
                        <path d="M19 15v2H5v-2h14m2-10H3v2h18V5zm-2 5v2H5v-2h14z" />
                      </svg>
                    </div>
                  </div>

                  {/* Playlist Details */}
                  <h4 className="text-sm font-medium text-white line-clamp-2 leading-snug group-hover:text-neutral-200">
                    {pl.title}
                  </h4>
                  <p className="text-xs text-[#AAAAAA] mt-1">{pl.updated}</p>
                  <p className="text-xs text-white/80 font-medium hover:underline mt-1 inline-block">
                    View full playlist
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: About */}
        {activeTab === 'About' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
            {/* Left 2 Cols: Description & Details */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
                  Description
                </h3>
                <p className="text-sm text-neutral-300 whitespace-pre-line leading-relaxed max-w-2xl">
                  {channel.description || 'Welcome to the official channel! Subscribe to stay updated with all our latest videos, tutorials, and community streams.'}
                </p>
              </div>

              <div className="border-t border-[#3F3F3F]/60 pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
                  Details
                </h3>
                <div className="space-y-2 text-sm text-[#AAAAAA]">
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-neutral-400">Location:</span>
                    <span className="text-white">United States</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="w-24 text-neutral-400">Inquiries:</span>
                    <span className="text-white">business@{channel.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#3F3F3F]/60 pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
                  Links
                </h3>
                <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
                  <a
                    href="#website"
                    onClick={(e) => e.preventDefault()}
                    className="text-blue-400 hover:underline"
                  >
                    Official Website
                  </a>
                  <a
                    href="#twitter"
                    onClick={(e) => e.preventDefault()}
                    className="text-blue-400 hover:underline"
                  >
                    Twitter / X
                  </a>
                  <a
                    href="#discord"
                    onClick={(e) => e.preventDefault()}
                    className="text-blue-400 hover:underline"
                  >
                    Discord Community
                  </a>
                </div>
              </div>
            </div>

            {/* Right Col: Stats Box */}
            <div className="border-t md:border-t-0 md:border-l border-[#3F3F3F]/60 md:pl-8 space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                Stats
              </h3>
              <div className="border-b border-[#3F3F3F]/60 pb-3 text-sm text-neutral-300">
                <span className="text-neutral-400 block text-xs">Joined</span>
                <span className="font-medium text-white">Sep 15, 2012</span>
              </div>
              <div className="border-b border-[#3F3F3F]/60 pb-3 text-sm text-neutral-300">
                <span className="text-neutral-400 block text-xs">Subscribers</span>
                <span className="font-medium text-white">{channel.subscribers}</span>
              </div>
              <div className="border-b border-[#3F3F3F]/60 pb-3 text-sm text-neutral-300">
                <span className="text-neutral-400 block text-xs">Total Views</span>
                <span className="font-medium text-white">{totalViewsFormatted}</span>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleShareChannel}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-[#272727] text-white hover:bg-[#3F3F3F] flex items-center gap-2 transition-colors"
                >
                  <Share className="w-4 h-4" />
                  <span>Share Channel</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChannelPage;
