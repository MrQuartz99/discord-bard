import {SlashCommandBuilder, ChatInputCommandInteraction, ButtonInteraction,Client, TextChannel, Message, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} from "discord.js"
import {run} from "../../plugins/Bard"
import { getPromptModel,getChatModel , getGuildModel } from "../../database"
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
    .setDescription(res?.text?.slice(0, 4000) || ``)
    await interaction.editReply({
        embeds: [replyEmbed]
    })

    let promptModel = getPromptModel() 
    if(promptModel) {
 const newPrompt = new promptModel({
        userId: interaction.user.id,
        guildId: interaction.guildId || ``,
        channelId: interaction.channelId,
        prompt: prompt || ``,
        response: res.text
    })
    await newPrompt?.save()
    }

   

}

const message = async (client: Client , message: Message) => {

    const ChatModel = getChatModel()
    if(!ChatModel) return
    let prompt = message.content
    const latestChats = await ChatModel.find({userId: message.author.id, channelId: message.channelId , terminated: false}).sort({createdAt: -1}).limit(1)
    await message.channel.sendTyping()
    const res = await run(prompt , "chat", latestChats[0]?._id.toString(), message)
    let terminateSession = new ButtonBuilder()
    .setCustomId(`bard-terminateCurrentSession`)
    .setLabel(`Terminate Current Session`)
    .setStyle(ButtonStyle.Secondary)

    let row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(terminateSession)
    
    if(res.error) {
        await message.channel.send({
            content: res.error,
            components: [row]
        })
        return
    }

   const msg = await message.channel.send({
    content: res.text?.slice(0, 2000) || ``,
    components: [row]
   })
    const promptModel = getPromptModel()
    if(promptModel) {
        const newPrompt = new promptModel({
            userId: message.author.id,
            guildId: message.guildId,
            channelId: message.channelId,
            prompt: prompt,
            response: res.text,
            userMessageId: message.id,
            botMessageId: msg.id,
            chatId: res.chatId
        })
        await newPrompt.save()
    }
}

const button = async (interaction: ButtonInteraction, customId: string ,args?: string[]) => {
    if(customId === `terminateCurrentSession`) {
        const ChatModel = getChatModel()
        if(!ChatModel) return
        const chats = await ChatModel.find({userId: interaction.user.id, channelId: interaction.channelId , terminated: false})
        if(!chats.length) return await interaction.reply({content: `No active session found.`, ephemeral: true})
        await interaction.deferReply()

        for(let chat of chats) {
            chat.terminated = true
            await chat.save()
        }
        await interaction.editReply({
            content: `Successfully Terminated Current Session, you can now start a new one.`
        })
    }
}

export = {
    data,
    slash,
    message,
    button

}