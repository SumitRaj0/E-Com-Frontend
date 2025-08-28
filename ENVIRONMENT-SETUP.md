# Frontend Environment Setup Guide

## Quick Setup

1. **Create `.env` file** in the `E-Com-Frontend` directory:

   ```bash
   # Copy this content to .env file
   REACT_APP_API_URL=https://e-com-backend-y9ps.onrender.com/api
   REACT_APP_LOCAL_API_URL=http://localhost:5050/api
   REACT_APP_ENV=production
   ```

2. **Restart your frontend** after creating the `.env` file

## How It Works

- **Production**: Automatically uses Render backend
- **Development**: Falls back to localhost if needed
- **Custom**: Can override with `REACT_APP_API_URL`

## Test Connection

The app will automatically log which API URL is being used in the console.

## Environment Variables

| Variable                  | Description      | Default        |
| ------------------------- | ---------------- | -------------- |
| `REACT_APP_API_URL`       | Primary API URL  | Render URL     |
| `REACT_APP_LOCAL_API_URL` | Fallback API URL | localhost:5050 |
| `REACT_APP_ENV`           | Environment      | production     |

## Notes

- All variables must start with `REACT_APP_`
- Changes require restart after `.env` modification
- The app automatically detects production vs development
