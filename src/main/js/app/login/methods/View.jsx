import React from 'react';
import PropTypes from 'prop-types';

import Store from '../Store';

import Continue from './continue';
import Oauth from './oauth';
import Password from './password';


const Options = [
	[Continue],
	[Password, Oauth]
];

function getAvailable (handshake) {
	for (let option of Options) {
		const available = option.filter(o => !o.isAvailable || o.isAvailable(handshake));

		if (available.length) { return available; }
	}

	return null;
}


LoginMethods.propTypes = {
	handshake: PropTypes.any
};
function LoginMethods (props) {
	const available = getAvailable(props);

	return (
		<section>
			{(available || []).map((option) => {
				const {Form, name} = option;

				if (!Form || !name) { return null; }

				return (<Form key={name} {...props} />);
			})}
		</section>
	);
}

export default Store
	.monitor({
		[Store.Handshake]: 'handshake',
		[Store.Busy]: 'busy',
		[Store.Error]: 'error',
		returnURL: 'returnURL',
		loginRedirectURL: 'loginRedirectURL',
		canLogout: 'canLogout',
		logout: 'logout'
	})(LoginMethods);