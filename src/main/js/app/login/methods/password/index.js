import {hasOauthLinks} from '../utils';

import Form from './Form';

export default {
	name: 'password',
	isAvailable: (handshake, forceNextThoughtLogin) => {
		return handshake && (forceNextThoughtLogin || !hasOauthLinks(handshake) || handshake.hasLink('account.create'));
	},

	Form
};