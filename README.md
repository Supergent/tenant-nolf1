# Minimal To-Do List Application

A clean, minimal to-do list application with real-time synchronization, built with modern web technologies.

## Features

- ✅ **Real-time synchronization** - Changes appear instantly across all devices
- 🔐 **User authentication** - Secure email/password authentication with Better Auth
- 🤖 **AI assistant** - Intelligent task suggestions and assistance
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- ⚡ **Fast & Reactive** - Powered by Convex for instant updates

## Architecture

This project follows the **four-layer Convex architecture pattern**:

1. **Database Layer** (`convex/db/`) - Pure CRUD operations, only place `ctx.db` is used
2. **Endpoint Layer** (`convex/endpoints/`) - Business logic, composes database operations
3. **Workflow Layer** (`convex/workflows/`) - Durable external service integrations
4. **Helper Layer** (`convex/helpers/`) - Pure utility functions, no database access

## Detected Components

This project uses the following Convex Components:

### Core Components
- **Better Auth** (`@convex-dev/better-auth`) - User authentication and session management
- **Rate Limiter** (`@convex-dev/rate-limiter`) - API rate limiting to prevent abuse
- **Agent** (`@convex-dev/agent`) - AI agent orchestration for task assistance

## Tech Stack

- **Backend**: Convex (serverless backend with real-time database)
- **Frontend**: Next.js 14 App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Better Auth with Convex adapter
- **AI**: OpenAI GPT-4 (via Agent component)
- **TypeScript**: Full type safety throughout

## Prerequisites

- Node.js 18+ and pnpm
- Convex account (free): https://dashboard.convex.dev
- OpenAI API key (for AI features): https://platform.openai.com/api-keys

## Installation

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Convex

```bash
# Login to Convex (opens browser)
npx convex login

# Initialize Convex project
npx convex dev --once
```

This will:
- Create a new Convex deployment
- Generate `convex/_generated/` with types
- Output your `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and fill in:
# 1. CONVEX_DEPLOYMENT and NEXT_PUBLIC_CONVEX_URL (from step 2)
# 2. BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)
# 3. OPENAI_API_KEY (from https://platform.openai.com/api-keys)
```

### 4. Start Development Servers

```bash
# Start both Convex and Next.js
pnpm dev

# Or start individually:
pnpm convex:dev  # Convex backend
pnpm web:dev     # Next.js frontend
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Component-Specific Setup

### Better Auth Configuration

Better Auth is pre-configured with:
- Email/password authentication
- 30-day JWT expiration
- Convex adapter for seamless integration

No additional setup required - authentication works out of the box.

### Rate Limiter Configuration

Rate limiting is configured in `convex/rateLimiter.ts` with sensible defaults:
- Create task: 10 requests/minute (burst capacity: 3)
- Update task: 50 requests/minute
- Delete task: 30 requests/minute

Adjust these limits based on your needs.

### Agent (AI Assistant) Configuration

The AI assistant requires an OpenAI API key:
1. Get your key from https://platform.openai.com/api-keys
2. Add to `.env.local`: `OPENAI_API_KEY=sk-...`
3. The assistant is configured to use GPT-4o-mini for cost-effective task suggestions

Alternatively, use Anthropic Claude by setting `ANTHROPIC_API_KEY` instead.

## Project Structure

```
minimal-todo-app/
├── convex/                    # Convex backend
│   ├── schema.ts             # Database schema
│   ├── convex.config.ts      # Component configuration
│   ├── auth.ts               # Better Auth setup
│   ├── http.ts               # HTTP routes
│   ├── rateLimiter.ts        # Rate limit configuration
│   ├── db/                   # Database layer (Phase 2)
│   ├── endpoints/            # API endpoints (Phase 2)
│   └── helpers/              # Utility functions (Phase 2)
├── apps/
│   └── web/                  # Next.js frontend (Phase 2)
├── package.json              # Root dependencies
└── .env.local.example        # Environment variables template
```

## Using the Application

### Task Management

1. **Sign up/Sign in** - Create an account or log in with email/password
2. **View Dashboard** - See task statistics (total, active, completed, overdue)
3. **Create Tasks** - Click "Add a new task" to create tasks with:
   - Title (required)
   - Description (optional)
   - Priority (low, medium, high)
   - Due date
4. **Manage Tasks**:
   - Toggle completion status
   - Filter by status (All, To Do, In Progress, Completed)
   - Edit or delete tasks
5. **Real-time Updates** - Changes sync instantly across all devices

### AI Assistant

1. Click the **"AI Assistant"** button in the header
2. Start a new conversation or select an existing thread
3. Ask for help with:
   - Breaking down complex tasks
   - Prioritizing your work
   - Productivity tips
   - Motivation and encouragement
4. All conversations are saved and user-scoped

## Implementation Details

### ✅ Phase 2 Complete

The following has been generated:

1. **Database Layer** (`convex/db/`) - CRUD operations for:
   - Tasks (create, read, update, delete, stats)
   - Threads (AI conversation management)
   - Messages (chat history)
   - User Preferences (settings)

2. **Endpoint Layer** (`convex/endpoints/`) - Business logic for:
   - Task management (with rate limiting)
   - AI assistant (thread and message management)
   - Dashboard (stats and recent activity)
   - User preferences

3. **Helper Layer** (`convex/helpers/`) - Pure utilities:
   - Validation functions
   - Formatting helpers
   - Application constants

4. **Frontend** (`apps/web/`) - Complete Next.js app:
   - Authentication (sign up, sign in, sign out)
   - Task list with filtering
   - Task creation/editing
   - Dashboard with real-time stats
   - AI assistant chat interface
   - Responsive design with Tailwind CSS

## Development Commands

```bash
pnpm dev          # Start all services
pnpm build        # Build Next.js app
pnpm setup        # Install deps + initialize Convex
```

## Learn More

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Documentation](https://better-auth.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## License

MIT
