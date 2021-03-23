import { getServer } from '@nti/web-client';

let pong = null;

export async function getPong(force) {
	if (!pong || force) {
		pong = getServer().ping();
	}

	return pong;
}
