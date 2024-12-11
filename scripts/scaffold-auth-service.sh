#!/bin/bash

# Navigate to auth-service directory
cd backend/auth-service

# Initialize npm project
npm init -y

# Install dependencies
npm install express firebase-admin jsonwebtoken dotenv cors helmet morgan express-validator winston

# Install dev dependencies
npm install -D nodemon typescript @types/express @types/node @types/jsonwebtoken @types/cors jest supertest

# Create directory structure
mkdir -p src/{config,controllers,middleware,routes,utils,services,models,errors} \
       src/__tests__/{integration,unit} \
       logs

# Create base configuration files
cat > .env << EOL
PORT=3001
NODE_ENV=development

# Firebase Config
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# JWT Config
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
EOL

# Create TypeScript configuration
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
EOL

# Update package.json scripts
cat > package.json << EOL
{
  "name": "auth-service",
  "version": "1.0.0",
  "description": "Authentication service for TaskFlow",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
EOL

echo "Auth service scaffolding complete!" 