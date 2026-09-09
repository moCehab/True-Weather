import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'True Weather — Your day, translated', description: 'Live weather translated into what to wear, what to bring, and when to head out.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><head><link rel="icon" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon.svg`}/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/></head><body>{children}</body></html>; }
