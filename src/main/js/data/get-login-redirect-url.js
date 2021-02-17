import getReturnURL from './get-return-url';

export default function getLoginRedirectURL() {
	const returnURL = getReturnURL();

	try {
		//This will throw if the returnURL isn't a fully resolved url,
		//later we might want to change it to new URL(returnURl, global.location.href)
		//so it is always fully resolved. But in an attempt to keep the return value
		//the same as when it was just `return ${returnURL}?_u=42` we're going to
		//let it throw for now
		const url = new URL(returnURL);

		url.searchParams.set('_u', 42);

		return url.toString();
	} catch (e) {
		return `${returnURL}?_u=42`;
	}
}
