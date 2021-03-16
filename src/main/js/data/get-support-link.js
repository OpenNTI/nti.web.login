import { getAnonymousPing } from './get-anonymous-ping';

export async function getSupportLink() {
	try {
		const ping = await getAnonymousPing();
		return ping.getLink('support-email');
	} catch (e) {
		return null;
	}
}
