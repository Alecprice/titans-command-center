// Compatibility bridge for modules that still import the Aug. 22 audit path.
// Current audited roster truth moved on Aug. 24 after Tennessee signed LB Reid Carrico
// and placed LB Milo Eifler on Injured Reserve.
export {
  auditedRoster20260824 as auditedRoster20260822,
  ROSTER_AUDIT_DATE,
  ROSTER_SOURCE_CONFLICT
} from './roster-audit-20260824.mjs';
