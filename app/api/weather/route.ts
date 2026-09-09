import type { Forecast } from '@/lib/weather';
const cache=new Map<string,{data:Forecast;at:number}>();
export async function GET(request:Request){
 const url=new URL(request.url);const lat=Number(url.searchParams.get('lat')),lon=Number(url.searchParams.get('lon'));
 if(!url.searchParams.has('lat')||!url.searchParams.has('lon')||!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return Response.json({error:'Choose a valid location.'},{status:400});
 const key=`${lat.toFixed(3)},${lon.toFixed(3)}`;const old=cache.get(key);
 if(old&&Date.now()-old.at<900000)return Response.json(old.data,{headers:{'Cache-Control':'private, max-age=60'}});
 const endpoint=new URL('https://api.open-meteo.com/v1/forecast');endpoint.search=new URLSearchParams({latitude:String(lat),longitude:String(lon),current:'temperature_2m,apparent_temperature,weather_code,is_day',hourly:'temperature_2m,apparent_temperature,precipitation_probability,precipitation,wind_speed_10m,weather_code,is_day',daily:'weather_code',timezone:'auto',forecast_days:'2'}).toString();
 try{const response=await fetch(endpoint,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('Provider unavailable');const d=await response.json() as { timezone:string; current:Forecast['current'] & {time:string;[key:string]:number|string}; daily:{time:string[]}; hourly:{time:string[];[key:string]:number[]|string[]} }; 
 const fields=['temperature_2m','apparent_temperature','precipitation_probability','precipitation','wind_speed_10m','weather_code','is_day'];
 if(!d.hourly?.time?.length||!d.current||!fields.every(k=>Array.isArray(d.hourly[k])&&d.hourly[k].length===d.hourly.time.length&&d.hourly[k].every((v:unknown)=>typeof v==='number'&&Number.isFinite(v)))||!['temperature_2m','apparent_temperature','weather_code','is_day'].every(k=>typeof d.current[k]==='number'))throw Error('Incomplete forecast');
 const data:Forecast={timezone:d.timezone,localTime:d.current.time,fetchedAt:new Date().toISOString(),current:d.current,dates:d.daily.time,hours:d.hourly.time.map((time:string,i:number)=>({time,temp:Number(d.hourly.temperature_2m[i]),feels:Number(d.hourly.apparent_temperature[i]),rain:Number(d.hourly.precipitation_probability[i]),amount:Number(d.hourly.precipitation[i]),wind:Number(d.hourly.wind_speed_10m[i]),code:Number(d.hourly.weather_code[i]),daylight:Boolean(d.hourly.is_day[i])}))};
 if(cache.size>200)cache.delete(cache.keys().next().value!);cache.set(key,{data,at:Date.now()});return Response.json(data,{headers:{'Cache-Control':'private, max-age=60'}});
 }catch{return Response.json({error:'We couldn’t update the forecast. Please try again.'},{status:503});}
}
