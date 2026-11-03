"""
End-to-End Verification Test Suite for YouTube Web Clone
Task 11: End-to-End Verification & Python Server Launcher

Verifies:
1. All 18 required project files exist and are non-empty.
2. Server launcher (serve.py) syntax, port fallback logic, browser auto-open, and ASCII banner.
3. README.md documentation covering features, quickstart, shortcuts, and architecture.
4. Data integrity in videos.js (videos, channels, categories).
5. State store functions and event dispatcher in state.js.
6. Component syntax and exports across all JS modules.
7. Verification that all 10 preceding test suites execute and pass.
"""

import os
import re
import sys
import py_compile
import subprocess

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_DIR = os.path.join(WORKSPACE_ROOT, "youtube-clone")

REQUIRED_FILES = [
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
    "youtube-clone/README.md",
]


def test_all_18_files_exist():
    """Verify all 18 required project files exist and are non-empty."""
    assert len(REQUIRED_FILES) == 18, f"Expected 18 required files, got {len(REQUIRED_FILES)}"
    for r in REQUIRED_FILES:
        full_path = os.path.join(WORKSPACE_ROOT, r)
        assert os.path.exists(full_path), f"Missing required file: {r}"
        size = os.path.getsize(full_path)
        assert size > 0, f"File {r} is empty"


def test_serve_py_structure():
    """Verify serve.py compiles, has port fallback, webbrowser auto-launch, banner, and stop instruction."""
    serve_path = os.path.join(PROJECT_DIR, "serve.py")
    assert os.path.exists(serve_path), "serve.py must exist"

    # Syntax compilation check
    py_compile.compile(serve_path, doraise=True)

    with open(serve_path, "r", encoding="utf-8") as f:
        code = f.read()

    # Webbrowser auto-launch
    assert "webbrowser" in code, "serve.py must import or use webbrowser"
    assert "webbrowser.open" in code or "open(" in code, "serve.py must call webbrowser.open"

    # Port fallback handling (e.g., 3000, 3001, 3002...)
    assert "3000" in code, "serve.py must default to port 3000"
    assert "port" in code.lower() and ("try" in code or "fallback" in code or "range" in code or "while" in code), \
        "serve.py must have port fallback logic"

    # HTTP server standard library usage
    assert "http.server" in code or "HTTPServer" in code, "serve.py must use http.server"

    # Console banner and stop instructions
    assert "Ctrl+C" in code or "ctrl+c" in code.lower(), "serve.py must display stop instruction (Ctrl+C)"
    assert "YouTube" in code or "YOUTUBE" in code, "serve.py must have a friendly YouTube clone banner"


def test_readme_documentation():
    """Verify README.md covers features, quickstart, shortcuts, theme, and architecture."""
    readme_path = os.path.join(PROJECT_DIR, "README.md")
    assert os.path.exists(readme_path), "README.md must exist"

    with open(readme_path, "r", encoding="utf-8") as f:
        readme = f.read()

    assert len(readme) > 800, "README.md should be comprehensive"

    required_topics = [
        "serve.py",
        "Video Player",
        "Search",
        "Categories",
        "Channel",
        "Comments",
        "Keyboard Shortcuts",
        "Theme",
        "localStorage",
        "Architecture",
    ]
    for topic in required_topics:
        assert topic.lower() in readme.lower(), f"README.md missing section or mention of '{topic}'"


def test_data_and_store_integrity():
    """Verify videos.js and state.js export required data and methods."""
    videos_js = os.path.join(PROJECT_DIR, "js", "data", "videos.js")
    with open(videos_js, "r", encoding="utf-8") as f:
        v_code = f.read()

    assert "MOCK_VIDEOS" in v_code or "videos" in v_code.lower()
    assert "CATEGORIES" in v_code or "categories" in v_code.lower()
    assert "CHANNELS" in v_code or "channels" in v_code.lower()

    state_js = os.path.join(PROJECT_DIR, "js", "store", "state.js")
    with open(state_js, "r", encoding="utf-8") as f:
        s_code = f.read()

    store_methods = [
        "getStoredState",
        "saveState",
        "toggleLike",
        "toggleDislike",
        "toggleSubscribe",
        "addComment",
        "toggleCommentLike",
        "addToHistory",
    ]
    for method in store_methods:
        assert method in s_code, f"state.js missing method '{method}'"


def test_component_exports():
    """Verify all React components exist and export their symbols."""
    components = [
        ("Header.js", "Header"),
        ("Sidebar.js", "Sidebar"),
        ("Icons.js", "Icons"),
        ("CategoryPills.js", "CategoryPills"),
        ("VideoCard.js", "VideoCard"),
        ("VideoGrid.js", "VideoGrid"),
        ("VideoPlayer.js", "VideoPlayer"),
        ("WatchPage.js", "WatchPage"),
        ("CommentSection.js", "CommentSection"),
        ("SearchResults.js", "SearchResults"),
        ("ChannelPage.js", "ChannelPage"),
    ]

    for filename, symbol in components:
        filepath = os.path.join(PROJECT_DIR, "js", "components", filename)
        with open(filepath, "r", encoding="utf-8") as f:
            code = f.read()
        assert f"export" in code, f"{filename} must have export statements"
        assert symbol in code, f"{filename} must define or export {symbol}"


