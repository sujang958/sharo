import { Client, Collection, Intents } from "discord.js";
import { config } from "dotenv";
import NewClient from "./interfaces/client"
import CommandFile from "./interfaces/commandFile";
import fs from "fs"
import CommandDo from "./interfaces/commandDo";

config()

const client: NewClient = new Client({
    intents: [
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS,
    ]
})

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

client.on('ready', () => {
    if (client.commands) {
        client.application?.commands.cache.map(command => {
            if (!client.commandsDo?.has(command.name)) {
                const target = client.commands?.find(cmd => cmd.name == command.name)
                if (target)
                    client.application?.commands.create(target)
            }
        })
    }
    console.log('logged on', client.user?.tag)
})

client.on('interaction', async (interaction) => {
    if (!interaction.isCommand()) return
    if (!client.commandsDo) return
    const command: CommandDo | undefined = client.commandsDo.get(interaction.commandName)
    
    if (command)
        command(interaction)
})

client.login(process.env.TOKEN)