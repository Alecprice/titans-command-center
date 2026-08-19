export const VISUAL_AUDIT_DATE='2026-08-19';

export const visualSources={
  titansBrand:{
    label:'Tennessee Titans — 2026 brand',
    url:'https://www.tennesseetitans.com/brand/',
    role:'Primary source for the current Shield, Titans Blue-led identity and 6-String Stripe.'
  },
  titansLogoHistory:{
    label:'Tennessee Titans — logo & helmet history',
    url:'https://www.tennesseetitans.com/history/logo-history',
    role:'Primary historical source for Oilers/Titans helmet changes and the 1999/2018 transitions.'
  },
  titansReveal:{
    label:'Tennessee Titans — March 12, 2026 brand reveal',
    url:'https://www.tennesseetitans.com/news/titans-unveil-new-uniforms-logo-to-represent-the-next-chapter-of-franchise-history',
    role:'Primary source for the 2026 logo/uniform change and current logo description.'
  },
  hallOfFame:{
    label:'Pro Football Hall of Fame — Titans team facts',
    url:'https://www.profootballhof.com/teams/tennessee-titans/team-facts',
    role:'Primary stable-reference source for franchise grant date, first season and championship milestones.'
  },
  sportsLogos:{
    label:'SportsLogos.net — Titans logo chronology',
    url:'https://www.sportslogos.net/logos/list_by_team/160/Tennessee-Titans-Logos/',
    role:'Specialist visual-history cross-check for primary, alternate and wordmark year ranges.'
  },
  sportsLogosSword1999:{
    label:'SportsLogos.net — sword alternate, 1999–2001',
    url:'https://www.sportslogos.net/logos/view/16062041999/Tennessee-Titans-Logo/1999/Alternate-Logo',
    role:'Specialist cross-check for the lighter-navy 1999–2001 sword alternate, first worn Sept. 12, 1999.'
  },
  sportsLogosSword:{
    label:'SportsLogos.net — sword alternate, 2002–2025',
    url:'https://www.sportslogos.net/logos/view/16038902002/Tennessee-Titans-Logo/2002/Alternate-Logo',
    role:'Specialist cross-check for the darker-navy 2002–2025 sword alternate. The underlying sword identity was first worn Sept. 12, 1999.'
  },
  titansSword:{
    label:'Tennessee Titans — 15th-season sword reference',
    url:'https://www.tennesseetitans.com/news/titans-unveil-fans-choice-of-15th-season-logo-9948081',
    role:'Official Titans article explicitly referring to the team’s “sword” mark in the 2013 anniversary-logo design.'
  },
  titans2018Uniforms:{
    label:'Tennessee Titans — 2018 uniform story',
    url:'https://www.tennesseetitans.com/news/the-story-behind-titans-new-uniforms-and-helmet-20512660',
    role:'Official source for the 2018 navy helmet and sword-inspired uniform/stripe treatment.'
  },
  wikipedia:{
    label:'Wikipedia — Tennessee Titans',
    url:'https://en.wikipedia.org/wiki/Tennessee_Titans',
    role:'Secondary cross-check for historical logo/uniform context, including the Tennessee Oilers transition.'
  },
  pfr:{
    label:'Pro Football Reference — franchise encyclopedia',
    url:'https://www.pro-football-reference.com/teams/oti/',
    role:'Secondary cross-check for franchise naming eras and season chronology.'
  }
};

