import { Schema , model} from "mongoose";

interface IChat {
    channelId: string
    userId: string
    guildId: string
    createdAt: Date
    terminated?: boolean
}


const ChatSchema = new Schema<IChat>({
    channelId: String,
    userId: String,
    guildId: String,
    createdAt: Date,
    terminated: {type: Boolean, default: false}
})


export {
    ChatSchema,
    IChat
}