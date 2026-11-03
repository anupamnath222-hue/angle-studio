/**
 * YouTube Web Clone - Local Storage State Management Store
 * Manages user interactions (likes, dislikes, subscriptions, history, comments, and theme)
 * with robust self-healing defaults and error resilience.
 */

export const STORAGE_KEY = 'yt_clone_state';

export const DEFAULT_STATE = {
  theme: 'dark',
  likedVideoIds: ['v1', 'v4'],
  dislikedVideoIds: [],
  subscribedChannelIds: ['c1', 'c3'],
  watchHistory: ['v1', 'v2', 'v3'],
  comments: {
    v1: [
      {
        id: 'c-101',
        author: 'TechEnthusiast',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        text: 'This breakdown of modern web architecture is incredible! Saved me hours of research.',
        timestamp: '2 days ago',
        likes: 142,
        isLiked: false,
        isDisliked: false,
        replies: []
      },
      {
        id: 'c-102',
        author: 'CodeNewbie',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        text: 'The component state pattern here makes so much sense. Thanks for sharing!',
        timestamp: '1 day ago',
        likes: 45,
        isLiked: false,
        isDisliked: false,
        replies: []
      }
    ],
    v2: [
      {
        id: 'c-201',
        author: 'ReactDev',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
        text: 'React 19 Actions and useActionState simplify forms so much. Bye bye boilerplate!',
        timestamp: '4 days ago',
        likes: 89,
        isLiked: false,
        isDisliked: false,
        replies: []
      }
    ],
    v4: [
      {
        id: 'c-401',
        author: 'ChillCoder',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        text: 'Listening to this while debugging CSS at 2 AM. Pure zen vibes.',
        timestamp: '1 week ago',
        likes: 312,
        isLiked: true,
        isDisliked: false,
        replies: []
      }
    ]
  }
};

let memoryStorage = null;

function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
  } catch (e) {
    // Access blocked (e.g. sandboxed iframe or disabled cookies)
  }
  return null;
}

/**
 * Returns the current stored state object, self-healing with fallback defaults
 * if localStorage is missing, empty, or corrupted.
 */
export function getStoredState() {
  const storage = getStorage();
  let raw = null;

  if (storage) {
    try {
      raw = storage.getItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
    }
  } else if (memoryStorage !== null) {
    return JSON.parse(JSON.stringify(memoryStorage));
  }

  if (!raw) {
    const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState(fresh);
    return fresh;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
      saveState(fresh);
      return fresh;
    }

    // Self-healing schema validation and defaults merge
    const healed = {
      theme: typeof parsed.theme === 'string' ? parsed.theme : DEFAULT_STATE.theme,
      likedVideoIds: Array.isArray(parsed.likedVideoIds) ? parsed.likedVideoIds : [],
      dislikedVideoIds: Array.isArray(parsed.dislikedVideoIds) ? parsed.dislikedVideoIds : [],
      subscribedChannelIds: Array.isArray(parsed.subscribedChannelIds) ? parsed.subscribedChannelIds : [],
      watchHistory: Array.isArray(parsed.watchHistory) ? parsed.watchHistory : [],
      comments: (parsed.comments && typeof parsed.comments === 'object' && !Array.isArray(parsed.comments))
        ? parsed.comments
        : JSON.parse(JSON.stringify(DEFAULT_STATE.comments))
    };

    return healed;
  } catch (e) {
    console.warn('Corrupted state in localStorage, self-healing with defaults:', e);
    const fresh = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState(fresh);
    return fresh;
  }
}

/**
 * Persists state object to localStorage (or in-memory fallback) and broadcasts update event.
 */
export function saveState(state) {
  if (!state || typeof state !== 'object') return;
  const storage = getStorage();

  if (storage) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to write to localStorage:', e);
    }
  } else {
    memoryStorage = JSON.parse(JSON.stringify(state));
  }

  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      window.dispatchEvent(new CustomEvent('yt-state-change', { detail: state }));
    } catch (e) {
      // Ignore event dispatch errors in restricted environments
    }
  }
}

/**
 * Toggles like status for a video.
 * Liking removes any active dislike for the same video.
 * @returns {boolean} Whether video is currently liked
 */
export function toggleLike(videoId) {
  if (!videoId) return false;
  const state = getStoredState();
  const index = state.likedVideoIds.indexOf(videoId);
  let isLiked = false;

  if (index >= 0) {
    state.likedVideoIds.splice(index, 1);
    isLiked = false;
  } else {
    state.likedVideoIds.push(videoId);
    isLiked = true;
    state.dislikedVideoIds = state.dislikedVideoIds.filter(id => id !== videoId);
  }

  saveState(state);
  return isLiked;
}

/**
 * Toggles dislike status for a video.
 * Disliking removes any active like for the same video.
 * @returns {boolean} Whether video is currently disliked
 */
export function toggleDislike(videoId) {
  if (!videoId) return false;
  const state = getStoredState();
  const index = state.dislikedVideoIds.indexOf(videoId);
  let isDisliked = false;

  if (index >= 0) {
    state.dislikedVideoIds.splice(index, 1);
    isDisliked = false;
  } else {
    state.dislikedVideoIds.push(videoId);
    isDisliked = true;
    state.likedVideoIds = state.likedVideoIds.filter(id => id !== videoId);
  }

  saveState(state);
  return isDisliked;
}

/**
 * Toggles subscription status for a channel.
 * @returns {boolean} Whether channel is currently subscribed
 */
