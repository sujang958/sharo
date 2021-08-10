import { CommandInteraction } from "discord.js";

type CommandDo = (interaction: CommandInteraction) => Promise<void> | Promise<any>

export default CommandDo