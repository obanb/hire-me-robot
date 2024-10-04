import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NextUIProvider from './NextUIProvider'
import UserContextProvider from "./UserContextProvider";
import { SessionProvider } from 'next-auth/react';


import {auth} from "../server/auth";
import {redirect} from "next/navigation";
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    const isAuth = await auth()

    console.log('isAuth', isAuth)

    if (!isAuth) {
        // If the user is not authenticated, redirect them to the sign-in page
        redirect('/api/auth/signin');
    }

  return (
      <html lang="en">
      <body
          className={`${inter.className} dark text-foreground bg-background h-screen w-screen bg-white`}
      >
      <SessionProvider>
          <UserContextProvider>
              <NextUIProvider>
                  {children}
              </NextUIProvider>
          </UserContextProvider>
      </SessionProvider>
      </body>
      </html>
  )
}
