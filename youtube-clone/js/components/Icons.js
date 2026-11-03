/**
 * YouTube Clone SVG Icon Components
 * Pixel-perfect SVG icons matching the authentic YouTube design system.
 */

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);

/**
 * YouTube Search Magnifying Glass
 */
export function Search({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M20.87 20.17l-5.59-5.59A7.94 7.94 0 0017 9.5 7.5 7.5 0 109.5 17a7.94 7.94 0 005.08-1.72l5.59 5.59.7-.7zM3 9.5a6.5 6.5 0 116.5 6.5A6.51 6.51 0 013 9.5z" />
    </svg>
  );
}

/**
 * YouTube Menu Hamburger (3 Horizontal Bars)
 */
export function Menu({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
    </svg>
  );
}

/**
 * YouTube Wordmark & Red Play Button Logo
 */
export function Logo({ className = "h-5", showText = true, ...props }) {
  return (
    <div className={`flex items-center select-none cursor-pointer ${className}`} {...props}>
      <svg viewBox="0 0 90 20" className="h-5 w-auto" focusable="false" aria-hidden="true">
        <g>
          {/* Red Play Rounded Rectangle */}
          <path
            d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24907e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24907e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24907e-07 5.35042 0 10 0 10C0 10 2.24907e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"
            fill="#FF0000"
          />
          {/* White Play Triangle */}
          <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="#FFFFFF" />
        </g>
        {showText && (
          <g fill="currentColor">
            {/* "YouTube" Lettering */}
            <path d="M34.8 17.6V6.1h2.2v1.5c.6-1.1 1.6-1.7 2.8-1.7 1.3 0 2.1.5 2.5 1.5.4 1 .6 2.5.6 4.6v1.3c0 2.1-.2 3.6-.6 4.5-.4 1-1.3 1.5-2.6 1.5-1.1 0-2.1-.5-2.7-1.5v4.2H34.8v-2.9zm4.8-2.6c.2-.5.3-1.4.3-2.6v-1.6c0-1.2-.1-2.1-.3-2.6-.2-.5-.6-.8-1.2-.8-.6 0-1 .3-1.3.8v7.3c.3.5.7.8 1.3.8.6 0 1-.3 1.2-.9z" />
            <path d="M49.2 14.7h2.2c0 1.2-.2 2.1-.6 2.7-.5.7-1.3 1-2.4 1-1.3 0-2.3-.5-2.8-1.4-.6-.9-.8-2.3-.8-4.2v-1.8c0-1.9.3-3.3.9-4.3.6-.9 1.6-1.4 2.9-1.4 1.3 0 2.2.5 2.7 1.4.5.9.8 2.3.8 4.3v2.2h-5.1v.8c0 1.3.1 2.2.3 2.7.2.5.6.8 1.2.8.5 0 .9-.2 1.1-.6.2-.3.4-.9.4-1.7v-.4zm-.3-4.8c0-1.3-.1-2.1-.3-2.6-.2-.5-.6-.8-1.1-.8-.5 0-.9.3-1.1.8-.2.5-.3 1.4-.3 2.6v.9h2.8v-.9z" />
            <path d="M57.6 6.1v1.6c.6-1.2 1.5-1.8 2.6-1.8 1.1 0 1.9.5 2.3 1.4.4.9.6 2.3.6 4.3v1.8c0 2-.2 3.5-.6 4.4-.4.9-1.2 1.4-2.4 1.4-1.1 0-2-.6-2.6-1.7v1.5h-2.1V6.1h2.2zm3.2 8.7c.2-.5.3-1.4.3-2.6v-2c0-1.2-.1-2.1-.3-2.6-.2-.5-.6-.8-1.1-.8-.6 0-1.1.3-1.3.8v7.3c.2.5.7.8 1.2.8.6 0 1-.3 1.2-.9z" />
            <path d="M68.5 6.1v8.7c0 .7.1 1.2.3 1.4.2.3.5.4.9.4.5 0 .9-.3 1.3-.8V6.1h2.2v13.1h-1.8l-.3-1.3c-.6 1-1.5 1.5-2.6 1.5-1 0-1.7-.4-2.1-1.1-.4-.7-.6-1.8-.6-3.3V6.1h2.3z" />
            <path d="M78.6 4.2v2h2.5v13.1h-2.5v-2h-3v2h-2.3V4.2h2.3v9.3h3V4.2h2.5z" />
            <path d="M86.1 14.7h2.2c0 1.2-.2 2.1-.6 2.7-.5.7-1.3 1-2.4 1-1.3 0-2.3-.5-2.8-1.4-.6-.9-.8-2.3-.8-4.2v-1.8c0-1.9.3-3.3.9-4.3.6-.9 1.6-1.4 2.9-1.4 1.3 0 2.2.5 2.7 1.4.5.9.8 2.3.8 4.3v2.2H83.8v.8c0 1.3.1 2.2.3 2.7.2.5.6.8 1.2.8.5 0 .9-.2 1.1-.6.2-.3.4-.9.4-1.7v-.4zm-.3-4.8c0-1.3-.1-2.1-.3-2.6-.2-.5-.6-.8-1.1-.8-.5 0-.9.3-1.1.8-.2.5-.3 1.4-.3 2.6v.9h2.8v-.9z" />
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * YouTube Home Icon
 */
export function Home({ className = "w-6 h-6", active = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      {active ? (
        <path d="M4 21V10.08l8-6.96 8 6.96V21h-6v-6h-4v6H4z" />
      ) : (
        <path d="M12 4.33l7 6.09V20h-4v-6H9v6H5v-9.58l7-6.09m0-1.77L3 10v11h8v-6h2v6h8V10L12 2.56z" />
      )}
    </svg>
  );
}

/**
 * YouTube Shorts Icon
 */
export function Shorts({ className = "w-6 h-6", active = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      {active ? (
        <path d="M10 14.65l6-3.65-6-3.65v7.3zM17.77 8.5a4.01 4.01 0 00-2.46-4.63 3.99 3.99 0 00-5.18 1.83l-.78 1.63a1.98 1.98 0 01-2.61.94 1.99 1.99 0 01-.94-2.61l.78-1.63A6 6 0 0114.34 1.3a6.01 6.01 0 013.68 6.95l-.65 2.12a.5.5 0 00.31.62c.26.08.54-.06.62-.31l.65-2.12a5.98 5.98 0 00-1.18-.06zM6.23 15.5a4.01 4.01 0 002.46 4.63 3.99 3.99 0 005.18-1.83l.78-1.63a1.98 1.98 0 012.61-.94 1.99 1.99 0 01.94 2.61l-.78 1.63A6 6 0 019.66 22.7a6.01 6.01 0 01-3.68-6.95l.65-2.12a.5.5 0 00-.31-.62.5.5 0 00-.62.31l-.65 2.12c-.06.2-.1.41-.12.62z" />
      ) : (
        <path d="M10 14.65l6-3.65-6-3.65v7.3zM17.77 10.32l-1.2.5a3.99 3.99 0 00-1.92-2.92 4 4 0 00-4.8.72l-.78 1.63a1.98 1.98 0 01-2.61.94 1.99 1.99 0 01-.94-2.61l.78-1.63a6 6 0 017.2-1.08 5.99 5.99 0 012.87 4.38l1.4-.58a2 2 0 012.62 1.15 2 2 0 01-1.15 2.62l-1.27.53.01.07zm-11.54 3.36l1.2-.5a3.99 3.99 0 001.92 2.92 4 4 0 004.8-.72l.78-1.63a1.98 1.98 0 012.61-.94 1.99 1.99 0 01.94 2.61l-.78 1.63a6 6 0 01-7.2 1.08 5.99 5.99 0 01-2.87-4.38l-1.4.58a2 2 0 01-2.62-1.15 2 2 0 011.15-2.62l1.27-.53-.01-.07z" />
      )}
    </svg>
  );
}

/**
 * YouTube Subscriptions Icon
 */
export function Subscriptions({ className = "w-6 h-6", active = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      {active ? (
        <path d="M20 7H4V6h16v1zm2 3H2V9h20v1zm-4 4l-6-3.5v7l6-3.5zm4-2v11H2V12h20z" />
      ) : (
        <path d="M20 7H4V6h16v1zm2 3H2V9h20v1zm-2 3v8H4v-8h16m1-1H3v10h18V12zm-11 2v4l4-2-4-2z" />
      )}
    </svg>
  );
}

/**
 * YouTube Library / "You" Icon
 */
export function Library({ className = "w-6 h-6", active = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      {active ? (
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
      ) : (
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-8-2.5l6-4.5-6-4.5v9z" />
      )}
    </svg>
  );
}

/**
 * YouTube History Clock Icon
 */
export function History({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 117 7 7.07 7.07 0 01-4.95-2.05l-1.41 1.41A8.96 8.96 0 0013 21a9 9 0 100-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
    </svg>
  );
}

/**
 * YouTube Like Thumbs Up Icon
 */
export function Like({ className = "w-6 h-6", active = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      {active ? (
        <path d="M3 21h3v-9H3v9zm19-8.5c0-.83-.67-1.5-1.5-1.5h-5.83l.88-4.22.03-.32a1.5 1.5 0 00-.44-1.06L15 4.34 9.17 10.17c-.42.42-.67 1-.67 1.61V19c0 1.1.9 2 2 2h7.61c.78 0 1.45-.49 1.7-1.21l2.43-5.69c.12-.28.19-.59.19-.9v-.7z" />
      ) : (
        <path d="M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11v10h10.43c1.06 0 1.98-.67 2.19-1.61l1.34-6c.27-1.2-.64-2.39-1.99-2.39H18.77zM3 11h2v10H3V11zm15.77 2l-1.34 6H9v-7.39l4.57-4.92c.2-.21.48-.34.78-.34.34 0 .61.18.74.46.06.13.08.28.04.43L13.6 12.24l-.54 1.76H14.9h3.87c.48 0 .86.29.96.7.04.14.02.26-.04.4l-.92 4.14z" />
      )}
    </svg>
  );
}

/**
 * YouTube Dislike Thumbs Down Icon
 */
export function Dislike({ className = "w-6 h-6", active = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      {active ? (
        <path d="M21 3h-3v9h3V3zm-19 8.5c0 .83.67 1.5 1.5 1.5h5.83l-.88 4.22-.03.32c0 .41.17.79.44 1.06L9.83 19.66 15.66 13.83c.42-.42.67-1 .67-1.61V5c0-1.1-.9-2-2-2H6.72c-.78 0-1.45.49-1.7 1.21L2.59 9.9c-.12.28-.19.59-.19.9v.7z" />
      ) : (
        <path d="M17 3H6.57c-1.06 0-1.98.67-2.19 1.61l-1.34 6c-.27 1.2.64 2.39 1.99 2.39h4.23l-1.52 4.94C7.42 18.97 8.26 20 9.42 20c.58 0 1.14-.24 1.52-.65L16 13V3zm4 0h-2v10h2V3zm-6 9.39l-4.57 4.92c-.2.21-.48.34-.78.34-.34 0-.61-.18-.74-.46-.06-.13-.08-.28-.04-.43l1.53-4.99.54-1.76H9.1H5.23c-.48 0-.86-.29-.96-.7-.04-.14-.02-.26.04-.4l.92-4.14L6.57 5H15v7.39z" />
      )}
    </svg>
  );
}

/**
 * YouTube Notifications Bell Icon
 */
export function Bell({ className = "w-6 h-6", active = false, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      {active ? (
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
      ) : (
        <path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65L18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 1.35V19h16v-1.65zM16 17H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
      )}
    </svg>
  );
}

/**
 * YouTube Voice Search Microphone Icon
 */
export function Mic({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
    </svg>
  );
}

/**
 * YouTube More Options (Three Vertical Dots)
 */
export function MoreVertical({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}

/**
 * Moon Icon (Dark Mode)
 */
export function Moon({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M12.3 2a10 10 0 00-1.9 19.8 10 10 0 0010.8-12.8A8 8 0 0112.3 2z" />
    </svg>
  );
}

/**
 * Sun Icon (Light Mode)
 */
export function Sun({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0-5a1 1 0 011 1v2a1 1 0 01-2 0V3a1 1 0 011-1zm0 16a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1zm10-7a1 1 0 01-1 1h-2a1 1 0 010-2h2a1 1 0 011 1zM5 12a1 1 0 01-1 1H2a1 1 0 010-2h2a1 1 0 011 1zm14.07 7.07a1 1 0 01-1.41 0l-1.42-1.41a1 1 0 111.41-1.42l1.42 1.42a1 1 0 010 1.41zM7.76 7.76a1 1 0 01-1.42 0L4.93 6.34a1 1 0 011.41-1.41l1.42 1.41a1 1 0 010 1.42zm11.31-2.83a1 1 0 010 1.41l-1.41 1.42a1 1 0 11-1.42-1.41l1.41-1.42a1 1 0 011.42 0zM6.34 19.07a1 1 0 01-1.41-1.41l1.41-1.42a1 1 0 111.42 1.42L6.34 19.07z" />
    </svg>
  );
}

/**
 * YouTube User Profile Avatar Silhouette
 */
export function User({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  );
}

/**
 * YouTube Verified Channel Badge Icon
 */
export function Verified({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.8 14.4l-4-4 1.4-1.4 2.6 2.6 6.8-6.8 1.4 1.4-8.2 8.2z" />
    </svg>
  );
}

/**
 * YouTube Video Create (Camera with Plus)
 */
export function Video({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" />
    </svg>
  );
}

/**
 * YouTube Compass (Explore)
 */
export function Compass({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2.19-12.19L8 10l2.19 6.19L16 14l-1.81-6.19zM12 13.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
    </svg>
  );
}

/**
 * YouTube Trending Flame Icon
 */
export function Flame({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M17.55 11.2C17.32 10.9 17.05 10.64 16.75 10.42C16.48 8.79 15.65 7.34 14.39 6.32C14.07 6.06 13.68 5.86 13.27 5.75C12.87 5.63 12.45 5.61 12.04 5.68C11.64 5.76 11.26 5.92 10.93 6.17C10.6 6.41 10.33 6.73 10.16 7.1C9.69 8.1 9.77 9.27 10.38 10.2C9.57 10.24 8.78 10.59 8.19 11.17C7.39 11.96 6.95 13.06 6.99 14.19C7.03 15.33 7.55 16.39 8.41 17.13C9.37 17.96 10.65 18.39 11.94 18.33C13.24 18.27 14.47 17.72 15.38 16.79C16.39 15.77 16.92 14.34 16.85 12.91C16.83 12.33 17.07 11.75 17.55 11.2ZM12 16.5C11.17 16.5 10.5 15.83 10.5 15C10.5 14.17 11.17 13.5 12 13.5C12.83 13.5 13.5 14.17 13.5 15C13.5 15.83 12.83 16.5 12 16.5Z" />
    </svg>
  );
}

/**
 * Close / Clear (X) Icon
 */
export function Close({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );
}

/**
 * Share Curved Arrow Icon
 */
export function Share({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" />
    </svg>
  );
}

/**
 * Play Triangle Icon
 */
export function Play({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/**
 * Checkmark Icon
 */
export function Check({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

/**
 * Chevron Down Icon
 */
export function ChevronDown({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
}

/**
 * Chevron Up Icon
 */
export function ChevronUp({ className = "w-6 h-6", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    </svg>
  );
}

// Default export container with all icons
const Icons = {
  Search,
  Menu,
  Logo,
  Home,
  Shorts,
  Subscriptions,
  Library,
  History,
  Like,
  Dislike,
  Bell,
  Mic,
  MoreVertical,
  Moon,
  Sun,
  User,
  Verified,
  Video,
  Compass,
  Flame,
  Close,
  Share,
  Play,
  Check,
  ChevronDown,
  ChevronUp
};

export default Icons;
