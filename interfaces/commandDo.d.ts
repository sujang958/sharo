import { CommandInteraction } from "discord.js";
import NewClient from "./client";

type CommandDo = (client: NewClient, interaction: CommandInteraction) => Promise<void> | Promise<any>

export default CommandDo