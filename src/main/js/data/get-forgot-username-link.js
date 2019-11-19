import getAnonymousPing from './get-anonymous-ping';

export default async function getForgotUsernameLink () {
	try {
		const ping = await getAnonymousPing();

		return ping.getLink('logon.forgot.username');
	} catch (e) {
		return null; 
	}
}