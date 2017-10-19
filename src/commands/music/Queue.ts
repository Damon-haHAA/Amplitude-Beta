import { Command, Message } from "yamdbf";
import { Queue } from "../../structures/music/discord/Queue";
import { AmpClient } from "../../structures/Client";
import { MusicVideo } from "../../structures/music/youtube/MusicVideo";
import { validate } from "../../util/decorators/validate";
import { Util } from "discord.js";

export class QueueCommand extends Command<AmpClient> {
	public constructor() {
		super({
			name: "queue",
			aliases: ["q"],
			desc: "Shows all queued songs, the first one is playing",
			usage: "<prefix>queue",
			group: "music",
			guildOnly: true
		});
	}

	@validate
	public async action(message: Message): Promise<any> {
		const queue: Queue = this.client.music.queues.get(message.guild.id);
		const list: string = queue.videos.map((v: MusicVideo, i: number) => {
			return `**${i + 1}.** ${Util.escapeMarkdown(v.title)}`;
		}).join("\n");

		try {
			message.channel.send(list);
		} catch (err) {
			message.channel.send("Too many songs to show!");
		}
	}
}
