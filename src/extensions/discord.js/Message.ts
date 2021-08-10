import { DMChannel, Message, NewsChannel, TextChannel, ThreadChannel } from "discord.js"
import BotClient from "@extensions/BotClient"
import client from "@src/index"
import { FancyGuild } from "./Guild"
import { FancyUser } from "./User"

export class FancyMessage extends Message {
	declare client: BotClient
    lowerCaseContent: string
    //guild: FancyGuild
    

	public constructor(client: BotClient, options: any) {
        super(client, options)
        this.lowerCaseContent = options.content.toLowerCase()
        //this.user = new FancyUser(this.client, this.author)
	}
    public declare user: FancyUser
}