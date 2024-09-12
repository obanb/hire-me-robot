import { randomUUID } from 'crypto'
import {SQL, sql} from 'drizzle-orm'
import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import type { AdapterAccount } from "next-auth/adapters"

const uuid_pk = () =>
    text('id')
        .primaryKey()
        .$default(() => randomUUID())

const datetime = () =>
    text('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull()

const date = (name: string) => text(name)

const boolean = (field: string) => integer(field, { mode: 'boolean' })

export const invitation = sqliteTable('invitation', {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
    // some stupid ts shit
    used: boolean("used").notNull().default(false as any),
    email: text('email').notNull(),
    vectorKey: text('vectorKey').notNull(),
})

export const agent = sqliteTable('agent', {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
    description: text('description').notNull(),
    name: text("name").notNull(),
    priority: integer('priority').notNull(),
    invitationId: text("invitationId")
        .notNull()
        .references(() => invitation.id, { onDelete: "cascade" }),
})

export const question = sqliteTable('question', {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
    // some stupid ts shit
    used: boolean("used").notNull().default(false as SQL<boolean>),
    text: text("text").notNull(),
    agent: text("agent").notNull(),
    invitationId: text("invitationId")
        .notNull()
        .references(() => invitation.id, { onDelete: "cascade" }),
})


export const users = sqliteTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
    image: text("image"),
})

export const accounts = sqliteTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const sessions = sqliteTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const verificationTokens = sqliteTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
)

export const authenticators = sqliteTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: integer("credentialBackedUp", {
            mode: "boolean",
        }).notNull(),
        transports: text("transports"),
    },
    (authenticator) => ({
        compositePK: primaryKey({
            columns: [authenticator.userId, authenticator.credentialID],
        }),
    })
)