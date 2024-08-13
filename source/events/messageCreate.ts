import { Interaction , Client , Events, Message, TextChannel, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder} from "discord.js";
import {interactions} from "../main";
import { getGuildModel, getPromptModel, getChatModel} from "../database";
import { run } from "../plugins/Bard";
export = {
    name: Events.MessageCreate,
    run: async (client: Client , message: Message) => {
            if(message.author.bot) return
            const GuildModel = getGuildModel()
            if(!GuildModel) return
            const guildData = await GuildModel.findOne({guildId: message.guildId}) 
            if(!guildData) return
            if(!guildData.AI.enabled) return
            let channel = client.channels.cache.get(guildData.AI.channelId) as TextChannel
            if(channel?.id === message.channelId) {
                interactions.get(`bard`)?.message(client, message)
            }
    
    }
}
