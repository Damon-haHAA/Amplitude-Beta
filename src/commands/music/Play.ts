import { Command, CommandDecorators, Middleware, Message } from "yamdbf";
import { VoiceChannel, TextChannel } from "discord.js";
import { Queue } from "../../structures/music/discord/Queue";
import { AmpClient } from "../../structures/Client";
import { MusicPlayer } from "../../structures/music/MusicPlayer";
import { MusicVideo } from "../../structures/music/youtube/MusicVideo";

const { using } = CommandDecorators;
const { expect, resolve } = Middleware;

export class PlayCommand extends Command<AmpClient> {
	public constructor() {
		super({
			name: "play",
			aliases: ["p"],
			desc: "Plays music from youtube in your voice channel",
			usage: "<prefix>play <...query>",
			group: "music",
			guildOnly: true,
			callerPermissions: [
				"CONNECT"
			],
			clientPermissions: [
				"CONNECT",
				"SPEAK"
			]
		});
	}

	@using(resolve({ "<...query>": "String" }))
	@using(expect({ "<...query>": "String" }))
	public async action(message: Message, [query]: [string]): Promise<any> {
		const music: MusicPlayer = this.client.music;

		let queue: Queue = music.queues.get(message.guild.id);
		if (!queue) {
			const voice: VoiceChannel = message.member.voiceChannel;
			if (!voice) {
				return message.channel.send("You must be in a voice channel.");
			} else if (voice.members.size === voice.userLimit) {
				return message.channel.send("That voice channel is full.");
			}
			queue = new Queue({
				text: message.channel as TextChannel,
				voice: voice
			});
		} else if (!queue.voice.members.has(message.member.id)) {
			return message.channel.send("You aren't in my voice channel.");
		}

		const videos: MusicVideo[] = [];
		const status: Message = await message.channel.send("Searching...") as Message;
		try {
			const received: MusicVideo[] = await music.api.youtube.get(query);
			videos.push(...received);
			if (videos.length > 1) {
				status.edit(`Added ${videos.length} videos to the queue.`);
			} else {
				status.edit(`Added **${videos[0].title}** (${videos[0].length}) to the queue.`);
			}
		} catch (err) {
			return status.edit(`I couldn't that find video!`);
		}

		queue.videos.push(...videos);

		return music.start(queue);
	}
}
