import { OpenAI } from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openaiConfig = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  max_tokens: 150
};
