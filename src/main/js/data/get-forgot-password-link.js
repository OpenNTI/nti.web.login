import getAnonymousPing from './get-anonymous-ping';

export default async function getForgotPasswordLink () {
	try {
		const ping = await getAnonymousPing();

		return ping.getLink('logon.forgot.passcode');
	} catch (e) {
		return null; 
	}
}