import { Command, Message, CommandDecorators, Middleware, Guild } from "yamdbf";
import { TextChannel, RichEmbed } from "discord.js";
import { AmpClient } from "../../structures/Client";

const { using } = CommandDecorators;
const { resolve, expect } = Middleware;

export class SuggestionCommand extends Command<AmpClient> {
	public constructor() {
		super({
			name: "suggestion",
			aliases: [],
			desc: "Sends suggestions to the developer",
			usage: "<prefix>suggestion <...suggestion>",
			group: "utility"
		});
	}

	@using(resolve({ "<...suggestion>": "String" }))
	@using(expect({ "<...suggestion>": "String" }))
	public async action(message: Message, [suggestion]: [string]): Promise<any> {
		const embed: RichEmbed = new RichEmbed()
			.setColor(Math.floor(Math.random() * 0xFFFFFF))
			.setAuthor(message.author.tag, message.author.displayAvatarURL)
			.setDescription(suggestion);
		try {
			const guild: Guild = this.client.guilds.get("251972338738790400");
			const channel: TextChannel = guild.channels.find("name", "suggestions") as TextChannel;
			await channel.send({ embed });
		} catch (err) {
			message.channel.send("Can't forward suggestion at this time.");
		}
	}
}
