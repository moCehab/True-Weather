import React from 'react';
import {createRoot} from 'react-dom/client';
import WeatherApp from '../app/weather-app';
import '../app/globals.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><WeatherApp/></React.StrictMode>);
