#!/bin/bash
echo "=== AstroJyothi Health Check ==="
echo "Time: $(date)"
echo ""
echo "PM2:" && pm2 list | grep astrojyothi
echo ""
echo "Redis:" && redis-cli ping
echo ""
echo "MySQL:" && mysqladmin -u krishnalaya -p"krishna@2026#" ping 2>/dev/null || echo "Check credentials"
echo ""
echo "API:" && curl -s https://api.krishnalaya.cloud/health | jq .status
