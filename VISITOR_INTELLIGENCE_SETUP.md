# Visitor Intelligence setup

## Included
- Vercel Web Analytics integration.
- Consent-gated custom events: page views, CV clicks, GitHub clicks, LinkedIn clicks, project clicks, and contact clicks.
- MongoDB event persistence with a 30-day TTL index.
- Password-protected admin routes at `/admin/login` and `/admin/visitor-intelligence`.
- No IP address storage, fingerprinting, identity claims, or company enrichment.

## Environment variables
Set these in local `.env.local` and in Vercel Project Settings → Environment Variables:
- `MONGODB_URI`: MongoDB Atlas connection string.
- `MONGODB_DB`: database name (optional; defaults to `nagedy_portfolio`).
- `ADMIN_PASSWORD`: strong unique admin password.
- `ADMIN_SESSION_SECRET`: random secret at least 32 characters long.

Do not commit `.env.local` or actual credentials. Use the example file only as a template.

## Database
Create a MongoDB Atlas cluster and a database user with access only to the chosen database. Restrict network access as appropriate for your deployment. The application creates indexes when the first event is received.

## Vercel Analytics
The Vercel Analytics component is included in the root layout. Confirm that Web Analytics is enabled for the Vercel project and check the current plan/usage terms. Review applicable privacy requirements before enabling analytics in production.

## First-run checklist
1. Configure all environment variables.
2. Deploy to a preview environment.
3. Visit the site and choose “Allow analytics”.
4. Verify a `page_view` appears in `/admin/visitor-intelligence`.
5. Verify a CV/GitHub click is logged.
6. Test invalid login, unauthenticated API access, consent rejection, and TTL expiry.
7. Review the privacy notice and retention policy before production launch.

## Limitations
Events identify a short-lived browser session, not a real person. The implementation intentionally does not store IP addresses or attempt device fingerprinting. Company-level enrichment is not enabled. Event reports are basic operational analytics and should not be treated as verified visitor identity.
