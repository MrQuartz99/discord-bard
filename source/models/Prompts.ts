import { Schema , model} from "mongoose";

interface IPrompt {
    userId: string
    guildId: string
    channelId: string
    prompt: string
    response: string
    date: Date
    userMessageId: string
    botMessageId: string
    chatId: string
}


const PromptSchema = new Schema<IPrompt>({
    userId: String,
    guildId: String,
    channelId: String,
    prompt: String,
    response: String,
    date: Date,
    userMessageId: String,
    botMessageId: String,
    chatId: String
})


export {
    PromptSchema,
    IPrompt
}