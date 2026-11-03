/**
 * YouTube Clone - VideoGrid Component
 * Responsive CSS grid container rendering VideoCard components.
 */

import { VideoCard } from './VideoCard.js';
import { VIDEOS, CHANNELS } from '../data/videos.js';

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);
const { useMemo } = React || {};

/**
 * Responsive Video Grid Component.
 *
 * @param {Object} props
 * @param {Array} [props.videos=VIDEOS] - List of video objects to render.
 * @param {Array} [props.channels=CHANNELS] - List of channel objects for metadata mapping.
 * @param {function} [props.onSelectVideo] - Callback when a video is clicked.
 * @param {function} [props.onSelectChannel] - Callback when a channel is clicked.
 */
export function VideoGrid({
  videos = VIDEOS,
  channels = CHANNELS,
  onSelectVideo,
  onSelectChannel
}) {
  const videoList = Array.isArray(videos) ? videos : VIDEOS;
  const channelList = Array.isArray(channels) ? channels : CHANNELS;

  // Build a lookup map of channelId -> channel for fast O(1) resolution
  const channelMap = useMemo(() => {
    const map = new Map();
    if (Array.isArray(channelList)) {
      channelList.forEach((c) => {
        if (c && c.id) {
          map.set(c.id, c);
        }
      });
    }
    return map;
  }, [channelList]);

  // Handle empty state gracefully
  if (!videoList || videoList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center w-full min-h-[50vh]">
        <div className="w-20 h-20 mb-4 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-400">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
            <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No videos found</h3>
        <p className="text-sm text-neutral-400 max-w-md">
          Try selecting another category or check back later for new recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {videoList.map((video) => {
          const channel = channelMap.get(video.channelId);
          return (
            <VideoCard
              key={video.id}
              video={video}
              channel={channel}
              onClick={onSelectVideo}
              onChannelClick={onSelectChannel}
            />
          );
        })}
      </div>
    </div>
  );
}

export default VideoGrid;
