# Edamen Media Frontend

Modern React frontend for Edamen Media built with Vite, Tailwind CSS, and Framer Motion.

## Setup

### Prerequisites
- Node.js 18+
- Yarn or npm

### Installation

```bash
cd frontend
npm install
# or
yarn install
```

### Environment Configuration

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update `REACT_APP_BACKEND_URL` in `.env.local` to point to your backend server:
```
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Development

Start the development server:

```bash
npm start
```

The app will open at `http://localhost:3000` by default.

## Build

Create a production build:

```bash
npm run build
```

## Testing

Run tests:

```bash
npm test
```

## Project Structure

```
src/
├── components/      # Reusable React components
├── pages/          # Page components
├── lib/            # Utilities and API client
├── App.js          # Main app component
├── App.css         # App-level styles
└── index.css       # Global styles and Tailwind directives
```

## Key Technologies

- **React 19** - UI library
- **React Router 7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Query** - Server state management

## Troubleshooting

### Build fails or styles don't load
1. Clear `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Clear Craco cache:
   ```bash
   rm -rf .cache
   npm start
   ```

### Backend API errors
Ensure `REACT_APP_BACKEND_URL` in `.env.local` points to your running backend server.

## License

Private
