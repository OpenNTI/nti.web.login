import { getPing } from './get-ping';

export async function getForgotPasswordLink() {
	try {
		const ping = await getPing();

		return ping.getLink('logon.forgot.passcode');
	} catch (e) {
		return null;
	}
}
