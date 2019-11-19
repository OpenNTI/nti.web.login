import {getConfigFor} from '@nti/web-client';//eslint-disable-line

export default function getReturnURL () {
	const {href} = global.location || {};
	const url = href ? new URL(href) : null;

	const returnParam = url?.searchParams?.get('return');

	const config = getConfigFor('url');
	const configURL = typeof config === 'string' ? config : null;

	return returnParam || configURL || '/loginsuccess';
}