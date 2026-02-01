#!/bin/bash
# Complete Project Startup Script

set -e  # Exit on error

echo "🏥 Starting Medical Assistant Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
echo -e "${BLUE}[1/5]${NC} Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Docker not found. Please install Docker.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Start Docker containers
echo ""
echo -e "${BLUE}[2/5]${NC} Starting Docker containers..."
docker-compose up -d
echo -e "${GREEN}✓ Docker containers started${NC}"

# Wait for services to be ready
echo ""
echo -e "${BLUE}[3/5]${NC} Waiting for services to be ready..."
sleep 10
echo -e "${GREEN}✓ Services are ready${NC}"

# Build and start backend
echo ""
echo -e "${BLUE}[4/5]${NC} Starting backend application..."
cd backend
mvn clean package -DskipTests -q
java -jar target/medical-backend-*.jar &
BACKEND_PID=$!
sleep 5
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
cd ..

# Start frontend
echo ""
echo -e "${BLUE}[5/5]${NC} Starting frontend application..."
cd frontend
npm install -q
npm start &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${GREEN}✅ Medical Assistant is running!${NC}"
echo ""
echo "📱 Services:"
echo "  - Frontend:     http://localhost:3000"
echo "  - Backend API:  http://localhost:8080"
echo "  - AI Service:   http://localhost:8000"
echo "  - Prometheus:   http://localhost:9090"
echo "  - Grafana:      http://localhost:3000 (admin/admin)"
echo "  - Kibana:       http://localhost:5601"
echo ""
echo "🛑 To stop the application:"
echo "  1. Press Ctrl+C to stop frontend"
echo "  2. Kill backend: kill $BACKEND_PID"
echo "  3. Stop Docker: docker-compose down"
echo ""

# Keep script running
wait
