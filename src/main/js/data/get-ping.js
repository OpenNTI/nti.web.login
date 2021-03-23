import { getServer } from '@nti/web-client';

let ping = null;

export async function getPing(force) {
	if (!ping || force) {
		ping = getServer().ping();
	}

	return ping;
}
