import { ApplicationCommandData, Client, Collection, CommandInteraction } from "discord.js";
import { EventEmitter } from "stream";
import { VideoSearchResult } from "yt-search";
import CommandDo from "./commandDo";
import Queue from "./queue";
import queue from "./queue";

export default interface NewClient extends Client {
    music?: MusicEventEmitter
    queue?: Map<string, queue>
    commands?: ApplicationCommandData[]
    commandsDo?: Collection<string, CommandDo>
}

interface MusicEventEmitter extends EventEmitter {
    on: (eventName: 'musicAdded', listener: (interaction: CommandInteraction, video: VideoSearchResult) => Promise<void> | Promise<any>) => void
    on: (eventName: 'end', listener: (interaction: CommandInteraction, guildQueue: Queue) => Promise<void> | Promise<any>) => void
}