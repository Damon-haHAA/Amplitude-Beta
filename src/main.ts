import { AmpClient } from "./structures/Client";
import { emojis } from "./util/emoji/emojis";
import { Logger } from "yamdbf";
import { TextChannel, MessageOptions, Message } from "discord.js";

for (const [Constructor, key] of [[TextChannel, "send"], [Message, "edit"]]) {
	const original = (Constructor as Function).prototype[key as any];
	(Constructor as Function).prototype[key as any] = function(content: any, options?: MessageOptions): Promise<Message | Message[]> {
		if (typeof content === "string") content += ` ${emojis.any()}`;
		else if (content instanceof Array) content = content.join("\n") + emojis.any();
		return original.apply(this, [content, options]);
	};
}

const logger: Logger = Logger.instance();
const client: AmpClient = new AmpClient();

process.on("unhandledRejection", (err: string | Error) => {
	logger.error("Process", `Unhandled rejection: ${err}`);
});

client.start();
