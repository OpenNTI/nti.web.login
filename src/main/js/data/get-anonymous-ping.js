import {getServer} from '@nti/web-client';//eslint-disable-line

let ping = null;

async function doPing () {
	const pong = await getServer().ping();

	return pong;
}

export default function getAnonymousPing (force) {
	if (!ping || force) {
		ping = doPing();
	}

	return ping;
}