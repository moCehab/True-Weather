import assert from 'node:assert/strict';
import {test} from 'node:test';
import {interpret,skyFor} from '../lib/weather.ts';
const forecast={timezone:'Asia/Kolkata',fetchedAt:'2026-09-09T03:30:00Z',dates:['2026-09-09','2026-09-10'],localTime:'2026-09-09T09:00',current:{temperature_2m:22,apparent_temperature:22,weather_code:0,is_day:1},hours:Array.from({length:48},(_,i)=>{const h=i%24;return {time:`2026-09-${i<24?'09':'10'}T${String(h).padStart(2,'0')}:00`,temp:22,feels:22,rain:0,amount:0,wind:10,code:0,daylight:h>=6&&h<=18};})};
test('today excludes elapsed hours; tomorrow retains its full forecast',()=>{assert(interpret(forecast,0).hours.every(h=>h.time>='2026-09-09T09:00'));assert.equal(interpret(forecast,1).hours.length,24);});
test('rain easing requires a sustained dry stretch',()=>{const rainy={...forecast,hours:forecast.hours.map(h=>({...h,rain:Number(h.time.slice(11,13))<14?80:10,code:Number(h.time.slice(11,13))<14?61:0}))};const advice=interpret(rainy,0);assert(advice.summary.includes('2 PM'));assert(advice.umbrella.includes('umbrella'));});
test('unsafe or uncomfortable hours are never promoted as outdoor windows',()=>{for(const variation of [{code:95},{feels:40},{wind:50},{code:75},{feels:-5}]){const advice=interpret({...forecast,hours:forecast.hours.map(h=>({...h,...variation}))},0);assert.equal(advice.window,'No clear outdoor window');}});
test('night forecasts do not promote next-morning windows or elapsed hours',()=>{const advice=interpret(forecast,0,'2026-09-09T23:10');assert.equal(advice.window,'No clear outdoor window');assert.equal(advice.hours.length,1);assert.equal(skyFor(0,false),'night');});
test('expired dates cannot produce today advice',()=>assert.equal(interpret(forecast,0,'2026-09-10T01:00'),null));
