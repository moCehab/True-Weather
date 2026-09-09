import type { Forecast, Place } from './weather';
const cache = new Map<string, { data: Forecast; at: number }>();
const staticHosting = process.env.NEXT_PUBLIC_STATIC_HOSTING === 'true';
export async function fetchForecast(place: Place, signal: AbortSignal): Promise<Forecast> {
 const key=`${place.latitude.toFixed(3)},${place.longitude.toFixed(3)}`;
 const old=cache.get(key);if(old&&Date.now()-old.at<900000)return old.data;
 const endpoint=new URL(staticHosting?'https://api.open-meteo.com/v1/forecast':`${window.location.origin}/api/weather`);
 endpoint.search=staticHosting?new URLSearchParams({latitude:String(place.latitude),longitude:String(place.longitude),current:'temperature_2m,apparent_temperature,weather_code,is_day',hourly:'temperature_2m,apparent_temperature,precipitation_probability,precipitation,wind_speed_10m,weather_code,is_day',daily:'weather_code',timezone:'auto',forecast_days:'2'}).toString():new URLSearchParams({lat:String(place.latitude),lon:String(place.longitude)}).toString();
 const response=await fetch(endpoint,{signal:AbortSignal.any([signal,AbortSignal.timeout(12000)])});
 if(!response.ok)throw Error('We couldn’t update the forecast. Please try again.');
 let data:Forecast;
 if(staticHosting){
 const d=await response.json() as {timezone:string;current:Forecast['current']&{time:string};daily:{time:string[]};hourly:{time:string[];[key:string]:string[]|number[]}};
 const fields=['temperature_2m','apparent_temperature','precipitation_probability','precipitation','wind_speed_10m','weather_code','is_day'];
 if(!d.hourly?.time?.length||!d.current||!d.daily?.time?.length||!fields.every(k=>Array.isArray(d.hourly[k])&&d.hourly[k].length===d.hourly.time.length&&d.hourly[k].every(v=>typeof v==='number'&&Number.isFinite(v))))throw Error('The forecast is incomplete. Please try again.');
 data={timezone:d.timezone,localTime:d.current.time,fetchedAt:new Date().toISOString(),current:d.current,dates:d.daily.time,hours:d.hourly.time.map((time,i)=>({time,temp:Number(d.hourly.temperature_2m[i]),feels:Number(d.hourly.apparent_temperature[i]),rain:Number(d.hourly.precipitation_probability[i]),amount:Number(d.hourly.precipitation[i]),wind:Number(d.hourly.wind_speed_10m[i]),code:Number(d.hourly.weather_code[i]),daylight:Boolean(d.hourly.is_day[i])}))};
 }else{data=await response.json() as Forecast;}
 if(cache.size>=30)cache.delete(cache.keys().next().value!);cache.set(key,{data,at:Date.now()});return data;
}
export async function searchPlaces(query:string,signal:AbortSignal):Promise<Place[]> {
 const endpoint=new URL(staticHosting?'https://geocoding-api.open-meteo.com/v1/search':`${window.location.origin}/api/places`);
 endpoint.search=staticHosting?new URLSearchParams({name:query,count:'6',language:'en',format:'json'}).toString():new URLSearchParams({q:query}).toString();
 const r=await fetch(endpoint,{signal:AbortSignal.any([signal,AbortSignal.timeout(8000)])});if(!r.ok)throw Error('Location search is unavailable. Try again or use your location.');const d=await r.json() as {results?:Place[]};return d.results||[];
}