export function toggleSubscribe(channelId) {
  if (!channelId) return false;
  const state = getStoredState();
  const index = state.subscribedChannelIds.indexOf(channelId);
  let isSubscribed = false;

  if (index >= 0) {
    state.subscribedChannelIds.splice(index, 1);
    isSubscribed = false;
  } else {
    state.subscribedChannelIds.push(channelId);
    isSubscribed = true;
  }

  saveState(state);
  return isSubscribed;
}

/**
 * Adds a new comment to a video.
 * @returns {Object|null} The newly created comment object
 */
export function addComment(videoId, text, author = 'You') {
  if (!videoId || !text || !text.trim()) return null;
  const state = getStoredState();
  if (!state.comments[videoId]) {
    state.comments[videoId] = [];
  }

  const newComment = {
    id: 'c-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    author: author || 'You',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    text: text.trim(),
    timestamp: 'Just now',
    likes: 0,
    isLiked: false,
    isDisliked: false,
    replies: []
  };

  state.comments[videoId].unshift(newComment);
  saveState(state);
  return newComment;
}

/**
 * Toggles like on a comment and updates its like count.
 * @returns {Object|null} The updated comment object
 */
export function toggleCommentLike(videoId, commentId) {
  if (!videoId || !commentId) return null;
  const state = getStoredState();
  const comments = state.comments[videoId];
  if (!Array.isArray(comments)) return null;

  const comment = comments.find(c => c.id === commentId);
  if (!comment) return null;

  if (comment.isLiked) {
    comment.isLiked = false;
    comment.likes = Math.max(0, (comment.likes || 1) - 1);
  } else {
    comment.isLiked = true;
    comment.likes = (comment.likes || 0) + 1;
    if (comment.isDisliked) {
      comment.isDisliked = false;
    }
  }

  saveState(state);
  return comment;
}

/**
 * Toggles dislike on a comment.
 * @returns {Object|null} The updated comment object
 */
export function toggleCommentDislike(videoId, commentId) {
  if (!videoId || !commentId) return null;
  const state = getStoredState();
  const comments = state.comments[videoId];
  if (!Array.isArray(comments)) return null;

  const comment = comments.find(c => c.id === commentId);
  if (!comment) return null;

  if (comment.isDisliked) {
    comment.isDisliked = false;
  } else {
    comment.isDisliked = true;
    if (comment.isLiked) {
      comment.isLiked = false;
      comment.likes = Math.max(0, (comment.likes || 1) - 1);
    }
  }

  saveState(state);
  return comment;
}

/**
 * Adds videoId to front of watch history, removing any duplicate entries.
 */
export function addToHistory(videoId) {
  if (!videoId) return;
  const state = getStoredState();
  state.watchHistory = [videoId, ...state.watchHistory.filter(id => id !== videoId)];
  if (state.watchHistory.length > 100) {
    state.watchHistory = state.watchHistory.slice(0, 100);
  }
  saveState(state);
}

/**
 * Clears watch history.
 */
export function clearHistory() {
  const state = getStoredState();
  state.watchHistory = [];
  saveState(state);
}

/**
 * Sets user theme preference ('dark' or 'light').
 */
export function setTheme(theme) {
  const validTheme = theme === 'light' ? 'light' : 'dark';
  const state = getStoredState();
  state.theme = validTheme;
  saveState(state);
  return validTheme;
}

/**
 * Toggles theme between 'dark' and 'light'.
 */
export function toggleTheme() {
  const state = getStoredState();
  const nextTheme = state.theme === 'light' ? 'dark' : 'light';
  state.theme = nextTheme;
  saveState(state);
  return nextTheme;
}

/**
 * Gets comments array for a video.
 */
export function getComments(videoId) {
  if (!videoId) return [];
  const state = getStoredState();
  return state.comments[videoId] || [];
}

/**
 * Checks whether a video is liked.
 */
export function isLiked(videoId) {
  if (!videoId) return false;
  const state = getStoredState();
  return state.likedVideoIds.includes(videoId);
}

/**
 * Checks whether a video is disliked.
 */
export function isDisliked(videoId) {
  if (!videoId) return false;
  const state = getStoredState();
  return state.dislikedVideoIds.includes(videoId);
}

/**
 * Checks whether a channel is subscribed.
 */
export function isSubscribed(channelId) {
  if (!channelId) return false;
  const state = getStoredState();
  return state.subscribedChannelIds.includes(channelId);
}

// Dual-compatibility: attach exports to global YT namespace
if (typeof window !== 'undefined') {
  window.YT = window.YT || {};
  window.YT.STORAGE_KEY = STORAGE_KEY;
  window.YT.DEFAULT_STATE = DEFAULT_STATE;
  window.YT.getStoredState = getStoredState;
  window.YT.saveState = saveState;
  window.YT.toggleLike = toggleLike;
  window.YT.toggleDislike = toggleDislike;
  window.YT.toggleSubscribe = toggleSubscribe;
  window.YT.addComment = addComment;
  window.YT.toggleCommentLike = toggleCommentLike;
  window.YT.toggleCommentDislike = toggleCommentDislike;
  window.YT.addToHistory = addToHistory;
  window.YT.clearHistory = clearHistory;
  window.YT.setTheme = setTheme;
  window.YT.toggleTheme = toggleTheme;
  window.YT.getComments = getComments;
  window.YT.isLiked = isLiked;
  window.YT.isDisliked = isDisliked;
  window.YT.isSubscribed = isSubscribed;
}

