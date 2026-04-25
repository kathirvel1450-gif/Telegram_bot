# Deployment Guide: Student Feedback Notifier

This guide provides instructions on how to deploy the **Frontend** (Vercel) and **Backend** (Render/Railway).

## 1. Backend Deployment (Render or Railway)

Since we are using SQLite, deploying to an ephemeral file system (like Heroku or Render's free tier) means your database might reset on each deployment or restart.
For a production application, you should either:
- Use **Render** with a **Persistent Disk** (requires a paid plan).
- Use **Railway** with a Volume attached.
- Alternatively, migrate to a remote database like MongoDB or PostgreSQL.

### Steps for Railway (Recommended for easy volumes):
1. Push your code to a GitHub repository.
2. Sign up / Log in to [Railway](https://railway.app/).
3. Click **New Project** -> **Deploy from GitHub repo**.
4. Select your repository.
5. In the settings for your backend service, add a **Volume** and mount it to `/app` (or wherever your `database.sqlite` is saved) so data persists.
6. Add your Environment Variables:
   - `PORT`: (Railway sets this automatically, but you can define it)
   - `TELEGRAM_BOT_TOKEN`: (Your Bot Token from BotFather)
   - `TELEGRAM_CHAT_ID`: (Your Chat ID)
7. Change your `package.json` scripts in the backend folder to include `"start": "node server.js"`.

## 2. Frontend Deployment (Vercel)

1. Sign up / Log in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Set the **Framework Preset** to **Vite**.
5. Set the **Root Directory** to `frontend`.
6. Set the **Build Command** to `npm run build`.
7. Set the **Output Directory** to `dist`.
8. *Crucial*: In your frontend code (`src/components/FeedbackForm.jsx` and `src/components/AdminPanel.jsx`), you need to change the API URL from `http://localhost:5000` to the actual URL of your deployed backend (e.g., `https://my-backend.up.railway.app`). You can use environment variables for this (e.g., `import.meta.env.VITE_API_URL`).
9. Click **Deploy**.

## Setting up the Telegram Bot

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot` and follow the prompts to get your `TELEGRAM_BOT_TOKEN`.
3. To get your `TELEGRAM_CHAT_ID`, send a message to your new bot, then go to `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` and look for the `"chat":{"id":...}` in the JSON response.
4. Add these to your `.env` file on the backend.
