import { getConfig, getReturnURL as _getReturnURL } from '@nti/web-client';

const ifString = x => (typeof x === 'string' ? x : null);

export function getReturnURL() {
	return _getReturnURL() || ifString(getConfig('url')) || '/loginsuccess';
}
