import { Command, Message, CommandDecorators, Middleware } from "yamdbf";
import { Queue } from "../../structures/music/discord/Queue";
import { AmpClient } from "../../structures/Client";
import { MusicVideo } from "../../structures/music/youtube/MusicVideo";
import { validate } from "../../util/decorators/validate";

const { using } = CommandDecorators;
const { resolve, expect } = Middleware;

export class VolumeCommand extends Command<AmpClient> {
	public constructor() {
		super({
			name: "volume",
			aliases: ["v", "vol"],
			desc: "Changes volume based on input ('|' means or)",
			usage: "<prefix>volume <number|+|-|=|earrape>",
			group: "music",
			guildOnly: true
		});
	}
	// tslint:disable no-shadowed-variable
	@validate
	@using(resolve({ "<number|+|-|=|earrape>": "String" }))
	@using(expect({ "<number|+|-|=|earrape>": "String" }))
	@using(function (message: Message, [input]: [string]) {
		let queue: Queue = this.client.music.queues.get(message.guild.id);
		let current: number = queue.dispatcher.volume;
		let volume: number = parseInt(input);
		if (isNaN(volume)) {
			if (["+", "up"].includes(input)) {
				volume = current + 1;
			} else if (["-", "down"].includes(input)) {
				volume = current - 1;
			} else if (["=", "pls"].includes(input)) {
				volume = 1;
			}
		}
		if (volume < 1) throw "Volume too low";
		return [message, [volume]];
	})
	public async action(message: Message, [volume]: [number]): Promise<any> {
		const queue: Queue = this.client.music.queues.get(message.guild.id);

		try {
			queue.dispatcher.setVolumeLogarithmic(volume / 5);
		} catch (err) {
			return message.channel.send("Couldn't change the volume.");
		}
	}
}
