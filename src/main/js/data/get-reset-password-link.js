import { getPing } from './get-ping';

export async function getResetPasswordLink() {
	try {
		const ping = await getPing();

		return ping.getLink('logon.reset.passcode');
	} catch (e) {
		return null;
	}
}
