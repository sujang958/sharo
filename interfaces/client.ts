import { ApplicationCommandData, Client, Collection } from "discord.js";
import CommandDo from "./commandDo";

export default interface NewClient extends Client {
    queue?: Map<string, object>
    commands?: ApplicationCommandData[]
    commandsDo?: Collection<string, CommandDo>
}