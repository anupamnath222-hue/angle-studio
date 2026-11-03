"""
Tests for YouTube Clone CommentSection Component:
- Comment count header with Sort dropdown (Top comments, Newest first)
- Add a comment form with user avatar, focus state, Cancel & Comment buttons, and validation
- Comment item cards:
  - User avatar
  - Author username, timestamp, verified badge / pinned indicator
  - Comment text
  - Like button with dynamic counter
  - Dislike button
  - Reply button with inline reply form
  - Nested replies view / accordion ("View replies" / "Hide replies")
"""
import os
import re

COMMENTS_FILE = "youtube-clone/js/components/CommentSection.js"

def test_comments_component_file_exists():
    assert os.path.exists(COMMENTS_FILE), f"Missing {COMMENTS_FILE}"

def test_comments_component_structure():
    assert os.path.exists(COMMENTS_FILE), f"Missing {COMMENTS_FILE}"
    with open(COMMENTS_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Export check
    assert re.search(r'export\s+(?:default\s+)?(?:function|const)\s+CommentSection\b', content) or "export default CommentSection" in content, (
        f"CommentSection component not exported in {COMMENTS_FILE}"
    )

    # Props contract: videoId, comments, onAddComment, onToggleCommentLike
    assert "videoId" in content, "CommentSection must accept videoId prop"
    assert "comments" in content, "CommentSection must accept comments prop"
    assert "onAddComment" in content or "addComment" in content, "CommentSection must support onAddComment"
    assert "onToggleCommentLike" in content or "toggleCommentLike" in content, "CommentSection must support onToggleCommentLike"

    # Header & Sort dropdown
    content_lower = content.lower()
    assert "sort" in content_lower, "Must support sort dropdown"
    assert "top comments" in content_lower or "top" in content_lower, "Must support 'Top comments' sorting option"
    assert "newest" in content_lower, "Must support 'Newest first' sorting option"

    # Add comment input form
    assert "add a comment" in content_lower or "placeholder" in content_lower, "Must have comment input with placeholder"
    assert "cancel" in content_lower, "Must have Cancel button"
    assert "comment" in content_lower, "Must have Comment button"
    assert "trim()" in content, "Must validate comment input by trimming whitespace"
    assert "disabled" in content_lower, "Comment submit button must be disabled when empty/whitespace"

    # Comment card items
    assert "avatar" in content_lower, "Must render avatar for comments"
    assert "timestamp" in content_lower or "ago" in content_lower, "Must render timestamp badge"
    assert "like" in content_lower, "Must render like button with counter"
    assert "dislike" in content_lower, "Must render dislike button"
    assert "reply" in content_lower, "Must render reply button"

    # Nested replies and accordion
    assert "replies" in content_lower, "Must support nested replies"

    # Pinned comment badge support
    assert "pinned" in content_lower, "Must support pinned comment indicator"

if __name__ == "__main__":
    test_comments_component_file_exists()
    test_comments_component_structure()
    print("ALL TESTS PASSED")
