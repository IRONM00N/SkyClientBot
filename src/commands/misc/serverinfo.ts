import { MessageEmbed } from "discord.js";
import { BotCommand } from "../../extensions/BotCommand";

export default class serverinfo extends BotCommand {
	constructor() {
		super("serverinfo", {
			aliases: ["serverinfo", "sinfo", "si", "server", "servin"] 
		});
	}

	exec(message) {
		const infoembed = new MessageEmbed()
		const example = `This is an example!`

        infoembed.setTitle(message.guild.name)
        .setDescription(`
		Created by: <@${message.guild.ownerID}>
		Members: \`${message.guild.memberCount}\`
		Online: \`i have no idea how to do this\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\`
		Example: \`${example}\``)

        message.channel.send(infoembed)
	}
}
