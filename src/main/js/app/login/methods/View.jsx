import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Loading} from '@nti/web-commons';

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

function getAvailable (handshake, forceNextThoughtLogin) {
	for (let option of Options) {
		const available = option.filter(o => !o.isAvailable || o.isAvailable(handshake, forceNextThoughtLogin));

		if (available.length) { return available; }
	}

	return null;
}


LoginMethods.propTypes = {
	handshake: PropTypes.object,
	busy: PropTypes.bool,
	forceNextThoughtLogin: PropTypes.bool
};
function LoginMethods (props) {
	const {busy, handshake, forceNextThoughtLogin} = props;

	if (!handshake) { return null; }

	const available = getAvailable(handshake, forceNextThoughtLogin);

	return (
		<>
			{busy && (<Loading.Spinner.Large />)}
			<section className={cx({busy})} aria-hidden={busy}>
				{(available || []).map((option) => {
					const {Form, name} = option;

					if (!Form || !name) { return null; }

					return (<Form key={name} {...props} />);
				})}
			</section>
		</>
	);
}

export default Store
	.monitor({
		[Store.Handshake]: 'handshake',
		[Store.Busy]: 'busy'
	})(LoginMethods);