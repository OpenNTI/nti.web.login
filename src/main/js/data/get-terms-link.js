import { getPong } from './get-pong';

export async function getTermsLink() {
	try {
		const pong = await getPong();
		return (
			pong.getLink('terms-of-service') || //placeholder "future override"
			pong.getLink('content.permanent_tos_page') ||
			pong.getLink('content.direct_tos_link')
		);
	} catch (e) {
		return null;
	}
}
