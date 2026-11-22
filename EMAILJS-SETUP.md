# EmailJS setup — One Gram Demo

## What changed
The invoice email action now calls the EmailJS REST API directly. It no longer
calls the old `VITE_EMAIL_API_URL` Render endpoint and no longer falls back to
`mailto:`. Bulk sends are sent as individual messages, with a delay between
requests so recipients do not see each other's addresses.

## Vercel environment variables
Add these in Vercel → Project → Settings → Environment Variables, for Production
(and Preview/Development if you use those environments):

- `VITE_EMAILJS_SERVICE_ID=service_xpvpu3m`
- `VITE_EMAILJS_TEMPLATE_ID=template_e2oxnoo`
- `VITE_EMAILJS_PUBLIC_KEY=jMlsqfB0UQskEusVD`
- `VITE_PUBLIC_APP_URL=https://1-gram-demo.vercel.app`
- `VITE_SHOP_NAME=Demo Jewellery Store`
- `VITE_SHOP_ADDRESS=12, Market Road, Visakhapatnam, Andhra Pradesh`
- `VITE_SHOP_PHONE=9876543210`

After saving, trigger a new Vercel deployment. Vite variables are embedded at
build time. Do not put Gmail passwords, Google App Passwords or Resend secret
keys in Vercel.

## EmailJS template `template_e2oxnoo`
In the EmailJS dashboard, confirm the Gmail service is connected and active.
Set the template's **To Email** field to `{{to_email}}`.
Use this subject:
`Invoice {{invoice_number}} from {{shop_name}}`

Use this HTML body:

```html
<h2>{{shop_name}}</h2>
<p>{{shop_address}} | {{shop_phone}}</p>
<h3>Invoice {{invoice_number}}</h3>
<p>Date: {{invoice_date}}</p>
<p>Dear {{customer_name}},</p>
<p>Thank you for your purchase. Here is your invoice summary:</p>
<pre style="font-family:Arial,sans-serif;white-space:pre-wrap">{{invoice_items}}</pre>
<table>
  <tr><td>Subtotal</td><td>{{subtotal}}</td></tr>
  <tr><td>Discount</td><td>{{discount}}</td></tr>
  <tr><td>GST</td><td>{{gst}}</td></tr>
  <tr><td><strong>Total</strong></td><td><strong>{{invoice_total}}</strong></td></tr>
  <tr><td>Amount received</td><td>{{amount_received}}</td></tr>
  <tr><td>Payment method</td><td>{{payment_method}}</td></tr>
</table>
<p><a href="{{invoice_url}}">View invoice</a></p>
<p>Thank you for shopping with us.</p>
```

The app supplies `to_email`, `customer_name`, `invoice_number`, `invoice_date`,
`invoice_items`, `subtotal`, `discount`, `gst`, `invoice_total`,
`amount_received`, `payment_method`, `invoice_url`, `shop_name`,
`shop_address`, and `shop_phone`.

The Gmail account connected inside EmailJS is the sender. Do not set an arbitrary
sender address in the frontend. Configure the allowed origins in EmailJS if
domain restrictions are enabled.

## Backend / Render variables
None. This implementation sends directly from the frontend to EmailJS. The old
Resend backend is not used by this project and may be stopped after the new
deployment is verified.

## Local development
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Production build
```bash
npm install
npm run build
```

## Testing
1. Deploy the latest commit to Vercel.
2. Create an invoice with a valid customer email address.
3. Open the invoice and click Email invoice.
4. In DevTools → Network → Fetch/XHR, expect a POST request to
   `https://api.emailjs.com/api/v1.0/email/send`.
5. A successful request returns HTTP 200. Check EmailJS Email History and the
   recipient inbox (including Spam).
6. For bulk email, select invoice(s), enter recipient email(s), and click
   Send selected invoices. The app sends each invoice-recipient pair separately.

If the API rejects the request, the app displays the EmailJS HTTP status and
response text in its toast and logs the failure in the browser console.

## Limitations
- This implementation sends invoice details and an invoice URL, not a PDF
  attachment.
- A browser-based EmailJS public key is intended for client use, but it can be
  abused if exposed without origin restrictions and account rate limits.
- A link that resolves invoice data from browser localStorage may not display
  the invoice on a different device; that requires server-side invoice storage.
