import { getPong } from './get-pong';

export async function getResetPasswordLink() {
	try {
		const pong = await getPong();

		return pong.getLink('logon.reset.passcode');
	} catch (e) {
		return null;
	}
}
