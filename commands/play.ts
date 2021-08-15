import { ApplicationCommandData, Client, CommandInteraction, GuildChannel, GuildMember, MessageEmbed } from "discord.js"
import CommandDo from "../interfaces/commandDo"
import ytdl from "ytdl-core-discord"
import yts from "yt-search"
import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice"
import NewClient from "../interfaces/client"
import Queue from "../interfaces/queue"

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
        const voiceChannel = interaction.member.voice.channel
        const guildQueue = client.queue?.get(String(interaction.guildId))

        if (voiceChannel) {
            const results = await yts({
                query: musicName,
                hl: 'KR',
                gl: 'KR',
            })
            const video = results.videos[0]

            if (!video)
                return interaction.reply('동영상이 없는것 같아요!')
            if (!guildQueue) {
                const voiceConnection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: String(interaction.guildId),
                    adapterCreator: voiceChannel?.guild.voiceAdapterCreator
                })
                const audioPlayer = createAudioPlayer()
                voiceConnection.subscribe(audioPlayer)
                const queue: Queue = {
                    voiceChannel,
                    voiceConnection,
                    audioPlayer,
                    onPlaying: false,
                    onPause: false,
                    music: [{
                        name: video.title,
                        url: video.url,
                        thumbnail: video.thumbnail,
                        duration: video.duration.toString()
                    }]
                }
                client.queue?.set(String(interaction.guildId), queue)
                voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
                    client.music?.emit('end', interaction, queue)
                })
                client.music?.emit('musicAdded', interaction, video)
                play(client, interaction, queue)
            } else {
                guildQueue.music.push({
                    name: video.title,
                    url: video.url,
                    thumbnail: video.thumbnail,
                    duration: video.duration.toString()
                })
                client.music?.emit('musicAdded', interaction, video)
                play(client, interaction, guildQueue)
            }
        } else {
            interaction.reply('먼저, 음성채널에 들어가주세요!')
        }
    }
}

const play = async (client: NewClient, interaction: CommandInteraction, guildQueue: Queue): Promise<any> => {
    const video = guildQueue.music[guildQueue.music.length - 1]
    
    if (!video)
        return client.music?.emit('end', interaction)
    
    const targetAudio = await ytdl(video.url, {
        highWaterMark: 1<<25
    })
    const audioResource = createAudioResource(targetAudio, { inlineVolume: true })
    
    if (!guildQueue.onPlaying) {
        guildQueue.onPlaying = true
        guildQueue.audioPlayer.play(audioResource)
        guildQueue.currentAudioResource = audioResource
    }  
    
    guildQueue.audioPlayer.on(AudioPlayerStatus.Idle, async (): Promise<any> => {
        guildQueue.onPlaying = false
        guildQueue.music.shift()
        if (guildQueue.music.length <= 0)
            return client.music?.emit('end', interaction, guildQueue)
        
        play(client, interaction, guildQueue)
    })
}

process.on('uncaughtException', (e) => {
    console.log(e.name, e.message)
    console.log(e.stack)
})
