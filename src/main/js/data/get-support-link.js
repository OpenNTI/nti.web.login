import { getPong } from './get-pong';

export async function getSupportLink() {
	try {
		const pong = await getPong();
		return pong.getLink('support') || pong.getLink('support-email');
	} catch (e) {
		return null;
	}
}
