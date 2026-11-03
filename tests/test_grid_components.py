"""
Tests for YouTube Clone Feed Grid Components:
- CategoryPills.js
- VideoCard.js
- VideoGrid.js
"""
import os
import re

CATEGORY_PILLS_FILE = "youtube-clone/js/components/CategoryPills.js"
VIDEO_CARD_FILE = "youtube-clone/js/components/VideoCard.js"
VIDEO_GRID_FILE = "youtube-clone/js/components/VideoGrid.js"

def test_grid_components_exist():
    for f in ["CategoryPills.js", "VideoCard.js", "VideoGrid.js"]:
        p = f"youtube-clone/js/components/{f}"
        assert os.path.exists(p), f"Missing {p}"

def test_category_pills_component():
    assert os.path.exists(CATEGORY_PILLS_FILE), f"Missing {CATEGORY_PILLS_FILE}"
    with open(CATEGORY_PILLS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Check export of CategoryPills
    assert re.search(r'export\s+(?:default\s+)?(?:function|const)\s+CategoryPills\b', content) or "export default CategoryPills" in content, (
        f"CategoryPills component not exported in {CATEGORY_PILLS_FILE}"
    )

    # Check expected props
    expected_props = ["categories", "selectedCategory", "onSelectCategory"]
    for prop in expected_props:
        assert prop in content, f"CategoryPills prop '{prop}' missing in {CATEGORY_PILLS_FILE}"

    # Check active pill styling and scrollability
    assert "selectedCategory" in content, "Must handle selectedCategory condition"
    assert "bg-white" in content and "text-black" in content, (
        "CategoryPills must contain active styling: bg-white text-black"
    )
    assert "overflow-x" in content or "overflow" in content or "scroll" in content.lower(), (
        "CategoryPills must support horizontal scrolling"
    )

    # Check scroll buttons or handlers
    assert "scroll" in content.lower(), "CategoryPills must support scrolling controls"

def test_video_card_component():
    assert os.path.exists(VIDEO_CARD_FILE), f"Missing {VIDEO_CARD_FILE}"
    with open(VIDEO_CARD_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Check export of VideoCard
    assert re.search(r'export\s+(?:default\s+)?(?:function|const)\s+VideoCard\b', content) or "export default VideoCard" in content, (
        f"VideoCard component not exported in {VIDEO_CARD_FILE}"
    )

    # Check expected props
    expected_props = ["video", "channel", "onClick", "onChannelClick"]
    for prop in expected_props:
        assert prop in content, f"VideoCard prop '{prop}' missing in {VIDEO_CARD_FILE}"

    # Check video card elements: duration overlay, title, avatar, verified badge, views, timestamp
    card_elements = [
        "thumbnailUrl",
        "duration",
        "avatarUrl",
        "title",
        "views",
        "timestamp"
    ]
    for el in card_elements:
        assert el in content, f"VideoCard must reference '{el}'"

    # Check verified badge icon
    assert "Verified" in content, "VideoCard must support Verified badge icon"

    # Check channel clicking stops propagation or handles channel separately
    assert "stopPropagation" in content or "onChannelClick" in content, (
        "VideoCard must support distinct channel click handler"
    )

def test_video_grid_component():
    assert os.path.exists(VIDEO_GRID_FILE), f"Missing {VIDEO_GRID_FILE}"
    with open(VIDEO_GRID_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Check export of VideoGrid
    assert re.search(r'export\s+(?:default\s+)?(?:function|const)\s+VideoGrid\b', content) or "export default VideoGrid" in content, (
        f"VideoGrid component not exported in {VIDEO_GRID_FILE}"
    )

    # Check expected props
    expected_props = ["videos", "channels", "onSelectVideo", "onSelectChannel"]
    for prop in expected_props:
        assert prop in content, f"VideoGrid prop '{prop}' missing in {VIDEO_GRID_FILE}"

    # Check grid layout classes
    assert "grid" in content, "VideoGrid must use CSS grid"
    assert "grid-cols-1" in content and "sm:grid-cols-2" in content and "lg:grid-cols-3" in content and "xl:grid-cols-4" in content, (
        "VideoGrid must define responsive grid-cols: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    )
    assert "VideoCard" in content, "VideoGrid must render VideoCard components"

if __name__ == "__main__":
    test_grid_components_exist()
    test_category_pills_component()
    test_video_card_component()
    test_video_grid_component()
    print("ALL TESTS PASSED")
