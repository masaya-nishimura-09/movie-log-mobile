# Movie Log Mobile

A mobile app for logging and managing personal movie watching records.
It talks to [Movie Log API](https://github.com/masaya-nishimura-09/movie-log-api)
and shares its design with [Movie Log](https://github.com/masaya-nishimura-09/movie-log).

## Features

- Register, log in, and log out (tokens are refreshed automatically)
- Update or delete your account
- Create, view, edit, and delete movie records
- Filter records by score, platform, mood tag, and genre
- Search records by title, sort them, and paginate the list
- Look up movies on TMDb when creating a record
- Upload poster images from the photo library
- English and Japanese UI (follows the device language)
- Light and dark themes (follow the device appearance)
- Mock mode that runs without the backend

## Tech Stack

- Expo (SDK 57) / React Native / Expo Router
- TypeScript
- NativeWind (Tailwind CSS 3)
- TanStack Query
- Zod
- Biome
- pnpm

## Getting Started

### Prerequisites

- Node.js 22.13+
- pnpm
- Expo Go on your phone
- [Movie Log API](https://github.com/masaya-nishimura-09/movie-log-api)
    (not needed in mock mode)

### Installation

```bash
git clone https://github.com/masaya-nishimura-09/movie-log-mobile.git
cd movie-log-mobile
pnpm install
# Create .env.local with your configuration
pnpm start
```

Scan the QR code with the phone camera and open it in Expo Go.
Sign in to the same Expo account on the CLI (`npx expo login`) and in Expo Go.

### Configuration

Create a `.env.local` file:

- `EXPO_PUBLIC_API_BASE_URL` - Base URL of Movie Log API.
    Use the LAN address of your computer, not `localhost`
- `EXPO_PUBLIC_USE_MOCK` - Set to `true` to use mock data instead of the API

Restart `pnpm start` after changing them.

### Scripts

| Command          | Description               |
|------------------|---------------------------|
| `pnpm start`     | Start the dev server      |
| `pnpm lint`      | Check with Biome          |
| `pnpm fix`       | Fix lint issues           |
| `pnpm format`    | Format with Biome         |
| `pnpm typecheck` | Run the TypeScript check  |

## Project Structure

```
src/
  app/            # Routes ((auth), (app), (legal))
  actions/        # Use cases called from screens
  api/            # Backend API clients and mock data
  components/     # UI components (atoms / molecules / organisms)
  hooks/          # React hooks (queries, form state, session)
  schemas/        # Zod schemas
  i18n/           # Locales and dictionaries
  lib/            # Helpers (auth, date, legal, query, record, style, text, theme, url)
```

## Screens

| Path               | Description   | Auth |
|--------------------|---------------|------|
| /login             | Login         | No   |
| /register          | Register      | No   |
| /terms, /privacy   | Legal         | No   |
| /records           | List records  | Yes  |
| /records/new       | Create record | Yes  |
| /records/:id       | Record detail | Yes  |
| /records/:id/edit  | Edit record   | Yes  |
| /account           | Account       | Yes  |
