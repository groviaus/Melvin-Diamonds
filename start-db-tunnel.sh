#!/bin/bash

echo "🔒 Starting secure SSH tunnel to database..."
echo "📡 Forwarding localhost:3307 → VPS MySQL (port 3306)"
echo ""
echo "Keep this terminal window open while developing."
echo "Press Ctrl+C to stop the tunnel."
echo ""

ssh -L 3307:localhost:3306 deploy@62.72.12.146 -N
