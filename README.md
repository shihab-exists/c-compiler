# C Compiler Platform

A modern, premium online C compiler and code execution platform with a VS Code / Replit / JetBrains-inspired interface.

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, ShadCN UI, Framer Motion, Monaco Editor
- **Backend:** Node.js, Express.js, TypeScript, Docker Sandbox, GCC, WebSocket
- **Database:** PostgreSQL, Prisma ORM
- **Auth:** JWT + Google OAuth (Passport.js)
- **Deployment:** Docker Compose, production-ready architecture

## Features

- Monaco-based C editor with syntax highlighting, autocomplete, bracket matching, minimap, folding, multi-cursor
- Docker-based secure code execution using GCC
- Real-time output, errors, warnings, execution time, memory usage
- Project management (create, rename, delete, duplicate, export ZIP, download .c)
- Auto-save every 5 seconds
- AI learning tools: code explanation, error analysis, complexity analysis
- Built-in snippets (hello world, arrays, linked list, stack, queue, trees, graphs, sorting, searching)
- Keyboard shortcuts (Ctrl+S, Ctrl+Enter, Ctrl+Shift+B)
- Dark / light mode
- Analytics dashboard

## Quick Start

```bash
# 1. Clone / enter project
cd c-compiler-platform

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your secrets

# 3. Start all services
docker-compose up --build

# 4. Run Prisma migrations
docker-compose exec backend npx prisma migrate dev

# Frontend: http://localhost:5173
# Backend API: http://localhost:4000
```

## Project Structure

```
c-compiler-platform/
├── backend/          # Express + TypeScript + Prisma + Docker runner
├── frontend/         # React + Vite + Tailwind + ShadCN + Monaco
├── sandbox-worker/   # Remote Docker-based code execution worker
├── docker/           # Sandbox Dockerfile & runner scripts
├── docker-compose.yml
└── .env.example
```

## Deploy to Render + GitHub

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/c-compiler-platform.git
git push -u origin main
```

### 2. Deploy Backend + Frontend on Render

1. Create a **New Blueprint Instance** on Render and point it to your GitHub repo.
2. Render will read `render.yaml` and create:
   - PostgreSQL database
   - Backend Web Service
   - Frontend Static Site
3. Add these environment variables manually in the Render dashboard:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `SANDBOX_URL` (from your VPS step below)

### 3. Deploy the Sandbox Worker on a VPS

Render cannot run Docker inside Docker (code execution sandbox). Deploy the sandbox worker on a VPS such as **DigitalOcean, Hetzner, AWS EC2, or Linode**:

```bash
# On your VPS, after installing Docker
git clone https://github.com/YOUR_USERNAME/c-compiler-platform.git
cd c-compiler-platform
cp sandbox-worker/.env.example sandbox-worker/.env
# Edit .env if needed
docker-compose -f docker-compose.sandbox.yml up --build -d
```

The sandbox worker will be available at `http://your-vps-ip:4001`. Copy this URL into your Render backend `SANDBOX_URL` environment variable as `https://your-sandbox-domain.com` (use Nginx/Caddy for HTTPS).

### 4. Production Notes

- Use HTTPS for the sandbox worker. Never expose it without authentication/API key in production.
- Set a strong `API_KEY` in the sandbox worker and verify it in requests.
- Set `NODE_ENV=production` on Render.
- For frontend, set `VITE_API_URL` to your Render backend URL.

## License

MIT
