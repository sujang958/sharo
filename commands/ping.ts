import { ApplicationCommandData, MessageEmbed } from "discord.js"
import CommandDo from "../interfaces/commandDo"

export const command: ApplicationCommandData = {
    name: 'ping',
    description: '봇의 핑을 보여준다.'
}

export const commandDo: CommandDo = async (client, interaction) => {
    const ping: number = Date.now() - interaction.createdTimestamp
    const embed = new MessageEmbed()
        .setAuthor('핑!')
        .addField('API Latency', `${client.ws.ping} ms`)
        .addField('Latency', `${ping} ms`)
        .setColor('GREEN')
        .setTimestamp()
        
    interaction.reply({embeds: [embed]})
}