export const legacyTimeline=[
  {
    id:'origin',
    era:'Aug. 14, 1959 / 1960',
    kicker:'Franchise origin',
    title:'Granted in 1959. Football began in 1960.',
    image:null,
    alt:'',
    verification:'Verified milestone',
    verificationLevel:'verified',
    copy:'The franchise was granted on Aug. 14, 1959 as an AFL charter member, while the Houston Oilers began play in 1960. Keeping those dates separate avoids turning “franchise granted” and “first season” into the same event.',
    sourceKeys:['hallOfFame','pfr']
  },
  {
    id:'houston-oilers',
    era:'1960–1996',
    kicker:'Houston Oilers',
    title:'The derrick was a constant motif, not one unchanged graphic.',
    image:'/assets/archive/oilers-derrick.webp',
    alt:'Representative Oilers oil-derrick reference graphic; exact historical year variant is intentionally not assigned.',
    verification:'Representative historical reference',
    verificationLevel:'representative',
    copy:'The Oilers used an oil-derrick helmet mark throughout the Houston era, but helmet shell color, striping, facemask color and the derrick treatment changed repeatedly. The official helmet history separates major looks across 1960–65, 1966–70, 1971, 1972–74, 1975–80 and 1981–98, while specialist logo catalogs split standalone primary-logo eras even further. This single project image is therefore representative, not “the 1960–1996 logo.”',
    sourceKeys:['titansLogoHistory','sportsLogos','wikipedia']
  },
  {
    id:'tennessee-oilers',
    era:'1997–1998',
    kicker:'Tennessee Oilers',
    title:'Two transition seasons kept the Oilers identity.',
    image:'/assets/archive/oilers-derrick.webp',
    alt:'Representative Oilers derrick reference for the 1997–1998 Tennessee Oilers era; not the exact Tennessee alternate logo.',
    verification:'Representative transition-era reference',
    verificationLevel:'representative',
    copy:'The franchise moved to Tennessee in 1997 and kept the Tennessee Oilers name for two seasons. The Titans’ official helmet history says a Tennessee logo was added to the back of the helmet in 1997; Wikipedia also documents an alternate mark that combined Tennessee-flag elements with the derrick. Because that exact alternate is not the asset shown here, the image stays labeled as a representative Oilers reference.',
    sourceKeys:['titansLogoHistory','wikipedia','hallOfFame']
  },
  {
    id:'fireball-wordmark-era',
    era:'1999–2017',
    kicker:'Tennessee Titans',
    title:'Titans name, fireball-T and the original wordmark era.',
    image:'/assets/archive/fireball-wordmark.webp',
    alt:'Reference graphic pairing the Tennessee Titans fireball-T mark with a pre-2018 Titans wordmark; not an exact year-specific primary-logo file.',
    verification:'Representative pre-2018 identity reference',
    verificationLevel:'representative',
    copy:'The Titans name and fireball-T identity debuted for the 1999 season. The primary mark was not literally unchanged for this whole span: SportsLogos catalogs primary-logo versions for 1999–2001 and 2002–2025, while the pre-2018 wordmark family is dated 1999–2017. This combined project graphic is used to represent the pre-2018 wordmark era without pretending it is one exact primary-logo file for every year.',
    sourceKeys:['titansLogoHistory','sportsLogos','wikipedia']
  },
  {
    id:'2018-uniform-era',
    era:'2018–2025',
    kicker:'Tennessee Titans',
    title:'New uniforms and wordmark; the fireball primary stayed.',
    image:'/assets/archive/fireball-on-navy.webp',
    alt:'Reference presentation of the pre-2026 Tennessee Titans fireball-T mark on navy; the fireball primary logo remained in use through 2025.',
    verification:'Representative 2018–2025 presentation',
    verificationLevel:'representative',
    copy:'The 2018 redesign introduced the navy helmet, a sword-inspired center stripe and a new uniform/wordmark system. It did not create a new primary team logo: the fireball-T remained the primary mark through 2025. Titans Blue returned as the primary home jersey color in 2025. The image is labeled as a navy presentation of the fireball era, not a separate “2018 logo” or “sword alternate.”',
    sourceKeys:['titansLogoHistory','titans2018Uniforms','sportsLogos','wikipedia']
  },
  {
    id:'shield-era',
    era:'2026–present',
    kicker:'Tennessee Titans',
    title:'The Shield becomes the primary logo.',
    image:'/assets/archive/current-shield-primary.webp',
    alt:'Tennessee Titans 2026 primary logo, The Shield, with a white T and three white stars inside a Titans blue circle with white and red accents.',
    verification:'Current primary identity — label verified',
    verificationLevel:'verified',
    copy:'On March 12, 2026 the Titans unveiled the current identity. The team explicitly calls the primary logo “The Shield.” The logo removes the old flames, keeps the T and three stars, and appears on the white helmet alongside the Nashville-inspired 6-String Stripe.',
    sourceKeys:['titansBrand','titansReveal','sportsLogos','wikipedia']
  }
];

