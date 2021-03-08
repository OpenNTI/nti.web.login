import { hasOauthLinks } from 'internal/common/utils';

import { canCreateAccount } from '../utils';

import Form from './Form';

export default {
	name: 'password',
	isAvailable: (handshake, forceNextThoughtLogin) => {
		return (
			handshake &&
			(forceNextThoughtLogin ||
				!hasOauthLinks(handshake) ||
				canCreateAccount(handshake))
		);
	},

	Form,
};
