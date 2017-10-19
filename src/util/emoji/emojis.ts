import * as e from "./unicode-emojis.json";

export namespace emojis {
	export function any(): string {
		const all: string[] = (Object as any)
			.values(e.happy)
			.concat((Object as any)
			.values(e.unhappy));
		return all[Math.floor(Math.random() * all.length)];
	}

	export function happy(): string {
		const eHappy: string[] = (Object as any).values(e.happy);
		return eHappy[Math.floor(Math.random() * eHappy.length)];
	}

	export function unhappy(): string {
		const eUnhappy: string[] = (Object as any).values(e.unhappy);
		return eUnhappy[Math.floor(Math.random() * eUnhappy.length)];
	}
}
