import { ApplicationCommandData } from "discord.js";
import CommandDo from "./commandDo";

export default interface CommandFile {
    command: ApplicationCommandData
    commandDo: CommandDo
}