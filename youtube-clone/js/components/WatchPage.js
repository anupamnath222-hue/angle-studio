/**
 * YouTube Clone - WatchPage Component
 *
 * Full-featured interactive YouTube watch view:
 * - 2-column responsive layout (main video column + Up Next sidebar)
 * - Theater mode full-width player expansion
 * - Video details: Title, view count, relative upload date
 * - Action buttons: Like (with dynamic count toggle), Dislike, Share (copies URL + toast), Download, Save
 * - Channel info card: Avatar, name, verified badge, subscriber count, and Subscribe toggle
 * - Collapsible description box with "Show more" / "Show less" toggle and hashtags
 * - CommentSection integration with real-time state binding
 * - Up Next recommended videos list with compact horizontal cards
 */

import { VideoPlayer } from './VideoPlayer.js';
import { CommentSection } from './CommentSection.js';
import {
  Like,
  Dislike,
  Share,
  Verified,
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from './Icons.js';
import { VIDEOS, CHANNELS } from '../data/videos.js';

// Resolve from imports or fallback to window.YT
const YT_WATCH = (typeof window !== 'undefined' && window.YT) || {};
const SafeVideoPlayer = typeof VideoPlayer !== 'undefined' ? VideoPlayer : YT_WATCH.VideoPlayer;
const SafeCommentSection = typeof CommentSection !== 'undefined' ? CommentSection : YT_WATCH.CommentSection;
const SafeVIDEOS = (typeof VIDEOS !== 'undefined' && VIDEOS) || YT_WATCH.VIDEOS || [];
const SafeCHANNELS = (typeof CHANNELS !== 'undefined' && CHANNELS) || YT_WATCH.CHANNELS || [];

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);
const { useState, useEffect, useMemo, useCallback } = React || {};

/**
 * Download SVG Icon
 */
function DownloadIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M17 18v1H6v-1h11zm-.5-6.6l-.7-.7-3.8 3.79V4h-1v10.49l-3.8-3.8-.7.7 5 5 5-4.99z" />
    </svg>
  );
}

/**
 * Save / Bookmark SVG Icon
 */
function SaveIcon({ className = "w-5 h-5", isSaved = false, ...props }) {
  if (isSaved) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z" />
    </svg>
  );
}

/**
 * Helper to parse an estimated like count from views string.
 */
function parseBaseLikes(viewsStr) {
  if (!viewsStr) return 42000;
  const match = String(viewsStr).match(/([\d.]+)\s*([KMBkmb]?)/);
  if (!match) return 42000;
  const num = parseFloat(match[1]);
  const unit = (match[2] || '').toUpperCase();
  let multiplier = 1;
  if (unit === 'K') multiplier = 1000;
  else if (unit === 'M') multiplier = 1000000;
  else if (unit === 'B') multiplier = 1000000000;
  const estimated = Math.round(num * multiplier * 0.045);
  return estimated > 0 ? estimated : 42000;
}

/**
 * Helper to format like counts nicely (e.g. 1.2M, 42K).
 */
function formatCount(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return String(num);
}

/**
 * WatchPage Component
 *
 * @param {Object} props
 * @param {Object} [props.video] - Current video object
 * @param {Object} [props.channel] - Channel object corresponding to video.channelId
 * @param {Array} [props.relatedVideos] - Recommended / related videos
 * @param {Object} [props.state] - Global store state (likedVideoIds, subscribedChannelIds, etc.)
 * @param {boolean} [props.isTheaterMode=false] - Whether theater mode is currently active
 * @param {function} [props.onToggleTheater] - Callback to toggle theater mode
 * @param {function} [props.onToggleLike] - Callback to toggle like for video
 * @param {function} [props.onToggleDislike] - Callback to toggle dislike for video
 * @param {function} [props.onToggleSubscribe] - Callback to toggle subscription for channel
 * @param {function} [props.onAddComment] - Callback to submit a comment
 * @param {function} [props.onToggleCommentLike] - Callback to like a comment
 * @param {function} [props.onSelectVideo] - Callback when related video is clicked
 * @param {function} [props.onSelectChannel] - Callback when channel avatar/name is clicked
 */
