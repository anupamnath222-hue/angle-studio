# YouTube Web Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modern, responsive YouTube web application clone with video playback, home and trending feeds, real-time search, interactive watch view with threaded comments, channel views, and localStorage persistence.

**Architecture:** Single-page application built using React 19 and Tailwind CSS via standard in-browser ES modules and Babel standalone. Components are separated by concern into modular ES modules (`components/`, `data/`, `store/`).

**Tech Stack:** React 19, Tailwind CSS, Lucide Icons (SVG), HTML5 Video / YouTube IFrame API, Python 3.11 for local HTTP serving.

**Spec:** [docs/superpowers/specs/2026-11-03-youtube-clone-design.md](file:///c:/Users/anupa/Downloads/Anti%20gravity%20-%20anupam/docs/superpowers/specs/2026-11-03-youtube-clone-design.md)

## Global Constraints
- Zero Node.js / npm runtime requirement; runs directly in modern browsers or served via Python 3.11 `python -m http.server`.
- Strict YouTube Dark Theme by default with toggleable Light Theme.
- YouTube red accent color `#FF0000` for branding, badges, active states, and video progress bar.
- Persistent client-side data for comments, likes, subscriptions, and history stored in `localStorage['yt_clone_state']`.

## Review Focus
- Stored state corruption or missing fields: store must self-heal with valid defaults when localStorage is empty or malformed.
- Video playback fallback: player must gracefully fall back to HTML5 stream if an embed ID or network request encounters an error.
- Search input with special characters: regex and query matching must escape special characters to avoid runtime crashes.
- Comment submission with whitespace: empty or whitespace-only comments must be blocked with visual validation.
- Responsive mobile / desktop breakpoint: sidebar must auto-collapse to icon mode or hidden drawer on smaller viewports.

---

### Task 1: Scaffolding, HTML Shell & Theme Styling

**Files:**
- Create: `youtube-clone/index.html`
- Create: `youtube-clone/css/styles.css`
- Test: `tests/test_scaffolding.py`

**Interfaces:**
- Produces: Base HTML mounting point `<div id="root"></div>`, CDN imports (Tailwind CSS, React 19, Babel), and YouTube custom CSS variables.

- [ ] **Step 1: Write test for HTML structure and CSS variables**
```python
# tests/test_scaffolding.py
import os

def test_index_html_structure():
    assert os.path.exists("youtube-clone/index.html")
    with open("youtube-clone/index.html", "r", encoding="utf-8") as f:
        content = f.read()
    assert '<div id="root">' in content
    assert 'tailwind' in content.lower()
    assert 'react' in content.lower()

def test_styles_css_variables():
    assert os.path.exists("youtube-clone/css/styles.css")
    with open("youtube-clone/css/styles.css", "r", encoding="utf-8") as f:
        content = f.read()
    assert '#ff0000' in content.lower() or 'yt-red' in content.lower()
```

- [ ] **Step 2: Run test to verify it fails**
Run: `python -m pytest tests/test_scaffolding.py || python tests/test_scaffolding.py`
Expected: FAIL (files do not exist yet).

- [ ] **Step 3: Create `youtube-clone/index.html` and `youtube-clone/css/styles.css`**
Implement the HTML5 template with React 19, Babel standalone, Tailwind CSS script, and YouTube scrollbar styling.

- [ ] **Step 4: Run test to verify it passes**
Run: `python tests/test_scaffolding.py`
Expected: PASS.

---

### Task 2: Seed Dataset & Data Layer

**Files:**
- Create: `youtube-clone/js/data/videos.js`
- Test: `tests/test_data_layer.py`

**Interfaces:**
- Produces: `VIDEOS`: Array of video objects (`id`, `title`, `description`, `thumbnailUrl`, `videoUrl`, `embedId`, `channelId`, `views`, `timestamp`, `category`, `duration`).
- Produces: `CHANNELS`: Map or Array of channel objects (`id`, `name`, `avatarUrl`, `subscribers`, `verified`, `bannerUrl`, `description`).
- Produces: `CATEGORIES`: Array of category strings (`"All"`, `"Gaming"`, `"Music"`, `"Tech"`, `"React"`, `"News"`, `"Podcasts"`).

- [ ] **Step 1: Write test verifying video and channel dataset integrity**
```python
# tests/test_data_layer.py
import json, re

def test_videos_data_format():
    with open("youtube-clone/js/data/videos.js", "r", encoding="utf-8") as f:
        js_code = f.read()
    assert "export const VIDEOS" in js_code or "const VIDEOS" in js_code
    assert "export const CHANNELS" in js_code or "const CHANNELS" in js_code
    assert "export const CATEGORIES" in js_code or "const CATEGORIES" in js_code
```

- [ ] **Step 2: Run test to verify it fails**
Run: `python tests/test_data_layer.py`
Expected: FAIL.

- [ ] **Step 3: Implement `youtube-clone/js/data/videos.js`**
Define at least 12 rich video entries across Gaming, Music, Tech, React, Podcasts, and News with valid YouTube embed IDs, high-res Unsplash/YouTube thumbnails, channel relations, and realistic view counts.

- [ ] **Step 4: Run test to verify it passes**
Run: `python tests/test_data_layer.py`
Expected: PASS.

---

### Task 3: Local Storage State Management Store

**Files:**
- Create: `youtube-clone/js/store/state.js`
- Test: `tests/test_store_state.py`

**Interfaces:**
- Consumes: Initial comments and video data from `js/data/videos.js`.
- Produces:
  - `getStoredState(): StateObject`
  - `saveState(state: StateObject): void`
  - `toggleLike(videoId: string): boolean`
  - `toggleDislike(videoId: string): boolean`
  - `toggleSubscribe(channelId: string): boolean`
  - `addComment(videoId: string, text: string, author?: string): CommentObject`
  - `toggleCommentLike(videoId: string, commentId: string): void`
  - `addToHistory(videoId: string): void`

- [ ] **Step 1: Write test verifying state manager structure and exports**
```python
# tests/test_store_state.py
def test_state_store_exports():
    with open("youtube-clone/js/store/state.js", "r", encoding="utf-8") as f:
        content = f.read()
    for fn in ["getStoredState", "saveState", "toggleLike", "toggleSubscribe", "addComment", "addToHistory"]:
        assert fn in content
```

- [ ] **Step 2: Run test to verify it fails**
Run: `python tests/test_store_state.py`
Expected: FAIL.

- [ ] **Step 3: Implement `youtube-clone/js/store/state.js`**
Implement the safe `localStorage` reading/writing with self-healing default state when local storage is empty or malformed.

- [ ] **Step 4: Run test to verify it passes**
Run: `python tests/test_store_state.py`
Expected: PASS.

---

### Task 4: Header & Collapsible Sidebar Navigation

**Files:**
- Create: `youtube-clone/js/components/Header.js`
- Create: `youtube-clone/js/components/Sidebar.js`
- Create: `youtube-clone/js/components/Icons.js`
- Test: `tests/test_navigation_components.py`

**Interfaces:**
- Consumes: Icons from `Icons.js`, search/view callbacks from `app.js`.
- Produces:
  - `Header({ onSearch, onMenuToggle, currentQuery, setQuery, onLogoClick, theme, toggleTheme })`
  - `Sidebar({ isOpen, currentView, onSelectView, subscriptions })`
  - `Icons`: SVG icons matching YouTube (Search, Menu, Logo, Home, Shorts, Subscriptions, Library, History, Like, Bell, Mic, MoreVertical).

- [ ] **Step 1: Write test for Header, Sidebar, and Icons component files**
```python
# tests/test_navigation_components.py
import os

def test_components_exist():
    assert os.path.exists("youtube-clone/js/components/Header.js")
    assert os.path.exists("youtube-clone/js/components/Sidebar.js")
    assert os.path.exists("youtube-clone/js/components/Icons.js")
```

- [ ] **Step 2: Run test to verify it fails**
Run: `python tests/test_navigation_components.py`
Expected: FAIL.

- [ ] **Step 3: Implement `Icons.js`, `Header.js`, and `Sidebar.js`**
Build the sticky Header with YouTube logo (red icon + wordmark), search bar with search button, mic icon, right-hand icons (create, notifications, user avatar), and theme toggle. Build the Sidebar with full mode and collapsed icon-only mode.

- [ ] **Step 4: Run test to verify it passes**
Run: `python tests/test_navigation_components.py`
Expected: PASS.

---

### Task 5: Category Filter Pills, Video Card & Video Grid

**Files:**
- Create: `youtube-clone/js/components/CategoryPills.js`
- Create: `youtube-clone/js/components/VideoCard.js`
- Create: `youtube-clone/js/components/VideoGrid.js`
- Test: `tests/test_grid_components.py`

**Interfaces:**
- Consumes: `VIDEOS`, `CHANNELS`, `CATEGORIES` from `data/videos.js`, onSelectVideo callback.
- Produces:
  - `CategoryPills({ categories, selectedCategory, onSelectCategory })`
  - `VideoCard({ video, channel, onClick, onChannelClick })`
  - `VideoGrid({ videos, channels, onSelectVideo, onSelectChannel })`

- [ ] **Step 1: Write test verifying feed components**
```python
# tests/test_grid_components.py
import os

def test_grid_components_exist():
    for f in ["CategoryPills.js", "VideoCard.js", "VideoGrid.js"]:
        assert os.path.exists(f"youtube-clone/js/components/{f}")
```

- [ ] **Step 2: Run test to verify it fails**
Run: `python tests/test_grid_components.py`
Expected: FAIL.

- [ ] **Step 3: Implement `CategoryPills.js`, `VideoCard.js`, and `VideoGrid.js`**
Render responsive YouTube video cards with hover effects, channel avatar, duration badge overlay, verified tick, formatted views, and time ago.

- [ ] **Step 4: Run test to verify it passes**
Run: `python tests/test_grid_components.py`
Expected: PASS.

---

### Task 6: Embedded Video Player Component

**Files:**
- Create: `youtube-clone/js/components/VideoPlayer.js`
- Test: `tests/test_video_player.py`

**Interfaces:**
- Consumes: `video: VideoObject`, `isTheaterMode: boolean`, `onToggleTheater: () => void`.
- Produces: `VideoPlayer({ video, isTheaterMode, onToggleTheater })` rendering YouTube IFrame player with HTML5 fallback.

- [ ] **Step 1: Write test verifying VideoPlayer component**
```python
# tests/test_video_player.py
def test_video_player_file():
    with open("youtube-clone/js/components/VideoPlayer.js", "r", encoding="utf-8") as f:
        content = f.read()
    assert "iframe" in content.lower()
    assert "embed" in content.lower() or "video" in content.lower()
```

- [ ] **Step 2: Run test to verify it fails**
Run: `python tests/test_video_player.py`
Expected: FAIL.

- [ ] **Step 3: Implement `youtube-clone/js/components/VideoPlayer.js`**
Implement the video player supporting YouTube embeds with `autoplay=1&enablejsapi=1`, aspect-video container, and fallback HTML5 video stream.

- [ ] **Step 4: Run test to verify it passes**
Run: `python tests/test_video_player.py`
Expected: PASS.

---

### Task 7: Interactive Watch Page & Up Next Sidebar

**Files:**
- Create: `youtube-clone/js/components/WatchPage.js`
- Test: `tests/test_watch_page.py`

**Interfaces:**
- Consumes: `video`, `channel`, `relatedVideos`, `state`, store actions (`toggleLike`, `toggleSubscribe`), `CommentSection`.
- Produces: `WatchPage({ video, channel, relatedVideos, onSelectVideo, onSelectChannel, state, onUpdateState })`

- [ ] **Step 1: Write test for WatchPage component**
```python
# tests/test_watch_page.py
def test_watch_page_structure():
    with open("youtube-clone/js/components/WatchPage.js", "r", encoding="utf-8") as f:
        content = f.read()
    assert "VideoPlayer" in content
    assert "CommentSection" in content
    assert "subscribe" in content.lower()
```

- [ ] **Step 2: Run test to verify it fails**
Run: `python tests/test_watch_page.py`
Expected: FAIL.

- [ ] **Step 3: Implement `youtube-clone/js/components/WatchPage.js`**
Implement video details layout: title, view count, upload date, Like/Dislike pills, Share button, Save button, channel card with Subscribe/Subscribed toggle, collapsible description box, and right-column Up Next recommended videos list.

- [ ] **Step 4: Run test to verify it passes**
Run: `python tests/test_watch_page.py`
Expected: PASS.

---

### Task 8: Interactive Comments Section

**Files:**
- Create: `youtube-clone/js/components/CommentSection.js`
- Test: `tests/test_comments_component.py`

**Interfaces:**
- Consumes: `videoId: string`, `comments: Array<Comment>`, `onAddComment`, `onToggleLike`.
- Produces: `CommentSection({ videoId, comments, onAddComment, onToggleLike })` with comment input, avatar, submit/cancel buttons, comment sorting, and like counts.

- [ ] **Step 1: Write test for CommentSection component**
```python
# tests/test_comments_component.py
def test_comments_component():
    with open("youtube-clone/js/components/CommentSection.js", "r", encoding="utf-8") as f:
        content = f.read()
    assert "CommentSection" in content
    assert "addComment" in content or "onSubmit" in content or "input" in content
```

- [ ] **Step 2: Run test to verify it fails**
Run: `python tests/test_comments_component.py`
Expected: FAIL.

- [ ] **Step 3: Implement `youtube-clone/js/components/CommentSection.js`**
Build the comment input box with active focus underline, cancel and comment buttons, comment count header with Sort dropdown (Top comments / Newest first), and comment list with avatar, author name, timestamp, text, and thumbs-up like button.

- [ ] **Step 4: Run test to verify it passes**
Run: `python tests/test_comments_component.py`
Expected: PASS.

---

### Task 9: Search Filter & Channel Profile Page

**Files:**
- Create: `youtube-clone/js/components/SearchResults.js`
- Create: `youtube-clone/js/components/ChannelPage.js`
- Test: `tests/test_search_and_channel.py`

**Interfaces:**
- Consumes: `searchQuery`, `channelId`, `VIDEOS`, `CHANNELS`.
- Produces:
  - `SearchResults({ query, videos, channels, onSelectVideo, onSelectChannel })`
  - `ChannelPage({ channel, videos, onSelectVideo, isSubscribed, onToggleSubscribe })`

- [ ] **Step 1: Write test for SearchResults and ChannelPage**
```python
# tests/test_search_and_channel.py
import os

def test_search_and_channel_files():
    assert os.path.exists("youtube-clone/js/components/SearchResults.js")
    assert os.path.exists("youtube-clone/js/components/ChannelPage.js")
```

- [ ] **Step 2: Run test to verify it fails**
Run: `python tests/test_search_and_channel.py`
Expected: FAIL.

- [ ] **Step 3: Implement `SearchResults.js` and `ChannelPage.js`**
Build horizontal search result video cards with detailed snippet descriptions. Build Channel Page with channel banner image, big avatar, subscriber stats, Subscribe button, and tabbed video showcase.

- [ ] **Step 4: Run test to verify it passes**
Run: `python tests/test_search_and_channel.py`
Expected: PASS.

---

### Task 10: Root App Integration & View Router

**Files:**
- Create: `youtube-clone/js/app.js`
- Modify: `youtube-clone/index.html`
- Test: `tests/test_app_integration.py`

**Interfaces:**
- Consumes: All components from `js/components/`, data from `js/data/videos.js`, state from `js/store/state.js`.
- Produces: Root `App` component mounting to `#root`, managing URL hash/view routing (`home`, `watch`, `search`, `channel`, `history`, `liked`).

- [ ] **Step 1: Write test for root App component and index.html mount**
```python
# tests/test_app_integration.py
def test_app_integration():
    with open("youtube-clone/js/app.js", "r", encoding="utf-8") as f:
        content = f.read()
    assert "ReactDOM" in content or "createRoot" in content
    assert "App" in content
    with open("youtube-clone/index.html", "r", encoding="utf-8") as f:
        html = f.read()
    assert "app.js" in html
```

- [ ] **Step 2: Run test to verify it fails**
Run: `python tests/test_app_integration.py`
Expected: FAIL.

- [ ] **Step 3: Implement `youtube-clone/js/app.js` and wire to `index.html`**
Integrate state synchronization, hash routing, keyboard shortcuts (e.g. `/` to focus search), and view switching.

- [ ] **Step 4: Run test to verify it passes**
Run: `python tests/test_app_integration.py`
Expected: PASS.

---

### Task 11: End-to-End Verification & Python Server Launcher

**Files:**
- Create: `youtube-clone/serve.py`
- Create: `youtube-clone/README.md`
- Test: `tests/test_e2e_suite.py`

**Interfaces:**
- Produces: Standalone Python launcher that starts a local HTTP server and opens `http://localhost:3000` in the default browser.

- [ ] **Step 1: Write comprehensive test verifying all components and launcher**
```python
# tests/test_e2e_suite.py
import os, urllib.request

def test_all_files_exist():
    required = [
        "youtube-clone/index.html",
        "youtube-clone/css/styles.css",
        "youtube-clone/js/app.js",
        "youtube-clone/js/data/videos.js",
        "youtube-clone/js/store/state.js",
        "youtube-clone/js/components/Header.js",
        "youtube-clone/js/components/Sidebar.js",
        "youtube-clone/js/components/Icons.js",
        "youtube-clone/js/components/CategoryPills.js",
        "youtube-clone/js/components/VideoCard.js",
        "youtube-clone/js/components/VideoGrid.js",
        "youtube-clone/js/components/VideoPlayer.js",
        "youtube-clone/js/components/WatchPage.js",
        "youtube-clone/js/components/CommentSection.js",
        "youtube-clone/js/components/SearchResults.js",
        "youtube-clone/js/components/ChannelPage.js",
        "youtube-clone/serve.py",
        "youtube-clone/README.md"
    ]
    for r in required:
        assert os.path.exists(r), f"Missing required file: {r}"
```

- [ ] **Step 2: Run test to verify it fails**
Run: `python tests/test_e2e_suite.py`
Expected: FAIL.

- [ ] **Step 3: Implement `youtube-clone/serve.py` and `youtube-clone/README.md`**
Create the one-click Python server launcher and detailed documentation with screenshots/feature overview.

- [ ] **Step 4: Run full test suite to verify everything passes**
Run: `python tests/test_e2e_suite.py`
Expected: PASS.
