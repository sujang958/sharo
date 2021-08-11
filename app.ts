import { Client, Collection, Intents } from "discord.js";
import { config } from "dotenv";
import NewClient from "./interfaces/client"
import CommandFile from "./interfaces/commandFile";
import fs from "fs"
import CommandDo from "./interfaces/commandDo";
import { EventEmitter } from "events"

config()

const client: NewClient = new Client({
    intents: [
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS,
    ]
})

client.music = new EventEmitter()
client.commands = []
client.commandsDo = new Collection()
client.queue = new Map()

const commandFiles: string[] = fs.readdirSync('./commands') 

for (const file of commandFiles) {
    try {
        const command: CommandFile = require(`./commands/${file}`)
        client.commands.push(command.command)
        client.commandsDo.set(command.command.name, command.commandDo)
    } catch (e) {
        console.log(e)
    }
}

client.on('ready', async () => {
    console.log('logged on', client.user?.tag)
})

client.on('interaction', async (interaction) => {
    if (!interaction.isCommand()) return
    if (!client.commandsDo) return
    const command: CommandDo | undefined = client.commandsDo.get(interaction.commandName)
    
    if (command)
        command(client, interaction)
})

client.login(process.env.TOKEN)
// https://discord.com/api/oauth2/authorize?client_id=874697100494012466&permissions=242669186112&scope=applications.commands%20bot