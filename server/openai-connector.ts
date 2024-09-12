import 'dotenv/config'
import OpenAI from "openai";

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!
});

export const openai = openaiClient;