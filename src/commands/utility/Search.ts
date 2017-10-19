import { Command, Message, CommandDecorators, Middleware } from "yamdbf";
import { RichEmbed } from "discord.js";
import { AmpClient } from "../../structures/Client";
import { MusicVideo } from "../../structures/music/youtube/MusicVideo";

const { using } = CommandDecorators;
const { expect, resolve } = Middleware;

export class SearchCommand extends Command<AmpClient> {
	public constructor() {
		super({
			name: "search",
			aliases: ["yt"],
			desc: "Searches for a video on youtube",
			usage: "<prefix>search <...query>",
			group: "utility"
		});
	}

	@using(resolve({ "<...query>": "String" }))
	@using(expect({ "<...query>": "String" }))
	public async action(message: Message, [query]: [string]): Promise<any> {
		let videos: MusicVideo[];
		try {
			videos = await this.client.music.api.youtube.get(query);
		} catch (err) {
			return message.channel.send("Couldn't find that.");
		}

		if (videos.length > 1) {
			return message.channel.send(`Found **${videos.length}** videos.`);
		}

		const video: MusicVideo = videos[0];
		const embed: RichEmbed = new RichEmbed()
			.setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
			.setTitle(video.title)
			.setColor(0xFF0000)
			.setDescription(video.description)
			.setThumbnail(video.thumbnail);

		try {
			await message.channel.send({ embed });
		} catch (err) {
			await message.channel.send(`Found **${video.title}**.`);
		}
	}
}
