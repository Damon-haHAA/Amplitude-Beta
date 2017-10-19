import { QueryObject } from "./types/QueryObject";
import { MusicVideo } from "./MusicVideo";
import { Url, parse } from "url";
import * as snekfetch from "snekfetch";

export class YouTube {
	public static readonly BASE: string = "https://www.googleapis.com/youtube/v3";

	private readonly _key: string;

	public constructor(key: string) {
		this._key = key;
	}

	public async getVideo(id: string): Promise<MusicVideo> {
		const res: snekfetch.Result = await this._get({
			endpoint: "videos",
			qs: {
				part: "contentDetails,snippet",
				key: this._key,
				id: id
			}
		});
		const data: any = JSON.parse(res.text);
		return new MusicVideo(data);
	}

	public async getPlaylist(id: string): Promise<MusicVideo[]> {
		const res: snekfetch.Result = await this._get({
			endpoint: "playlistItems",
			qs: {
				part: "snippet",
				key: this._key,
				playlistId: id,
				maxResults: "25"
			}
		});
		const data: any = JSON.parse(res.text);
		return (await Promise.all(data.items.map(async (item: any) => {
			try {
				return await this.getVideo(item.snippet.resourceId.videoId);
			} catch (err) {
				return null;
			}
		}))).filter(v => !!v) as MusicVideo[];
	}

	public async searchVideo(search: string): Promise<MusicVideo> {
		const res: snekfetch.Result = await this._get({
			endpoint: "search",
			qs: {
				maxResults: "1",
				part: "snippet",
				type: "video",
				key: this._key,
				q: search
			}
		});
		const data: any = JSON.parse(res.text);
		return await this.getVideo(data.items[0].id.videoId);
	}

	public async get(unknown: string): Promise<MusicVideo[]> {
		const parsed: Url = parse(unknown);
		if (["www.youtube.com", "youtube.com"].includes(parsed.hostname)) {
			if (parsed.query.v) return [await this.getVideo(parsed.query.v)];
			if (parsed.query.list) return await this.getPlaylist(parsed.query.list);
		} else {
			return [await this.searchVideo(unknown)];
		}
		return Promise.reject("xD");
	}

	private _get(query: QueryObject): Promise<snekfetch.Result> {
		let url: string = `${YouTube.BASE}/${query.endpoint}?`;
		let keys: string[] = Object.keys(query.qs);
		for (const key of keys) {
			url += `${key}=${query.qs[key]}&`;
		}
		url = url.slice(0, -1);
		return snekfetch.get(url).end();
	}
}
