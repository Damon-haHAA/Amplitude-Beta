import { Util } from "discord.js";

export class MusicVideo {
	public static readonly durationRegex: RegExp = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
	public readonly durationISO8601: string;
	public readonly title: string;
	public readonly id: string;
	public readonly description: string;
	public readonly data: any;
	public start: number;

	public constructor(data: any) {
		this.durationISO8601 = data.items[0].contentDetails.duration;
		this.title = Util.escapeMarkdown(data.items[0].snippet.title);
		this.id = data.items[0].id;
		this.description = Util.escapeMarkdown(data.items[0].snippet.description);
		this.data = data;
		this.start = 0;
	}

	public get duration(): number {
		let totalSeconds: number = 0;
		if (MusicVideo.durationRegex.test(this.durationISO8601)) {
			const matches = MusicVideo.durationRegex.exec(this.durationISO8601);
			let hours: number = matches[1] ? Number(matches[1]) : 0;
			let minutes: number = matches[2] ? Number(matches[2]) : 0;
			let seconds: number = matches[3] ? Number(matches[3]) : 0;
			totalSeconds = hours * 3600  + minutes * 60 + seconds;
		}
		return totalSeconds;
	}

	public get url(): string {
		return `https://www.youtube.com/watch?v=${this.id}`;
	}

	public get thumbnail(): string {
		return `https://img.youtube.com/vi/${this.id}/hqdefault.jpg`;
	}

	public get length(): string {
		return MusicVideo.formatDuration(this.duration);
	}

	public static formatDuration(totalSeconds: number) {
		const hours: number = Math.floor(totalSeconds / 3600);
		const minutes: number = Math.floor((totalSeconds % 3600) / 60);
		const seconds: number = totalSeconds % 60;
		let length: string = "";

		length += hours > 0 ? `${hours}:${minutes < 10 ? "0" : ""}` : "";
		length += `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
		return length;
	}
}
