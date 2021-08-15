import { AudioPlayer, AudioResource, VoiceConnection } from "@discordjs/voice";
import { StageChannel, VoiceChannel } from "discord.js"

export default interface Queue {
    voiceChannel: VoiceChannel | StageChannel
    voiceConnection: VoiceConnection
    audioPlayer: AudioPlayer
    music: Music[]
    onPlaying: boolean
    onPause: boolean
    currentAudioResource?: AudioResource
}

interface Music {
    name: string
    url: string
    thumbnail: string
    duration: string
}