/**
 * YouTube Clone - VideoCard Component
 * Individual video card with 16:9 thumbnail, duration overlay, channel avatar,
 * verified badge, view count, relative timestamp, and channel linking.
 */

import { Verified, MoreVertical } from './Icons.js';
import { CHANNELS } from '../data/videos.js';

// Resolve from imports or fallback to window.YT
const YT_CARD = (typeof window !== 'undefined' && window.YT) || {};
const SafeVerified = typeof Verified !== 'undefined' ? Verified : YT_CARD.Verified;
const SafeMoreVertical = typeof MoreVertical !== 'undefined' ? MoreVertical : YT_CARD.MoreVertical;
const SafeCHANNELS = (typeof CHANNELS !== 'undefined' && CHANNELS) || YT_CARD.CHANNELS || [];

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);

/**
 * YouTube Video Card Component.
 *
 * @param {Object} props
 * @param {Object} props.video - Video item object.
 * @param {Object} [props.channel] - Channel details object (auto-resolved from CHANNELS if omitted).
 * @param {function} [props.onClick] - Callback when video card or title is clicked.
 * @param {function} [props.onChannelClick] - Callback when channel avatar or channel name is clicked.
 */
export function VideoCard({
  video,
  channel,
  onClick,
  onChannelClick
}) {
  if (!video) return null;

  // Resolve channel info if not explicitly passed
  const resolvedChannel = channel || (Array.isArray(SafeCHANNELS)
    ? SafeCHANNELS.find((c) => c.id === video.channelId)
    : null) || {
      id: video.channelId || 'unknown',
      name: 'Creator',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      verified: false
    };

  const handleCardClick = () => {
    if (onClick) {
      onClick(video);
    }
  };

  const handleChannelClick = (e) => {
    e.stopPropagation();
    if (onChannelClick) {
      onChannelClick(resolvedChannel, e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`${video.title} by ${resolvedChannel.name}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group flex flex-col w-full text-left cursor-pointer focus:outline-none select-none transition-transform duration-200"
    >
      {/* Thumbnail Container (16:9 Aspect Ratio) */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-[#272727] shadow-sm mb-3">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
          onError={(e) => {
            // High quality dark fallback placeholder
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

      {/* Video Metadata & Channel Info */}
      <div className="flex items-start gap-3 px-0.5">
        {/* Channel Avatar with Channel Linking */}
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
          className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 ring-1 ring-black/10 dark:ring-white/10 hover:ring-black/30 dark:hover:ring-white/40 transition-all cursor-pointer mt-0.5"
        >
          <img
            src={resolvedChannel.avatarUrl}
            alt={resolvedChannel.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80';
            }}
          />
        </div>

        {/* Video Details */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Title */}
          <h3
            title={video.title}
            className="font-medium text-sm sm:text-base leading-snug line-clamp-2 text-neutral-900 dark:text-[#F1F1F1] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            {video.title}
          </h3>

          {/* Channel Name with Verified Badge */}
          <div
            onClick={handleChannelClick}
            className="inline-flex items-center gap-1.5 mt-1 text-xs sm:text-sm text-neutral-600 dark:text-[#AAAAAA] hover:text-neutral-900 dark:hover:text-[#F1F1F1] transition-colors cursor-pointer w-fit"
          >
            <span className="truncate max-w-[200px]">{resolvedChannel.name}</span>
            {resolvedChannel.verified && (
              <SafeVerified className="w-3.5 h-3.5 text-neutral-500 dark:text-[#AAAAAA] flex-shrink-0" />
            )}
          </div>

          {/* Views & Relative Timestamp */}
          <div className="flex items-center gap-1 text-xs sm:text-sm text-neutral-600 dark:text-[#AAAAAA] mt-0.5">
            <span>{video.views}</span>
            <span className="mx-0.5 text-neutral-400 dark:text-neutral-500">•</span>
            <span>{video.timestamp}</span>
          </div>
        </div>

        {/* 3-dots Context Menu Button (Hover Only) */}
        <div className="flex-shrink-0">
          <button
            type="button"
            aria-label="Action menu"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 dark:text-[#AAAAAA] hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/10 rounded-full transition-opacity"
          >
            <SafeMoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default VideoCard;

// Dual-compatibility: attach exports to global YT namespace
if (typeof window !== 'undefined') {
  window.YT = window.YT || {};
  window.YT.VideoCard = VideoCard;
}

