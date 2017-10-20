import { EventEmitter } from "events";
import { YouTube } from "./youtube/YouTube";
import { MusicVideo } from "./youtube/MusicVideo";
import { QueueCollection } from "../../util/QueueCollection";
import { Queue } from "./discord/Queue";
import { Logger, logger } from "yamdbf";
import { StreamDispatcher, StreamOptions } from "discord.js";
import { Readable } from "stream";
import { AmpClient } from "../Client";
import * as ytdl from "ytdl-core";

export class MusicPlayer {
	@logger private readonly _logger: Logger;

	public api: { youtube: YouTube };
	public queues: QueueCollection;
	public client: AmpClient;

	public constructor(client: AmpClient) {
		this.client = client;
		this.queues = new QueueCollection();
		this.api = {
			youtube: new YouTube(this.client.keys.google)
		};
	}

	public async start(queue: Queue): Promise<void> {
		if (!queue.connection) {
			try {
				await queue.voice.join();
				await this._play(queue);
			} catch (err) {
				await queue.text.send("I can't connect to the channel!");
				await this._logger.warn("Music", `Couldn't join voice channel: ${err}`);
			}
		} else if (!queue.dispatcher) {
			await this._play(queue);
		}
	}

	public async stop(queue: Queue): Promise<void> {
		const emptyQueue: boolean = !queue.videos.length;
		const emptyChannel: boolean = queue.voice.members.size < 2;
		if (emptyQueue) await queue.text.send("Out of music!");
		else if (emptyChannel) await queue.text.send("No one is listening!");
		try {
			this.queues.delete(queue.id);
			await queue.connection.disconnect();
		} catch (err) {
			this._logger.error("Music", err.message);
		}

		this._logger.debug("MusicPlayer", "thing is still here: " + this.queues.get(queue.id));
	}

	private async _play(queue: Queue): Promise<void> {
		if (!queue || !queue.videos.length || queue.voice.members.size < 2) return await this.stop(queue);

		const video: MusicVideo = queue.videos[0];
		const stream: Readable = ytdl(video.url, { filter: "audioonly" })
			.on("error", (err: Error) => {
				this._logger.error("MusicPlayer", `Stream error: ${err.message}`);
			});
		const options: StreamOptions = {
			passes: 5,
			seek: video.start,
			volume: 0.5
		};
		const dispatcher: StreamDispatcher = queue.connection.playStream(stream, options)
			.once("start", () => {
				if (video.start === 0) queue.text.send(`:musical_note:  Now playing **${video.title}** (${video.length}).`);
			})
			.once("end", (reason: string) => {
				dispatcher.removeAllListeners();
				stream.removeAllListeners();
				this.client.setTimeout(() => {
					if (!queue.loop && reason !== "seek") queue.videos.shift();
					this._logger.debug("MusicPlayer", `Dispatcher end: ${reason}`);
					this._play(queue);
				}, 500);
			})
			.on("error", (err: Error) => {
				this._logger.error("MusicPlayer", `Dispatcher error: ${err.message}`);
			});
	}
}
