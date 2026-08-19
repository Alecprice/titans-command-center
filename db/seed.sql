insert into sources(slug,name,tier,category,base_url,enabled,capabilities,metadata) values
('titans','Tennessee Titans','official','Official','https://www.tennesseetitans.com',true,ARRAY['roster','schedule','transactions','news','depth-chart']::text[],'{"status":"Primary source","method":"HTML/JSON-LD + page parsers","cadence":"5-15m on game/roster days"}'::jsonb),
('nflverse','nflverse','media','Stats','https://github.com/nflverse',true,ARRAY['rosters','schedules','player-stats','snap-counts','pbp','advanced']::text[],'{"status":"Core open-data source","method":"GitHub releases/CDN parquet-csv","cadence":"Daily/release-driven"}'::jsonb),
('nws','National Weather Service','official','Weather','https://api.weather.gov',true,ARRAY['forecast','alerts','hourly']::text[],'{"status":"Free; no key","method":"api.weather.gov","cadence":"15-30m near game"}'::jsonb),
('bluesky','Bluesky public API','community','Social','https://public.api.bsky.app',true,ARRAY['search-posts']::text[],'{"status":"Free; no key","method":"app.bsky.feed.searchPosts","cadence":"30-90s during live windows"}'::jsonb),
('espn','ESPN consumer JSON','media','Score/Reference','https://site.api.espn.com',true,ARRAY['scoreboard','game-state']::text[],'{"status":"Undocumented; adapter isolated","method":"Consumer JSON","cadence":"30-90s live only"}'::jsonb),
('propline','PropLine','media','Market','https://prop-line.com',true,ARRAY['live-odds','pregame-odds','spreads','moneyline','totals','player-props','period-lines','futures']::text[],'{"status":"Needs free API key","method":"PropLine v1","cost":"Free / no credit card","cadence":"Quota-aware","purpose":"Primary free Titans market feed"}'::jsonb),
('odds-api-io','Odds-API.io','media','Market','https://odds-api.io',true,ARRAY['live-odds','pregame-odds','spreads','moneyline','totals','player-props','team-props','futures']::text[],'{"status":"Optional free API key","method":"Odds-API.io v3","cost":"Free / no credit card","cadence":"Quota-aware","purpose":"Secondary free NFL odds source"}'::jsonb),
('sportsgameodds','SportsGameOdds','media','Market','https://sportsgameodds.com',false,ARRAY['live-odds','pregame-odds','spreads','moneyline','totals','props','historical','results']::text[],'{"status":"Disabled by free-only policy","method":"v2 API","cadence":"Disabled"}'::jsonb),
('sportsdataio','SportsDataIO','media','Market','https://sportsdata.io',false,ARRAY['player-props','team-props','game-lines','scores','depth-charts']::text[],'{"status":"Disabled by free-only policy","method":"v3 API","cadence":"Disabled"}'::jsonb),
('the-odds-api','The Odds API','media','Market','https://the-odds-api.com',false,ARRAY['odds','spreads','totals']::text[],'{"status":"Disabled by free-only policy","method":"v4 API","cadence":"Disabled"}'::jsonb),
('x','X','reporter','Social','https://x.com',false,ARRAY['search-posts']::text[],'{"status":"Disabled by free-only policy","method":"API requires paid/usage-based access","cadence":"Disabled"}'::jsonb),
('threads','Threads','community','Social','https://www.threads.com',false,ARRAY['public-content']::text[],'{"status":"Needs approved Meta app + token","method":"Official API only","cadence":"Once approved"}'::jsonb),
('youtube','YouTube','community','Video','https://www.youtube.com',false,ARRAY['search-videos','channels']::text[],'{"status":"Needs API key","method":"YouTube Data API v3","cadence":"5-15m"}'::jsonb),
('reddit','Reddit','community','Community','https://www.reddit.com',false,ARRAY['posts','comments']::text[],'{"status":"Needs OAuth app","method":"Official OAuth API","cadence":"2-5m"}'::jsonb),
('gnews-rss','Google News RSS','media','News','https://news.google.com',false,ARRAY['rss-news']::text[],'{"status":"Optional fallback","method":"RSS","cadence":"5-15m"}'::jsonb)
on conflict (slug) do update set name=excluded.name,tier=excluded.tier,category=excluded.category,base_url=excluded.base_url,enabled=excluded.enabled,capabilities=excluded.capabilities,metadata=excluded.metadata,updated_at=now();

