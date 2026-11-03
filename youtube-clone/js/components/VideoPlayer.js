/**
 * YouTube Clone - VideoPlayer Component
 *
 * Implements:
 * - YouTube IFrame Player embed with autoplay=1&rel=0&modestbranding=1
 * - Fallback to HTML5 <video controls> when embedId is absent or fails
 * - Theater mode toggle button with keyboard shortcut (t)
 * - Responsive 16:9 aspect ratio container (aspect-video)
 * - Playback error recovery with retry controls
 */

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);
const { useState, useEffect, useRef, useCallback } = React || {};

/**
 * Theater Mode Icon (SVG)
 */
function TheaterIcon({ isTheater, className = "w-5 h-5" }) {
  if (isTheater) {
    // Icon representing exit theater / return to default view
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
        <rect x="7" y="10" width="10" height="4" fill="currentColor" opacity="0.6" />
      </svg>
    );
  }
  // Icon representing enter theater mode (wide player)
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
    </svg>
  );
}

/**
 * VideoPlayer Component
 *
 * @param {Object} props
 * @param {Object} [props.video] - Video object containing embedId, title, videoUrl, thumbnailUrl
 * @param {boolean} [props.isTheaterMode=false] - Whether theater mode is currently active
 * @param {function} [props.onToggleTheater] - Callback to toggle theater mode
 * @param {string} [props.className=''] - Additional container classes
 */
export function VideoPlayer({
  video,
  isTheaterMode = false,
  onToggleTheater = () => {},
  className = ''
}) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [forceHtmlFallback, setForceHtmlFallback] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const playerContainerRef = useRef(null);

  // Reset state when video changes
  useEffect(() => {
    setHasError(false);
    setErrorMessage('');
    setForceHtmlFallback(false);
    setIsIframeLoaded(false);
  }, [video?.id, video?.embedId]);

  // Handle keyboard shortcut ('t' or 'T') for theater mode toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing inside an input, textarea, or contentEditable element
      const targetTag = e.target?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || e.target?.isContentEditable) {
        return;
      }

      if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (onToggleTheater) {
          onToggleTheater();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleTheater]);

  // Retry playback handler
  const handleRetry = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
    setIsIframeLoaded(false);
    setRetryKey((prev) => prev + 1);
  }, []);

  // Empty state if no video provided
  if (!video) {
    return (
      <div
        className={`w-full aspect-video rounded-xl bg-[#0f0f0f] border border-[#272727] flex flex-col items-center justify-center text-[#aaaaaa] select-none p-6 text-center ${className}`}
      >
        <div className="w-16 h-16 rounded-full bg-[#222222] flex items-center justify-center mb-3 text-white/50">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="text-base font-medium text-white/80">No video selected</p>
        <p className="text-sm text-neutral-400 mt-1">Select any video from the feed to start watching</p>
      </div>
    );
  }

  const hasEmbed = Boolean(video.embedId) && !forceHtmlFallback;
  const embedUrl = hasEmbed
    ? `https://www.youtube.com/embed/${video.embedId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`
    : '';

  // Container styling depending on theater mode
  const containerClasses = isTheaterMode
    ? `w-full max-h-[80vh] aspect-video bg-black relative flex items-center justify-center overflow-hidden shadow-2xl transition-all duration-300 ${className}`
    : `w-full aspect-video bg-black rounded-xl relative overflow-hidden shadow-lg transition-all duration-300 ${className}`;

  return (
    <div
      ref={playerContainerRef}
      className={`group/player ${containerClasses}`}
      tabIndex={-1}
    >
      {/* Playback Error Recovery View */}
      {hasError ? (
        <div className="absolute inset-0 z-30 bg-[#0f0f0f]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center mb-3 text-red-500">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Playback Error</h3>
          <p className="text-sm text-neutral-400 max-w-md mb-4">
            {errorMessage || "An error occurred while loading this video stream. Please check your network or try again."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="px-4 py-2 bg-white text-black hover:bg-neutral-200 active:scale-95 text-sm font-semibold rounded-full transition-transform flex items-center gap-2 shadow"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              Retry Playback
            </button>

            {hasEmbed && (
              <button
                type="button"
                onClick={() => {
                  setForceHtmlFallback(true);
                  handleRetry();
                }}
                className="px-4 py-2 bg-[#272727] hover:bg-[#333333] text-white text-sm font-medium rounded-full transition"
              >
                Try HTML5 Player
              </button>
            )}

            {video.embedId && (
              <a
                href={`https://www.youtube.com/watch?v=${video.embedId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#222222] hover:bg-[#2c2c2c] text-neutral-300 text-sm font-medium rounded-full transition inline-flex items-center gap-1.5"
              >
                Watch on YouTube
                <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            )}
          </div>
        </div>
      ) : null}

      {/* Primary Video Embed: YouTube IFrame Player */}
      {hasEmbed ? (
        <iframe
          key={`yt-iframe-${video.embedId}-${retryKey}`}
          src={embedUrl}
          title={video.title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full object-cover border-0"
          onLoad={() => setIsIframeLoaded(true)}
          onError={() => {
            setHasError(true);
            setErrorMessage("YouTube player could not be loaded.");
          }}
        />
      ) : (
        /* Fallback: HTML5 <video controls> Player when embedId is absent */
        <video
          key={`html5-video-${video.id || 'default'}-${retryKey}`}
          controls
          autoPlay
          playsInline
          poster={video.thumbnailUrl}
          className="w-full h-full object-contain bg-black"
          onLoadedData={() => setIsIframeLoaded(true)}
          onError={() => {
            setHasError(true);
            setErrorMessage("Failed to load HTML5 video source.");
          }}
        >
          {video.videoUrl && <source src={video.videoUrl} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>
      )}

      {/* Floating Control Overlay: Theater Mode Toggle */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2 opacity-0 group-hover/player:opacity-100 transition-opacity duration-200 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleTheater) {
              onToggleTheater();
            }
          }}
          title={isTheaterMode ? "Default view (t)" : "Theater mode (t)"}
          aria-label={isTheaterMode ? "Exit theater mode (t)" : "Enter theater mode (t)"}
          className="p-2 rounded-lg bg-black/75 hover:bg-black/90 text-white backdrop-blur-md transition shadow hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#3EA6FF]"
        >
          <TheaterIcon isTheater={isTheaterMode} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default VideoPlayer;
