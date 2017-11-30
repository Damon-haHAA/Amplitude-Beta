import { join } from "path";
import {
	Client,
	LogLevel,
	ListenerUtil,
	Logger,
	Command
} from "yamdbf";
import { Collection, Snowflake } from "discord.js";
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
	}
}
