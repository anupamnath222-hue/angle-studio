/**
 * YouTube Clone - CommentSection Component
 *
 * Full-featured interactive YouTube comments system:
 * - Dynamic comment counter with singular/plural formatting
 * - Sort dropdown menu (Top comments, Newest first) with active indicator
 * - Add comment input form with user avatar, active focus underline,
 *   expandable action buttons (Cancel & Comment), and input validation (empty/whitespace)
 * - Comment item cards:
 *   - User avatar with hover effects
 *   - Author username, verified creator badge, pinned comment indicator
 *   - Timestamp badge ("2 days ago", "Just now", etc.)
 *   - Comment text with collapsible "Read more" / "Show less" for long comments
 *   - Like thumbs up button with dynamic counter and active fill state
 *   - Dislike thumbs down button with active fill state
 *   - Creator heart badge
 *   - Reply button that opens inline reply composer
 *   - Nested replies accordion ("View 2 replies" / "Hide replies") with animated chevrons
 *   - Nested reply items with avatar, author, text, and like actions
 * - Resilient state handling with fallback local state and store persistence
 */

import {
  Like,
  Dislike,
  Verified,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Check,
  User
} from './Icons.js';
import {
  addComment as storeAddComment,
  toggleCommentLike as storeToggleCommentLike,
  toggleCommentDislike as storeToggleCommentDislike
} from '../store/state.js';

// Global React reference for in-browser Babel / UMD / React 18
const React = window.React || (typeof globalThis !== 'undefined' ? globalThis.React : null);
const { useState, useEffect, useMemo, useRef, useCallback } = React || {};

/**
 * YouTube 3-line sort / filter icon
 */
function SortLinesIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M21 6H3V5h18v1zm-6 5H3v1h12v-1zm-6 6H3v1h6v-1z" />
    </svg>
  );
}

/**
 * YouTube Pushpin icon for pinned comments
 */
function PinIcon({ className = "w-3.5 h-3.5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
    </svg>
  );
}

/**
 * Creator Heart icon badge
 */
