# AI Chat with Sensitive Data Protection

A Next.js chat application powered by Claude that automatically detects and blurs sensitive information in AI responses.

## Features

- **AI Chat**: Streaming conversations with Claude Sonnet 4
- **Sensitive Data Blurring**: Auto-detects PII (names, emails, phones, addresses, etc.) and blurs them in responses
- **Conversation History**: Persisted in PostgreSQL with sidebar navigation
- **Click-to-Reveal**: Toggle visibility of blurred sensitive data

## Tech Stack

- Next.js 16 / React 19 / TypeScript
- AI SDK + Anthropic Claude
- Prisma + PostgreSQL
- Tailwind CSS

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Required variables:
   - `ANTHROPIC_API_KEY` - Your Anthropic API key
   - `DATABASE_URL` - PostgreSQL connection string

3. **Setup database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:migrate` | Run database migrations |
