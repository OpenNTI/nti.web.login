import { getPong } from './get-pong';

export async function getPrivacyLink() {
	try {
		const pong = await getPong();
		return (
			pong.getLink('privacy-policy') ||
			pong.getLink('content.permanent_general_privacy_page')
		);
	} catch (e) {
		return null;
	}
}
