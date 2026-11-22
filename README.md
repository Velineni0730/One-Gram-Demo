# Demo — One Gram Jewellery

A standalone React single-page jewellery retail demo. It includes dashboard, billing, invoice register, returns, inventory, and activity logs/pricing.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL printed by Vite.

## Build for Vercel

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: repository root

Add the variables from `.env.example` in Vercel if you want to customize the demo shop details.

## Demo capabilities and limitations

- Product, invoice, return, and activity data are stored in the browser's `localStorage`. This is intentionally a frontend-only demo, not shared multi-user storage.
- Invoice print/download uses the browser print dialog; choose **Save as PDF**.
- WhatsApp sharing opens a prefilled `wa.me` message. The user must review and press Send.
- Email sharing uses the user's default mail app (`mailto:`) unless `VITE_EMAIL_API_URL` is configured to point to a trusted email service endpoint.
- The optional email endpoint receives JSON: `{ to, subject, text, invoiceUrl, invoice }`. Implement authentication, validation, rate limiting, and provider credentials on the server. Never put SMTP passwords or private API keys in Vite environment variables.
- Invoice share URLs carry a compact, read-only invoice snapshot in the URL fragment (not sent to the web server). This lets a recipient open the shared invoice in the static demo without a database. Do not treat these links as private or tamper-proof. For production, replace this with an API/database, server-generated unguessable invoice token, and a customer-safe read-only invoice endpoint.
- Returns increase the product stock and create a refund activity record. This demo does not connect to a real payment gateway or issue a bank/UPI refund.
- This is sample data and should not be used for actual accounting, tax filing, or payment settlement without server-side validation and a proper audit trail.

## Reset demo data

Use **Reset demo** in the top bar. It restores the sample products and clears invoices, returns, and logs for this browser.
