import { Client, Collection } from "discord.js";

export default interface NewClient extends Client {
    queue?: Map<string, object>
    commands?: Collection<string, object>
    aliases?: Collection<string, object>
}