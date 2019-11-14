import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Store from '../Store';

import Styles from './View.css';
import Continue from './continue';
import Oauth from './oauth';
import Password from './password';

const cx = classnames.bind(Styles);

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
	handshake: PropTypes.object,
	busy: PropTypes.bool
};
function LoginMethods (props) {
	const {busy, handshake} = props;
	const available = getAvailable(handshake);

	return (
		<section className={cx({busy})} aria-hidden={busy}>
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
		[Store.Busy]: 'busy'
	})(LoginMethods);