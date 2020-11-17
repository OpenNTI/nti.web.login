import {getConfig, getReturnURL} from '@nti/web-client';

const ifString = x => typeof x === 'string' ? x : null;

export default function _getReturnURL () {
	return getReturnURL() || ifString(getConfig('url')) || '/loginsuccess';
}
