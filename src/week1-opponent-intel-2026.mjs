const SOURCE_CHECKED_AT='2026-09-03T14:16:00Z';

const sources={
  titansSchedule:{
    tier:'official',
    publisher:'Tennessee Titans',
    label:'2026 Titans schedule',
    url:'https://www.tennesseetitans.com/schedule/',
    checkedAt:SOURCE_CHECKED_AT
  },
  jetsRoster:{
    tier:'official',
    publisher:'New York Jets',
    label:"Breaking Down the Jets' Active Roster, Position by Position",
    publishedAt:'2026-09-01T18:38:00Z',
    url:'https://www.newyorkjets.com/news/jets-53-man-roster-position-breakdown-09-01-2026',
    checkedAt:SOURCE_CHECKED_AT
  },
  jetsTransactions:{
    tier:'official',
    publisher:'New York Jets',
    label:'Jets Awarded K Blake Grupe and LB Trevin Wallace Off Waivers',
    publishedAt:'2026-08-31T21:16:00Z',
    url:'https://www.newyorkjets.com/news/jets-awarded-blake-grupe-trevin-wallace-off-waivers-08-31-2026',
    checkedAt:SOURCE_CHECKED_AT
  },
  jetsDepthChart:{
    tier:'official-unofficial-depth-chart',
    publisher:'New York Jets Communications Department',
    label:'Jets Depth Chart',
    url:'https://www.newyorkjets.com/team/depth-chart',
    checkedAt:SOURCE_CHECKED_AT,
    qualification:'The Jets label this page an unofficial depth chart.'
  }
};

export const WEEK1_OPPONENT_INTEL_2026=Object.freeze({
  version:'2026-w1-20260903.1',
  opponent:'New York Jets',
  opponentAbbr:'NYJ',
  asOf:'2026-09-03',
  checkedAt:SOURCE_CHECKED_AT,
  game:Object.freeze({
    week:1,
    kickoff:'2026-09-13T17:00:00Z',
    homeAway:'home',
    venue:'Nissan Stadium',
    network:'CBS'
  }),
  leadership:Object.freeze({
    headCoach:'Aaron Glenn'
  }),
  activeRosterSpine:Object.freeze({
    quarterback:Object.freeze({starter:'Geno Smith',backup:'Cade Klubnik'}),
    runningBack:Object.freeze({lead:'Breece Hall',depth:Object.freeze(['Braelon Allen','Isaiah Davis'])}),
    receivers:Object.freeze(['Garrett Wilson','Adonai Mitchell','Tim Patrick','Omar Cooper Jr.']),
    tightEnds:Object.freeze(['Mason Taylor','Jeremy Ruckert','Jelani Woods','Kenyon Sadiq']),
    offensiveLine:Object.freeze(['Olu Fashanu','Dylan Parham','Josh Myers','Joe Tippmann','Armand Membou']),
    defensiveFront:Object.freeze(['Kingsley Enagbare','Harrison Phillips','Jowon Briggs','David Onyemata','Joseph Ossai','Will McDonald IV','T’Vondre Sweat']),
    linebackers:Object.freeze(['Jamien Sherwood','Demario Davis','Trevin Wallace']),
    secondary:Object.freeze(['Jarvis Brownlee Jr.','Brandon Stephens','Azareye’h Thomas','Nahshon Wright','Minkah Fitzpatrick','Andre Cisco']),
    kicker:'Blake Grupe'
  }),
  depthChart:Object.freeze({
    status:'qualified-conflict',
    authority:'unofficial',
    safeUse:'role-ordering-only-after-roster-cross-check',
    note:'Use the Jets depth chart as a role-ordering signal only. Newer official roster/transaction evidence controls active membership when sources disagree.',
    conflicts:Object.freeze([
      Object.freeze({
        subject:'Jason Sanders',
        depthChartClaim:'Listed as first-team kicker.',
        controllingEvidence:'Jets released Jason Sanders on Aug. 31 and added Blake Grupe; the Sept. 1 active-roster article lists Grupe.',
        resolution:'Do not surface Sanders as the current Jets kicker.',
        severity:'high'
      }),
      Object.freeze({
        subject:'Kohl Levao',
        depthChartClaim:'Listed as second-team right guard.',
        controllingEvidence:'Jets waived Levao from the active roster on Aug. 31; he is not part of the Sept. 1 active-roster offensive-line group.',
        resolution:'Do not infer active-roster membership from the depth chart.',
        severity:'medium'
      })
    ])
  }),
  availability:Object.freeze({
    status:'pre-game-week',
    confidence:'limited',
    note:'Do not convert camp/practice expectations into official Week 1 game-status labels. Re-audit against the NFL/Jets injury report during game week.'
  }),
  sources:Object.freeze(sources)
});

export function opponentIntelSourceTruth(intel=WEEK1_OPPONENT_INTEL_2026){
  const conflicts=Array.isArray(intel?.depthChart?.conflicts)?intel.depthChart.conflicts:[];
  return Object.freeze({
    checkedAt:intel?.checkedAt||null,
    status:conflicts.length?'qualified-conflict':'cross-source-confirmed',
    conflictCount:conflicts.length,
    hasHighSeverityConflict:conflicts.some(item=>item?.severity==='high'),
    controllingSourceOrder:Object.freeze(['official-transaction','official-active-roster','official-unofficial-depth-chart'])
  });
}

export function cloneWeek1OpponentIntel(){
  return structuredClone(WEEK1_OPPONENT_INTEL_2026);
}
