import { Collection, Snowflake } from "discord.js";
import { QueueData } from "../structures/music/discord/types/QueueData";
import { Queue } from "../structures/music/discord/Queue";

export class QueueCollection extends Collection<Snowflake, Queue> {
	public constructor(iterable?: any) {
		super(iterable);
	}

	public create(data: QueueData): Queue {
		const queue: Queue = new Queue(data);
		this.delete(queue.id);
		this.set(queue.id, queue);
		return queue;
	}
}