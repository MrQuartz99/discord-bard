import { Interaction , Client , Events} from "discord.js";
import {interactions} from "../main";
export = {
    name: Events.InteractionCreate,
    run: async (client: Client , interaction: Interaction) => {
        
        if (interaction.isChatInputCommand()) {
            const command = interactions.get(interaction.commandName)
            if (!command) return interaction.reply({content: `An error has occured!`})
            try {
                command.slash(interaction)
            } catch (error) {
                console.log(client.user?.tag + ` | ` + error)
                if(interaction.deferred) return interaction.editReply({content: `An error has occured!`})
                interaction.reply({content: `An error has occured!`})
            }
        } if(interaction.isButton()) {
            const command = interactions.get(interaction.customId.split(`-`)[0])
            try {
                let customId = interaction.customId.split(`-`)[1]
                let args = interaction.customId.split(`-`).slice(2)
                command.button(interaction, customId, args)
            } catch (error) {
                console.log(client.user?.tag + ` | ` + error)
                if(interaction.deferred) return interaction.editReply({content: `An error has occured!`})
                interaction.reply({content: `An error has occured!`})
            }
        }

    
    }
}