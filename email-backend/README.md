# One Gram Demo Email Backend

## Render settings
- Root Directory: `email-backend`
- Build Command: `npm install`
- Start Command: `npm start`

This package explicitly declares Express in `package.json` dependencies.
Add `RESEND_API_KEY`, `EMAIL_FROM`, `FRONTEND_URL`, and `CORS_ORIGINS` in Render Environment.
The sender domain must be verified in Resend.

Health check: `GET /health`
Send endpoint: `POST /api/send-email`

Example body:
```json
{"to":"customer@example.com","subject":"Your invoice","html":"<p>Thank you for your purchase</p>","text":"Thank you for your purchase"}
```

For multiple recipients, `to` can be an array. Emails are sent separately.
