"""
Tests for YouTube Clone VideoPlayer Component:
- YouTube IFrame Player Embed (autoplay=1&rel=0&modestbranding=1)
- Fallback to HTML5 <video controls> when embedId is absent
- Theater mode toggle button
- Responsive 16:9 aspect ratio container (aspect-video)
- Playback error handling / recovery
"""
import os
import re

VIDEO_PLAYER_FILE = "youtube-clone/js/components/VideoPlayer.js"

def test_video_player_file_exists():
    assert os.path.exists(VIDEO_PLAYER_FILE), f"Missing {VIDEO_PLAYER_FILE}"

def test_video_player_component_structure():
    assert os.path.exists(VIDEO_PLAYER_FILE), f"Missing {VIDEO_PLAYER_FILE}"
    with open(VIDEO_PLAYER_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Check export of VideoPlayer
    assert re.search(r'export\s+(?:default\s+)?(?:function|const)\s+VideoPlayer\b', content) or "export default VideoPlayer" in content, (
        f"VideoPlayer component not exported in {VIDEO_PLAYER_FILE}"
    )

    # Check expected props
    expected_props = ["video", "isTheaterMode", "onToggleTheater"]
    for prop in expected_props:
        assert prop in content, f"VideoPlayer prop '{prop}' missing in {VIDEO_PLAYER_FILE}"

    # Check YouTube IFrame embed and query parameters
    assert "iframe" in content.lower(), "VideoPlayer must render an iframe for YouTube embed"
    assert "youtube.com/embed" in content or "youtube-nocookie.com/embed" in content, (
        "VideoPlayer must use YouTube embed URL"
    )
    assert "autoplay=1" in content, "Embed URL must include autoplay=1"
    assert "rel=0" in content, "Embed URL must include rel=0"
    assert "modestbranding=1" in content, "Embed URL must include modestbranding=1"

    # Check HTML5 video fallback
    assert "<video" in content.lower() or "video controls" in content.lower(), (
        "VideoPlayer must include HTML5 video fallback when embedId is missing"
    )

    # Check theater mode toggle
    assert "onToggleTheater" in content, "Must handle theater mode toggle"
    assert "theater" in content.lower(), "Must include theater mode controls and styling"

    # Check responsive 16:9 aspect container
    assert "aspect-video" in content, "VideoPlayer container must include 'aspect-video' class"

    # Check error handling / recovery
    assert "error" in content.lower() or "haserror" in content.lower(), (
        "VideoPlayer must support error handling or recovery state"
    )

if __name__ == "__main__":
    test_video_player_file_exists()
    test_video_player_component_structure()
    print("ALL TESTS PASSED")