insert into teams(provider_key,abbreviation,name,city,conference,division,metadata)
values('TEN','TEN','Tennessee Titans','Nashville','AFC','South','{"venue":"Nissan Stadium"}'::jsonb)
on conflict(abbreviation) do update set name=excluded.name,city=excluded.city,conference=excluded.conference,division=excluded.division,metadata=excluded.metadata;

-- Verified official roster subset (Aug 2026); the ingestion layer replaces/extends it.
with ten as (select id team_id from teams where abbreviation='TEN'),
p(n,first,last,pos,jersey,unit,exp,college) as (values
('Cam Ward','Cam','Ward','QB','1','Offense','2','Miami'),
('Tony Pollard','Tony','Pollard','RB','20','Offense','8','Memphis'),
('Tyjae Spears','Tyjae','Spears','RB','2','Offense','4','Tulane'),
('Nicholas Singleton','Nicholas','Singleton','RB','32','Offense','R','Penn State'),
('Calvin Ridley','Calvin','Ridley','WR','0','Offense','9','Alabama'),
('Wan''Dale Robinson','Wan''Dale','Robinson','WR','4','Offense','5','Kentucky'),
('Elic Ayomanor','Elic','Ayomanor','WR','5','Offense','2','Stanford'),
('Carnell Tate','Carnell','Tate','WR','14','Offense','R','Ohio State'),
('Daniel Bellinger','Daniel','Bellinger','TE','82','Offense','5','San Diego State'),
('Peter Skoronski','Peter','Skoronski','G','77','Offense','4','Northwestern'),
('Jeffery Simmons','Jeffery','Simmons','DT','98','Defense','8','Mississippi State'),
('Jermaine Johnson II','Jermaine','Johnson II','OLB','11','Defense','5','Florida State'),
('Cody Barton','Cody','Barton','LB','50','Defense','8','Utah'),
('Alontae Taylor','Alontae','Taylor','CB','24','Defense','5','Tennessee'),
('Tony Adams','Tony','Adams','S','38','Defense','5','Illinois'),
('Kevin Winston Jr.','Kevin','Winston Jr.','S','23','Defense','2','Penn State'),
('Joey Slye','Joey','Slye','K','6','Special Teams','8','Virginia Tech')
), inserted as (
 insert into players(full_name,first_name,last_name,position,college,metadata)
 select n,first,last,pos,college,jsonb_build_object('seed','official-roster-2026') from p
 on conflict do nothing
 returning id,full_name
)
insert into roster_snapshots(team_id,player_id,source_id,snapshot_at,season,jersey_number,position,status,experience,raw_payload)
select ten.team_id,pl.id,s.id,now(),2026,p.jersey,p.pos,'Active',p.exp,jsonb_build_object('unit',p.unit,'source','official roster seed')
from p cross join ten join players pl on pl.full_name=p.n join sources s on s.slug='titans'
where not exists(select 1 from roster_snapshots rs where rs.team_id=ten.team_id and rs.player_id=pl.id and rs.season=2026);

insert into events(source_id,event_type,trust_tier,title,summary,url,published_at,topics,importance,provider_event_id)
select s.id,'news','official','Titans beat 49ers 19-13 in preseason opener','Tennessee opened Robert Saleh''s first preseason with a 19-13 win in San Francisco.','https://www.tennesseetitans.com/news/game-recap-titans-beat-49ers-19-13-in-preseason-opener',timestamptz '2026-08-13 23:30:00-04',ARRAY['game','preseason','result']::text[],8,'seed-2026-preseason-w1'
from sources s where s.slug='titans'
on conflict(source_id,provider_event_id) do nothing;

