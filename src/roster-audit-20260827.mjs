import { auditedRoster20260824 } from './roster-audit-20260824.mjs';

export const ROSTER_AUDIT_DATE='2026-08-27';
export const ROSTER_SOURCE_CONFLICT='';

// The Aug. 25 official transaction log is now reflected by the current Titans
// roster page: Dyontae Johnson is active, Dominique Hampton was waived/injured,
// and Sanoussi Kane was waived from injured reserve. The active roster remains
// at 91 players, with four additional Reserve/Injured entries shown separately.
const removed=new Set(['Dominique Hampton','Sanoussi Kane']);
const retained=auditedRoster20260824
  .filter(player=>!removed.has(player.name))
  .map(player=>player.name==='Reid Carrico'?{...player,number:'47'}:{...player});

export const auditedRoster20260827=[
  ...retained,
  {name:'Dyontae Johnson',number:'45',position:'LB',unit:'Defense',status:'Active',experience:'2'}
];
