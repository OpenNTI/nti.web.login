import { getPong } from './get-pong';

const AboutLink = 'https://nextthought.com';

export async function getAboutLink() {
	try {
		const pong = await getPong();
		return pong.getLink('content.about-site') || AboutLink;
	} catch (e) {
		return null;
	}
}
