import { Command, Message } from "yamdbf";
import { AmpClient } from "../../structures/Client";

export class StatsCommand extends Command<AmpClient> {
	public constructor() {
		super({
			name: "stats",
			aliases: [],
			desc: "Just some stats of the bot, mostly for development purposes",
			usage: "<prefix>stats",
			group: "utility"
		});
	}

	public async action(message: Message): Promise<any> {
		const users: string = `**${this.client.users.size}**`;
		const guilds: string = `**${this.client.guilds.size}**`;
		const queues: string = `**${this.client.music.queues.size}**`;
		const memory: string = `**${(process.memoryUsage().heapUsed / (1024 ** 2)).toFixed(2)} Mb**`;

		return message.channel.send(`Users: ${users}\nGuilds: ${guilds}\nQueues: ${queues}\nMemory: ${memory}\n`);
	}
}
