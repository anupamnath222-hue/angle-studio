"""
Tests for YouTube Clone SearchResults & ChannelPage Components:
- SearchResults.js:
  - Exported component SearchResults
  - Filters videos matching query in title, description, category, or channel name
  - Channel banner / showcase card when query matches a channel name
  - Horizontal YouTube search card layout (thumbnail on left, metadata & channel on right)
  - Duration badge on thumbnail
  - Verified channel badge
  - Empty state when no matches found
- ChannelPage.js:
  - Exported component ChannelPage
  - Wide channel banner image
  - Header with large avatar, channel name, verified check, handle (@handle), subscriber count, video count
  - Subscribe button with active / subscribed toggle state
  - Tab navigation: 'Videos', 'Playlists', 'About'
  - Grid of videos uploaded by this channel
  - VideoCard integration
"""
import os
import re

SEARCH_RESULTS_FILE = "youtube-clone/js/components/SearchResults.js"
CHANNEL_PAGE_FILE = "youtube-clone/js/components/ChannelPage.js"

def test_search_results_file_exists():
    assert os.path.exists(SEARCH_RESULTS_FILE), f"Missing {SEARCH_RESULTS_FILE}"

def test_channel_page_file_exists():
    assert os.path.exists(CHANNEL_PAGE_FILE), f"Missing {CHANNEL_PAGE_FILE}"

def test_search_results_structure():
    assert os.path.exists(SEARCH_RESULTS_FILE), f"Missing {SEARCH_RESULTS_FILE}"
    with open(SEARCH_RESULTS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Component export
    assert re.search(r'export\s+(?:default\s+)?(?:function|const)\s+SearchResults\b', content) or "export default SearchResults" in content, (
        f"SearchResults component not exported in {SEARCH_RESULTS_FILE}"
    )

    content_lower = content.lower()

    # Query filtering logic
    assert "query" in content_lower, "SearchResults must accept and process query prop"
    assert "title" in content_lower, "Must filter against video title"
    assert "description" in content_lower, "Must filter against video description"
    assert "filter" in content_lower or "includes" in content_lower, "Must implement search filtering"

    # Channel match feature
    assert "channel" in content_lower, "SearchResults must handle channel matching"

    # Empty state
    assert "no results" in content_lower or "no videos" in content_lower or "try different" in content_lower, (
        "Must render empty state when no results match"
    )

    # Layout elements
    assert "duration" in content_lower, "Must show video duration on search thumbnail"
    assert "thumbnail" in content_lower or "thumbnailurl" in content_lower, "Must render video thumbnail"
    assert "verified" in content_lower, "Must include verified badge for channels"

def test_channel_page_structure():
    assert os.path.exists(CHANNEL_PAGE_FILE), f"Missing {CHANNEL_PAGE_FILE}"
    with open(CHANNEL_PAGE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Component export
    assert re.search(r'export\s+(?:default\s+)?(?:function|const)\s+ChannelPage\b', content) or "export default ChannelPage" in content, (
        f"ChannelPage component not exported in {CHANNEL_PAGE_FILE}"
    )

    content_lower = content.lower()

    # Header elements
    assert "banner" in content_lower or "bannerurl" in content_lower, "ChannelPage must render channel banner"
    assert "avatar" in content_lower or "avatarurl" in content_lower, "ChannelPage must render channel avatar"
    assert "verified" in content_lower, "ChannelPage must support verified badge"
    assert "subscriber" in content_lower, "ChannelPage must render subscriber count"
    assert "subscribe" in content_lower, "ChannelPage must render subscribe button"
    assert "handle" in content_lower or "@" in content, "ChannelPage must render channel handle"

    # Tabs
    assert "videos" in content_lower, "ChannelPage must have Videos tab"
    assert "playlists" in content_lower, "ChannelPage must have Playlists tab"
    assert "about" in content_lower, "ChannelPage must have About tab"

    # Video display
    assert "VideoCard" in content or "videocard" in content_lower, "ChannelPage must integrate VideoCard component"

if __name__ == "__main__":
    test_search_results_file_exists()
    test_channel_page_file_exists()
    test_search_results_structure()
    test_channel_page_structure()
    print("ALL TESTS PASSED")
