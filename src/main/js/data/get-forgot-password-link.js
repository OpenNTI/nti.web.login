import { getPong } from './get-pong';

export async function getForgotPasswordLink() {
	try {
		const pong = await getPong();

		return pong.getLink('logon.forgot.passcode');
	} catch (e) {
		return null;
	}
}