export function WatchPage({
  video,
  channel,
  relatedVideos,
  state = {},
  isTheaterMode = false,
  onToggleTheater,
  onToggleLike,
  onToggleDislike,
  onToggleSubscribe,
  onAddComment,
  onToggleCommentLike,
  onSelectVideo,
  onSelectChannel
}) {
  // Resolve current video with safe fallback
  const currentVideo = video || (Array.isArray(VIDEOS) && VIDEOS.length > 0 ? VIDEOS[0] : null);

  // Resolve current channel with safe fallback
  const currentChannel = channel || (Array.isArray(CHANNELS)
    ? CHANNELS.find((c) => c.id === currentVideo?.channelId)
    : null) || {
      id: currentVideo?.channelId || 'c1',
      name: 'Channel Creator',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
      subscribers: '1.2M subscribers',
      verified: true
    };

  // Build channel lookup map for related videos
  const channelMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(CHANNELS)) {
      CHANNELS.forEach((c) => {
        if (c && c.id) map.set(c.id, c);
      });
    }
    return map;
  }, []);

  // Filter related videos (exclude currently playing video)
  const availableVideos = Array.isArray(relatedVideos) && relatedVideos.length > 0
    ? relatedVideos
    : (Array.isArray(VIDEOS) ? VIDEOS : []);

  const upNextVideos = useMemo(() => {
    if (!currentVideo) return availableVideos;
    return availableVideos.filter((v) => v.id !== currentVideo.id);
  }, [availableVideos, currentVideo?.id]);

  // Collapsible description state
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Reset description collapse when video changes
  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [currentVideo?.id]);

  // Saved / Bookmark state
  const [isSaved, setIsSaved] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Like / Dislike status from store state
  const isLiked = Boolean(
    currentVideo?.id &&
    Array.isArray(state?.likedVideoIds) &&
    state.likedVideoIds.includes(currentVideo.id)
  );

  const isDisliked = Boolean(
    currentVideo?.id &&
    Array.isArray(state?.dislikedVideoIds) &&
    state.dislikedVideoIds.includes(currentVideo.id)
  );

  const isSubscribed = Boolean(
    currentChannel?.id &&
    Array.isArray(state?.subscribedChannelIds) &&
    state.subscribedChannelIds.includes(currentChannel.id)
  );

  // Dynamic like counter calculation
  const baseLikes = useMemo(() => parseBaseLikes(currentVideo?.views), [currentVideo?.views]);
  const displayLikes = formatCount(isLiked ? baseLikes + 1 : baseLikes);

  // Comments for current video
  const videoComments = useMemo(() => {
    if (!currentVideo?.id || !state?.comments) return [];
    return state.comments[currentVideo.id] || [];
  }, [currentVideo?.id, state?.comments]);

  // Action handlers
  const handleLike = () => {
    if (onToggleLike && currentVideo?.id) {
      onToggleLike(currentVideo.id);
    }
  };

  const handleDislike = () => {
    if (onToggleDislike && currentVideo?.id) {
      onToggleDislike(currentVideo.id);
    }
  };

  const handleSubscribe = () => {
    if (onToggleSubscribe && currentChannel?.id) {
      onToggleSubscribe(currentChannel.id);
      showToast(isSubscribed ? "Subscription removed" : "Subscription added");
    }
  };

  const handleShare = () => {
    const shareUrl = typeof window !== 'undefined'
      ? window.location.href
      : `https://youtu.be/${currentVideo?.embedId || currentVideo?.id || ''}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    showToast("Link copied to clipboard");
  };

  const handleDownload = () => {
    showToast("Download started for offline viewing");
  };

  const handleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      showToast(next ? "Saved to Watch Later" : "Removed from Watch Later");
      return next;
    });
  };

  const handleSelectRelatedVideo = (videoItem) => {
    if (onSelectVideo) {
      onSelectVideo(videoItem);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectChannel = (e) => {
    e.stopPropagation();
    if (onSelectChannel && currentChannel) {
      onSelectChannel(currentChannel, e);
    }
  };

  if (!currentVideo) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center p-6 text-[#aaaaaa]">
        <p className="text-lg font-medium text-[#f1f1f1] mb-2">No video selected</p>
        <p className="text-sm">Please select a video from the home feed or search results.</p>
      </div>
    );
  }

  // Active CommentSection component
  const ActiveCommentSection = SafeCommentSection || CommentSection;


  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-[#f1f1f1]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-6 z-50 bg-[#212121] text-[#f1f1f1] px-4 py-3 rounded-lg shadow-2xl border border-[#3f3f3f] flex items-center gap-3 text-sm animate-fade-in"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Theater Mode: Wide Top Player */}
      {isTheaterMode && (
        <div className="w-full bg-black flex justify-center py-0 px-0">
          <div className="w-full max-w-[1920px] max-h-[82vh]">
            <VideoPlayer
              video={currentVideo}
              isTheaterMode={isTheaterMode}
              onToggleTheater={onToggleTheater}
            />
          </div>
        </div>
      )}

      {/* Main 2-Column Responsive Container */}
      <div className="max-w-[1780px] mx-auto px-4 md:px-6 py-4 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Player (non-theater), Details, Channel, Description, Comments */}
        <div className="flex-1 min-w-0 max-w-full lg:max-w-[calc(100%-420px)]">
          {/* Default Non-Theater Player */}
          {!isTheaterMode && (
            <div className="w-full mb-4">
              <VideoPlayer
                video={currentVideo}
                isTheaterMode={isTheaterMode}
                onToggleTheater={onToggleTheater}
              />
            </div>
          )}

          {/* Video Title */}
          <h1 className="text-lg md:text-xl font-bold text-[#f1f1f1] leading-snug break-words">
            {currentVideo.title}
          </h1>

          {/* Channel Card & Action Buttons Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3 pb-2">
            {/* Channel Info */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={currentChannel.avatarUrl}
                alt={currentChannel.name}
                onClick={handleSelectChannel}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
              />
              <div className="flex flex-col min-w-0 mr-2">
                <div
                  onClick={handleSelectChannel}
                  className="font-semibold text-sm md:text-base text-[#f1f1f1] hover:text-white cursor-pointer flex items-center gap-1 truncate"
                >
                  <span className="truncate">{currentChannel.name}</span>
                  {currentChannel.verified && (
                    <Verified className="w-3.5 h-3.5 text-[#aaaaaa] flex-shrink-0" />
                  )}
                </div>
                <span className="text-xs text-[#aaaaaa] truncate">
                  {currentChannel.subscribers}
                </span>
              </div>

              {/* Subscribe Toggle Button */}
              <button
                type="button"
                onClick={handleSubscribe}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm transition-all flex-shrink-0 ${
                  isSubscribed
                    ? 'bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1] border border-[#3f3f3f]'
                    : 'bg-white hover:bg-neutral-200 text-black font-semibold'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell className="w-4 h-4 text-[#f1f1f1]" active={true} />
                    <span>Subscribed</span>
                    <ChevronDown className="w-3 h-3 text-[#aaaaaa]" />
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </div>

            {/* Action Pills Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-shrink-0">
              {/* Segmented Like & Dislike Pill */}
              <div className="flex items-center bg-[#272727] hover:bg-[#323232] rounded-full overflow-hidden text-sm font-medium text-[#f1f1f1] transition-colors">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-3.5 py-2 hover:bg-[#3f3f3f] transition-colors rounded-l-full ${
                    isLiked ? 'text-[#3ea6ff] font-semibold bg-[#383838]' : 'text-[#f1f1f1]'
                  }`}
                  title="I like this"
                  aria-label="Like"
                >
                  <Like className="w-5 h-5" active={isLiked} />
                  <span>{displayLikes}</span>
                </button>
                <div className="w-[1px] h-6 bg-[#3f3f3f]" />
                <button
                  type="button"
                  onClick={handleDislike}
                  className={`flex items-center px-3.5 py-2 hover:bg-[#3f3f3f] transition-colors rounded-r-full ${
                    isDisliked ? 'text-[#3ea6ff] bg-[#383838]' : 'text-[#f1f1f1]'
                  }`}
                  title="I dislike this"
                  aria-label="Dislike"
                >
                  <Dislike className="w-5 h-5" active={isDisliked} />
                </button>
              </div>

              {/* Share Pill */}
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1] px-4 py-2 rounded-full text-sm font-medium transition-colors"
                title="Share"
              >
                <Share className="w-5 h-5" />
                <span>Share</span>
              </button>

              {/* Download Pill */}
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1] px-4 py-2 rounded-full text-sm font-medium transition-colors"
                title="Download"
              >
                <DownloadIcon className="w-5 h-5" />
                <span>Download</span>
              </button>

              {/* Save / Bookmark Pill */}
              <button
                type="button"
                onClick={handleSave}
                className={`flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1] px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isSaved ? 'text-[#3ea6ff]' : ''
                }`}
                title="Save"
              >
                <SaveIcon className="w-5 h-5" isSaved={isSaved} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {/* Overflow More Options */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2 bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1] rounded-full transition-colors"
                title="More actions"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Collapsible Description Container */}
          <div
            onClick={() => setIsDescriptionExpanded((prev) => !prev)}
            className="bg-[#272727]/70 hover:bg-[#272727] transition-colors rounded-xl p-3 md:p-4 mt-3 cursor-pointer text-sm select-none"
          >
            {/* Meta header: views, relative date, hashtags */}
            <div className="flex flex-wrap items-center gap-2 font-semibold text-[#f1f1f1] mb-2">
              <span>{currentVideo.views || '1.2M views'}</span>
              <span>{currentVideo.timestamp || '3 days ago'}</span>
              <span className="text-[#3ea6ff]">
                #{currentVideo.category || 'Tech'} #Trending #YouTube
              </span>
            </div>

            {/* Description Body */}
            <div
              className={`text-[#f1f1f1] leading-relaxed whitespace-pre-line ${
                isDescriptionExpanded ? '' : 'line-clamp-2'
              }`}
            >
              {currentVideo.description || 'No description provided for this video.'}
            </div>

            {/* Expanded metadata */}
            {isDescriptionExpanded && (
              <div className="mt-4 pt-4 border-t border-[#3f3f3f]/50 flex flex-col gap-2 text-xs text-[#aaaaaa]">
                <div>
                  <span className="text-neutral-400">Channel: </span>
                  <span className="text-[#f1f1f1] font-medium">{currentChannel.name}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Category: </span>
                  <span className="text-[#f1f1f1] font-medium">{currentVideo.category || 'General'}</span>
                </div>
                <div>
                  <span className="text-neutral-400">License: </span>
                  <span className="text-[#f1f1f1] font-medium">Standard YouTube License</span>
                </div>
              </div>
            )}

            {/* Toggle Action */}
            <div className="mt-2 font-semibold text-white">
              {isDescriptionExpanded ? 'Show less' : '...Show more'}
            </div>
          </div>

          {/* Interactive Comments Section */}
          <div className="mt-6">
            <ActiveCommentSection
              videoId={currentVideo.id}
              comments={videoComments}
              onAddComment={onAddComment}
              onToggleCommentLike={onToggleCommentLike}
              state={state}
            />
          </div>
        </div>

        {/* Right Sidebar Column: Up Next / Recommended Videos */}
        <aside className="w-full lg:w-[400px] xl:w-[420px] flex-shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-bold text-[#f1f1f1]">
              Up Next
            </h2>
            <span className="text-xs text-[#aaaaaa]">
              Autoplay on
            </span>
          </div>

          {/* Recommended Videos List */}
          <div className="flex flex-col gap-3">
            {upNextVideos.map((relVideo) => {
              const relChannel = channelMap.get(relVideo.channelId) || {
                name: 'Creator',
                verified: false
              };

              return (
                <div
                  key={relVideo.id}
                  onClick={() => handleSelectRelatedVideo(relVideo)}
                  className="flex gap-2.5 group cursor-pointer p-1 rounded-xl hover:bg-[#272727]/60 transition-colors"
                >
                  {/* Compact 16:9 Thumbnail */}
                  <div className="relative w-40 sm:w-44 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-neutral-800">
                    <img
                      src={relVideo.thumbnailUrl}
                      alt={relVideo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    {relVideo.duration && (
                      <span className="absolute bottom-1 right-1 bg-black/85 text-white text-[11px] font-medium px-1.5 py-0.5 rounded">
                        {relVideo.duration}
                      </span>
                    )}
                  </div>

                  {/* Video Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-start">
                    <h3 className="text-sm font-medium text-[#f1f1f1] group-hover:text-white line-clamp-2 leading-snug">
                      {relVideo.title}
                    </h3>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectChannel) {
                          onSelectChannel(relChannel, e);
                        }
                      }}
                      className="text-xs text-[#aaaaaa] hover:text-white mt-1 flex items-center gap-1 cursor-pointer truncate"
                    >
                      <span className="truncate">{relChannel.name}</span>
                      {relChannel.verified && (
                        <Verified className="w-3 h-3 text-[#aaaaaa] flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-[#aaaaaa] mt-0.5 flex items-center gap-1">
                      <span>{relVideo.views}</span>
                      <span>•</span>
                      <span>{relVideo.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default WatchPage;

// Dual-compatibility: attach exports to global YT namespace
if (typeof window !== 'undefined') {
  window.YT = window.YT || {};
  window.YT.WatchPage = WatchPage;
}