export const visualArchive=[
  {
    id:'shield-primary',
    image:'/assets/archive/current-shield-primary.webp',
    title:'The Shield',
    era:'2026–present',
    kind:'Current identity',
    verification:'Current primary identity — label verified',
    verificationLevel:'verified',
    alt:'Tennessee Titans 2026 primary logo, The Shield, with a white T and three white stars inside a Titans blue circle with white and red accents.',
    description:'The current primary logo. The Titans’ official brand page calls it “The Shield.”',
    provenance:'The identity and label are verified against current Tennessee Titans brand materials. The repo file is used in an unofficial fan project and should not be read as a grant of logo-usage rights.',
    sourceKeys:['titansBrand','titansReveal','sportsLogos']
  },
  {
    id:'current-lockup',
    image:'/assets/brand/current-lockup.webp',
    title:'2026 Shield + wordmark lockup',
    era:'2026–present',
    kind:'Current identity',
    verification:'Current-brand reference',
    verificationLevel:'verified',
    alt:'Tennessee Titans 2026 Shield logo paired with the current Titans wordmark.',
    description:'A current-brand lockup reference pairing The Shield with the Titans wordmark.',
    provenance:'The current Shield name and wordmark-era context are checked against the official 2026 brand presentation; this project file is not described as an independently licensed official asset package.',
    sourceKeys:['titansBrand','titansReveal']
  },
  {
    id:'shield-fireball-comparison',
    image:'/assets/archive/logo-transition-shield-fireball.webp',
    title:'Shield / fireball comparison',
    era:'2002–2026 transition reference',
    kind:'Reference graphic',
    verification:'Project comparison graphic',
    verificationLevel:'reference-composite',
    alt:'Project comparison graphic showing the 2026 Titans Shield beside the pre-2026 fireball-T identity; not an official standalone logo.',
    description:'Useful for comparing the current Shield with the previous fireball identity, but it is not a historical logo by itself.',
    provenance:'Explicitly classified as a project comparison/composite so it cannot be mistaken for an official primary, alternate or anniversary mark.',
    sourceKeys:['titansBrand','titansReveal','sportsLogos']
  },
  {
    id:'oilers-derrick',
    image:'/assets/archive/oilers-derrick.webp',
    title:'Oilers derrick — representative reference',
    era:'Oilers eras, 1960–1998',
    kind:'Oilers reference',
    verification:'Representative historical reference',
    verificationLevel:'representative',
    alt:'Representative Oilers oil-derrick reference graphic; exact historical year variant is intentionally not assigned.',
    description:'Represents the franchise’s long-running oil-derrick motif without assigning this one rendering to every Oilers season.',
    provenance:'Official helmet history documents repeated changes to the derrick treatment and helmet system. The exact year variant of this project file is not established, so the label stays intentionally broad.',
    sourceKeys:['titansLogoHistory','sportsLogos','wikipedia']
  },
  {
    id:'fireball-wordmark',
    image:'/assets/archive/fireball-wordmark.webp',
    title:'Fireball + pre-2018 wordmark reference',
    era:'1999–2017 wordmark era',
    kind:'Fireball era',
    verification:'Representative historical reference',
    verificationLevel:'representative',
    alt:'Reference graphic pairing the Tennessee Titans fireball-T mark with a pre-2018 Titans wordmark; not an exact year-specific primary-logo file.',
    description:'A pre-2018 wordmark-era reference. The primary fireball mark itself has a documented 1999–2001 / 2002–2025 chronology.',
    provenance:'Labeled by the elements it visibly combines rather than calling the whole graphic the official “1999–2017 primary logo.”',
    sourceKeys:['sportsLogos','titansLogoHistory','wikipedia']
  },
  {
    id:'fireball-on-navy',
    image:'/assets/archive/fireball-on-navy.webp',
    title:'Fireball on navy — presentation reference',
    era:'2002–2025 primary mark; navy helmet from 2018',
    kind:'Fireball era',
    verification:'Representative historical reference',
    verificationLevel:'representative',
    alt:'Reference presentation of the pre-2026 Tennessee Titans fireball-T mark on navy; the fireball primary logo remained in use through 2025.',
    description:'Separates two facts that are easy to blur together: the fireball primary continued through 2025, while the navy helmet arrived with the 2018 uniform redesign.',
    provenance:'Not labeled as a separate “2018 logo.” A Titans sword secondary/alternate mark is historically documented, but this file is not verified as that sword asset. The 2018 uniform also used sword-inspired helmet, jersey and pant details.',
    sourceKeys:['titansLogoHistory','titans2018Uniforms','sportsLogos','wikipedia']
  }
];

export const knownVisualsNotPictured=[
  {
    id:'titans-sword-alternate',
    title:'Titans sword alternate / secondary mark',
    status:'Documented identity · verified project asset not available',
    copy:'The sword is a real Titans secondary/alternate mark. Official Titans material explicitly calls it the “Titans sword.” SportsLogos catalogs a lighter-navy 1999–2001 version and a darker-navy 2002–2025 version; both are the same underlying sword identity first worn Sept. 12, 1999. The repo’s old legacy-sword.webp cannot be used as proof because it is one of several differently named legacy aliases that resolve to the same binary. Keep this identity text-only until a distinct, provenance-checked asset is added.',
    sourceKeys:['titansSword','sportsLogosSword1999','sportsLogosSword','sportsLogos']
  },
  {
    id:'tennessee-oilers-alternate',
    title:'Tennessee Oilers Tennessee-flag / derrick alternate',
    status:'Historically documented · exact project asset not available',
    copy:'Wikipedia documents a 1997–1998 alternate mark combining Tennessee-flag elements with the derrick, and the official Titans helmet history confirms Tennessee-specific branding was added after relocation. The current Oilers image in this project is not verified as that alternate, so the alternate is acknowledged but intentionally not pictured.',
    sourceKeys:['wikipedia','titansLogoHistory']
  }
];

export const sourcesFor=keys=>(keys||[]).map(key=>visualSources[key]).filter(Boolean);
