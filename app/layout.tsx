import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"FeedForward — A home for your good finds",description:"Transform social media screenshots into events, shopping lists, workouts, and practical next steps.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
