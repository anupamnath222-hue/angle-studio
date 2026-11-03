#!/usr/bin/env python3
"""
YouTube Web Clone - Local Development Server Launcher
======================================================
Starts a lightweight HTTP server, automatically finds an open port
(defaults to 3000, with graceful fallback to 3001, 3002, etc.),
displays a friendly YouTube ASCII banner, and launches your default browser.

Usage:
    python serve.py
    python serve.py --port 3000
    python serve.py --no-browser
"""

import os
import sys
import socket
import threading
import webbrowser
import argparse
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver

BANNER = r"""
 __     __            _____ube 
 \ \   / /           |_   _|   
  \ \_/ /__  _   _     | | _   _  ___   ___   ___ 
   \   / _ \| | | |    | || | | |/ _ \ / _ \ / _ \
    | | (_) | |_| |    | || |_| | (_) | (_) |  __/
    |_|\___/ \__,_|    \_/ \__,_|\___/ \___/ \___|
       >> YouTube Web Clone (React 18 + Tailwind) <<
"""


def is_port_available(port: int, host: str = "127.0.0.1") -> bool:
    """Check if a port is available to bind."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            s.bind((host, port))
            return True
        except OSError:
            return False


def find_available_port(start_port: int = 3000, max_attempts: int = 20) -> int:
    """Find the first available port starting from start_port."""
    for port in range(start_port, start_port + max_attempts):
        if is_port_available(port):
            return port
    raise RuntimeError(
        f"Could not find an available port in range {start_port} - {start_port + max_attempts}"
    )


class YouTubeCloneHandler(SimpleHTTPRequestHandler):
    """Custom HTTP handler with clean logging and explicit MIME types."""

    extensions_map = SimpleHTTPRequestHandler.extensions_map.copy()
    extensions_map.update({
        ".js": "application/javascript",
        ".mjs": "application/javascript",
        ".json": "application/json",
        ".css": "text/css",
        ".svg": "image/svg+xml",
        ".html": "text/html; charset=utf-8",
    })

    def log_message(self, format, *args):
        # Concise console logging for requests
        sys.stderr.write(f"[{self.log_date_time_string()}] {self.address_string()} - {format % args}\n")


def run_server(port: int = 3000, auto_open: bool = True):
    """Start the HTTP server on an available port and optionally open the browser."""
    # Ensure working directory is the directory containing index.html
    clone_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(clone_dir)

    target_port = find_available_port(port)
    if target_port != port:
        print(f"\n[Note] Port {port} is currently in use. Gracefully falling back to port {target_port}.")

    url = f"http://localhost:{target_port}"

    print(BANNER)
    print("=" * 66)
    print(f"  * Local Server URL  : \033[1;32m{url}\033[0m")
    print(f"  * Serving Directory : {clone_dir}")
    print(f"  * Auto-Open Browser : {'Enabled' if auto_open else 'Disabled'}")
    print(f"  * Stop Instructions : Press \033[1;31mCtrl+C\033[0m to stop the server")
    print("=" * 66)
    print("\n[Ready] Listening for incoming requests...\n")

    if auto_open:
        def open_browser():
            try:
                webbrowser.open(url)
            except Exception as e:
                print(f"[Warning] Could not auto-launch browser: {e}")

        # Open browser shortly after server socket opens
        timer = threading.Timer(0.8, open_browser)
        timer.daemon = True
        timer.start()

    # Allow fast address reuse on restart
    socketserver.TCPServer.allow_reuse_address = True

    try:
        httpd = HTTPServer(("", target_port), YouTubeCloneHandler)
    except OSError as err:
        print(f"[Error] Failed to bind to port {target_port}: {err}")
        sys.exit(1)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n" + "=" * 66)
        print("  Shutting down YouTube Clone server... Goodbye! (Ctrl+C received)")
        print("=" * 66 + "\n")
        httpd.server_close()
        sys.exit(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="YouTube Web Clone Local Server")
    parser.add_argument(
        "-p", "--port", type=int, default=3000, help="Port to serve on (default: 3000)"
    )
    parser.add_argument(
        "--no-browser", action="store_true", help="Do not automatically launch web browser"
    )
    args = parser.parse_args()

    run_server(port=args.port, auto_open=not args.no_browser)
