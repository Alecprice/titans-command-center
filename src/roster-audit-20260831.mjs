export const ROSTER_AUDIT_DATE='2026-09-02';
export const ROSTER_SOURCE_CONFLICT='The official active roster/player pages contain the newest jersey assignments, while the official transactions log is newer than the roster table for reserve and practice-squad status on Sept. 2. Latest dated official transactions therefore override lagging roster-table membership/status.';
export const ROSTER_SOURCE_URL='https://www.tennesseetitans.com/team/rosters';
export const ROSTER_53_SOURCE_URL='https://www.tennesseetitans.com/news/updated-53-man-roster-for-the-titans';
export const ROSTER_TRANSACTION_SOURCE_URL='https://www.tennesseetitans.com/team/transactions/';
export const PRACTICE_SQUAD_SOURCE_URL='https://www.tennesseetitans.com/news/titans-add-four-to-practice-squad-waive-three-others-from-practice-squad';

// Compatibility export name is retained because other runtime modules already import it.
// Membership/status is audited through Sept. 2, 2026. The current-team fallback
// intentionally contains only the 53-player Active roster plus seven reserve-list
// players. Practice-squad players remain a separate roster class below.
export const auditedRoster20260831=[
  {name:'Tony Adams',number:'29',position:'S',unit:'Defense',status:'Active',experience:'5'},
  {name:'Elic Ayomanor',number:'5',position:'WR',unit:'Offense',status:'Active',experience:'2'},
  {name:'Cody Barton',number:'50',position:'LB',unit:'Defense',status:'Active',experience:'8'},
  {name:'Daniel Bellinger',number:'82',position:'TE',unit:'Offense',status:'Active',experience:'5'},
  {name:'Terrell Burgess',number:'38',position:'S',unit:'Defense',status:'Active',experience:'6'},
  {name:'Fernando Carmona Jr.',number:'66',position:'G',unit:'Offense',status:'Active',experience:'R'},
  {name:'Julius Chestnut',number:'36',position:'RB',unit:'Offense',status:'Active',experience:'5'},
  {name:'Pat Coogan',number:'79',position:'C',unit:'Offense',status:'Active',experience:'R'},
  {name:'Morgan Cox',number:'46',position:'LS',unit:'Special Teams',status:'Active',experience:'17'},
  {name:'Brandon Crenshaw-Dickson',number:'78',position:'T',unit:'Offense',status:'Active',experience:'2'},
  {name:'Garrett Dellinger',number:'71',position:'G',unit:'Offense',status:'Active',experience:'1'},
  {name:'Chimere Dike',number:'17',position:'WR',unit:'Offense',status:'Active',experience:'2'},
  {name:'Jordan Elliott',number:'95',position:'DL',unit:'Defense',status:'Active',experience:'7'},
  {name:'Keldric Faulk',number:'15',position:'DE',unit:'Defense',status:'Active',experience:'R'},
  {name:"Cor'Dale Flott",number:'18',position:'CB',unit:'Defense',status:'Active',experience:'5'},
  {name:'John Franklin-Myers',number:'91',position:'DL',unit:'Defense',status:'Active',experience:'9'},
  {name:'Kylen Granson',number:'86',position:'TE',unit:'Offense',status:'Active',experience:'6'},
  {name:'Cedric Gray',number:'33',position:'LB',unit:'Defense',status:'Active',experience:'3'},
  {name:'Marcus Harris',number:'26',position:'CB',unit:'Defense',status:'Active',experience:'2'},
  {name:'Gunnar Helm',number:'84',position:'TE',unit:'Offense',status:'Active',experience:'2'},
  {name:'Anthony Hill Jr.',number:'53',position:'LB',unit:'Defense',status:'Active',experience:'R'},
  {name:'Amani Hooker',number:'37',position:'S',unit:'Defense',status:'Active',experience:'8'},
  {name:'James Hudson III',number:'59',position:'T',unit:'Offense',status:'Active',experience:'6'},
  {name:'Jermaine Johnson II',number:'11',position:'DE',unit:'Defense',status:'Active',experience:'5'},
  {name:'Truman Jones',number:'56',position:'DE',unit:'Defense',status:'Active',experience:'2'},
  {name:'JC Latham',number:'55',position:'T',unit:'Offense',status:'Active',experience:'3'},
  {name:'Jackie Marshall',number:'96',position:'DT',unit:'Defense',status:'Active',experience:'R'},
  {name:'David Martin-Robinson',number:'88',position:'TE',unit:'Offense',status:'Active',experience:'3'},
  {name:'Jacob Martin',number:'57',position:'DE',unit:'Defense',status:'Active',experience:'9'},
  {name:'Dan Moore Jr.',number:'75',position:'T',unit:'Offense',status:'Active',experience:'6'},
  {name:'Oluwafemi Oladejo',number:'7',position:'DE',unit:'Defense',status:'Active',experience:'2'},
  {name:'Owen Pappoe',number:'40',position:'LB',unit:'Defense',status:'Active',experience:'4'},
  {name:'Tony Pollard',number:'20',position:'RB',unit:'Offense',status:'Active',experience:'8'},
  {name:'Calvin Ridley',number:'0',position:'WR',unit:'Offense',status:'Active',experience:'8'},
  {name:'Micah Robinson',number:'21',position:'CB',unit:'Defense',status:'Active',experience:'2'},
  {name:"Wan'Dale Robinson",number:'4',position:'WR',unit:'Offense',status:'Active',experience:'5'},
  {name:'Austin Schlottmann',number:'51',position:'C',unit:'Offense',status:'Active',experience:'8'},
  {name:'Jeffery Simmons',number:'98',position:'DT',unit:'Defense',status:'Active',experience:'8'},
  {name:'Nicholas Singleton',number:'32',position:'RB',unit:'Offense',status:'Active',experience:'R'},
  {name:'Peter Skoronski',number:'77',position:'G',unit:'Offense',status:'Active',experience:'4'},
  {name:'Jackson Slater',number:'64',position:'G',unit:'Offense',status:'Active',experience:'2'},
  {name:'Joey Slye',number:'6',position:'K',unit:'Special Teams',status:'Active',experience:'8'},
  {name:'Melvin Smith Jr.',number:'39',position:'DB',unit:'Defense',status:'Active',experience:'1'},
  {name:'Tyjae Spears',number:'2',position:'RB',unit:'Offense',status:'Active',experience:'4'},
  {name:'Nazir Stackhouse',number:'93',position:'DT',unit:'Defense',status:'Active',experience:'2'},
  {name:'Carnell Tate',number:'14',position:'WR',unit:'Offense',status:'Active',experience:'R'},
  {name:'Alontae Taylor',number:'24',position:'CB',unit:'Defense',status:'Active',experience:'5'},
  {name:'Solomon Thomas',number:'90',position:'DT',unit:'Defense',status:'Active',experience:'10'},
  {name:'Tommy Townsend',number:'3',position:'P',unit:'Special Teams',status:'Active',experience:'7'},
  {name:'Mitchell Trubisky',number:'10',position:'QB',unit:'Offense',status:'Active',experience:'10'},
  {name:'Cam Ward',number:'1',position:'QB',unit:'Offense',status:'Active',experience:'2'},
  {name:'James Williams Sr.',number:'52',position:'LB',unit:'Defense',status:'Active',experience:'3'},
  {name:'Kevin Winston Jr.',number:'23',position:'S',unit:'Defense',status:'Active',experience:'2'},
  {name:'Milo Eifler',number:'',position:'LB',unit:'Defense',status:'Reserve/Injured',experience:'3'},
  {name:'Dominique Hampton',number:'40',position:'LB',unit:'Defense',status:'Reserve/Injured',experience:'2'},
  {name:'Jaylen Harrell',number:'92',position:'DE',unit:'Defense',status:'Reserve/Injured',experience:'3'},
  {name:'Jaren Kanak',number:'81',position:'TE',unit:'Offense',status:'Reserve/Injured',experience:'R'},
  {name:'Tanoh Kpassagnon',number:'58',position:'DE',unit:'Defense',status:'Reserve/Injured',experience:'8'},
  {name:'Dorian Mausi',number:'54',position:'LB',unit:'Defense',status:'Reserve/Injured; Designated for Return',experience:'2'},
  {name:'Joshua Williams',number:'25',position:'CB',unit:'Defense',status:'Reserve/Injured; Designated for Return',experience:'5'}
];

