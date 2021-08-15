import { ApplicationCommandData, Client, CommandInteraction, GuildChannel, GuildMember, MessageEmbed } from "discord.js"
import CommandDo from "../interfaces/commandDo"

export const command: ApplicationCommandData = {
    name: `볼륨`,
    description: '음악의 볼륨을 설정함미다!',
    options: [{
        type: 'INTEGER',
        required: true,
        name: 'volume',
        description: '음량을 여기에 적으세요! (1 ~ 100)',
    }]
}

export const commandDo: CommandDo = async (client, interaction: CommandInteraction) => {
    if (interaction.member instanceof GuildMember) {
        if (!interaction.member.permissions.has('MANAGE_CHANNELS'))
            return interaction.reply('채널 편집 권한이 있어야지 가능한 명령어에요!')
        const guildQueue = client.queue?.get(String(interaction.guildId))
        const volume = interaction.options.get('volume')?.value
        if (!volume)
            return interaction.reply('음량이 뭔가 이상하네요! (1~100)')
        if (volume <= 0 || volume > 100)
            return interaction.reply('음량이 뭔가 이상하네요! (1~100)')
        if (!guildQueue)
            return interaction.reply('재생중인 음악이 없네요!')
        if (!guildQueue.currentAudioResource)
            return interaction.reply('재생중인 음악이 없네요!')

        guildQueue.currentAudioResource.volume?.setVolume(Number(volume) / 100)
        interaction.reply('볼륨을 변경했어요!')
    } else {
        interaction.reply(':thinking:')
    }
}

