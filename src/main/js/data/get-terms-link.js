import { getPong } from './get-pong';

export async function getTermsLink() {
	try {
		const pong = await getPong();
		return (
			pong.getLink('terms-of-service') ||
			pong.getLink('content.permanent_tos_page')
		);
	} catch (e) {
		return null;
	}
}
