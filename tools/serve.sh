#!/bin/sh
# Serve the game locally: http://localhost:8000
cd "$(dirname "$0")/.." && python3 -m http.server "${1:-8000}"
