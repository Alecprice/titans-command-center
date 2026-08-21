# Titans Command Center v1.0 Fan Platform

This release turns the existing audited Titans dashboard into a personalized desktop/mobile fan app while keeping the current roster, schedule, market, analytics, and source-integrity layers intact.

## Fan experience

- One-time onboarding with favorite-player selection, alert opt-in, and home-screen installation guidance.
- Customizable home command deck with reorderable/hideable game, favorite-player, roster-move, intel, market, and freshness cards.
- Favorite-player intel cards backed by `/api/player` data.
- Position-aware two-player comparison.
- Expandable schedule rows with weather, market context, related intel, and calendar export.
- Rich Game Day / live / postgame center with score state, weather, markets, leaders, and direct links into roster/intel/analytics.
- Smart search commands such as `QB`, `number 98`, `week 6`, `last transaction`, `next home game`, `Oilers`, `injuries`, and `<player> stats`.
- “What changed?” summary based on the prior visit.
- Data-freshness chips on major routes.
- Interactive Legacy era navigation.
- Wide-desktop quick-glance rail and mobile full-screen settings/modals.

## PWA and reliability

- Saved `/api/data` snapshot used when the network is unavailable.
- Offline status + retry UI.
- Mobile pull-to-refresh.
- Scroll-position restoration and route-aware page titles.
- Browser alert preferences for kickoff, finals, roster moves, and top stories while the app/PWA session is active.
- Service worker `push` and `notificationclick` handlers are packaged so a future VAPID subscription/delivery service can use native Web Push without redesigning the client.
- Headshot loading no longer retries failed remote photos in a mutation loop; above-the-fold roster/stats photos are eager/high-priority.

## Privacy

Personalization is stored locally in the browser. No user account is required and no preference data is sent to the Titans Command Center server.
