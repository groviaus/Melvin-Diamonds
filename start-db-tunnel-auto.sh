#!/bin/bash

echo "🔒 Starting auto-reconnecting SSH tunnel to database..."
echo "📡 Forwarding localhost:3307 → VPS MySQL (port 3306)"
echo ""
echo "This tunnel will automatically reconnect if it drops."
echo "Press Ctrl+C to stop."
echo ""

# Function to create tunnel
create_tunnel() {
    ssh -o ServerAliveInterval=60 -o ServerAliveCountMax=3 -L 3307:localhost:3306 deploy@62.72.12.146 -N
}

# Keep trying to reconnect
while true; do
    create_tunnel
    echo "⚠️  Tunnel disconnected. Reconnecting in 5 seconds..."
    sleep 5
done