def test_all_unit_and_integration_suites_pass():
    """Run all prior 10 test files and ensure every single one passes."""
    tests_dir = os.path.join(WORKSPACE_ROOT, "tests")
    test_files = [
        f for f in sorted(os.listdir(tests_dir))
        if f.startswith("test_") and f.endswith(".py") and f != "test_e2e_suite.py"
    ]

    assert len(test_files) >= 10, f"Expected at least 10 prior test suites, found {len(test_files)}"

    for test_file in test_files:
        test_path = os.path.join(tests_dir, test_file)
        result = subprocess.run(
            [sys.executable, test_path],
            capture_output=True,
            text=True,
            cwd=WORKSPACE_ROOT,
        )
        assert result.returncode == 0, (
            f"Test suite {test_file} failed with return code {result.returncode}!\n"
            f"STDOUT: {result.stdout}\n"
            f"STDERR: {result.stderr}"
        )
        assert "ALL TESTS PASSED" in result.stdout, (
            f"Test suite {test_file} did not output 'ALL TESTS PASSED':\n{result.stdout}"
        )


def test_http_server_and_script_loading():
    """Start local HTTP server, fetch index.html and every <script type="text/babel" src="..."> tag via HTTP,
    verifying HTTP 200 OK, non-empty payload, and zero broken links."""
    import http.server
    import threading
    import urllib.request

    class CloneHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=PROJECT_DIR, **kwargs)

        def log_message(self, format, *args):
            pass  # Suppress console logging during test execution

    # Ephemeral free port (port 0)
    server = http.server.HTTPServer(("127.0.0.1", 0), CloneHandler)
    host, port = server.server_address

    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()

    try:
        base_url = f"http://127.0.0.1:{port}"

        # 1. Fetch index.html
        with urllib.request.urlopen(f"{base_url}/index.html", timeout=5) as response:
            assert response.status == 200, f"index.html returned status {response.status}"
            html_content = response.read().decode("utf-8")
            assert len(html_content) > 0, "index.html returned empty payload"
            assert '<div id="root">' in html_content, "index.html missing <div id='root'> container"

        # 2. Extract all <script type="text/babel" ... src="..."> tags
        script_sources = re.findall(
            r'<script\s+[^>]*type=["\']text/babel["\'][^>]*src=["\']([^"\']+)["\']',
            html_content
        )
        if not script_sources:
            script_sources = re.findall(
                r'<script\s+[^>]*src=["\']([^"\']+)["\'][^>]*type=["\']text/babel["\']',
                html_content
            )

        assert len(script_sources) >= 12, (
            f"Expected at least 12 babel scripts in index.html, found {len(script_sources)}: {script_sources}"
        )

        # Expected core scripts in dependency order
        expected_scripts = [
            "js/data/videos.js",
            "js/store/state.js",
            "js/components/Icons.js",
            "js/components/CategoryPills.js",
            "js/components/VideoCard.js",
            "js/components/VideoGrid.js",
            "js/components/VideoPlayer.js",
            "js/components/CommentSection.js",
            "js/components/WatchPage.js",
            "js/components/SearchResults.js",
            "js/components/ChannelPage.js",
            "js/app.js",
        ]
        for exp in expected_scripts:
            assert any(exp in s for s in script_sources), f"Missing required babel script tag for '{exp}'"

        # 3. Fetch each script via HTTP and verify 200 OK and non-empty body
        for src in script_sources:
            clean_src = src.lstrip("/")
            script_url = f"{base_url}/{clean_src}"
            with urllib.request.urlopen(script_url, timeout=5) as resp:
                assert resp.status == 200, f"Script {src} returned HTTP status {resp.status}"
                body = resp.read()
                assert len(body) > 0, f"Script {src} returned empty body"
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    print("Running test_all_18_files_exist()...")
    test_all_18_files_exist()

    print("Running test_serve_py_structure()...")
    test_serve_py_structure()

    print("Running test_readme_documentation()...")
    test_readme_documentation()

    print("Running test_data_and_store_integrity()...")
    test_data_and_store_integrity()

    print("Running test_component_exports()...")
    test_component_exports()

    print("Running test_all_unit_and_integration_suites_pass()...")
    test_all_unit_and_integration_suites_pass()

    print("Running test_http_server_and_script_loading()...")
    test_http_server_and_script_loading()

    print("ALL TESTS PASSED")
