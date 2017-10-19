import { QueueData } from "./types/QueueData";
import { Guild } from "yamdbf";
import {
	TextChannel,
	VoiceChannel,
	VoiceConnection,
	StreamDispatcher,
	Snowflake
} from "discord.js";
import { MusicVideo } from "../youtube/MusicVideo";

export class Queue {
	public videos: MusicVideo[];
	public voters: Snowflake[];
	public loop: boolean;
	public readonly text: TextChannel;
	public readonly voice: VoiceChannel;

	public constructor(data: QueueData) {
		this.videos = [];
		this.voters = [];
		this.loop = false;
		this.text = data.text;
		this.voice = data.voice;
	}

	public shuffle(): void {
		const array: MusicVideo[] = this.videos.slice(1);
		let length: number = array.length;
		while (length--) {
			const random: number = Math.floor(Math.random() * length);
			const temp: MusicVideo = array[length];
			array[length] = array[random];
			array[random] = temp;
		}
		array.unshift(this.videos[0]);
		this.videos = array;
	}

	public get guild(): Guild {
		return this.text.guild;
	}

	public get id(): string {
		return this.guild.id;
	}

	public get connection(): VoiceConnection {
		return this.guild.voiceConnection ? this.guild.voiceConnection : null;
	}

	public get dispatcher(): StreamDispatcher {
		return this.connection ? this.connection.dispatcher : null;
	}
}
