export const auditedTeamContext = {
  auditedOn: '2026-08-19',
  sourcePolicy: {
    currentTeamData: ['Tennessee Titans', 'NFL.com'],
    franchiseHistory: ['Tennessee Titans', 'Pro Football Hall of Fame'],
    statisticalCrossCheck: ['NFL.com', 'Pro Football Reference', 'nflverse'],
    visualCrossCheck: ['Tennessee Titans brand/history', 'SportsLogos.net'],
    secondaryContext: ['Wikipedia'],
    rule: 'Current official Titans/NFL information overrides secondary sources when they conflict.'
  },
  knownConflicts: [
    { topic: '2026 preseason opener date', officialValue: 'Aug. 13, 2026', secondaryValue: 'Pro Football Reference currently lists Aug. 15', resolution: 'Use Tennessee Titans/NFL schedule: Aug. 13.' },
    { topic: 'Franchise origin date', officialValue: 'Franchise granted Aug. 14, 1959; first season 1960', secondaryValue: 'Some team/league summaries simply say established 1960', resolution: 'Display both grant date and first season instead of collapsing them.' }
  ],
  leadership: [
    { role: 'Controlling Owner', name: 'Amy Adams Strunk' },
    { role: 'General Manager', name: 'Mike Borgonzi' },
    { role: 'President & CEO', name: 'Burke Nihill' }
  ],
  coaching: [
    { unit: 'Team', role: 'Head Coach', name: 'Robert Saleh' },
    { unit: 'Offense', role: 'Offensive Coordinator', name: 'Brian Daboll' },
    { unit: 'Offense', role: 'Quarterbacks', name: 'Shea Tierney' },
    { unit: 'Offense', role: 'Running Backs', name: 'Randy Jordan' },
    { unit: 'Offense', role: 'Wide Receivers', name: 'Greg Lewis' },
    { unit: 'Offense', role: 'Tight Ends', name: 'Luke Stocker' },
    { unit: 'Offense', role: 'Offensive Line', name: 'Carmen Bricillo' },
    { unit: 'Defense', role: 'Defensive Coordinator', name: 'Gus Bradley' },
    { unit: 'Defense', role: 'Linebackers', name: 'Dave Borgonzi' },
    { unit: 'Defense', role: 'DB / Safeties', name: 'Marquand Manuel' },
    { unit: 'Defense', role: 'Pass Game Coordinator / Cornerbacks', name: 'Tony Oden' },
    { unit: 'Defense', role: 'Run Game Coordinator / Defensive Line', name: 'Aaron Whitecotton' },
    { unit: 'Special Teams', role: 'Assistant Head Coach / Special Teams Coordinator', name: 'John Fassel' },
    { unit: 'Special Teams', role: 'Assistant Special Teams', name: 'Rayna Stewart' }
  ],
  injuryReport: {
    status: 'not-published-preseason',
    label: 'Official weekly injury report not yet published',
    detail: 'The Titans state that injury reports become available in the regular season. Reserve/Injured roster status is tracked separately and should not be presented as the weekly injury report.',
    sourceUrl: 'https://www.tennesseetitans.com/team/injury-report/'
  },
  baselineStats: {
    season: 2025,
    label: '2025 verified baseline — not 2026 stats',
    players: [
      { name: 'Cam Ward', position: 'QB', lines: ['323/540 passing', '3,169 pass yds', '15 TD · 7 INT', '80.2 rating'], sourceUrl: 'https://www.nfl.com/players/cam-ward/stats/career' },
      { name: 'Tony Pollard', position: 'RB', lines: ['242 rush att', '1,082 rush yds', '4.5 yds/att', '5 rush TD'], sourceUrl: 'https://www.nfl.com/players/tony-pollard/stats/career' },
      { name: 'Jeffery Simmons', position: 'DT', lines: ['15 games', '65 total tackles', '11 sacks', '1 safety'], sourceUrl: 'https://www.nfl.com/players/jeffery-simmons/stats/career' }
    ]
  },
  visualAudit: {
    rule: 'Only the current Shield is treated as the current primary mark. Historical archive images are labeled as representative/reference visuals unless the exact year variant is verified.',
    sources: ['https://www.tennesseetitans.com/brand/', 'https://www.tennesseetitans.com/history/logo-history', 'https://www.sportslogos.net/logos/list_by_team/160/Tennessee-Titans-Logos/']
  }
};

export async function getAuditedTeamContext(sql) {
  if (!sql) return { ...auditedTeamContext, depthChart: { status: 'database-unavailable', rows: [] } };
  const rows = await sql`
    with latest_snapshot as (
      select max(d.captured_at) captured_at
      from depth_chart_snapshots d
      join teams t on t.id=d.team_id
      join sources s on s.id=d.source_id
      where t.abbreviation='TEN' and s.slug='titans'
    ), latest_roster as (
      select rs.player_id,rs.jersey_number,
             row_number() over(partition by rs.player_id order by rs.captured_at desc,rs.id desc) rn
      from roster_snapshots rs
      join teams t on t.id=rs.team_id
      where t.abbreviation='TEN'
    )
    select d.position_group,d.position,d.slot,d.rank,d.captured_at,d.raw_payload,
           p.id player_id,p.full_name,lr.jersey_number
    from depth_chart_snapshots d
    join latest_snapshot x on x.captured_at=d.captured_at
    join teams t on t.id=d.team_id and t.abbreviation='TEN'
    join sources s on s.id=d.source_id and s.slug='titans'
    join players p on p.id=d.player_id
    left join latest_roster lr on lr.player_id=p.id and lr.rn=1
    order by case d.position_group when 'Offense' then 1 when 'Defense' then 2 when 'Special Teams' then 3 else 4 end,
             d.slot,d.rank,p.full_name
  `;
  const first = rows[0];
  return {
    ...auditedTeamContext,
    depthChart: {
      status: rows.length ? 'available' : 'awaiting-official-snapshot',
      unofficial: true,
      source: 'Tennessee Titans',
      sourceUrl: first?.raw_payload?.source_url || 'https://www.tennesseetitans.com/team/depth-chart',
      sourceDate: first?.raw_payload?.source_date || null,
      capturedAt: first?.captured_at ? new Date(first.captured_at).toISOString() : null,
      rows: rows.map(r => ({ unit:r.position_group, position:r.position, slot:Number(r.slot), rank:Number(r.rank), playerId:String(r.player_id), name:r.full_name, number:r.jersey_number || '' }))
    }
  };
}
