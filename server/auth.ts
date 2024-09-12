import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import GitHub from "next-auth/providers/github"
import Resend from "next-auth/providers/resend"
import {db} from "./sqlite-connector";
import {accounts, users, verificationTokens} from "./sqlite-schemas";
import {
    DefaultSQLiteAccountsTable,
    DefaultSQLiteUsersTable,
    DefaultSQLiteVerificationTokenTable
} from "@auth/drizzle-adapter/lib/sqlite";
import {Adapter} from "next-auth/adapters";
import {Provider} from "next-auth/providers";


import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db,{
        accountsTable: accounts as DefaultSQLiteAccountsTable,
        usersTable: users as DefaultSQLiteUsersTable,
        verificationTokensTable: verificationTokens as DefaultSQLiteVerificationTokenTable,
    }) as Adapter,
    secret: process.env.AUTH_SECRET,
    providers: [
        GitHub({clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET}) as Provider,
        Resend({
            from: "notif@aihassle.org",
            apiKey: process.env.RESEND_SECRET_KEY,
        })
    ],
    pages: {
    },
    callbacks: {
    },
})

console.log('AUTH_LOG', auth)