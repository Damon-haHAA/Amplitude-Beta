import { ShardingManager } from "discord.js";

const manager: ShardingManager = new ShardingManager("./main");
manager.spawn(2);
