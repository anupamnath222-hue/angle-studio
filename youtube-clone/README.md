# YouTube Web Clone

A modern, responsive, zero-build YouTube web clone built with **React 18**, **Tailwind CSS**, **Lucide Icons**, and in-browser **Babel Standalone**. It replicates the complete core YouTube experience: video playback with rich custom controls, responsive multi-view navigation, feeds, instant search, interactive comments, channel profiles, dark/light themes, and persistent state stored in `localStorage`.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Features Overview](#features-overview)
   - [Custom Video Player](#custom-video-player)
   - [Feeds & Navigation](#feeds--navigation)
   - [Category Filtering](#category-filtering)
   - [Instant Search](#instant-search)
   - [Watch Page & Actions](#watch-page--actions)
   - [Interactive Comments](#interactive-comments)
   - [Channel Pages](#channel-pages)
   - [Dark & Light Themes](#dark--light-themes)
   - [State Persistence (localStorage)](#state-persistence-localstorage)
3. [Keyboard Shortcuts](#keyboard-shortcuts)
4. [Architecture & Project Structure](#architecture--project-structure)
5. [Running Tests](#running-tests)

---

## Quick Start

### 1. Launch with Python Server Launcher (Recommended)

Run the included standalone Python launcher from the repository root:

```bash
python youtube-clone/serve.py
```

Or from inside the `youtube-clone/` directory:

```bash
cd youtube-clone
python serve.py
```

The launcher:
- Automatically starts a local HTTP server on port `3000` (or gracefully falls back to `3001`, `3002`, etc., if port 3000 is occupied).
- Automatically launches your default web browser to `http://localhost:3000`.
- Displays an ASCII banner and server information in the console.
- Stops cleanly when you press `Ctrl+C`.

**Optional Flags:**
```bash
python serve.py --port 4000    # Serve on custom port
python serve.py --no-browser   # Start server without launching the browser
```

### 2. Alternative Launchers

You can also use any standard static file server:

- **npx serve**: `npx serve youtube-clone`
- **Python one-liner**: `cd youtube-clone && python -m http.server 3000`
- **VS Code Live Server**: Open `youtube-clone/index.html` and click "Go Live"

---

## Features Overview

### Custom Video Player
- **HTML5 Video Core**: High-definition video playback using standard HTML5 `<video>` tags with fallbacks.
- **Custom Player Controls**:
  - **Play / Pause**: Smooth click-to-play overlay with center play icon animation.
  - **Scrubbing & Seek Bar**: Custom progress bar with played progress, buffered progress, and hover time preview tooltip.
  - **Time Elapsed & Duration**: Live timestamp format (`MM:SS` / `HH:MM:SS`).
  - **Volume Slider & Mute Toggle**: Dynamic volume slider with muted/low/high volume icons.
  - **Playback Speed Selector**: Choose between `0.5x`, `0.75x`, `1x` (normal), `1.25x`, `1.5x`, and `2x`.
  - **Theater Mode**: Expand video to full window width while keeping the page content accessible below.
  - **Fullscreen API**: Toggle native browser fullscreen with Esc/F key support.
  - **Autoplay Next**: Automatically transitions to the next related video upon playback completion.

### Feeds & Navigation
- **Home Feed**: Dynamic grid of trending and recommended videos.
- **Subscriptions Feed**: Video feed curated exclusively from channels you have subscribed to.
- **Watch History**: Chronologically ordered log of every video you have watched with timestamps.
- **Liked Videos**: Collection of all videos you have liked.
- **Shorts View**: Vertical video layout preview.
- **Library View**: Central hub summarizing your history, liked videos, and playlists.
- **Responsive Sidebar**:
  - Full-width sidebar on desktop with quick links and subscription channels.
  - Compact mini-sidebar mode on medium screens.
  - Collapsible drawer overlay for mobile displays.

### Category Filtering
- Horizontal scrolling pill carousel below the top navigation bar.
- Filters video grid in real time across categories:
  - *All*, *Gaming*, *Coding*, *Music*, *Lo-Fi*, *React*, *TypeScript*, *Gadgets*, *Podcasts*, *Design*, *Science*, etc.
- Active category is highlighted with dynamic contrast styling.

### Instant Search
- Real-time search query matching across video titles, channel names, descriptions, and tags.
- Dedicated **Search Results Page** showcasing list-style video cards with metadata highlights and descriptions.
- Search input equipped with instant clear button (`X`) and voice search button mock.
- Global keyboard shortcut (`/`) focuses search bar from anywhere on the page.

### Watch Page & Actions
- Two-column cinema layout with primary video player on the left and Up Next / Related videos sidebar on the right.
- **Engagement Controls**:
  - Interactive **Like** and **Dislike** counters with active pill styling.
  - **Subscribe** button with instant state toggle and subscriber count updates.
  - **Share** dialog button with copy link support.
  - **Download**, **Clip**, and **Save to Playlist** mock action buttons.
- **Expandable Description Box**: Displays view count, relative date, formatted description text with hashtags, and a Show More / Show Less toggle.

### Interactive Comments
- Add new custom comments directly to any video.
- Real-time comment count badge.
- Interactive thumbs up (like) buttons with incrementing like counts.
- Reply to comments with threaded inline input.
- Sort comments by **Top Comments** or **Newest First**.
- Comments persist to `localStorage` per video.

### Channel Pages
- Dedicated creator profile view for every channel (`#channel/{channelName}`).
- High-resolution channel banner header and avatar.
- Channel title, verified badge, handle, subscriber count, and total video count.
- Integrated **Subscribe** button synced with global state.
- Tabbed interface: **Home**, **Videos**, **Playlists**, **Community**, **Channels**, **About**.
- Full video catalog filtered specifically for the creator.

### Dark & Light Themes
- True YouTube `#0f0f0f` dark mode enabled by default.
- Crisp, high-contrast light mode with tailored text and border contrast.
- One-click theme toggle in header using sun/moon icons.
- Active theme persists across sessions in `localStorage`.

### State Persistence (localStorage)
All user interactions are saved locally:
- **Likes & Dislikes**: Preserved per video ID.
- **Subscriptions**: Channels you subscribe to remain subscribed across reloads.
- **Watch History**: Every watched video is appended to your history.
- **Custom Comments**: New comments and comment likes stay saved.
- **Theme Preference**: Persisted across browser tabs and refreshes.
- Custom event dispatcher (`window.dispatchEvent(new CustomEvent('yt-state-change'))`) ensures instant reactivity across all mounted components.

---

## Keyboard Shortcuts

The video player and root application support standard YouTube keyboard shortcuts:

| Shortcut | Action |
|:---------|:-------|
| `Space` or `k` | Toggle Play / Pause |
| `f` | Toggle Fullscreen |
| `m` | Toggle Mute / Unmute |
| `t` | Toggle Theater Mode |
| `Arrow Left` | Seek backward 5 seconds |
| `Arrow Right` | Seek forward 5 seconds |
| `j` | Seek backward 10 seconds |
| `l` | Seek forward 10 seconds |
| `Arrow Up` | Increase volume by 5% |
| `Arrow Down` | Decrease volume by 5% |
| `0` - `9` | Seek to 0% - 90% of video duration |
| `/` | Focus Search input from anywhere |
| `Escape` | Clear Search input and blur / Exit Fullscreen |

---

## Architecture & Project Structure

The project is structured into modular ES6 modules without requiring a build step:

```
youtube-clone/
├── index.html                 # Main entry HTML, CDN scripts (React, Tailwind, Babel)
├── css/
│   └── styles.css             # Custom utility classes, scrollbars, and CSS variables
├── js/
│   ├── app.js                 # Root App component, view router, and layout shell
│   ├── data/
│   │   └── videos.js          # Mock videos, channels, categories, and initial comments
│   ├── store/
│   │   └── state.js           # Central state manager, localStorage sync & event bus
│   └── components/
│       ├── Icons.js           # Lightweight Lucide SVG icon collection
│       ├── Header.js          # Top navigation bar, search input, theme toggle
│       ├── Sidebar.js         # Full and mini sidebar navigation links
│       ├── CategoryPills.js   # Horizontal scrollable category filters
│       ├── VideoCard.js       # Video preview thumbnail card with metadata
│       ├── VideoGrid.js       # Responsive multi-column grid layout
│       ├── VideoPlayer.js     # Custom HTML5 player with full controls & shortcuts
│       ├── WatchPage.js       # Two-column watch layout with action bar & related list
│       ├── CommentSection.js  # Add, like, reply, and sort comments
│       ├── SearchResults.js   # Search results list view
│       └── ChannelPage.js     # Channel profile header, tabs, and video grid
├── serve.py                   # Python development server launcher
└── README.md                  # Comprehensive project documentation
```

### Key Technical Highlights
- **Zero Build Step**: Native browser ES modules loaded via `<script type="text/babel" data-type="module">`.
- **Pure React 18**: Uses modern React hooks (`useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`).
- **Tailwind CSS**: Atomic utility classes with dark mode support (`dark:` classes).
- **Reactive State Bus**: `state.js` dispatches custom DOM events on state mutation, allowing components to subscribe to state updates without heavyweight third-party state libraries.

---

## Running Tests

A comprehensive Python test suite validates every layer of the application:

```bash
# Run the End-to-End verification test suite
python tests/test_e2e_suite.py

# Run all test suites in the repository
Get-ChildItem -Path tests -Filter test_*.py | ForEach-Object { python $_.FullName }
```

### Test Coverage Summary
- `test_scaffolding.py`: Directory structure, HTML skeleton, CSS styling.
- `test_data_layer.py`: Videos, categories, and channels mock data integrity.
- `test_store_state.py`: localStorage state CRUD operations and reactive events.
- `test_navigation_components.py`: Header, Sidebar, and Icons components.
- `test_grid_components.py`: CategoryPills, VideoCard, and VideoGrid components.
- `test_video_player.py`: Custom HTML5 player, controls, shortcuts, and time formatting.
- `test_watch_page.py`: Watch page layout, actions, description, and related list.
- `test_comments_component.py`: CommentSection adding, liking, replying, and sorting.
- `test_search_and_channel.py`: SearchResults and ChannelPage components.
- `test_app_integration.py`: Root App component, routing, theme switching, and mounting.
- `test_e2e_suite.py`: Complete 18-file verification, server launcher, and e2e integration.
