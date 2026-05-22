import express, { text } from "express"
import { tavily } from '@tavily/core'
import 'dotenv/config'
// import { streamText } from 'ai';
import { GoogleGenAI } from "@google/genai";

import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompt";


const app = express()


app.use(express.json())

const ai = new GoogleGenAI({
    apiKey: process.env.AI_GATEWAY_API_KEY
});


const client = tavily({ apiKey: process.env.TAVILY_API_KEY });


app.post('/pureplexity-ask', async (req, res)=>{

    //get the query from the user 
    const query = req.body.query
    //step - 2 make sure user has access/credis to hit the endpoint
    //step-3 (TODO) - check if we have web search indexed for a similar query
    //step 4 -  web search to gather sources
    const webSearchRes = await client.search(query, {
        searchDepth: "advanced"
    })

    const webSearchResult = webSearchRes.results

    //step 5 -
    //step 6 -hit the llm and stream back the responses 

    const prompt = PROMPT_TEMPLATE
    .replace("{{WEB_SEARCH_RESULTS}}" , JSON.stringify(webSearchResult))
    .replace("{{USER_QUERY}}" , query)

    // const result = streamText({
    //     model: 'openai/gpt-5.4',
    //     prompt: 'Invent a new holiday and describe its traditions.',
    //     system : SYSTEM_PROMPT
    //   });
    const result = await ai.models.generateContentStream({
        model: "gemini-3.5-flash",
        contents: query,
        config: {
            systemInstruction: SYSTEM_PROMPT,
          },
      });
    
    

    // hit the llm ? llm apikey/openrouter/ vercel ai gateway

    // for await (const textPart of result.textStream) {
    //     res.write(textPart)
    //   }

    for await (const chunk of result) {
        res.write(chunk.text);
      }


      res.write(`\n<SOURCE>\n`)
      
      res.write(JSON.stringify(webSearchResult.map( result => ({ url: result.url}))))

      res.write(`\n</SOURCE>\n`)
      res.end()
    //also stream back the source and the follow up questions 

})


app.listen(3000, ()=>{
    console.log("server is running on port 3000");
})