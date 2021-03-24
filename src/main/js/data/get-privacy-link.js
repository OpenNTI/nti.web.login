import { getPong } from './get-pong';

export async function getPrivacyLink() {
	try {
		const pong = await getPong();
		return (
			pong.getLink('privacy-policy') || //placeholder "future override"
			pong.getLink('content.permanent_general_privacy_page') ||
			pong.getLink('content.direct_privacy_link')
		);
	} catch (e) {
		return null;
	}
}
