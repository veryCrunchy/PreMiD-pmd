import { Client, User } from "discord-rpc";

export let user: User | undefined;

export default function getDiscordAppUser() {
	return new Promise<User | undefined>(async (res, rej) => {
		if (user) return user;

		const client = new Client({ transport: "ipc" });

		const t = setTimeout(() => {
			if (user) return;

			client.destroy();
			res(undefined);
		}, 500);

		try {
			await client.login({ clientId: "503557087041683458" });
			clearTimeout(t);
			await client.destroy();
		} catch {}

		user = client.user;

		res(client.user);
	});
}