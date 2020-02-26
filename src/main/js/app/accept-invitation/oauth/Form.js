import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Utils, OAuth} from 'common';
import Store from 'app/signup/Store';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

LoginOauthMethod.propTypes = {
	handshake: PropTypes.object
};

function LoginOauthMethod ({handshake, ...otherProps}) {
	const links = Utils.getOauthLinks(handshake);

	if (!links || !links.length) { return null; }

	return (
		<ul className={cx('oauth-buttons')}>
			{links.map((link) => {
				return (
					<li key={link.rel}>
						<OAuth.Button link={link} {...otherProps} />
					</li>
				);
			})}
		</ul>
	);
}

export default Store
	.monitor({
		[Store.ReturnURL]: 'returnURL',
		[Store.SetBusy]: 'setBusy',
		[Store.Handshake]: 'handshake'
	})(LoginOauthMethod);
