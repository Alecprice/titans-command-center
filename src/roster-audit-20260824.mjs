import { auditedRoster20260822 } from './roster-audit-20260822.mjs';

export const ROSTER_AUDIT_DATE='2026-08-24';
export const ROSTER_SOURCE_CONFLICT='The Tennessee Titans roster page lagged the team’s Aug. 24 transaction announcement. The newer official transaction controls: Reid Carrico is active and Milo Eifler is on Reserve/Injured until the roster page catches up.';

export const auditedRoster20260824=[
  ...auditedRoster20260822.map(player=>player.name==='Milo Eifler'?{...player,status:'Reserve/Injured'}:{...player}),
  {name:'Reid Carrico',number:'',position:'LB',unit:'Defense',status:'Active',experience:'R'}
];
