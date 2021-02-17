import React from 'react';
import PropTypes from 'prop-types';

import { Text, Routing } from '../../common';

import Store from './Store';
import { canCreateAccount } from './methods/utils';

const TextBlock = styled(Text.Medium)`
	margin-top: 1.5rem;
`;

CreateAccount.propTypes = {
	path: PropTypes.string,
	busy: PropTypes.bool,
	handshake: PropTypes.shape({
		hasLink: PropTypes.func,
	}),
};
function CreateAccount({ path = './signup', busy, handshake }) {
	if (busy || !canCreateAccount(handshake)) {
		return null;
	}

	return (
		<TextBlock className="create-account" center>
			Need an Account? <Routing.Link to={path}>Get Started.</Routing.Link>
		</TextBlock>
	);
}

export default Store.monitor({
	[Store.Busy]: 'busy',
	[Store.Handshake]: 'handshake',
})(CreateAccount);
