import { hasOauthLinks } from 'internal/common/utils';

import Form from './Form';

export default {
	name: 'oauth',
	isAvailable: handshake => handshake && hasOauthLinks(handshake),
	Form,
};
