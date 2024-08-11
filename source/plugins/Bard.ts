const { GoogleGenerativeAI,GoogleGenerativeAIResponseError } = require("@google/generative-ai");
import { FinishReason } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.BardAPIKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

const run = async (prompt: string): Promise<string> => {
    
    const result = await model.generateContent(prompt).catch((e: any) => console.log(e))
    if(result.response.candidates[0]?.finishReason === FinishReason.STOP) {
        return result.response.text()
    } else {
        return `There was an error with the prompt: ${prompt}`
    }
}

export {
    run
}