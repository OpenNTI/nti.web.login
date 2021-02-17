export function getReturnParam() {
	const { href } = global.location || {};
	const url = href ? new URL(href) : null;

	return url?.searchParams?.get('return');
}

export function addReturnParam(link) {
	const returnParam = getReturnParam();

	if (!returnParam) {
		return link;
	}

	const [base, query] = link.split('?');

	if (!query) {
		return `${base}?return=${encodeURIComponent(returnParam)}`;
	}

	//TODO: figure out this case if we need to.
	return link;
}
