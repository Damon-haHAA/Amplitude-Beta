import { Command, Message, CommandDecorators, Middleware } from "yamdbf";
import { Queue } from "../../structures/music/discord/Queue";
import { AmpClient } from "../../structures/Client";
import { MusicVideo } from "../../structures/music/youtube/MusicVideo";
import { validate } from "../../util/decorators/validate";

const { expect, resolve } = Middleware;
const { using } = CommandDecorators;

export class SeekCommand extends Command<AmpClient> {
	public constructor() {
		super({
			name: "seek",
			aliases: [],
			desc: "Skips a portion of the audio and starts playing",
			usage: "<prefix>seek <time>",
			group: "music",
			guildOnly: true,
			ratelimit: "1/30s"
		});
	}

	@validate
	@using(resolve({ "<time>": "String" }))
	@using(expect({ "<time>": "String" }))
	public async action(message: Message, [time]: [string]): Promise<any> {
		const queue: Queue = this.client.music.queues.get(message.guild.id);
		const video: MusicVideo = queue.videos[0];

		let duration: number = 0;
		if (/^\d+(?:\.\d+)?(?:s(?:ecs?)?|m(?:ins?)?|h(?:rs?|ours?)?|d(?:ays?)?)$/.test(time)) {
			const match: RegExpMatchArray = time.match(/^(\d+(?:\.\d+)?)(s|m|h|d)/);
			duration = parseFloat(match[1]);
			duration = match[2] === "s"
				? duration : match[2] === "m"
				? duration * 60 : match[2] === "h"
				? duration * 60 * 60 : match[2] === "d"
				? duration * 60 * 60 * 24 : 0;
		} else if (!isNaN(parseFloat(time))) {
			duration = parseFloat(time);
		}

		if (duration > video.duration) return message.channel.send("It doesn't go for that long.");

		try {
			video.start = duration;
			queue.dispatcher.end("seek");
		} catch (err) {
			return message.channel.send("Something went wrong!");
		}

		message.channel.send(`Moving to ${MusicVideo.formatDuration(duration)}.`);
	}
}
