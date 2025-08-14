import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-knowledge-base.ts';
import '@/ai/flows/generate-assistant-prompt.ts';
import '@/ai/flows/generate-chat-response.ts';
import '@/ai/flows/generate-inbox-reply.ts';
