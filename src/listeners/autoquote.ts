import { BotListener } from '@extensions/BotListener'
import { Guild, Message, TextChannel } from 'discord.js'

module.exports = class autoquote extends BotListener {
	constructor() {
		super('autoquote', {
			emitter: 'client',
			event: 'messageCreate',
		})
	}

	async exec(message: Message) {
		try {
			if (message.author.bot) return

			const urlRegex = /https:\/\/(?:\w+\.)?discord\.com\/channels\/(\d{18})\/(\d{18})\/(\d{18})/g
			const matches = [...message.content.matchAll(urlRegex)]

			if (matches.length === 0) return

			const messageArray = matches

			messageArray.forEach(async (msgArray) => {
				const mArray = msgArray[0].split('/')
				const guildID = mArray[mArray.length - 3]
				const channelID = mArray[mArray.length - 2]
				const messageID = mArray[mArray.length - 1]

				const guild = (await this.client.guilds.cache.get(guildID)) as Guild
				if (guild === undefined) return
				const channel = await guild.channels.cache.get(channelID)
				if (channel === undefined) return
				if (!channel?.isText()) return

				const member = await guild.members.fetch(message.author)
				if (member === undefined) return

				if (channel.permissionsFor(member).toArray().includes('VIEW_CHANNEL') === false) return

				const msg = await channel.messages.fetch(messageID)
				if (msg === undefined) return

				if (message.channel.type === 'GUILD_TEXT') {
					const webhooks = await (message.channel as TextChannel).fetchWebhooks()
					const foundWebhook = webhooks.find((w) => w.name == `Rain Quoting - ${(message.channel as TextChannel).name}` && w.owner?.id === this.client.user?.id)
					let webhook
					if (foundWebhook === undefined) {
						webhook = await (message.channel as TextChannel).createWebhook(`Rain Quoting - ${(message.channel as TextChannel).name}`, { avatar: this.client.user?.displayAvatarURL() })
					} else if (foundWebhook.owner?.id != this.client.user?.id) {
						webhook = await (message.channel as TextChannel).createWebhook(`Rain Quoting - ${(message.channel as TextChannel).name}`, { avatar: this.client.user?.displayAvatarURL() })
					} else {
						webhook = foundWebhook
					}

					if (msg.content)
						await webhook.send({ content: msg.content, files: msg.attachments.toJSON(), embeds: msg.embeds, username: `${msg.author.tag}`, avatarURL: msg.author.displayAvatarURL() })
					else await webhook.send({ files: msg.attachments.toJSON(), embeds: msg.embeds, username: `${msg.author.tag}`, avatarURL: msg.author.displayAvatarURL() })
				}
				else if (message.channel.type === 'GUILD_PUBLIC_THREAD' || message.channel.type === 'GUILD_PRIVATE_THREAD') {
					const webhooks = await (message.channel.parent as TextChannel).fetchWebhooks()
					const foundWebhook = webhooks.find((w) => w.name == `Rain Quoting - ${(message.channel as TextChannel).name}` && w.owner?.id === this.client.user?.id)
					let webhook
					if (foundWebhook === undefined) {
						webhook = await (message.channel.parent as TextChannel).createWebhook(`Rain Quoting - ${(message.channel.parent as TextChannel).name}`, { avatar: this.client.user?.displayAvatarURL() })
					} else if (foundWebhook.owner?.id != this.client.user?.id) {
						webhook = await (message.channel.parent as TextChannel).createWebhook(`Rain Quoting - ${(message.channel.parent as TextChannel).name}`, { avatar: this.client.user?.displayAvatarURL() })
					} else {
						webhook = foundWebhook
					}

					if (msg.content)
						await webhook.send({ content: msg.content, files: msg.attachments.toJSON(), embeds: msg.embeds, username: `${msg.author.tag}`, avatarURL: msg.author.displayAvatarURL(), threadId: message.channelId })
					else await webhook.send({ files: msg.attachments.toJSON(), embeds: msg.embeds, username: `${msg.author.tag}`, avatarURL: msg.author.displayAvatarURL(), threadId: message.channelId })
				}
			})
		} catch (err) {
			console.error(err)
		}
	}
}