export const auditedRoster20260902=auditedRoster20260831;

export const auditedPracticeSquad20260902=[
  {name:'Shemar Bartholomew',number:'45',position:'CB',unit:'Defense',status:'Practice Squad'},
  {name:'Michael Carter',number:'35',position:'RB',unit:'Offense',status:'Practice Squad'},
  {name:'Mohamoud Diabate',number:'44',position:'LB',unit:'Defense',status:'Practice Squad'},
  {name:'Erick Hallett II',number:'41',position:'S',unit:'Defense',status:'Practice Squad'},
  {name:'Jalyn Holmes',number:'97',position:'DL',unit:'Defense',status:'Practice Squad'},
  {name:'Hendon Hooker',number:'16',position:'QB',unit:'Offense',status:'Practice Squad'},
  {name:'Timmy Horne',number:'94',position:'DT',unit:'Defense',status:'Practice Squad'},
  {name:'Jalen McMurray',number:'47',position:'CB',unit:'Defense',status:'Practice Squad'},
  {name:'Rasheed Miller',number:'62',position:'T',unit:'Offense',status:'Practice Squad'},
  {name:'Tyren Montgomery',number:'19',position:'WR',unit:'Offense',status:'Practice Squad'},
  {name:'Drew Moss',number:'67',position:'G',unit:'Offense',status:'Practice Squad'},
  {name:'Kalel Mullings',number:'31',position:'RB',unit:'Offense',status:'Practice Squad'},
  {name:'K.J. Osborn',number:'85',position:'WR',unit:'Offense',status:'Practice Squad'},
  {name:'Jerrick Reed II',number:'28',position:'S',unit:'Defense',status:'Practice Squad'},
  {name:'Xavier Restrepo',number:'87',position:'WR',unit:'Offense',status:'Practice Squad'},
  {name:'Joel Wilson',number:'83',position:'TE',unit:'Offense',status:'Practice Squad'},
  {name:'Laki Tasi',number:'68',position:'DT',unit:'Defense',status:'Practice Squad/International'}
];
