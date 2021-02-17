import getAnonymousPing from './get-anonymous-ping';

export default async function getResetPasswordLink() {
	try {
		const ping = await getAnonymousPing();

		return ping.getLink('logon.reset.passcode');
	} catch (e) {
		return null;
	}
}
