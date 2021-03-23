import { getPing } from './get-ping';

export async function getForgotUsernameLink() {
	try {
		const ping = await getPing();

		return ping.getLink('logon.forgot.username');
	} catch (e) {
		return null;
	}
}
