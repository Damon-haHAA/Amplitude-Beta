import { Command, Message } from "yamdbf";
import { AmpClient } from "../../structures/Client";

export class PatreonCommand extends Command<AmpClient> {
	public constructor() {
		super({
			name: "patreon",
			aliases: ["pledge", "support"],
			desc: "Sends a link to the owner's patreon, any help is appreciated",
			usage: "<prefix>patreon",
			group: "utility"
		});
	}

	public async action(message: Message): Promise<any> {
		try {
			message.channel.send(`Money will able me to focus on developing and pay for bot hosting\n\nhttps://www.patreon.com/_damon\n\nAny help is appreciated`);
		} catch (err) {
			message.channel.send("Can't send the link for some reason, thanks for trying though.");
		}
	}
}
