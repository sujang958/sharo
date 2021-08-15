import { ApplicationCommandData, Client, CommandInteraction, GuildChannel, GuildMember, MessageEmbed } from "discord.js"
import CommandDo from "../interfaces/commandDo"

export const command: ApplicationCommandData = {
    name: `정지`,
    description: '음악 멈춰!'
}

export const commandDo: CommandDo = async (client, interaction: CommandInteraction) => {
    if (interaction.member instanceof GuildMember) {
        const guildQueue = client.queue?.get(String(interaction.guildId))
        if (!guildQueue)
            return interaction.reply('재생중인 음악이 없네요!')
        if (!guildQueue.onPlaying)
            return interaction.reply('재생중인 음악이 없네요!')
        if (guildQueue.music.length <= 0)
            return interaction.reply('음악이 없네요!')

        guildQueue.audioPlayer.pause()
        guildQueue.onPlaying = false
        guildQueue.onPause = true
        interaction.reply('음악을 멈췄어요!')
    } else {
        interaction.reply(':thinking:')
    }
}

