import {Pinecone} from "@pinecone-database/pinecone";

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new Pinecone({
    apiKey: process.env.PINECONE_KEY!,
});

export const pinecone = client;