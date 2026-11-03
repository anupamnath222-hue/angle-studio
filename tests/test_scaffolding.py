import os

def test_index_html_structure():
    assert os.path.exists("youtube-clone/index.html"), "youtube-clone/index.html missing"
    with open("youtube-clone/index.html", "r", encoding="utf-8") as f:
        content = f.read()
    assert '<div id="root">' in content
    assert 'tailwind' in content.lower()
    assert 'react' in content.lower()

def test_styles_css_variables():
    assert os.path.exists("youtube-clone/css/styles.css"), "youtube-clone/css/styles.css missing"
    with open("youtube-clone/css/styles.css", "r", encoding="utf-8") as f:
        content = f.read()
    assert '#ff0000' in content.lower() or 'yt-red' in content.lower()

if __name__ == "__main__":
    test_index_html_structure()
    test_styles_css_variables()
    print("ALL TESTS PASSED")
