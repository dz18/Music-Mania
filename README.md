# Music Mania

**[www.trymusicmania.com](https://www.trymusicmania.com)**

Music Mania is a platform for music enthusiasts to discover, review, and discuss songs, albums, and artists. Share your opinions and connect with a community that takes music seriously.

---

## Features

- **Reviews** — Write and read reviews on songs, albums, and artists
- **Ratings** — Rate music and see how your taste compares to others
- **Community** — Discuss and debate music with people who care as much as you do

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, TypeScript |
| Backend | Express 5, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | NextAuth.js, JWT |
| Storage | AWS S3 |
| API Docs | Swagger / OpenAPI |
| Testing | Jest, React Testing Library, Supertest |

---

## Project Structure

```
music-mania/
├── client/          # Next.js frontend
├── server/          # Express API backend
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   └── prisma/      # Database schema & migrations
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for the database)

### 1. Clone the repo

```bash
git clone https://github.com/your-org/music-mania.git
cd music-mania
```

### 2. Start the database

```bash
docker-compose up db
```

### 3. Set up the server

```bash
cd server
cp .env.example .env   # fill in your environment variables
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev            # runs on http://localhost:5000
```

### 4. Set up the client

```bash
cd client
cp .env.example .env.local   # fill in your environment variables
npm install
npm run dev                  # runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API

The REST API runs on port `5000`. Interactive API docs are available at:

```
http://localhost:5000/api-docs
```

Key routes:

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in |
| GET | `/reviews` | List reviews |
| POST | `/reviews` | Create a review |
| GET | `/stats` | Music metrics & stats |
| GET | `/users/:id` | User profile |

---

## Running Tests

```bash
# Frontend
cd client && npm test

# Backend (all)
cd server && npm test

# Backend (unit only)
cd server && npm run test:unit

# Backend (integration only)
cd server && npm run test:integration
```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `AWS_ACCESS_KEY_ID` | AWS credentials for S3 |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials for S3 |
| `AWS_REGION` | S3 bucket region |
| `S3_BUCKET_NAME` | S3 bucket for media uploads |

### Client (`client/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Base URL for NextAuth (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
