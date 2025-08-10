#!/bin/bash

# Japasea NestJS Server - Installation and Setup Script

echo "🗾 Installing Japasea NestJS Server..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
    echo "⚠️  Please edit .env with your configuration before running the server"
else
    echo "✅ .env file already exists"
fi

# Create uploads directory
mkdir -p uploads
echo "✅ Created uploads directory"

# Build the application
echo ""
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build the application"
    exit 1
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Make sure MongoDB is running"
echo "3. Run 'npm run db:seed' to seed the database (optional)"
echo "4. Run 'npm run start:dev' to start the development server"
echo ""
echo "📚 Documentation: http://localhost:3001/api/docs (after starting the server)"
echo ""
