export const TEAM_TIME_ZONE='America/Chicago';
export const TEAM_TIME_LABEL='Nashville time';

export function formatTeamKickoff(value){
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return'Time TBD';
  return new Intl.DateTimeFormat('en-US',{
    weekday:'short',
    month:'short',
    day:'numeric',
    hour:'numeric',
    minute:'2-digit',
    timeZone:TEAM_TIME_ZONE,
    timeZoneName:'short'
  }).format(date);
}

export function formatCalendarDate(value){
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return'Date not loaded';
  return new Intl.DateTimeFormat('en-US',{
    year:'numeric',
    month:'short',
    day:'numeric',
    timeZone:'UTC'
  }).format(date);
}
