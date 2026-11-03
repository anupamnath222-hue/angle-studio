import os
import re
import json

def test_videos_data_format():
    filepath = "youtube-clone/js/data/videos.js"
    assert os.path.exists(filepath), f"{filepath} does not exist"
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    assert "export const VIDEOS" in content or "export const VIDEOS =" in content or "VIDEOS" in content
    assert "export const CHANNELS" in content or "export const CHANNELS =" in content or "CHANNELS" in content
    assert "export const CATEGORIES" in content or "export const CATEGORIES =" in content or "CATEGORIES" in content
    assert "embedId" in content
    assert "channelId" in content
    
    # Check categories
    categories = ["All", "Gaming", "Music", "Tech", "React", "News", "Podcasts"]
    for cat in categories:
        assert f'"{cat}"' in content or f"'{cat}'" in content, f"Category {cat} missing from CATEGORIES"
        
    # Count video entries by looking for id and embedId matches
    embed_ids = re.findall(r'embedId:\s*["\']([^"\']+)["\']', content)
    assert len(embed_ids) >= 12, f"Expected at least 12 videos, found {len(embed_ids)}"
    
    # Check required video keys
    video_keys = ["id", "title", "description", "thumbnailUrl", "videoUrl", "embedId", "channelId", "views", "timestamp", "category", "duration"]
    for key in video_keys:
        assert f"{key}:" in content, f"Expected key '{key}' in VIDEOS"
        
    # Count channel entries
    subscribers = re.findall(r'subscribers:\s*["\']([^"\']+)["\']', content)
    assert len(subscribers) >= 5, f"Expected at least 5 channels, found {len(subscribers)}"
    
    # Check required channel keys
    channel_keys = ["id", "name", "avatarUrl", "subscribers", "verified", "bannerUrl", "description"]
    for key in channel_keys:
        assert f"{key}:" in content, f"Expected key '{key}' in CHANNELS"

if __name__ == "__main__":
    test_videos_data_format()
    print("ALL TESTS PASSED")
