import { ApplicationCommandData, Client, CommandInteraction, GuildMember, MessageEmbed } from "discord.js"
import CommandDo from "../interfaces/commandDo"
import ytdl from "ytdl-core-discord"
import yts from "yt-search"
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice"

export const command: ApplicationCommandData = {
    name: `재생`,
    description: '음악을 재생함미다',
    options: [{
        type: "STRING",
        required: true,
        name: 'music_name',
        description: "음악의 이름을 여기에 적어주세요!"
    }]
}

export const commandDo: CommandDo = async (client, interaction: CommandInteraction) => {
    if (interaction.member instanceof GuildMember) {
        const musicName = String(interaction.options.get('music_name')?.value)
        const guildQueue = client.queue?.get(String(interaction.guildId))
        const voiceChannel = interaction.member.voice.channel

        if (voiceChannel) {
            const results = await yts({
                query: musicName,
                hl: 'KR',
                gl: 'KR',
            })
            const video = results.videos[0]
            if (!guildQueue) {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: String(interaction.guildId),
                    adapterCreator: voiceChannel?.guild.voiceAdapterCreator
                })
                const audioSource = await ytdl(video.url)
                const audioPlayer = createAudioPlayer()
                connection.subscribe(audioPlayer)

                audioPlayer.play(createAudioResource(audioSource))
                audioPlayer.on(AudioPlayerStatus.Idle, () => {
                    
                })
            } else {
                guildQueue.music.push({
                    name: video.title,
                    url: video.url,
                    thumbnail: video.thumbnail,
                    duration: video.duration.toString()
                })
                client.music?.emit('musicAdded', interaction)
            }
        } else {
            interaction.reply('먼저, 음성채널에 들어가주세요!')
        }
    }
}