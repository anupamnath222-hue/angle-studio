"""
Comprehensive Tests for Task 10: Root App Integration & View Router
Verifies:
- youtube-clone/js/app.js exists
- Root App component mounts to #root via ReactDOM.createRoot
- Manages active views (home, watch, search, channel, history, liked, subscriptions, shorts, library)
- Hash routing support (#watch, #channel, #search, #history, #liked, #subscriptions, #shorts, #library)
- Store state integration (likes, dislikes, subscriptions, history, comments, theme)
- Window 'yt-state-change' reactive event listening and getStoredState() refreshes
- ChannelPage isSubscribed explicit prop binding
- Safe state access against primitive return value overwrites
- Global keyboard shortcuts ('/' to focus search, 'Escape' to blur/clear)
- Theme switching support (dark/light toggles html and body classes)
- Integration in index.html with babel module script and #root element
"""
import os
import re

APP_FILE = "youtube-clone/js/app.js"
INDEX_HTML = "youtube-clone/index.html"

def test_files_exist():
    assert os.path.exists(APP_FILE), f"Missing {APP_FILE}"
    assert os.path.exists(INDEX_HTML), f"Missing {INDEX_HTML}"

def test_html_mount_and_script():
    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        html = f.read()
    assert 'id="root"' in html, "index.html must contain <div id='root'></div>"
    assert "app.js" in html, "index.html must reference app.js"
    assert "react" in html.lower(), "index.html must include React"
    assert "react-dom" in html.lower(), "index.html must include ReactDOM"
    assert "babel" in html.lower(), "index.html must include Babel standalone"
    assert '<html' in html and 'class="dark"' in html, "index.html html tag should default to dark class"

def test_app_mounting():
    with open(APP_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    assert "createRoot" in content or "ReactDOM" in content, "Must use ReactDOM.createRoot"
    assert "root" in content, "Must target #root element"
    assert re.search(r'(?:export\s+)?(?:function|const)\s+App\b', content), "Must define App component"
    assert "export default App" in content or "export { App" in content, "Must export App component"

def test_app_view_routing():
    with open(APP_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    content_lower = content.lower()
    # Views must be handled
    expected_views = ['home', 'watch', 'search', 'channel', 'history', 'liked', 'subscriptions']
    for view in expected_views:
        assert view in content_lower, f"App must support view '{view}'"

    # Hash routing functions
    assert "parsehash" in content_lower, "App must provide parseHash function"
    assert "buildhash" in content_lower, "App must provide buildHash function"
    assert "hashchange" in content_lower, "App must handle window hashchange event"
    assert "removeeventlistener" in content_lower, "Must properly clean up hashchange and keydown listeners"

    # Route parameters
    assert "v=" in content or "params.get('v')" in content or 'params.get("v")' in content, "Must parse video id parameter"
    assert "c=" in content or "params.get('c')" in content or 'params.get("c")' in content, "Must parse channel id parameter"
    assert "q=" in content or "params.get('q')" in content or 'params.get("q")' in content, "Must parse query parameter"

def test_app_component_integrations():
    with open(APP_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Required component imports
    components = ['Header', 'Sidebar', 'CategoryPills', 'VideoGrid', 'WatchPage', 'SearchResults', 'ChannelPage']
    for comp in components:
        assert comp in content, f"App must integrate {comp}"
        # Also ensure component is actually rendered as JSX tag
        assert f"<{comp}" in content, f"App must render <{comp} /> in JSX"

    # ChannelPage explicit isSubscribed prop binding
    assert re.search(r'<ChannelPage[\s\S]*?\bisSubscribed=', content), (
        "App must explicitly pass isSubscribed prop to ChannelPage"
    )

    # Required data imports
    assert "VIDEOS" in content, "App must integrate VIDEOS"
    assert "CHANNELS" in content, "App must integrate CHANNELS"
    assert "CATEGORIES" in content, "App must integrate CATEGORIES"

def test_app_store_binding():
    with open(APP_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Store state bindings
    store_fns = [
        'getStoredState',
        'toggleLike',
        'toggleDislike',
        'toggleSubscribe',
        'addComment',
        'addToHistory',
        'clearHistory',
        'toggleTheme'
    ]
    for fn in store_fns:
        assert fn in content, f"App must bind store function {fn}"

    # Assert window event listener for 'yt-state-change'
    assert "yt-state-change" in content, "App must listen for 'yt-state-change' window event"

    # Assert getStoredState() is called to refresh state
    assert "getStoredState()" in content, "App must refresh state from getStoredState()"

    # Assert that primitive return values are NOT passed into setStoreState
    bad_assignment = re.search(
        r'const\s+\w+\s*=\s*(?:toggleLike|toggleDislike|toggleSubscribe|addToHistory|clearHistory|toggleTheme)\([^)]*\);\s*setStoreState\(\w+\)',
        content
    )
    assert not bad_assignment, f"Found unsafe assignment of primitive store return value to setStoreState: {bad_assignment}"

def test_app_history_and_liked_features():
    with open(APP_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    content_lower = content.lower()
    # History clear button and empty state
    assert "clear all watch history" in content_lower or "clear watch history" in content_lower, (
        "App must render clear watch history button"
    )
    assert "watch history is empty" in content_lower or "keep track of what you watch" in content_lower, (
        "App must render empty state for watch history"
    )

    # Liked videos header and empty state
    assert "liked videos" in content_lower, "App must render Liked videos view header"
    assert "no liked videos" in content_lower, "App must render empty state for liked videos"

    # Subscriptions header and empty state
    assert "subscriptions" in content_lower, "App must render Subscriptions view header"

def test_app_keyboard_shortcuts():
    with open(APP_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Keyboard shortcuts: '/' and 'Escape'
    assert "keydown" in content.lower(), "App must register keydown listener"
    assert '"/"' in content or "'/'" in content, "App must handle '/' keyboard shortcut"
    assert "Escape" in content, "App must handle 'Escape' shortcut"
    assert 'input[placeholder="Search"]' in content or "placeholder" in content, (
        "App must focus search input when '/' is pressed"
    )

def test_app_theme_support():
    with open(APP_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    content_lower = content.lower()
    assert "theme" in content_lower, "App must manage theme state"
    assert "dark" in content_lower, "App must support dark theme"
    assert "classlist" in content_lower, "App must toggle classes via classList on document"

if __name__ == "__main__":
    test_files_exist()
    test_html_mount_and_script()
    test_app_mounting()
    test_app_view_routing()
    test_app_component_integrations()
    test_app_store_binding()
    test_app_history_and_liked_features()
    test_app_keyboard_shortcuts()
    test_app_theme_support()
    print("ALL TESTS PASSED")
