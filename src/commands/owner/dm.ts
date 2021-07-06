import { MessageEmbed } from 'discord.js';
import { BotCommand } from '@extensions/BotCommand';
import utils from '@functions/utils'

export default class dm extends BotCommand {
    constructor() {
        super('dm', {
            aliases: ['dm'],
            args: [
                {
                    id: 'user',
                    type: 'user'
                },
                {
                    id: 'message',
                    type: 'string',
                    match: 'restContent'
                },
            ],
            ownerOnly: true,
            channel: 'guild'
        });
    }

    async exec(message, args) {
        try {
            const dmembed = new MessageEmbed()
                .setTitle(`Message was sent to **${args.user.tag}**`)
                .addField(`Contents`, `${args.message}`)
                .setTimestamp()

            args.user.send(`${args.message}`)
            message.util.send(dmembed)
        }
        catch (err) {
            utils.errorhandling
        }
    }
}
