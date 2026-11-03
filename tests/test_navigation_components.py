import os
import re

ICONS_FILE = "youtube-clone/js/components/Icons.js"
HEADER_FILE = "youtube-clone/js/components/Header.js"
SIDEBAR_FILE = "youtube-clone/js/components/Sidebar.js"

def test_components_exist():
    for f in [ICONS_FILE, HEADER_FILE, SIDEBAR_FILE]:
        assert os.path.exists(f), f"Missing {f}"

def test_icons_exports():
    assert os.path.exists(ICONS_FILE), f"Missing {ICONS_FILE}"
    with open(ICONS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    required_icons = [
        "Search",
        "Menu",
        "Logo",
        "Home",
        "Shorts",
        "Subscriptions",
        "Library",
        "History",
        "Like",
        "Bell",
        "Mic",
        "MoreVertical",
        "Moon",
        "Sun",
        "User",
        "Verified",
        "Video",
        "Compass",
        "Flame"
    ]

    for icon in required_icons:
        assert re.search(rf'export\s+(?:const|function)\s+{icon}\b', content) or f"{icon}" in content, (
            f"Icon '{icon}' not exported or found in {ICONS_FILE}"
        )
    # Check SVG tags are present
    assert "<svg" in content and "</svg>" in content, "Icons.js must contain SVG elements"

def test_header_component():
    assert os.path.exists(HEADER_FILE), f"Missing {HEADER_FILE}"
    with open(HEADER_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Check export of Header
    assert re.search(r'export\s+(?:default\s+)?(?:function|const)\s+Header\b', content) or "export default Header" in content, (
        f"Header component not exported in {HEADER_FILE}"
    )

    # Check props handling
    expected_props = [
        "onSearch",
        "onMenuToggle",
        "currentQuery",
        "setQuery",
        "onLogoClick",
        "theme",
        "toggleTheme"
    ]
    for prop in expected_props:
        assert prop in content, f"Header prop '{prop}' missing in {HEADER_FILE}"

    # Check header UI elements: search input, mic, buttons, logo, theme toggle
    assert "input" in content.lower(), "Header must have an input element"
    assert "placeholder" in content.lower(), "Search input must have a placeholder"
    assert "onSearch" in content, "Header must trigger onSearch"
    assert "toggleTheme" in content, "Header must allow toggling theme"
    assert "Mic" in content, "Header must include Mic icon for voice search"
    assert "Logo" in content, "Header must include YouTube Logo"

def test_sidebar_component():
    assert os.path.exists(SIDEBAR_FILE), f"Missing {SIDEBAR_FILE}"
    with open(SIDEBAR_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Check export of Sidebar
    assert re.search(r'export\s+(?:default\s+)?(?:function|const)\s+Sidebar\b', content) or "export default Sidebar" in content, (
        f"Sidebar component not exported in {SIDEBAR_FILE}"
    )

    # Check props handling
    expected_props = [
        "isOpen",
        "currentView",
        "onSelectView",
        "subscriptions"
    ]
    for prop in expected_props:
        assert prop in content, f"Sidebar prop '{prop}' missing in {SIDEBAR_FILE}"

    # Check key navigation sections
    nav_items = ["Home", "Shorts", "Subscriptions", "Library", "History", "Liked"]
    for item in nav_items:
        assert item.lower() in content.lower(), f"Sidebar navigation missing '{item}' in {SIDEBAR_FILE}"

    # Check collapsed and expanded states
    assert "!isOpen" in content or "isOpen" in content, "Sidebar must handle both expanded and collapsed states"

if __name__ == "__main__":
    test_components_exist()
    test_icons_exports()
    test_header_component()
    test_sidebar_component()
    print("ALL TESTS PASSED")
