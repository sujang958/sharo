import { ApplicationCommandData, Client, CommandInteraction, GuildChannel, GuildMember, MessageEmbed } from "discord.js"
import CommandDo from "../interfaces/commandDo"

export const command: ApplicationCommandData = {
    name: `다시재생`,
    description: '멈춘 음악을 다시 트러줍미다!'
}

export const commandDo: CommandDo = async (client, interaction: CommandInteraction) => {
    if (interaction.member instanceof GuildMember) {
        const guildQueue = client.queue?.get(String(interaction.guildId))
        if (!guildQueue)
            return interaction.reply('재생중인 음악이 없네요!')
        if (guildQueue.onPlaying)
            return interaction.reply('음악이 이미 재생중이네요!')
        if (!guildQueue.onPause)
            return interaction.reply('음악이 이미 재생중이네요!')
        if (guildQueue.music.length <= 0)
            return interaction.reply('음악이 없네요!')

        guildQueue.audioPlayer.unpause()
        guildQueue.onPlaying = true
        guildQueue.onPause = false
        interaction.reply('음악을 다시 재생할께요!')
    } else {
        interaction.reply(':thinking:')
    }
}