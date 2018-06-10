import { ShardingManager } from "discord.js";
import { join } from "path";

const path = join(__dirname, "main.js");
const manager: ShardingManager = new ShardingManager(path);
manager.spawn(2);
