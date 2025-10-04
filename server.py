#!/usr/bin/env python3
import http.server
import socketserver
import os
from functools import partial

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="joxaisolweb", **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

PORT = 5000
HOST = "0.0.0.0"

with socketserver.TCPServer((HOST, PORT), NoCacheHTTPRequestHandler) as httpd:
    httpd.allow_reuse_address = True
    print(f"Server running at http://{HOST}:{PORT}/")
    print(f"Serving files from: {os.path.abspath('joxaisolweb')}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
