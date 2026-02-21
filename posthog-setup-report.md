<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **DevEvent** Next.js App Router application. Here is a summary of all changes made:

## Summary of changes

- **`instrumentation-client.ts`** — Already present and correctly configured using the Next.js 15.3+ pattern. Initializes PostHog with the EU ingest proxy (`/ingest`), automatic error tracking (`capture_exceptions: true`), and debug mode in development. No changes were needed.
- **`next.config.ts`** — Added PostHog reverse proxy rewrites (`/ingest/static/*` and `/ingest/*` → EU PostHog endpoints) and `skipTrailingSlashRedirect: true` to support PostHog's trailing slash API requests.
- **`.env.local`** — Verified and updated `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` with the correct project values. Keys are gitignored and never hardcoded in source files.
- **`components/ExploteBtn.tsx`** — Added `'use client'` directive (already present) and `posthog.capture('explore_events_clicked')` in the click handler, replacing the placeholder `console.log`.
- **`components/EventCard.tsx`** — Added `'use client'` directive and `posthog.capture('event_card_clicked', { event_title, event_slug, event_location, event_date, event_time })` on the card link click handler to track which events users are most interested in.
- **`components/Navbar.tsx`** — Added `'use client'` directive and `posthog.capture('nav_link_clicked', { link_label })` on each navigation link to track site navigation patterns.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the "Explore Events" button on the homepage hero — top of the engagement funnel | `components/ExploteBtn.tsx` |
| `event_card_clicked` | User clicked an event card to view details — the primary conversion action, with properties: `event_title`, `event_slug`, `event_location`, `event_date`, `event_time` | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicked a navigation link in the site header, with property: `link_label` (Home, Events, Create Event, Logo) | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- 📊 **Dashboard — Analytics basics**: [https://eu.posthog.com/project/129953/dashboard/535190](https://eu.posthog.com/project/129953/dashboard/535190)
- 📈 **Event Engagement Trend** (daily clicks on Explore + Event Cards): [https://eu.posthog.com/project/129953/insights/X4Zw9IW7](https://eu.posthog.com/project/129953/insights/X4Zw9IW7)
- 🔻 **Homepage to Event Click Funnel** (conversion from explore intent to event card click): [https://eu.posthog.com/project/129953/insights/Icr5ARyJ](https://eu.posthog.com/project/129953/insights/Icr5ARyJ)
- 🏆 **Most Clicked Events** (bar chart breakdown by event title): [https://eu.posthog.com/project/129953/insights/crp5pfeW](https://eu.posthog.com/project/129953/insights/crp5pfeW)
- 🥧 **Navigation Link Clicks by Label** (pie chart of nav usage): [https://eu.posthog.com/project/129953/insights/FrmPI8Pu](https://eu.posthog.com/project/129953/insights/FrmPI8Pu)
- 👥 **Daily Active Users** (unique users engaging each day): [https://eu.posthog.com/project/129953/insights/X9XR8QlW](https://eu.posthog.com/project/129953/insights/X9XR8QlW)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
