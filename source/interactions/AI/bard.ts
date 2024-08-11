import {SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder} from "discord.js"
import {run} from "../../plugins/Bard"

const data = new SlashCommandBuilder()
    .setName(`bard`)
    .setDescription(`Interact with Bard`)
    .addStringOption((option) => option.setName(`prompt`).setDescription(`The prompt to reply`).setRequired(true))


const slash = async (interaction: ChatInputCommandInteraction ) : Promise<void>=> {

    const prompt = interaction.options.getString(`prompt`)
    if(interaction.isRepliable()) {
        await interaction.deferReply()    
    }
    let res = await run(prompt || ``)

    let replyEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(prompt?.slice(0, 256) || ``)
    .setDescription(res.slice(0, 4000))
    await interaction.editReply({
        embeds: [replyEmbed]
    })

}

export = {
    data,
    slash,
}