# YouTube Web Clone — Design Document

## 1. Intent and Why
The user wants to create a responsive, modern web application that looks and behaves like **YouTube** (https://www.youtube.com/). The application will provide an authentic YouTube experience featuring a video player, feed recommendations, category filtering, search, interactive watch view with comments, and channel profiles.

## 2. Goals, Non-Goals, and Anti-Goals
### Goals
- **Authentic YouTube UI/UX**: Dark theme by default with toggle, YouTube red accents (`#FF0000`), sticky top navigation bar with search and action icons, collapsible left sidebar drawer, and category chips.
- **Home & Trending Feeds**: Multi-category video grid with thumbnail previews, duration badges, channel avatars, verified badges, view counters, and relative timestamps ("2 days ago").
- **Interactive Video Player**:
  - Embedded player supporting real video playback (YouTube IFrame player / HTML5 direct stream fallback).
  - Play/pause, scrubbing, volume slider, theater mode, and full-screen toggle.
- **Video Detail & Watch View**:
  - Main video viewport with title, view count, upload date, like/dislike buttons, share modal trigger, and save/playlist toggle.
  - Channel info card with avatar, subscriber count, and toggleable "Subscribe" button.
  - Expandable video description box.
  - Interactive comment section: add new comment, like comments, view threaded replies, and sort comments (Top comments vs. Newest first).
  - Up Next / Related videos recommendation sidebar.
- **Search & Filter**: Search input with instant filtering across video titles, descriptions, tags, and channel names, plus a dedicated search results view.
- **Channel Profile Page**: Channel banner header, avatar, subscriber count, and tabs (Home, Videos, About).
- **Client Persistence**: Save user interactions (liked videos, subscribed channels, watch history, and posted comments) to browser `localStorage`.

### Non-Goals
- Full video encoding/transcoding backend pipelines (no FFmpeg transcode cluster).
- User authentication server / OAuth2 identity provider (local user profile is used).
- Monetization / Google AdSense simulation.

### Anti-Goals
- Requiring complex external API keys (like Google Cloud YouTube Data API quota restrictions) that prevent the app from running immediately.
- Heavy build step dependencies that fail when Node.js is not present on the host.

## 3. Constraints
- Host environment has Python 3.11 installed, but does not have Node.js / npm installed in PATH.
- Must run immediately in any modern web browser with zero compilation or setup friction, while remaining 100% modular and upgradable to Next.js / Vite in the future.

## 4. Approaches Considered
1. **Modern Single-Page Web App (React + Tailwind CSS via Browser ESM)** *(Selected)*:
   - Uses React 19 and Tailwind CSS via standard ESM modules, running directly in the browser or via `python -m http.server 3000`.
   - Complete YouTube component architecture with zero build friction.
2. **Next.js / Vite Project**:
   - Would require installing Node.js via `winget` and downloading hundreds of npm packages. Rejected for immediate zero-friction runability.
3. **Python Backend (FastAPI) + React**:
   - Multi-process overhead without added value for initial client-focused UI/UX.

## 5. System Architecture & Component Design
### Directory Structure
```
youtube-clone/
├── index.html               # Main entry point with Tailwind CDN and React root mount
├── css/
│   └── styles.css           # YouTube custom scrollbars, animations, and dark mode helpers
├── js/
│   ├── app.js               # Root React application and view router (home, watch, channel, search)
│   ├── data/
│   │   └── videos.js        # Rich seed dataset of high quality videos, channels, and comments
│   ├── store/
│   │   └── state.js         # State manager (likes, subscriptions, comments, history with localStorage)
│   └── components/
│       ├── Header.js        # YouTube header, logo, search bar, voice search icon, user actions
│       ├── Sidebar.js       # Collapsible left navigation (Home, Shorts, Subscriptions, Library, History)
│       ├── CategoryPills.js # Filter chips (All, Gaming, Music, Tech, React, Podcasts, News)
│       ├── VideoGrid.js     # Responsive grid of VideoCard components
│       ├── VideoCard.js     # Individual video card with hover preview and metadata
│       ├── WatchPage.js     # Watch page: video player, details, comments, and recommendations
│       ├── VideoPlayer.js   # Video player engine with custom controls
│       ├── CommentSection.js# Comments list, comment input form, sorting, and like buttons
│       └── ChannelPage.js   # Channel banner, subscriber count, and video showcase
└── README.md                # Quick run guide
```

### Views & Navigation State
- `view: 'home'` -> Home feed with category filter chips and video grid.
- `view: 'watch'` -> Watch page for a specific `videoId`, displaying player, channel info, description, comments, and recommendations.
- `view: 'search'` -> Search results feed filtered by query.
- `view: 'channel'` -> Channel profile for a specific `channelId`.
- `view: 'history'` / `view: 'liked'` -> Saved videos from local storage.

### Persistent State Schema (`localStorage['yt_clone_state']`)
```json
{
  "theme": "dark",
  "likedVideoIds": ["vid-1", "vid-3"],
  "dislikedVideoIds": [],
  "subscribedChannelIds": ["chan-1"],
  "watchHistory": ["vid-1"],
  "comments": {
    "vid-1": [
      {
        "id": "c-user-1",
        "author": "You",
        "avatar": "https://...",
        "text": "Great explanation!",
        "timestamp": "Just now",
        "likes": 0,
        "isLiked": false
      }
    ]
  }
}
```

## 6. What's Left to the Builder
- Selection of sample streamable video IDs and aesthetic high-res thumbnails across diverse topics (tech, coding, nature, music, gaming).
- Exact icon mappings (using Lucide / SVG icons matching YouTube's exact icons).
- Smooth transitions between theater mode, standard mode, and mobile drawer.
