import { getPing } from './get-ping';

export async function getSupportLink() {
	try {
		const ping = await getPing();
		return ping.getLink('support') || ping.getLink('support-email');
	} catch (e) {
		return null;
	}
}
