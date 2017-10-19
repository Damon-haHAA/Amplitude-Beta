import { Command, Message } from "yamdbf";
import { Queue } from "../../structures/music/discord/Queue";
import { AmpClient } from "../../structures/Client";
import { MusicVideo } from "../../structures/music/youtube/MusicVideo";
import { validate } from "../../util/decorators/validate";

export class ResumeCommand extends Command<AmpClient> {
	public constructor() {
		super({
			name: "resume",
			aliases: ["unpause"],
			desc: "Resumes music",
			usage: "<prefix>resume",
			group: "music",
			guildOnly: true
		});
	}

	@validate
	public async action(message: Message): Promise<any> {
		const queue: Queue = this.client.music.queues.get(message.guild.id);

		if (queue.dispatcher.paused) {
			try {
				queue.dispatcher.resume();
			} catch (err) {
				return message.channel.send("Unable to resume.");
			}
		} else {
			return message.channel.send("Resume what? It's playing.");
		}
	}
}
