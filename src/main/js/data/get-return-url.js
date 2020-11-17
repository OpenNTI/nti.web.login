import {getConfig, getReturnURL} from '@nti/web-client';

export default function _getReturnURL () {
	return getReturnURL() || getConfig('url') || '/loginsuccess';
}
