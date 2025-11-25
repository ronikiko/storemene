# PostgreSQL Setup Guide

## Quick Start with Railway (Recommended)

### 1. Create PostgreSQL Database on Railway
```bash
railway login
railway init
railway add
# Select "PostgreSQL"
```

### 2. Get Database URL
```bash
railway variables
```
Copy the `DATABASE_URL` value.

### 3. Update Local Environment
Create/update `server/.env`:
```env
PORT=3001
DATABASE_URL=<paste-your-railway-database-url-here>
```

### 4. Push Schema to Database
```bash
cd server
npm run db:push
```

### 5. Seed Database
```bash
npm run seed
```

### 6. Start Development
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

---

## Alternative: Local PostgreSQL

### 1. Install PostgreSQL
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb styleflow
```

### 2. Update Environment
`server/.env`:
```env
PORT=3001
DATABASE_URL=postgresql://localhost:5432/styleflow
```

### 3. Continue with steps 4-6 above

---

## Drizzle Studio (Database GUI)

View and edit your database:
```bash
cd server
npm run db:studio
```

Opens at `https://local.drizzle.studio`

---

## Troubleshooting

**Connection Error?**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- For Railway: ensure database is created

**Schema Push Fails?**
- Check DATABASE_URL format
- Ensure PostgreSQL version is 12+

**Seed Fails?**
- Run `npm run db:push` first
- Check database is empty or drop tables
