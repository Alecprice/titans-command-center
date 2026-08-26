import { auditedRoster20260824 } from './roster-audit-20260824.mjs';

export const ROSTER_AUDIT_DATE='2026-08-26';
export const ROSTER_AUDIT_NOTE='The Tennessee Titans Aug. 25 official transaction log controls the fallback roster: Dominique Hampton was waived/injured, Dyontae Johnson was signed, and Sanoussi Kane was waived from injured reserve. Missing jersey or status detail is not guessed.';

export const auditedRoster20260826=[
  ...auditedRoster20260824.filter(player=>!['Dominique Hampton','Sanoussi Kane','Dyontae Johnson'].includes(player.name)),
  {name:'Dyontae Johnson',number:'45',position:'LB',unit:'Defense',status:'Active',experience:''}
];
