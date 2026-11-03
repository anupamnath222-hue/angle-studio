import os
import re

STATE_FILE = "youtube-clone/js/store/state.js"

def test_state_file_exists():
    assert os.path.exists(STATE_FILE), f"{STATE_FILE} does not exist"

def test_state_store_exports():
    assert os.path.exists(STATE_FILE), f"{STATE_FILE} does not exist"
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    required_functions = [
        "getStoredState",
        "saveState",
        "toggleLike",
        "toggleDislike",
        "toggleSubscribe",
        "addComment",
        "toggleCommentLike",
        "addToHistory"
    ]

    for fn in required_functions:
        assert re.search(rf'export\s+(?:const|function)\s+{fn}\b', content), (
            f"Missing exported function: {fn} in {STATE_FILE}"
        )

def test_storage_key_and_default_state():
    assert os.path.exists(STATE_FILE), f"{STATE_FILE} does not exist"
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    assert "yt_clone_state" in content, "Missing 'yt_clone_state' storage key"
    assert "DEFAULT_STATE" in content or "defaultState" in content, "Missing default state definition"

    # Verify state schema fields are referenced
    required_state_fields = [
        "theme",
        "likedVideoIds",
        "dislikedVideoIds",
        "subscribedChannelIds",
        "watchHistory",
        "comments"
    ]
    for field in required_state_fields:
        assert field in content, f"State field '{field}' not found in {STATE_FILE}"

def test_self_healing_logic():
    assert os.path.exists(STATE_FILE), f"{STATE_FILE} does not exist"
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Must contain try/catch and fallback handling
    assert "try" in content and "catch" in content, "Missing try/catch error resilience"
    assert "JSON.parse" in content, "Missing JSON.parse"
    assert "JSON.stringify" in content, "Missing JSON.stringify"

def test_comment_and_history_operations():
    assert os.path.exists(STATE_FILE), f"{STATE_FILE} does not exist"
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    # Comment generation fields
    for field in ["author", "avatar", "text", "timestamp", "likes"]:
        assert field in content, f"Comment field '{field}' not handled in state store"

    # History deduplication check
    assert "filter" in content or "indexOf" in content or "Set" in content or "unshift" in content, (
        "History operations should include deduplication/unshift"
    )

if __name__ == "__main__":
    test_state_file_exists()
    test_state_store_exports()
    test_storage_key_and_default_state()
    test_self_healing_logic()
    test_comment_and_history_operations()
    print("ALL TESTS PASSED")
