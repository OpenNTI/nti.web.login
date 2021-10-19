import { getReturnURL } from './get-return-url';

export function getLoginRedirectURL() {
	const returnURL = getReturnURL();

	try {
		const url = new URL(returnURL, global.location.href);

		//cache bust
		url.searchParams.set('_u', Math.round(Math.random() * 100));

		return url.toString();
	} catch (e) {
		return returnURL;
	}
}
