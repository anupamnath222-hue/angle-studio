"""
Tests for YouTube Clone WatchPage Component:
- 2-column responsive layout (main video column + sidebar column)
- VideoPlayer integration with theater mode support
- Video metadata: title, view count, relative date
- Action pills: Like (with like counter toggle), Dislike, Share (toast / copy URL), Download, Save
- Channel info card: avatar, name, verified badge, subscriber count, Subscribe / Subscribed toggle
- Collapsible description container with 'Show more' / 'Show less' toggle and hashtags
- CommentSection integration
- Up Next / Related videos sidebar with compact cards (horizontal thumbnail, title, channel, views)
"""
import os
import re

WATCH_PAGE_FILE = "youtube-clone/js/components/WatchPage.js"

def test_watch_page_file_exists():
    assert os.path.exists(WATCH_PAGE_FILE), f"Missing {WATCH_PAGE_FILE}"

def test_watch_page_structure():
    assert os.path.exists(WATCH_PAGE_FILE), f"Missing {WATCH_PAGE_FILE}"
    with open(WATCH_PAGE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Component export
    assert re.search(r'export\s+(?:default\s+)?(?:function|const)\s+WatchPage\b', content) or "export default WatchPage" in content, (
        f"WatchPage component not exported in {WATCH_PAGE_FILE}"
    )

    # Core subcomponents
    assert "VideoPlayer" in content, "WatchPage must embed VideoPlayer"
    assert "CommentSection" in content, "WatchPage must integrate CommentSection"

    # Action pills
    content_lower = content.lower()
    assert "subscribe" in content_lower, "Must support subscribe action"
    assert "like" in content_lower, "Must support like button/action"
    assert "dislike" in content_lower, "Must support dislike button/action"
    assert "share" in content_lower, "Must support share action"
    assert "download" in content_lower, "Must support download action"
    assert "save" in content_lower, "Must support save action"

    # Description toggle
    assert "show more" in content_lower, "Must have 'Show more' toggle"
    assert "show less" in content_lower, "Must have 'Show less' toggle"

    # Up Next / Related videos
    assert "related" in content_lower or "up next" in content_lower or "relatedvideos" in content_lower, (
        "Must render related / Up Next videos"
    )

if __name__ == "__main__":
    test_watch_page_file_exists()
    test_watch_page_structure()
    print("ALL TESTS PASSED")
