#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║   Next.js + tRPC + Drizzle Monorepo Template Setup     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Check Node.js version
echo -e "${BLUE}[1/5]${NC} Checking Node.js version..."
NODE_VERSION=$(node -v 2>/dev/null | cut -d'v' -f2 | cut -d'.' -f1)
if [ -z "$NODE_VERSION" ]; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js version must be 18 or higher. Current: v$NODE_VERSION${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Node.js v$NODE_VERSION detected${NC}"

# Create .env file if it doesn't exist
echo -e "${BLUE}[2/5]${NC} Setting up environment variables..."
if [ -f ".env" ]; then
    echo -e "${YELLOW}  ! .env file already exists, skipping...${NC}"
else
    # Copy from example
    cp .env.example .env

    # Update DATABASE_URL with correct absolute path
    DB_PATH="$PROJECT_ROOT/packages/db/sqlite.db"
    if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sed -i.bak "s|file:/Users/yourname/path/to/project/packages/db/sqlite.db|file:$DB_PATH|g" .env
        rm -f .env.bak
    fi

    # Generate AUTH_SECRET
    AUTH_SECRET=$(openssl rand -base64 32)
    if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sed -i.bak "s|your-auth-secret-here|$AUTH_SECRET|g" .env
        rm -f .env.bak
    fi

    echo -e "${GREEN}  ✓ Created .env file with:${NC}"
    echo -e "    - DATABASE_URL pointing to local SQLite"
    echo -e "    - AUTH_SECRET generated"
fi

# Remind about GitHub OAuth
echo -e "${BLUE}[3/5]${NC} GitHub OAuth Configuration..."
echo -e "${YELLOW}  ! You need to configure GitHub OAuth credentials:${NC}"
echo ""
echo "    1. Go to https://github.com/settings/developers"
echo "    2. Click 'New OAuth App'"
echo "    3. Set Homepage URL: http://localhost:3000"
echo "    4. Set Callback URL: http://localhost:3000/api/auth/callback/github"
echo "    5. Copy Client ID and Client Secret to .env file"
echo ""

# Install dependencies
echo -e "${BLUE}[4/5]${NC} Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: npm install failed${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Dependencies installed${NC}"

# Push database schema
echo -e "${BLUE}[5/5]${NC} Setting up database..."
npm run db:push -w @repo/db
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Database setup failed${NC}"
    exit 1
fi
echo -e "${GREEN}  ✓ Database schema pushed${NC}"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗"
echo "║                  Setup Complete!                       ║"
echo "╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Next steps:"
echo "  1. Add your GitHub OAuth credentials to .env"
echo "  2. Run: npm run dev"
echo "  3. Open: http://localhost:3000"
echo ""
echo "The template includes a Todo app as an example feature."
echo "See README.md for guides on adding your own features."
echo ""