-- Official 2026 transaction chronology seeded from the Titans transactions page.
with t(d,kind,description,event_id) as (values
(date '2026-08-18','Released','The Titans released OT Logan Brown, RB Raheim Sanders and LB Ron Stone.','titans-txn-2026-08-18'),
(date '2026-08-16','Signed/Released','The Titans agreed to terms with LB Chris Board and WR Kameron Johnson, and released S Jalen Mills.','titans-txn-2026-08-16'),
(date '2026-08-15','Signed/Released','The Titans agreed to terms with DL Sebastian Joseph-Day and waived OLB Femi Oladejo.','titans-txn-2026-08-15'),
(date '2026-08-09','Signed/Released','The Titans agreed to terms with C Bryce Foster, and released LB Kendell Brooks and DB Akeem Dent.','titans-txn-2026-08-09'),
(date '2026-08-08','Signed/Released','The Titans agreed to terms with DB Kemon Hall and released CB Leonard Johnson III.','titans-txn-2026-08-08'),
(date '2026-08-04','Activated','The Titans activated OLB Femi Oladejo from Active/Physically Unable to Perform.','titans-txn-2026-08-04'),
(date '2026-08-03','Signed/Released','The Titans agreed to terms with RB Malik Davis and released WR George Pickens and DB Tay Gowan.','titans-txn-2026-08-03'),
(date '2026-07-30','Signed/Released','The Titans agreed to terms with DT Elijah Simmons and released OLB Brailyn Oliver.','titans-txn-2026-07-30'),
(date '2026-07-29','Signed/Released','The Titans agreed to terms with LB Michael Barrett, LB Justin Barron, CB Kendall Bohler and CB Jaden Davis, and released G Logan Bruss, G Mark Evans II, DT Alex Huntley and LB David Long Jr.','titans-txn-2026-07-29'),
(date '2026-07-28','Traded','The Titans traded CB L''Jarius Sneed to the Buffalo Bills.','titans-txn-2026-07-28'),
(date '2026-07-27','Signed','The Titans agreed to terms with free agent OLB Julian Okwara.','titans-txn-2026-07-27'),
(date '2026-07-25','Signed','The Titans agreed to terms with free agent OLB David Ojabo.','titans-txn-2026-07-25'),
(date '2026-07-24','Signed','The Titans agreed to terms with free agent S Adrian Amos.','titans-txn-2026-07-24'),
(date '2026-07-23','Signed','The Titans agreed to terms with free agent LB Kyzir White.','titans-txn-2026-07-23'),
(date '2026-07-22','Signed/Activated','The Titans agreed to terms with WR KhaDarel Hodge and G Jaelyn Duncan and activated DL Walter Nolen III from the Non-Football Injury list.','titans-txn-2026-07-22'),
(date '2026-06-17','Released','The Titans released G Kevin Zeitler.','titans-txn-2026-06-17'),
(date '2026-06-16','Signed','The Titans agreed to terms with LB Bud Dupree.','titans-txn-2026-06-16'),
(date '2026-06-11','Released','The Titans released TE Chig Okonkwo.','titans-txn-2026-06-11'),
(date '2026-06-10','Signed','The Titans agreed to terms with TE Tyler Warren.','titans-txn-2026-06-10'),
(date '2026-05-27','Signed','The Titans agreed to terms with WR George Pickens.','titans-txn-2026-05-27')
)
insert into transactions(source_id,provider_event_id,transacted_at,transaction_type,description,raw_payload)
select s.id,t.event_id,t.d::timestamptz,t.kind,t.description,jsonb_build_object('source','Titans 2026 transaction page','verified_on','2026-08-18')
from t join sources s on s.slug='titans'
on conflict(source_id,provider_event_id) do update set transacted_at=excluded.transacted_at,transaction_type=excluded.transaction_type,description=excluded.description,raw_payload=excluded.raw_payload;

insert into sync_runs(source_id,job_type,status,finished_at,records_seen,records_written,metadata)
select id,'official-transactions-seed','success',now(),20,20,
       '{"source_url":"https://www.tennesseetitans.com/team/transactions/","season":2026}'::jsonb
from sources s where s.slug='titans'
and not exists (select 1 from sync_runs sr where sr.source_id=s.id and sr.job_type='official-transactions-seed');
