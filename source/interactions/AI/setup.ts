import {SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder} from "discord.js"
import {run} from "../../plugins/Bard"
import { getPromptModel, getGuildModel } from "../../database"
const data = new SlashCommandBuilder()
    .setName(`setup`)
    .setDescription(`Setup a Channel to let bard interact with you directly without commands`)
    .addChannelOption((option) => option.setName(`channel`).setDescription(`The channel to setup`).setRequired(true))


const slash = async (interaction: ChatInputCommandInteraction ) : Promise<void>=> {

    const channel = interaction.options.getChannel(`channel`)

    if(interaction.isRepliable()) {
        await interaction.deferReply()
    }
     
    const GuildModel = getGuildModel()
    if(GuildModel) {
        const guildData = await GuildModel.findOne({guildId: interaction.guildId})
        if(guildData) {
            guildData.AI.channelId = channel?.id || ``
            guildData.AI.lastModifiedBy = interaction.user.id
            guildData.save()
        } else {
            const newGuild = new GuildModel({
                guildId: interaction.guildId || ``,
                AI: {
                    channelId: channel?.id || ``,
                    enabled: true,
                    lastModifiedBy: interaction.user.id
                }
            })
            await newGuild?.save()
        }
        
        await interaction.editReply({
            content: `Successfully Setup the AI Channel to ${channel?.name || ``}!`
        })
    }

   

   

}

export = {
    data,
    slash,
}