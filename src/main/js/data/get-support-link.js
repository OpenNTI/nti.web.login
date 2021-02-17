import getAnynonmousPing from './get-anonymous-ping';

export default async function getSupportLink() {
	try {
		const ping = await getAnynonmousPing();
		return ping.getLink('support-email');
	} catch (e) {
		return null;
	}
}
