# One Gram Demo Email Backend

Express API that sends invoice/customer emails through Resend.

## Deploy on Render
Create a Node Web Service. If this folder is in your frontend repository:
- Root Directory: `email-backend`
- Build Command: `npm install`
- Start Command: `npm start`

Add the variables described in `.env.example` to Render's Environment page.
Required: `RESEND_API_KEY`, `EMAIL_FROM`, `FRONTEND_URL`, `CORS_ORIGINS`.

## Health check
Open `https://YOUR-RENDER-SERVICE.onrender.com/health`.
A configured service returns `configured: true`.

## Endpoint
`POST https://YOUR-RENDER-SERVICE.onrender.com/api/send-email`

Example JSON:
```json
{
  "to": "customer@example.com",
  "subject": "Your invoice",
  "html": "<h2>Thank you</h2><p>Your invoice is ready.</p>",
  "text": "Thank you. Your invoice is ready."
}
```

`to` can also be an array for bulk sending. Messages are sent individually.
Optional `attachments` is an array of `{ "filename": "invoice.pdf", "content": "BASE64" }`.
The sender address/domain must be verified in Resend.

Security note: CORS is not authentication. This starter includes a basic in-memory
rate limit. Before enabling unrestricted public bulk email, add CAPTCHA or
authenticated server-side authorization and stronger abuse protection.
