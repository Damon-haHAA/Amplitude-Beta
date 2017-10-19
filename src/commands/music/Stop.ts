import { Command, Message } from "yamdbf";
import { GuildMember } from "discord.js";
import { Queue } from "../../structures/music/discord/Queue";
import { AmpClient } from "../../structures/Client";
import { validate } from "../../util/decorators/validate";

export class StopCommand extends Command<AmpClient> {
	public constructor() {
		super({
			name: "stop",
			aliases: ["stfu"],
			desc: "Stops the current audio playing",
			usage: "<prefix>stop",
			group: "music",
			guildOnly: true
		});
	}

	@validate
	public async action(message: Message): Promise<any> {
		const queue: Queue = this.client.music.queues.get(message.guild.id);
		const amount: number = queue.voice.members.size;
		const voter: GuildMember = message.member;

		if (!queue.voters.includes(voter.id)) {
			queue.voters.push(voter.id);
			if (queue.voters.length >= Math.ceil(amount / 2)) {
				try {
					queue.videos = [];
					queue.dispatcher.end();
					queue.voters = [];
				} catch (err) {
					return message.channel.send("Unable to stop the queue.");
				}
				return message.channel.send(`Stopped queue, **${queue.videos.length}** videos have been skipped`);
			}
			return message.channel.send("Vote added.");
		} else {
			return message.channel.send("You have already voted to stop");
		}
	}
}
