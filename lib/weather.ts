export type Place = { name: string; latitude: number; longitude: number; country?: string; admin1?: string; id?: number };
export type Hour = { time: string; temp: number; feels: number; rain: number; amount: number; wind: number; code: number; daylight: boolean };
export type Forecast = { timezone: string; localTime: string; fetchedAt: string; current: { temperature_2m: number; apparent_temperature: number; weather_code: number; is_day: number }; hours: Hour[]; dates: string[] };
export const defaultPlace: Place = { name: 'Bengaluru', latitude:12.9716, longitude:77.5946, country:'India' };
export const hourLabel = (time: string) => { const h=Number(time.slice(11,13));return `${h%12||12}${h<12?' AM':' PM'}`; };
export const snowCode=(c:number)=>[71,73,75,77,85,86].includes(c);
export const wetCode=(c:number)=>c>=51 && !snowCode(c);
export function conditions(c:number){return c>=95?'Thunderstorms':snowCode(c)?'Snow':c>=51?'Rain':c>=45?'Fog':c>=3?'Overcast':c>=1?'Partly cloudy':'Clear skies';}
export function skyFor(c:number,day:boolean){return !day?'night':c>=95?'rain':snowCode(c)?'snow':wetCode(c)?'rain':c<2?'clear':'cloudy';}
export function interpret(f:Forecast,day:number,nowLocal=f.localTime){
 const date=f.dates[day];const all=f.hours.filter(h=>h.time.startsWith(date));
 const remaining=all.filter(h=>day!==0 || h.time.slice(0,13)>=nowLocal.slice(0,13));
 if(!remaining.length)return null;
 const active=remaining.filter(h=>Number(h.time.slice(11,13))>=7&&Number(h.time.slice(11,13))<22);
 const hours=active.length?active:remaining;
 const wet=(h:Hour)=>h.rain>=45 || h.amount>=.2 || wetCode(h.code) || snowCode(h.code);
 const first=hours[0], rainy=hours.filter(wet), snow=hours.some(h=>snowCode(h.code)),storm=hours.some(h=>h.code>=95);
 const peak=Math.max(...hours.map(h=>h.feels)),low=Math.min(...hours.map(h=>h.feels));
 const wind=Math.max(...hours.map(h=>h.wind));
 let headline='A mostly dry day ahead.';
 let change='Little or no rain is forecast.';
 if(rainy.length){
  if(wet(first)){
   const clearing=hours.findIndex((h,i)=>i>0&&!wet(h)&&hours[i+1]&&!wet(hours[i+1]));
   headline=clearing>0?`${snow?'Snow':'Rain'} first.\nA drier stretch later.`:`${snow?'Snow':'Rain'} is on the cards.`;
   change=clearing>0?`${snow?'Snow':'Rain'} may ease around ${hourLabel(hours[clearing].time)}${hours.slice(clearing+2).some(wet)?', with more showers possible later.':'.'}`:`${snow?'Snow':'Showers'} are possible through much of ${day===0?'the rest of today':'the day'}.`;
  }else{headline=`A dry start.\n${snow?'Snow':'Showers'} later.`;change=`${snow?'Snow':'Rain'} becomes more likely around ${hourLabel(rainy[0].time)}.`;}
 }
 if(storm){headline='Thunderstorms possible.\nKeep plans flexible.';change='Choose indoor plans during forecast storm hours.';}
 else if(wind>=40){headline='A windy day.\nPlan for strong winds.';}
 else if(!rainy.length&&peak>=35){headline='A hot day ahead.\nGo out early or late.';}
 else if(!rainy.length&&peak<=8){headline='A cold day ahead.\nLayer up.';}
 if(day===0&&Number(nowLocal.slice(11,13))>=21&&!storm){headline=rainy.length?'A wet end to the day.':'A mostly dry night ahead.';}
 const feeling=peak>=35?'It’ll feel very hot.':peak>=29?'It’ll feel warm to hot.':peak>=23?'Expect warm conditions.':peak>=16?'It should feel mild.':peak>=8?'It’ll feel cool.':'It’ll feel cold.';
 const clothes=low<=5?'Warm layers and a coat':low<=14?'Bring a jacket or an extra layer':peak>=27?'Light, breathable clothes':'Comfortable light layers';
 const umbrella=storm?'Rain cover; shelter during storms':snow?'Waterproof shoes and warm layers':rainy.length?'Take an umbrella or raincoat':'You can likely leave the umbrella';
 const evening=remaining.filter(h=>Number(h.time.slice(11,13))>=18&&Number(h.time.slice(11,13))<=21);
 const eveningText=evening.length?(evening.some(h=>h.code>=95)?'Keep evening plans indoors':evening.some(wet)?'Have an indoor backup this evening':'Evening plans look mostly dry'):'Check tomorrow for your next outing';
 const windows=remaining.map((h,i)=>remaining.slice(i,i+3)).filter(w=>w.length===3 && w.every(h=>h.daylight&&!wet(h)&&h.wind<35&&h.feels<35&&h.feels>0&&h.code<45));
 windows.sort((a,b)=>a.reduce((s,h)=>s+h.rain+Math.abs(h.feels-22)*2+h.wind/2,0)-b.reduce((s,h)=>s+h.rain+Math.abs(h.feels-22)*2+h.wind/2,0));
 const best=windows[0];
 return {headline,summary:`${change} ${feeling}`,clothes,umbrella,eveningText,window:best?`${hourLabel(best[0].time)}–${hourLabel(best[2].time)}`:'No clear outdoor window',windowNote:best?'A relatively dry, comfortable stretch for a walk or errands.':'No three-hour daylight stretch meets our dry, mild and low-wind criteria. Check the hourly forecast before heading out.',hours:remaining,sky:skyFor(day===0?f.current.weather_code:hours[Math.floor(hours.length/2)].code,day===0?Boolean(f.current.is_day):true),feels:Math.round(peak),low:Math.round(low)};
}
