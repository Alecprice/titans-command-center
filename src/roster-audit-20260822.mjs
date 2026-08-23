export const ROSTER_AUDIT_DATE='2026-08-22';
export const ROSTER_SOURCE_CONFLICT="TennesseeTitans.com roster currently omits TE Matt Lauter, while the Titans' Aug. 16 transaction story says he was signed and NFL.com lists him Active. The audited fallback retains Lauter and surfaces the discrepancy.";
const raw=`61|Andre James|C|Offense|Active|8
51|Austin Schlottmann|C|Offense|Active|8
79|Pat Coogan|C|Offense|Active|R
73|Cordell Volson|G|Offense|Active|5
67|Drew Moss|G|Offense|Active|2
66|Fernando Carmona Jr.|G|Offense|Active|R
71|Garrett Dellinger|G|Offense|Active|1
64|Jackson Slater|G|Offense|Active|2
77|Peter Skoronski|G|Offense|Active|4
1|Cam Ward|QB|Offense|Active|2
16|Hendon Hooker|QB|Offense|Active|3
10|Mitchell Trubisky|QB|Offense|Active|10
8|Will Levis|QB|Offense|Active|4
21|D'Ernest Johnson|RB|Offense|Active|8
36|Julius Chestnut|RB|Offense|Active|5
31|Kalel Mullings|RB|Offense|Active|2
35|Michael Carter|RB|Offense|Active|5
32|Nicholas Singleton|RB|Offense|Active|R
20|Tony Pollard|RB|Offense|Active|8
2|Tyjae Spears|RB|Offense|Active|4
69|Aamil Wagner|T|Offense|Active|R
76|Austin Deculus|T|Offense|Active|4
78|Brandon Crenshaw-Dickson|T|Offense|Active|2
75|Dan Moore Jr.|T|Offense|Active|6
55|JC Latham|T|Offense|Active|3
62|Rasheed Miller|T|Offense|Active|R
72|Zachary Thomas|T|Offense|Active|4
82|Daniel Bellinger|TE|Offense|Active|5
88|David Martin-Robinson|TE|Offense|Active|3
84|Gunnar Helm|TE|Offense|Active|2
81|Jaren Kanak|TE|Offense|Reserve/Injured|R
83|Joel Wilson|TE|Offense|Active|1
86|Kylen Granson|TE|Offense|Active|6
|Matt Lauter|TE|Offense|Active|R
80|Bryce Oliver|WR|Offense|Active|3
0|Calvin Ridley|WR|Offense|Active|8
14|Carnell Tate|WR|Offense|Active|R
17|Chimere Dike|WR|Offense|Active|2
39|Courtney Jackson|WR|Offense|Active|1
5|Elic Ayomanor|WR|Offense|Active|2
13|Hank Beatty|WR|Offense|Active|R
85|K.J. Osborn|WR|Offense|Active|6
89|Lance McCutcheon|WR|Offense|Active|2
12|Mason Kinsey|WR|Offense|Active|4
19|Tyren Montgomery|WR|Offense|Active|R
4|Wan'Dale Robinson|WR|Offense|Active|5
87|Xavier Restrepo|WR|Offense|Active|1
24|Alontae Taylor|CB|Defense|Active|5
18|Cor'Dale Flott|CB|Defense|Active|5
13|Corey Mayfield Jr.|CB|Defense|Active|1
16|Jalen McMurray|CB|Defense|Active|R
25|Joshua Williams|CB|Defense|Active|5
29|Keydrain Calligan|CB|Defense|Active|1
26|Marcus Harris|CB|Defense|Active|2
35|Mario Goodrich III|CB|Defense|Active|2
21|Micah Robinson|CB|Defense|Active|2
42|Derrick Canteen|DB|Defense|Active|1
30|Kendell Brooks|DB|Defense|Active|2
36|Nazeeh Johnson|DB|Defense|Reserve/Injured|5
99|Earnest Brown IV|DE|Defense|Active|3
57|Jacob Martin|DE|Defense|Active|9
92|Jaylen Harrell|DE|Defense|Reserve/Injured|3
11|Jermaine Johnson II|DE|Defense|Active|5
15|Keldric Faulk|DE|Defense|Active|R
93|Malik Herring|DE|Defense|Active|6
7|Oluwafemi Oladejo|DE|Defense|Active|2
56|Truman Jones|DE|Defense|Active|2
97|Jalyn Holmes|DL|Defense|Active|7
91|John Franklin-Myers|DL|Defense|Active|9
95|Jordan Elliott|DL|Defense|Active|7
96|Jackie Marshall|DT|Defense|Active|R
98|Jeffery Simmons|DT|Defense|Active|8
59|Khalen Saunders|DT|Defense|Active|8
68|Laki Tasi|DT|Defense|Active|1
90|Solomon Thomas|DT|Defense|Active|10
94|Timmy Horne|DT|Defense|Active|4
53|Anthony Hill Jr.|LB|Defense|Active|R
33|Cedric Gray|LB|Defense|Active|3
50|Cody Barton|LB|Defense|Active|8
40|Dominique Hampton|LB|Defense|Active|2
54|Dorian Mausi|LB|Defense|Active|2
52|James Williams Sr.|LB|Defense|Active|3
|Milo Eifler|LB|Defense|Active|3
49|Mani Powell|LB|Defense|Active|R
44|Mohamoud Diabate|LB|Defense|Active|4
37|Amani Hooker|S|Defense|Active|8
31|Bishop Fitzgerald|S|Defense|Active|R
41|Erick Hallett II|S|Defense|Active|2
28|Jerrick Reed II|S|Defense|Active|4
23|Kevin Winston Jr.|S|Defense|Active|2
42|Sanoussi Kane|S|Defense|Reserve/Injured|3
38|Tony Adams|S|Defense|Active|5
6|Joey Slye|K|Special Teams|Active|8
46|Morgan Cox|LS|Special Teams|Active|17
3|Tommy Townsend|P|Special Teams|Active|7`;
export const auditedRoster20260822=raw.split('\n').map(line=>{const [number,name,position,unit,status,experience]=line.split('|');return {name,number,position,unit,status,experience}});