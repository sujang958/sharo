import { Client, Collection, Intents } from "discord.js";
import { config } from "dotenv";
import NewClient from "./interfaces/client"
import fs from "fs"

config()

const client: NewClient = new Client({
    intents: [
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILDS,
    ]
})

client.commands = new Collection()
client.aliases = new Collection()
client.queue = new Map()

const commandFiles: string[] = fs.readdirSync('./commands') 

for (const file of commandFiles) {
    try {
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)

        for (const alias of command.aliases)
            client.aliases.set(alias, command.name)
    } catch (e) {
    
    }
}

client.login(process.env.TOKEN)