function HeartIcon({ className = "w-3 h-3 text-red-500", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} focusable="false" aria-hidden="true" {...props}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

/**
 * Helper to format like counts nicely (e.g. 1.2M, 42K)
 */
function formatLikes(num) {
  if (!num || num <= 0) return '';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return String(num);
}

/**
 * CommentSection Component
 *
 * @param {Object} props
 * @param {string} props.videoId - ID of current playing video
 * @param {Array} [props.comments=[]] - Array of comment objects
 * @param {function} [props.onAddComment] - Callback when comment is submitted
 * @param {function} [props.onToggleCommentLike] - Callback when comment like is toggled
 * @param {function} [props.onToggleCommentDislike] - Callback when comment dislike is toggled
 * @param {function} [props.onAddReply] - Callback when reply is submitted
 * @param {Object} [props.currentUser] - Authenticated user info { name, avatar }
 * @param {string} [props.channelName] - Channel name for pinned comment attribution
 */
export function CommentSection({
  videoId,
  comments = [],
  onAddComment,
  onToggleCommentLike,
  onToggleCommentDislike,
  onAddReply,
  currentUser = {
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  channelName = 'Creator'
}) {
  // Local state for comments list (synced with props.comments with local fallback updates)
  const [localComments, setLocalComments] = useState(Array.isArray(comments) ? comments : []);

  // Update local state when comments prop changes or videoId changes
  useEffect(() => {
    if (Array.isArray(comments)) {
      setLocalComments(comments);
    }
  }, [comments, videoId]);

  // Main comment input state
  const [newCommentText, setNewCommentText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const commentInputRef = useRef(null);

  // Sort menu state: 'top' (Top comments) or 'newest' (Newest first)
  const [sortBy, setSortBy] = useState('top');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef(null);

  // Active inline reply state
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [replyInputText, setReplyInputText] = useState('');
  const replyInputRef = useRef(null);

  // Accordion state for nested replies: { [commentId]: boolean }
  const [expandedReplies, setExpandedReplies] = useState({});

  // Collapsible text state for long comments: { [commentId]: boolean }
  const [expandedComments, setExpandedComments] = useState({});

  // Close sort menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setIsSortMenuOpen(false);
      }
    }
    if (isSortMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortMenuOpen]);

  // Focus reply input when reply form opens
  useEffect(() => {
    if (activeReplyCommentId && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [activeReplyCommentId]);

  // Total comment count (top-level comments + nested replies)
  const totalCommentsCount = useMemo(() => {
    return localComments.reduce((acc, c) => {
      const replyCount = Array.isArray(c.replies) ? c.replies.length : 0;
      return acc + 1 + replyCount;
    }, 0);
  }, [localComments]);

  // Sorted comments according to selected sort option
  const sortedComments = useMemo(() => {
    const list = [...localComments];
    if (sortBy === 'top') {
      list.sort((a, b) => {
        // Pinned comment always stays at the top
        const aPinned = a.pinned || a.isPinned;
        const bPinned = b.pinned || b.isPinned;
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return (b.likes || 0) - (a.likes || 0);
      });
    } else if (sortBy === 'newest') {
      list.sort((a, b) => {
        const aPinned = a.pinned || a.isPinned;
        const bPinned = b.pinned || b.isPinned;
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        if (a.timestamp === 'Just now' && b.timestamp !== 'Just now') return -1;
        if (b.timestamp === 'Just now' && a.timestamp !== 'Just now') return 1;
        return 0;
      });
    }
    return list;
  }, [localComments, sortBy]);

  // Handles submitting a new top-level comment
  const handleAddComment = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const text = newCommentText.trim();
    if (!text) return;

    if (onAddComment) {
      onAddComment(videoId, text);
    } else if (typeof storeAddComment === 'function') {
      const created = storeAddComment(videoId, text, currentUser?.name || 'You');
      if (created) {
        setLocalComments(prev => [created, ...prev]);
      }
    } else {
      // Local fallback comment object
      const fallback = {
        id: 'c-' + Date.now(),
        author: currentUser?.name || 'You',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        text,
        timestamp: 'Just now',
        likes: 0,
        isLiked: false,
        isDisliked: false,
        replies: []
      };
      setLocalComments(prev => [fallback, ...prev]);
    }

    setNewCommentText('');
    setIsInputFocused(false);
  };

  // Handles toggling like on a comment
  const handleToggleLike = (commentId) => {
    if (onToggleCommentLike) {
      onToggleCommentLike(videoId, commentId);
    }

    // Update local state for immediate reactive UI
    setLocalComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const wasLiked = Boolean(c.isLiked);
        const currentLikes = c.likes || 0;
        return {
          ...c,
          isLiked: !wasLiked,
          likes: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1,
          isDisliked: false
        };
      }
      return c;
    }));

    if (!onToggleCommentLike && typeof storeToggleCommentLike === 'function') {
      storeToggleCommentLike(videoId, commentId);
    }
  };

  // Handles toggling dislike on a comment
  const handleToggleDislike = (commentId) => {
    if (onToggleCommentDislike) {
      onToggleCommentDislike(videoId, commentId);
    }

    setLocalComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const wasDisliked = Boolean(c.isDisliked);
        const wasLiked = Boolean(c.isLiked);
        const currentLikes = c.likes || 0;
        return {
          ...c,
          isDisliked: !wasDisliked,
          isLiked: false,
          likes: wasLiked ? Math.max(0, currentLikes - 1) : currentLikes
        };
      }
      return c;
    }));

    if (!onToggleCommentDislike && typeof storeToggleCommentDislike === 'function') {
      storeToggleCommentDislike(videoId, commentId);
    }
  };

  // Handles submitting an inline reply to a comment
  const handleReplySubmit = (commentId, parentAuthor) => {
    const text = replyInputText.trim();
    if (!text) return;

    const newReply = {
      id: 'r-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      author: currentUser?.name || 'You',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
      isDisliked: false
    };

    setLocalComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const currentReplies = Array.isArray(c.replies) ? c.replies : [];
        return {
          ...c,
          replies: [...currentReplies, newReply]
        };
      }
      return c;
    }));

    // Auto-expand replies accordion so user sees their new reply
    setExpandedReplies(prev => ({ ...prev, [commentId]: true }));
    setActiveReplyCommentId(null);
    setReplyInputText('');

    if (onAddReply) {
      onAddReply(videoId, commentId, text);
    }
  };

  // Handles toggling like on a nested reply
  const handleToggleReplyLike = (commentId, replyId) => {
    setLocalComments(prev => prev.map(c => {
      if (c.id === commentId && Array.isArray(c.replies)) {
        return {
          ...c,
          replies: c.replies.map(r => {
            if (r.id === replyId) {
              const wasLiked = Boolean(r.isLiked);
              const curLikes = r.likes || 0;
              return {
                ...r,
                isLiked: !wasLiked,
                likes: wasLiked ? Math.max(0, curLikes - 1) : curLikes + 1,
                isDisliked: false
              };
            }
            return r;
          })
        };
      }
      return c;
    }));
  };

  // Handles toggling dislike on a nested reply
  const handleToggleReplyDislike = (commentId, replyId) => {
    setLocalComments(prev => prev.map(c => {
      if (c.id === commentId && Array.isArray(c.replies)) {
        return {
          ...c,
          replies: c.replies.map(r => {
            if (r.id === replyId) {
              const wasDisliked = Boolean(r.isDisliked);
              const wasLiked = Boolean(r.isLiked);
              const curLikes = r.likes || 0;
              return {
                ...r,
                isDisliked: !wasDisliked,
                isLiked: false,
                likes: wasLiked ? Math.max(0, curLikes - 1) : curLikes
              };
            }
            return r;
          })
        };
      }
      return c;
    }));
  };

  return (
    <section className="w-full mt-6 text-[#f1f1f1]" aria-label="Comments">
      {/* Header: Comment count & Sort Dropdown */}
      <div className="flex items-center gap-6 mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#f1f1f1]">
          {totalCommentsCount} {totalCommentsCount === 1 ? 'Comment' : 'Comments'}
        </h2>

        {/* Sort Menu */}
        <div className="relative" ref={sortMenuRef}>
          <button
            type="button"
            onClick={() => setIsSortMenuOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-[#f1f1f1] hover:bg-[#272727] transition-colors focus:outline-none"
            aria-expanded={isSortMenuOpen}
            aria-label="Sort comments"
          >
            <SortLinesIcon className="w-5 h-5 text-[#f1f1f1]" />
            <span>Sort by</span>
          </button>

          {isSortMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-[#282828] border border-[#3f3f3f]/60 rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  setSortBy('top');
                  setIsSortMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                  sortBy === 'top'
                    ? 'bg-[#3f3f3f]/50 font-semibold text-white'
                    : 'text-[#f1f1f1] hover:bg-[#373737]'
                }`}
              >
                <span>Top comments</span>
                {sortBy === 'top' && <Check className="w-4 h-4 text-white" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSortBy('newest');
                  setIsSortMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                  sortBy === 'newest'
                    ? 'bg-[#3f3f3f]/50 font-semibold text-white'
                    : 'text-[#f1f1f1] hover:bg-[#373737]'
                }`}
              >
                <span>Newest first</span>
                {sortBy === 'newest' && <Check className="w-4 h-4 text-white" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add a comment input form */}
      <form onSubmit={handleAddComment} className="flex gap-4 mb-8 items-start">
        {/* User Avatar */}
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
          alt={currentUser?.name || 'Your avatar'}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="relative">
            <input
              ref={commentInputRef}
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              placeholder="Add a comment..."
              className="w-full bg-transparent border-b border-[#3f3f3f] focus:border-white outline-none py-1.5 text-sm text-[#f1f1f1] placeholder-neutral-400 transition-colors"
            />
          </div>

          {/* Expandable action buttons */}
          {(isInputFocused || newCommentText.length > 0) && (
            <div className="flex justify-end items-center gap-2 mt-3 animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  setNewCommentText('');
                  setIsInputFocused(false);
                }}
                className="px-4 py-2 rounded-full text-sm font-medium text-[#f1f1f1] hover:bg-[#272727] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  newCommentText.trim()
                    ? 'bg-[#3ea6ff] text-black hover:bg-[#65b8ff] cursor-pointer'
                    : 'bg-[#272727] text-neutral-500 cursor-not-allowed'
                }`}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {sortedComments.map((comment) => {
          const isPinned = Boolean(comment.pinned || comment.isPinned);
          const hasReplies = Array.isArray(comment.replies) && comment.replies.length > 0;
          const isRepliesExpanded = Boolean(expandedReplies[comment.id]);
          const isTextExpanded = Boolean(expandedComments[comment.id]);
          const isReplyFormOpen = activeReplyCommentId === comment.id;
          const isLongText = (comment.text || '').length > 220;

          return (
            <div key={comment.id} className="flex gap-4 text-sm group">
              {/* Commenter Avatar */}
              <img
                src={comment.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                alt={comment.author || 'User'}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
              />

              {/* Comment Body */}
              <div className="flex-1 min-w-0">
                {/* Pinned comment indicator */}
                {isPinned && (
                  <div className="flex items-center gap-1.5 text-xs text-[#aaaaaa] font-medium mb-1.5">
                    <PinIcon className="w-3.5 h-3.5 text-[#aaaaaa]" />
                    <span>Pinned by {comment.pinnedBy || channelName}</span>
                  </div>
                )}

                {/* Author Name and Timestamp */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-xs text-[#f1f1f1] hover:text-white cursor-pointer">
                    @{comment.author}
                  </span>
                  {comment.isCreator && (
                    <span className="bg-[#3f3f3f] text-neutral-200 text-[10px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      Creator
                    </span>
                  )}
                  <span className="text-xs text-[#aaaaaa]">
                    {comment.timestamp}
                  </span>
                </div>

                {/* Comment Text with Show more / Show less */}
                <p className="text-[#f1f1f1] text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {isLongText && !isTextExpanded
                    ? `${comment.text.slice(0, 220)}...`
                    : comment.text}
                </p>

                {isLongText && (
                  <button
                    type="button"
                    onClick={() => setExpandedComments(prev => ({
                      ...prev,
                      [comment.id]: !prev[comment.id]
                    }))}
                    className="text-xs font-semibold text-[#aaaaaa] hover:text-white mt-1 cursor-pointer block"
                  >
                    {isTextExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}

                {/* Comment Actions: Like, Dislike, Heart, Reply */}
                <div className="flex items-center gap-1 mt-2 text-xs text-[#aaaaaa]">
                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleLike(comment.id)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-full hover:bg-[#272727] hover:text-white transition-colors"
                    aria-label="Like comment"
                  >
                    <Like className="w-4 h-4" active={Boolean(comment.isLiked)} />
                    {formatLikes(comment.likes) && (
                      <span className="text-xs text-[#aaaaaa]">
                        {formatLikes(comment.likes)}
                      </span>
                    )}
                  </button>

                  {/* Dislike Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleDislike(comment.id)}
                    className="p-1.5 rounded-full hover:bg-[#272727] hover:text-white transition-colors"
                    aria-label="Dislike comment"
                  >
                    <Dislike className="w-4 h-4" active={Boolean(comment.isDisliked)} />
                  </button>

                  {/* Creator Heart */}
                  {(comment.creatorHeart || comment.heart) && (
                    <div className="flex items-center ml-1" title={`Hearted by ${channelName}`}>
                      <HeartIcon className="w-3.5 h-3.5 text-red-500 fill-current" />
                    </div>
                  )}

                  {/* Reply Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (activeReplyCommentId === comment.id) {
                        setActiveReplyCommentId(null);
                        setReplyInputText('');
                      } else {
                        setActiveReplyCommentId(comment.id);
                        setReplyInputText(`@${comment.author} `);
                      }
                    }}
                    className="font-semibold hover:text-white hover:bg-[#272727] px-3 py-1.5 rounded-full ml-1 transition-colors"
                  >
                    Reply
                  </button>
                </div>

                {/* Inline Reply Form */}
                {isReplyFormOpen && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReplySubmit(comment.id, comment.author);
                    }}
                    className="flex gap-3 mt-3 items-start animate-fadeIn"
                  >
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={currentUser?.name || 'Your avatar'}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <input
                        ref={replyInputRef}
                        type="text"
                        value={replyInputText}
                        onChange={(e) => setReplyInputText(e.target.value)}
                        placeholder="Add a reply..."
                        className="w-full bg-transparent border-b border-[#3f3f3f] focus:border-white outline-none py-1 text-sm text-[#f1f1f1] placeholder-neutral-400 transition-colors"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveReplyCommentId(null);
                            setReplyInputText('');
                          }}
                          className="px-3 py-1 rounded-full text-xs font-medium text-[#f1f1f1] hover:bg-[#272727]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!replyInputText.trim()}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            replyInputText.trim()
                              ? 'bg-[#3ea6ff] text-black hover:bg-[#65b8ff] cursor-pointer'
                              : 'bg-[#272727] text-neutral-500 cursor-not-allowed'
                          }`}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Nested Replies View / Accordion */}
                {hasReplies && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setExpandedReplies(prev => ({
                        ...prev,
                        [comment.id]: !prev[comment.id]
                      }))}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-[#3ea6ff] hover:bg-[#3ea6ff]/10 transition-colors w-fit"
                      aria-expanded={isRepliesExpanded}
                    >
                      {isRepliesExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#3ea6ff]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#3ea6ff]" />
                      )}
                      <span>
                        {isRepliesExpanded
                          ? (comment.replies.length === 1 ? 'Hide reply' : 'Hide replies')
                          : (comment.replies.length === 1 ? '1 reply' : `${comment.replies.length} replies`)}
                      </span>
                    </button>

                    {/* Replies List */}
                    {isRepliesExpanded && (
                      <div className="flex flex-col gap-4 mt-3 pl-2 border-l-2 border-[#3f3f3f]/50 ml-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3 text-sm">
                            <img
                              src={reply.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                              alt={reply.author || 'User'}
                              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-semibold text-xs text-[#f1f1f1]">
                                  @{reply.author}
                                </span>
                                <span className="text-xs text-[#aaaaaa]">
                                  {reply.timestamp}
                                </span>
                              </div>
                              <p className="text-[#f1f1f1] text-xs leading-relaxed whitespace-pre-wrap break-words">
                                {reply.text}
                              </p>
                              <div className="flex items-center gap-1 mt-1 text-xs text-[#aaaaaa]">
                                <button
                                  type="button"
                                  onClick={() => handleToggleReplyLike(comment.id, reply.id)}
                                  className="flex items-center gap-1 p-1 hover:text-white"
                                  aria-label="Like reply"
                                >
                                  <Like className="w-3.5 h-3.5" active={Boolean(reply.isLiked)} />
                                  {formatLikes(reply.likes) && (
                                    <span className="text-[11px] text-[#aaaaaa]">
                                      {formatLikes(reply.likes)}
                                    </span>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleReplyDislike(comment.id, reply.id)}
                                  className="p-1 hover:text-white"
                                  aria-label="Dislike reply"
                                >
                                  <Dislike className="w-3.5 h-3.5" active={Boolean(reply.isDisliked)} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveReplyCommentId(comment.id);
                                    setReplyInputText(`@${reply.author} `);
                                  }}
                                  className="font-semibold hover:text-white px-2 py-0.5 rounded text-[11px]"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CommentSection;
