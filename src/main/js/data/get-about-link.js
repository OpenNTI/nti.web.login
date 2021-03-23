import { getPing } from './get-ping';

const AboutLink = 'https://nextthought.com';

export async function getAboutLink() {
	try {
		const ping = await getPing();
		return ping.getLink('about') || AboutLink;
	} catch (e) {
		return null;
	}
}
