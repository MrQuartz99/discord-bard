import { Schema , model} from "mongoose";

interface IGuild {
    guildId: string
    AI: {
        channelId: string
        enabled: boolean
        lastModifiedBy: string
    }
}


const GuildSchema = new Schema<IGuild>({
    guildId: {type: String, unique: true , required: true},
    AI: {
       channelId: String,
       enabled: {type: Boolean, default: false},
       lastModifiedBy: String
    },
})

export {
    GuildSchema,
    IGuild
}