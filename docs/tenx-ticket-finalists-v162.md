# TENX FULL — Ticket Finalists cache identity v162

## Production finding
The production Ticket Center regression measured the Finalists and group-budget buttons at 24px high even though the repository stylesheet requires a 44px minimum touch target.

## Root cause
`tickets-finalists-v127.js` dynamically requested `/tickets-finalists-v127.css?v=1`. The stylesheet had evolved while the fixed cache-busting identity stayed on `v=1`, allowing production/CDN/browser caches to retain older presentation bytes.

## Repair
- Advance the dynamic stylesheet request to `?v=2`.
- Preserve the existing 44px desktop and mobile CSS contract.
- Add a regression test coupling the module stylesheet identity to the touch-target rule.

## Scope
No ticket pricing, provider, comparison, shortlist, persistence, or purchasing behavior changes.
