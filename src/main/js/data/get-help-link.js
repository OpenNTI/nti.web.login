import { getPong } from './get-pong';

export async function getHelpLink() {
	try {
		const pong = await getPong();
		return pong.getLink('content.help-site');
	} catch (e) {
		return null;
	}
}
