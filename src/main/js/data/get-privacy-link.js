import { getPing } from './get-ping';

const PrivacyLink =
	'https://docs.google.com/document/u/1/pub?id=1W9R8s1jIHWTp38gvacXOStsfmUz5TjyDYYy3CVJ2SmM';

export async function getPrivacyLink() {
	try {
		const ping = await getPing();
		return ping.getLink('privacy-policy') || PrivacyLink;
	} catch (e) {
		return null;
	}
}
