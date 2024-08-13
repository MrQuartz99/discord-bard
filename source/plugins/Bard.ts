const { GoogleGenerativeAI,GoogleGenerativeAIResponseError } = require("@google/generative-ai");
import { FinishReason, GenerateContentResult, GenerativeModel, ModelParams } from "@google/generative-ai";
import { getChatModel, getPromptModel } from "../database";
import { Message } from "discord.js";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.BardAPIKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"}) as GenerativeModel

interface Response {
    text?: string
    error?: string
    chatId?: string
}
const run = async (prompt: string, type?: string , chatId?: string, message?: Message): Promise<Response> => {
    if(!type || type === "command") {
        const result = await model.generateContent(prompt) as GenerateContentResult
        if(result.response.candidates && result.response.candidates[0]?.finishReason === FinishReason.STOP) {
            return {text: result.response.text()}
        } else {
            return {error: `There was an error with the prompt: ${prompt}`}

        }

    }
    let history = []
    if(chatId) {
        let ChatModel = getChatModel()
        if(!ChatModel) return {error: `Chat model not found`}
        let PromptModel = getPromptModel()
        if(!PromptModel) return {error: `Prompt model not found`}
        let chatMessages = await PromptModel.find({chatId: chatId.toString()})
        chatMessages = chatMessages.slice(0, 10)
        for(let message of chatMessages) {
            history.push({ role: "user", parts: [{text: message.prompt}] })
            history.push({ role: "model", parts: [{text: message.response.slice(0, 2000)}] })
        }
    } else {
        let ChatModel = getChatModel()
        if(!ChatModel) return {error: `Chat model not found`}

        let newChat = new ChatModel({
            userId: message?.author?.id || ``,
            guildId: message?.guild?.id || ``,
            channelId: message?.channel?.id || ``,
            terminated: false,
            createdAt: new Date()
        })
        await newChat.save()
        chatId = newChat._id.toString()
    }
    console.log(history)
    history.push({ role: "user", parts: [{text: prompt}] })

    const chat = await model.startChat({ history: history })

    const result = await chat.sendMessage(prompt) as GenerateContentResult

    if(result?.response?.candidates && result.response.candidates[0].finishReason === FinishReason.STOP) {
        return {
            text:result.response.text(),
            chatId: chatId || ``
        }
    } else {
        return {error: `There was an error with the prompt: ${prompt}`}
    }
}

export {
    run
}