import { ApplicationCommandData, Client, Collection } from "discord.js";
import { EventEmitter } from "stream";
import CommandDo from "./commandDo";
import queue from "./queue";

export default interface NewClient extends Client {
    music?: MusicEventEmitter
    queue?: Map<string, queue>
    commands?: ApplicationCommandData[]
    commandsDo?: Collection<string, CommandDo>
}

interface MusicEventEmitter extends EventEmitter {
    on: (eventName: 'musicAdded', listener: () => Promise<void>) => void
}