import { getPong } from './get-pong';

export async function getForgotUsernameLink() {
	try {
		const pong = await getPong();

		return pong.getLink('logon.forgot.username');
	} catch (e) {
		return null;
	}
}
