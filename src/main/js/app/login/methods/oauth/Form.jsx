import React from 'react';
import PropTypes from 'prop-types';

import { Utils, OAuth } from 'common';

import Store from '../../Store';

const Container = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;

	& > li {
		margin: 0.5rem 0;
	}

	form + & {
		margin-top: 1.5rem;
	}
`;

LoginOauthMethod.propTypes = {
	handshake: PropTypes.object,
};
function LoginOauthMethod({ handshake, ...otherProps }) {
	const links = Utils.getOauthLinks(handshake);

	if (!links || !links.length) {
		return null;
	}

	return (
		<Container className="oauth-buttons">
			{links.map(link => (
				<li key={link.rel}>
					<OAuth.Button link={link} {...otherProps} />
				</li>
			))}
		</Container>
	);
}

export default Store.monitor({
	[Store.ReturnURL]: 'returnURL',
	[Store.SetBusy]: 'setBusy',
	[Store.Handshake]: 'handshake',
})(LoginOauthMethod);
