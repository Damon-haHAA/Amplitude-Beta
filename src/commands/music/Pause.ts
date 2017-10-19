import { Command, Message } from "yamdbf";
import { Queue } from "../../structures/music/discord/Queue";
import { AmpClient } from "../../structures/Client";
import { MusicVideo } from "../../structures/music/youtube/MusicVideo";
import { validate } from "../../util/decorators/validate";

export class PauseCommand extends Command<AmpClient> {
	public constructor() {
		super({
			name: "pause",
			aliases: ["wait"],
			desc: "Pauses music",
			usage: "<prefix>pause",
			group: "music",
			guildOnly: true
		});
	}

	@validate
	public async action(message: Message): Promise<any> {
		const queue: Queue = this.client.music.queues.get(message.guild.id);

		if (!queue.dispatcher.paused) {
			try {
				queue.dispatcher.pause();
			} catch (err) {
				return message.channel.send("Unable to pause.");
			}
		} else {
			return message.channel.send("Already paused.");
		}
	}
}
