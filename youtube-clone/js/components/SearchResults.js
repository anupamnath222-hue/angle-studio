/**
 * YouTube Clone - SearchResults Component
 *
 * Displays search results in authentic YouTube horizontal layout:
 * - Matching channel showcase banner/card if query matches a channel
 * - Horizontal video result cards (16:9 thumbnail on left, metadata & snippet on right)
 * - Channel avatar, name, and verified badge with channel navigation
 * - Filter against video title, description, category, tags, and channel name
 * - Clean empty state with search illustration when no results match
 */

import { Search, Verified, Bell, Check } from './Icons.js';
import { VIDEOS, CHANNELS } from '../data/videos.js';

// Resolve from imports or fallback to window.YT
const YT_SEARCH = (typeof window !== 'undefined' && window.YT) || {};
const SafeSearch = typeof Search !== 'undefined' ? Search : YT_SEARCH.Search;
const SafeVerified = typeof Verified !== 'undefined' ? Verified : YT_SEARCH.Verified;
const SafeBell = typeof Bell !== 'undefined' ? Bell : YT_SEARCH.Bell;
const SafeCheck = typeof Check !== 'undefined' ? Check : YT_SEARCH.Check;
const SafeVIDEOS = (typeof VIDEOS !== 'undefined' && VIDEOS) || YT_SEARCH.VIDEOS || [];
const SafeCHANNELS = (typeof CHANNELS !== 'undefined' && CHANNELS) || YT_SEARCH.CHANNELS || [];

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);
const { useState, useMemo } = React || {};

/**
 * Filter Pill Component for Search Results
 */
function SearchFilterPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors select-none ${
        active
          ? 'bg-white text-black'
          : 'bg-[#272727] text-white hover:bg-[#3F3F3F]'
      }`}
    >
      {label}
    </button>
  );
}

/**
 * Channel Showcase Banner Card (rendered at the top if search matches a channel)
 */
function ChannelShowcaseCard({
  channel,
  videoCount,
  onSelectChannel,
  isSubscribed,
  onToggleSubscribe
}) {
  if (!channel) return null;

  const handleSubscribeClick = (e) => {
    e.stopPropagation();
    if (onToggleSubscribe) {
      onToggleSubscribe(channel.id);
    }
  };

  const handleCardClick = () => {
    if (onSelectChannel) {
      onSelectChannel(channel);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleClean = channel.handle || `@${channel.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Visit channel ${channel.name}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-8 p-4 md:p-6 mb-6 rounded-2xl bg-[#1F1F1F]/60 hover:bg-[#272727]/60 border border-[#3F3F3F]/40 cursor-pointer transition-all duration-200"
    >
      {/* Large Channel Avatar */}
      <div className="flex-shrink-0">
        <img
          src={channel.avatarUrl}
          alt={channel.name}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-lg border-2 border-neutral-700"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80';
          }}
        />
      </div>

      {/* Channel Information */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
          <h2 className="text-xl md:text-2xl font-bold text-white hover:text-white/90">
            {channel.name}
          </h2>
          {channel.verified && (
            <Verified className="w-5 h-5 text-[#AAAAAA] flex-shrink-0" />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-xs md:text-sm text-[#AAAAAA] mb-2">
          <span>{handleClean}</span>
          <span>•</span>
          <span>{channel.subscribers}</span>
          <span>•</span>
          <span>{videoCount} {videoCount === 1 ? 'video' : 'videos'}</span>
        </div>

        {channel.description && (
          <p className="text-xs md:text-sm text-[#AAAAAA] line-clamp-2 max-w-2xl mb-4 leading-relaxed">
            {channel.description}
          </p>
        )}

        {/* Subscribe Action */}
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <button
            type="button"
            aria-label={isSubscribed ? `Unsubscribe from ${channel.name}` : `Subscribe to ${channel.name}`}
            onClick={handleSubscribeClick}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 shadow-sm ${
              isSubscribed
                ? 'bg-[#272727] text-white hover:bg-[#3F3F3F] border border-[#3F3F3F]'
                : 'bg-white text-black hover:bg-[#E5E5E5]'
            }`}
          >
            {isSubscribed ? (
              <>
                <Bell className="w-4 h-4" />
                <span>Subscribed</span>
              </>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * YouTube Search Horizontal Video Card
 */
function SearchVideoCard({
  video,
  channel,
  onSelectVideo,
  onSelectChannel
}) {
  const handleCardClick = () => {
    if (onSelectVideo) {
      onSelectVideo(video);
    }
  };

  const handleChannelClick = (e) => {
    e.stopPropagation();
    if (onSelectChannel && channel) {
      onSelectChannel(channel);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const resolvedChannel = channel || {
    id: video.channelId,
    name: 'Creator',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
    verified: false
  };

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`${video.title} by ${resolvedChannel.name}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group flex flex-col sm:flex-row gap-4 w-full cursor-pointer focus:outline-none select-none py-1"
    >
      {/* 16:9 Thumbnail on Left */}
      <div className="relative w-full sm:w-72 md:w-88 lg:w-96 aspect-video flex-shrink-0 rounded-xl overflow-hidden bg-[#272727] shadow-sm">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=450&q=80';
          }}
        />

        {/* Video Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-sm text-white text-xs font-semibold px-1.5 py-0.5 rounded tracking-wide shadow-sm">
            {video.duration}
          </div>
        )}
      </div>

      {/* Video Metadata & Snippet on Right */}
      <div className="flex-1 min-w-0 flex flex-col justify-start">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-medium text-white line-clamp-2 leading-snug group-hover:text-neutral-200 transition-colors">
          {video.title}
        </h3>

        {/* Views & Date */}
        <div className="flex items-center gap-1 text-xs text-[#AAAAAA] mt-1 mb-2">
          <span>{video.views}</span>
          <span>•</span>
          <span>{video.timestamp}</span>
        </div>

        {/* Channel Row */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`Visit channel ${resolvedChannel.name}`}
          onClick={handleChannelClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleChannelClick(e);
            }
          }}
          className="flex items-center gap-2 py-1 my-0.5 w-fit hover:opacity-90"
        >
          <img
            src={resolvedChannel.avatarUrl}
            alt={resolvedChannel.name}
            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80';
            }}
          />
          <span className="text-xs text-[#AAAAAA] hover:text-white transition-colors font-normal">
            {resolvedChannel.name}
          </span>
          {resolvedChannel.verified && (
            <Verified className="w-3.5 h-3.5 text-[#AAAAAA] flex-shrink-0" />
          )}
        </div>

        {/* Video Description Snippet */}
        {video.description && (
          <p className="text-xs text-[#AAAAAA] line-clamp-2 mt-1 leading-relaxed max-w-3xl">
            {video.description}
          </p>
        )}

        {/* Badges: Category or Features */}
        <div className="flex items-center gap-2 mt-2">
          {video.category && (
            <span className="text-[11px] font-medium bg-[#272727] text-[#AAAAAA] px-2 py-0.5 rounded">
              {video.category}
            </span>
          )}
          {video.duration === 'Live' && (
            <span className="text-[11px] font-bold bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">
              Live
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * YouTube Search Results Component
 *
 * @param {Object} props
 * @param {string} [props.query=""] - Search term to filter videos and channels.
 * @param {Array} [props.videos=VIDEOS] - Video dataset.
 * @param {Array} [props.channels=CHANNELS] - Channel dataset.
 * @param {function} [props.onSelectVideo] - Callback when video is selected.
 * @param {function} [props.onSelectChannel] - Callback when channel is selected.
 * @param {Array} [props.subscribedChannelIds=[]] - List of subscribed channel IDs.
 * @param {function} [props.onToggleSubscribe] - Callback to toggle subscription.
 */
export function SearchResults({
  query = '',
  videos = VIDEOS,
  channels = CHANNELS,
  onSelectVideo,
  onSelectChannel,
  subscribedChannelIds = [],
  onToggleSubscribe
}) {
  const [filterType, setFilterType] = useState('All'); // 'All' | 'Videos' | 'Channels'

  const videoList = Array.isArray(videos) ? videos : VIDEOS;
  const channelList = Array.isArray(channels) ? channels : CHANNELS;

  // Build channel lookup map
  const channelMap = useMemo(() => {
    const map = new Map();
    channelList.forEach((c) => {
      if (c && c.id) map.set(c.id, c);
    });
    return map;
  }, [channelList]);

  // Clean and parse query
  const cleanQuery = (query || '').trim().toLowerCase();

  // Find matching channel if query matches a channel name
  const matchedChannel = useMemo(() => {
    if (!cleanQuery) return null;
    return channelList.find((c) => {
      if (!c || !c.name) return false;
      const cName = c.name.toLowerCase();
      const cHandle = (c.handle || `@${c.name.replace(/[^a-zA-Z0-9]/g, '')}`).toLowerCase();
      return (
        cName.includes(cleanQuery) ||
        cleanQuery.includes(cName) ||
        cHandle.includes(cleanQuery)
      );
    }) || null;
  }, [cleanQuery, channelList]);

  // Count videos for the matched channel
  const matchedChannelVideoCount = useMemo(() => {
    if (!matchedChannel) return 0;
    return videoList.filter((v) => v.channelId === matchedChannel.id).length;
  }, [matchedChannel, videoList]);

  // Filter videos matching query
  const filteredVideos = useMemo(() => {
    if (!cleanQuery) return videoList;

    return videoList.filter((v) => {
      if (!v) return false;

      // 1. Title match
      const titleMatch = v.title && v.title.toLowerCase().includes(cleanQuery);
      if (titleMatch) return true;

      // 2. Description match
      const descMatch = v.description && v.description.toLowerCase().includes(cleanQuery);
      if (descMatch) return true;

      // 3. Category match
      const catMatch = v.category && v.category.toLowerCase().includes(cleanQuery);
      if (catMatch) return true;

      // 4. Tags match (if present)
      if (Array.isArray(v.tags)) {
        const tagMatch = v.tags.some((t) => t && t.toLowerCase().includes(cleanQuery));
        if (tagMatch) return true;
      }

      // 5. Channel name match
      const ch = channelMap.get(v.channelId);
      if (ch && ch.name && ch.name.toLowerCase().includes(cleanQuery)) {
        return true;
      }

      return false;
    });
  }, [cleanQuery, videoList, channelMap]);

  const hasResults = Boolean(matchedChannel) || filteredVideos.length > 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 md:py-6 text-white min-h-[70vh]">
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between border-b border-[#3F3F3F]/60 pb-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <SearchFilterPill
            label="All"
            active={filterType === 'All'}
            onClick={() => setFilterType('All')}
          />
          <SearchFilterPill
            label="Videos"
            active={filterType === 'Videos'}
            onClick={() => setFilterType('Videos')}
          />
          <SearchFilterPill
            label="Channels"
            active={filterType === 'Channels'}
            onClick={() => setFilterType('Channels')}
          />
        </div>

        {cleanQuery && (
          <span className="text-xs text-[#AAAAAA] hidden sm:inline-block">
            Showing results for <span className="text-white font-medium">"{query}"</span>
          </span>
        )}
      </div>

      {/* Channel Showcase Card (if matching channel exists and filter allows) */}
      {matchedChannel && filterType !== 'Videos' && (
        <ChannelShowcaseCard
          channel={matchedChannel}
          videoCount={matchedChannelVideoCount}
          onSelectChannel={onSelectChannel}
          isSubscribed={subscribedChannelIds.includes(matchedChannel.id)}
          onToggleSubscribe={onToggleSubscribe}
        />
      )}

      {/* Videos List */}
      {filterType !== 'Channels' && filteredVideos.length > 0 && (
        <div className="flex flex-col gap-5">
          {filteredVideos.map((video) => (
            <SearchVideoCard
              key={video.id}
              video={video}
              channel={channelMap.get(video.channelId)}
              onSelectVideo={onSelectVideo}
              onSelectChannel={onSelectChannel}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!hasResults && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-[#1F1F1F] flex items-center justify-center text-[#AAAAAA]">
            <Search className="w-12 h-12" />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
            No results found
          </h2>
          <p className="text-sm text-[#AAAAAA] max-w-md mb-6 leading-relaxed">
            Try different keywords or check for spelling errors. You can also search for video titles, categories, or channel creators.
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchResults;

// Dual-compatibility: attach exports to global YT namespace
if (typeof window !== 'undefined') {
  window.YT = window.YT || {};
  window.YT.SearchResults = SearchResults;
}

