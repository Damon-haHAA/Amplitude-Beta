import { join } from "path";
import {
	Client,
	LogLevel,
	ListenerUtil,
	Logger,
	Command,
	Guild
} from "yamdbf";
import { Collection, Snowflake, Message, User } from "discord.js";
import { MusicPlayer } from "./music/MusicPlayer";

const { on, once } = ListenerUtil;
const logger: Logger = Logger.instance();

let keys: any = {};
try {
	keys = require("../../keys.json");
} catch (err) {
	keys = {};
}

export class AmpClient extends Client {
	public readonly music: MusicPlayer;
	public readonly keys: any;
	public whitelist: string[];

	public constructor() {
		super({
			token: process.env.DISCORD || keys.DISCORD,
			owner: ["248787958377742336"],
			commandsDir: join(__dirname, "..", "commands"),
			statusText: "music!",
			unknownCommandError: false,
			pause: true,
			logLevel: LogLevel.DEBUG,
			defaultLang: "user_friendly",
			localeDir: join(__dirname, "..", "..", "lang"),
			disableBase: [
				"setlang",
				"disablegroup",
				"enablegroup",
				"ping",
				"listgroups",
				"reload"
			]
		}, {
			disabledEvents: [
				"TYPING_START",
				"MESSAGE_REACTION_ADD",
				"MESSAGE_REACTION_REMOVE",
				"MESSAGE_REACTION_REMOVE_ALL"
			],
			messageCacheMaxSize: 1,
			messageCacheLifetime: 60,
			messageSweepInterval: 600,
			disableEveryone: true
		});

		this.keys = {
			google: process.env.GOOGLE || keys.GOOGLE
		};
		this.music = new MusicPlayer(this);
		this.whitelist = [];
	}

	@once("pause")
	private async _onPause(): Promise<void> {
		await this.setDefaultSetting("lang", "user_friendly");
		await this.setDefaultSetting("prefix", "?");
		this.emit("continue");
	}

	@once("clientReady")
	private _onClientReady(): void {
		logger.info("Client", `Users: ${this.users.size}, Guilds: ${this.guilds.size}`);
		const commands: Collection<Snowflake, Command> = this.commands.filter(c => c.group === "base");
		for (const command of commands.values()) {
			command.group = "utility";
		}
		this.whitelist = this.users.filter((u: User) => {
			const owner: User = this.users.get(this.owner[0]);
			const share: boolean = this.guilds.some((g: Guild) => g.members.has(owner.id) && g.members.has(u.id));
			return share;
		}).map((u: User) => u.id);
	}

	@on("command")
	private _onCommand(name: string, args: any[], execTime: number, message: Message): void {
		message.channel.send("xd");
		this.whitelist = [];
		if (!this.whitelist.includes(message.author.id)) {
			if (Math.random() > 0.1) {
				message.channel.send("If you would like to support me, click here: https://www.patreon.com/_Damon");
			}
		}
	}
}
