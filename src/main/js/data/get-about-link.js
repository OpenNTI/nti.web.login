import { getAnonymousPing } from './get-anonymous-ping';

const AboutLink = 'https://nextthought.com';

export async function getAboutLink() {
	try {
		const ping = await getAnonymousPing();
		return ping.getLink('about') || AboutLink;
	} catch (e) {
		return null;
	}
}
